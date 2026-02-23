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
        },{id: "nav-repositories",
          title: "repositories",
          description: "Open-source projects and contributions.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/repositories/";
          },
        },{id: "nav-teaching",
          title: "teaching",
          description: "Courses, lectures, and talks.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/teaching/";
          },
        },{id: "news-started-as-head-of-llm-r-amp-amp-d-at-wildberries-building-the-llm-organization-from-scratch",
          title: 'Started as Head of LLM R&amp;amp;amp;D at Wildberries, building the LLM organization from...',
          description: "",
          section: "News",},{id: "news-started-lecturing-deep-learning-in-applications-at-harbour-space-university-barcelona",
          title: 'Started lecturing Deep Learning in Applications at Harbour.Space University, Barcelona.',
          description: "",
          section: "News",},{id: "news-gave-a-talk-at-an-industry-panel-llms-one-year-later",
          title: 'Gave a talk at an industry panel: LLMs One Year Later.',
          description: "",
          section: "News",},{id: "teachings-deep-learning-in-applications",
          title: 'Deep Learning in Applications',
          description: "A hands-on course covering practical applications of deep learning across NLP, computer vision, and generative models.",
          section: "Teachings",handler: () => {
              window.location.href = "/teachings/deep-learning-applications/";
            },},{id: "teachings-nlp-cv-lectures-amp-ml-reading-club",
          title: 'NLP, CV Lectures &amp;amp; ML Reading Club',
          description: "Lectures on NLP and Computer Vision topics, and an ML reading club discussing recent research papers.",
          section: "Teachings",handler: () => {
              window.location.href = "/teachings/nlp-cv-reading-club/";
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
