"""Prefetch icon fonts for jekyll-3rd-party-libraries' flattened CSS cache.

Version 0.0.1 skips a font directory once it is nonempty. Academicons and
Scholar Icons both reference ../fonts, so both sets must exist before that hook.
"""

import base64
import hashlib
from pathlib import Path
import re
from urllib.parse import urljoin, urlsplit
from urllib.request import urlopen

import yaml


def download_icon_fonts():
    config = yaml.safe_load(Path("_config.yml").read_text())
    libraries = config["third_party_libraries"]
    if not libraries["download"]:
        return

    for name in ("fontawesome", "academicons", "scholar-icons"):
        library = libraries[name]
        css_url = library["url"]["css"].replace("{{version}}", library["version"])
        with urlopen(css_url, timeout=30) as response:
            css = response.read()
        digest = "sha256-" + base64.b64encode(hashlib.sha256(css).digest()).decode()
        if digest != library["integrity"]["css"]:
            raise ValueError(f"CSS integrity mismatch: {name}")

        for reference in set(re.findall(r"url\(([^)]+)\)", css.decode())):
            reference = reference.strip("\"'")
            font_path = urlsplit(reference).path
            if Path(font_path).suffix not in (".eot", ".svg", ".ttf", ".woff", ".woff2"):
                continue
            destination = Path("assets/libs", name, font_path)
            destination.parent.mkdir(parents=True, exist_ok=True)
            with urlopen(urljoin(css_url, reference), timeout=30) as response:
                destination.write_bytes(response.read())
            print(f"Downloaded {name}: {destination.name}")


if __name__ == "__main__":
    download_icon_fonts()
