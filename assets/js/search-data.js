// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-publications",
          title: "publications",
          description: "Selected publications in reversed chronological order.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-cv",
          title: "CV",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "nav-teaching",
          title: "teaching",
          description: "Courses, lectures, and talks.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/teaching/";
          },
        },{id: "nav-repositories",
          title: "repositories",
          description: "Open-source projects and contributions.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/repositories/";
          },
        },{id: "news-started-teaching-deep-learning-in-applications-at-harbour-space-university-in-barcelona",
          title: 'Started teaching Deep Learning in Applications at Harbour.Space University in Barcelona.',
          description: "",
          section: "News",},{id: "news-think-align-select-query-key-scores-for-llm-reasoning-was-published-on-openreview-neurips-workshop-track",
          title: 'Think, Align, Select: Query–Key Scores for LLM Reasoning was published on OpenReview (NeurIPS...',
          description: "",
          section: "News",},{id: "news-synthetic-proofs-with-tool-integrated-reasoning-contrastive-alignment-for-llm-mathematics-with-lean-appeared-in-acl-anthology-mathnlp-emnlp-2025",
          title: 'Synthetic Proofs with Tool-Integrated Reasoning: Contrastive Alignment for LLM Mathematics with Lean appeared...',
          description: "",
          section: "News",},{id: "news-attended-emnlp-2025-presented-at-a-workshop-and-had-many-productive-discussions-with-colleagues-also-helped-organize-and-connect-the-russian-speaking-nlp-ml-community-on-site",
          title: 'Attended EMNLP 2025, presented at a workshop, and had many productive discussions with...',
          description: "",
          section: "News",},{id: "news-attended-mlws-mbzuai-no-talk-this-time-but-many-valuable-conversations-and-networking-with-the-community",
          title: 'Attended MLWS @ MBZUAI; no talk this time, but many valuable conversations and...',
          description: "",
          section: "News",},{id: "teachings-deep-learning-in-applications",
          title: 'Deep Learning in Applications',
          description: "A hands-on course covering practical applications of deep learning across NLP, computer vision, and generative models.",
          section: "Teachings",handler: () => {
              window.location.href = "/teachings/deep-learning-applications/";
            },},{id: "teachings-deep-vision-and-graphics",
          title: 'Deep Vision and Graphics',
          description: "Lectures on deep learning for computer vision and graphics, covering ConvNets, transformers, detection, segmentation, generative models, and neural rendering.",
          section: "Teachings",handler: () => {
              window.location.href = "/teachings/deep-vision-and-graphics/";
            },},{id: "teachings-ml-reading-club",
          title: 'ML Reading Club',
          description: "Reading club for discussing recent influential papers in machine learning and deep learning.",
          section: "Teachings",handler: () => {
              window.location.href = "/teachings/ml-reading-club/";
            },},{id: "teachings-natural-language-processing",
          title: 'Natural Language Processing',
          description: "Lectures on NLP as part of the YSDA NLP course covering embeddings, language models, attention, transfer learning, and LLMs.",
          section: "Teachings",handler: () => {
              window.location.href = "/teachings/nlp-course/";
            },},{id: "teachings-practical-reinforcement-learning",
          title: 'Practical Reinforcement Learning',
          description: "Mentor for the Practical Reinforcement Learning course offered jointly by HSE University and Yandex on Coursera.",
          section: "Teachings",handler: () => {
              window.location.href = "/teachings/practical-rl/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%6D%69%63%68%61%65%6C.%73.%64%69%73%6B%69%6E@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/yhn112", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/yhn112", "_blank");
        },
      },{
        id: 'social-telegram',
        title: 'telegram',
        section: 'Socials',
        handler: () => {
          window.open("https://telegram.me/yhn112", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=LRKQhcYAAAAJ", "_blank");
        },
      },{
        id: 'social-orcid',
        title: 'ORCID',
        section: 'Socials',
        handler: () => {
          window.open("https://orcid.org/0000-0001-8902-513X", "_blank");
        },
      },{
        id: 'social-kaggle',
        title: 'Kaggle',
        section: 'Socials',
        handler: () => {
          window.open("https://www.kaggle.com/yhn112", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
