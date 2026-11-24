import importlib.util
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import yaml


script_path = Path(__file__).resolve().parents[1] / "bin/update_scholar_citations.py"
spec = importlib.util.spec_from_file_location("update_scholar_citations", script_path)
citations = importlib.util.module_from_spec(spec)
spec.loader.exec_module(citations)


class CitationUpdateTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.output = Path(self.directory.name) / "citations.yml"
        self.author = {
            "publications": [
                {
                    "author_pub_id": "author:paper",
                    "bib": {"title": "Example paper", "pub_year": "2023"},
                    "num_citations": 648,
                }
            ]
        }
        output_patch = patch.object(citations, "OUTPUT_FILE", str(self.output))
        output_patch.start()
        self.addCleanup(output_patch.stop)
        scholar_patch = patch.object(citations, "scholarly")
        self.scholar = scholar_patch.start()
        self.addCleanup(scholar_patch.stop)
        self.scholar.fill.return_value = self.author

    def write_existing_data(self, count):
        self.output.write_text(
            yaml.safe_dump(
                {
                    "metadata": {"last_updated": "2000-01-01"},
                    "papers": {
                        "author:paper": {
                            "title": "Example paper",
                            "year": "2023",
                            "citations": count,
                        }
                    },
                }
            )
        )

    def test_first_run_creates_citation_file(self):
        citations.get_scholar_citations()

        result = yaml.safe_load(self.output.read_text())
        self.assertEqual(result["papers"]["author:paper"]["citations"], 648)

    def test_updated_count_replaces_previous_count(self):
        self.write_existing_data(513)

        citations.get_scholar_citations()

        result = yaml.safe_load(self.output.read_text())
        self.assertEqual(result["papers"]["author:paper"]["citations"], 648)

    def test_unchanged_counts_preserve_file(self):
        self.write_existing_data(648)
        original = self.output.read_bytes()

        citations.get_scholar_citations()

        self.assertEqual(self.output.read_bytes(), original)

    def test_fetch_failure_preserves_previous_data_and_fails(self):
        self.write_existing_data(513)
        original = self.output.read_bytes()
        self.scholar.search_author_id.side_effect = RuntimeError("Fetch failed")

        with self.assertRaises(SystemExit) as error:
            citations.get_scholar_citations()

        self.assertEqual(error.exception.code, 1)
        self.assertEqual(self.output.read_bytes(), original)


if __name__ == "__main__":
    unittest.main()
