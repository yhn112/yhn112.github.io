// Import the rendercv function and all the refactored components
#import "@preview/rendercv:0.1.0": *

// Apply the rendercv template with custom configuration
#show: rendercv.with(
  name: "Michael Diskin",
  footer: context { [#emph[Michael Diskin -- #str(here().page())\/#str(counter(page).final().first())]] },
  top-note: [ #emph[Last updated in Nov 2026] ],
  locale-catalog-language: "en",
  page-size: "a4",
  page-top-margin: 0.7in,
  page-bottom-margin: 0.7in,
  page-left-margin: 0.7in,
  page-right-margin: 0.7in,
  page-show-footer: false,
  page-show-top-note: false,
  colors-body: rgb(0, 0, 0),
  colors-name: rgb(0, 79, 144),
  colors-headline: rgb(0, 79, 144),
  colors-connections: rgb(0, 79, 144),
  colors-section-titles: rgb(0, 79, 144),
  colors-links: rgb(0, 79, 144),
  colors-footer: rgb(128, 128, 128),
  colors-top-note: rgb(128, 128, 128),
  typography-line-spacing: 0.6em,
  typography-alignment: "justified",
  typography-date-and-location-column-alignment: right,
  typography-font-family-body: "Source Sans 3",
  typography-font-family-name: "Source Sans 3",
  typography-font-family-headline: "Source Sans 3",
  typography-font-family-connections: "Source Sans 3",
  typography-font-family-section-titles: "Source Sans 3",
  typography-font-size-body: 10pt,
  typography-font-size-name: 30pt,
  typography-font-size-headline: 10pt,
  typography-font-size-connections: 10pt,
  typography-font-size-section-titles: 1.4em,
  typography-small-caps-name: false,
  typography-small-caps-headline: false,
  typography-small-caps-connections: false,
  typography-small-caps-section-titles: false,
  typography-bold-name: true,
  typography-bold-headline: false,
  typography-bold-connections: false,
  typography-bold-section-titles: true,
  links-underline: false,
  links-show-external-link-icon: false,
  header-alignment: center,
  header-photo-width: 3.5cm,
  header-space-below-name: 0.7cm,
  header-space-below-headline: 0.7cm,
  header-space-below-connections: 0.7cm,
  header-connections-hyperlink: true,
  header-connections-show-icons: true,
  header-connections-display-urls-instead-of-usernames: false,
  header-connections-separator: "",
  header-connections-space-between-connections: 0.5cm,
  section-titles-type: "with_partial_line",
  section-titles-line-thickness: 0.5pt,
  section-titles-space-above: 0.5cm,
  section-titles-space-below: 0.3cm,
  sections-allow-page-break: true,
  sections-space-between-text-based-entries: 0.3em,
  sections-space-between-regular-entries: 1.2em,
  entries-date-and-location-width: 4.15cm,
  entries-side-space: 0.2cm,
  entries-space-between-columns: 0.1cm,
  entries-allow-page-break: false,
  entries-short-second-row: true,
  entries-summary-space-left: 0cm,
  entries-summary-space-above: 0cm,
  entries-highlights-bullet:  "•" ,
  entries-highlights-nested-bullet:  "•" ,
  entries-highlights-space-left: 0.15cm,
  entries-highlights-space-above: 0cm,
  entries-highlights-space-between-items: 0cm,
  entries-highlights-space-between-bullet-and-text: 0.5em,
  date: datetime(
    year: 2026,
    month: 11,
    day: 23,
  ),
)


= Michael Diskin

#connections(
  [#link("mailto:michael.s.diskin@gmail.com", icon: false, if-underline: false, if-color: false)[#connection-with-icon("envelope")[michael.s.diskin\@gmail.com]]],
  [#connection-with-icon("location-dot")[Europe]],
  [#link("https://github.com/yhn112", icon: false, if-underline: false, if-color: false)[#connection-with-icon("github")[yhn112]]],
  [#link("https://linkedin.com/in/yhn112", icon: false, if-underline: false, if-color: false)[#connection-with-icon("linkedin")[yhn112]]],
)


== Experience

#regular-entry(
  [
    #strong[Wildberries], Head of LLM R&D

    - Built LLM R&D org from 0 to 30+ engineers (4–5 teams); manage a 500+ GPU cluster and define platform strategy for LLM and embeddings company-wide.

    - Shipped universal text embeddings (retrieval, ranking, classification) and marketplace-scale MT translating tens of millions of product listings into 10+ languages, including low-resource.

    - Deployed optimized LLM serving with use-case routing, batching, and quantization — cut GPU costs by 40\%+ while meeting latency SLAs under peak traffic.

    - Built RAG-powered assistants (internal and seller-facing) with safety guardrails, evaluation framework, and gold-standard regression datasets.

    - Established research-to-production operating model: experiment standards, evaluation gates, reliable releases — reduced iteration cycles from weeks to days.

  ],
  [
    Moscow, Russia

    2024 – present

    2 years

  ],
)

#regular-entry(
  [
    #strong[Brask AI], Senior Research Engineer

    - Led R&D on a lip-sync model for AI video dubbing: research, model iteration, production integration.

    - Improved robustness across diverse speakers and conditions; defined quality metrics and failure-analysis pipeline with product and engineering.

  ],
  [
    Tbilisi, Georgia

    2022 – 2023

    1 year

  ],
)

#regular-entry(
  [
    #strong[Yandex Research], Research Scientist

    - Research on efficient and distributed training for large models; 5 papers at NeurIPS, ICML, and ICLR.

    - Led pre-training of a fully open-source Russian BERT-class language model; co-authored the Hivemind decentralized training library.

    - Created an evaluation benchmark for graph neural networks under heterophily (650+ citations, ICLR 2023).

  ],
  [
    Moscow, Russia

    2021 – 2022

    1 year

  ],
)

#regular-entry(
  [
    #strong[Huawei], Research Engineer

    - Computer vision research: optical flow and depth estimation for image-based localization.

  ],
  [
    Moscow, Russia

    2020 – 2021

    1 year

  ],
)

#regular-entry(
  [
    #strong[Early-stage startups], ML \/ Software Engineer

    - Built ML-powered backend services and data pipelines from scratch in small teams; end-to-end ownership from prototyping to deployment.

  ],
  [
    Moscow, Russia

    2019 – 2020

    1 year

  ],
)

#regular-entry(
  [
    #strong[Yandex], Software Engineering Intern

    - Large-scale analytics over multi-terabyte log data using internal MapReduce infrastructure (YT).

  ],
  [
    Moscow, Russia

    2017 – 2018

    1 year

  ],
)

== Education

#education-entry(
  [
    #strong[HSE University], Computer Science

  ],
  [
    Moscow, Russia

    2022 – 2024

  ],
  degree-column: [
    
  ],
)

#education-entry(
  [
    #strong[Yandex School of Data Analysis], Machine Learning (Graduate program)

  ],
  [
    2019 – 2021

  ],
  degree-column: [
    
  ],
)

#education-entry(
  [
    #strong[HSE University], Computer Science

  ],
  [
    Moscow, Russia

    2014 – 2019

  ],
  degree-column: [
    
  ],
)

== Skills

#regular-entry(
  [
    #strong[ML & AI]

  ],
  [
  ],
)

#regular-entry(
  [
    #strong[Frameworks]

  ],
  [
  ],
)

#regular-entry(
  [
    #strong[Data & Eval]

  ],
  [
  ],
)

#regular-entry(
  [
    #strong[Infra & MLOps]

  ],
  [
  ],
)

#regular-entry(
  [
    #strong[Languages]

  ],
  [
  ],
)

== Awards

#regular-entry(
  [
    #strong[HSE FCS Scholarship for Research Excellence]

    HSE University

  ],
  [
    2024

  ],
)

#regular-entry(
  [
    #strong[Tinkoff Education Scholarship]

    Tinkoff

  ],
  [
    2023

  ],
)

#regular-entry(
  [
    #strong[Xeek.ai \"Put it on the Map!\" — 2nd place (100+ teams)]

    #summary[Cash prize]

    Xeek.ai

  ],
  [
    2020

  ],
)

#regular-entry(
  [
    #strong[Kaggle \"Recursion Cellular Image Classification\" — 13th of 800+ teams]

    Kaggle

  ],
  [
    2019

  ],
)

#regular-entry(
  [
    #strong[Huawei Image Inpainting Hackathon — 2nd place (100+ teams)]

    #summary[Cash prize]

    Huawei

  ],
  [
    2019

  ],
)

#regular-entry(
  [
    #strong[International Data Analysis Olympiad — 16th of 1000+ participants]

    IDAO

  ],
  [
    2019

  ],
)

== Languages

#regular-entry(
  [
    #strong[Russian]

    #summary[Native speaker]

  ],
  [
  ],
)

#regular-entry(
  [
    #strong[English]

    #summary[Fluent]

  ],
  [
  ],
)
