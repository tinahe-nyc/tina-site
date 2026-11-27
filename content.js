/* Everything the site shows lives here. Every page reads this one file.
   Image paths are from the top of the project (about/, art/, microscopy/). */
var CONTENT = {

  /* How many items each section shows on the home page before a
     "See all" link appears. Change a number and every page follows. */
  limits: {
    currentOnHome: 3,     // quest log on the home page: this many current...
    completedOnHome: 3,   // ...and this many completed (newest first)
    gallery: 8,           // microscope and art: rows of 4, so 8 or 12 fill rows
    reading: 3,
    tools: 5
  },

  /* ---------------- QUEST LOG ----------------
     cur:  1 = current, 0 = completed (newest completed first)
     page: a page on this site for the quest. Its title gets an arrow (→).
     l:    links that leave the site, shown as SMALL CAPS ↗. Any number. */
  quests: [
    { t: "Artificial Reef Project", slug: "artificial-reef", cur: 1, from: "Mar", yr: "2026 – present",
      d: "Help sink a decommissioned ship for fish housing.",
      n: "Rig & hoist machinery out of the engine room.",
      page: "quests/artificial-reef.html",
      l: [["Read the article", "https://www.thecityreporter.nyc/2026/04/20/artificial-reef-ferry-sea-creatures-sink-volunteers/"]] },
    { t: "SideQuest", cur: 1, from: "Jul", yr: "2026 – present",
      d: "Host biweekly coworking sessions for side projects, from apps and blogposts to chainmail jewelry and murder mystery games.",
      n: "Bake ube brownies for the next session.",
      l: [["Join us", "https://luma.com/sidequest"]] },
    { t: "Safety Training Analysis", cur: 1, from: "Aug", yr: "2026 – present",
      d: "Learn causal inference by investigating whether mandatory safety training reduced medical resident injuries." },
    { t: "Nature Religious Art", cur: 1, from: "", yr: "",
      d: "Create devotional pantheist art to express reverence for nature.",
      n: "Identify themes, motifs, and other elements of religious art." },
    { t: "Foxfire Forecast", cur: 1, from: "", yr: "",
      d: "Apply ML to predict when and where to find glowing mushrooms.",
      n: "Use MaxEnt to predict the where part" },
    { t: "First Friendsgiving", cur: 0, from: "Nov", yr: "2026",
      d: "Host my first ever Friendsgiving. On the menu: beef bourguignon (three hours!), mashed potatoes, and French green beans." },
    { t: "Integration: An Inception Parody", cur: 0, from: "Oct", yr: "2026",
      d: "Vibe code an Inception parody about integrals within integrals. Best with sound on.",
      l: [["Watch it", "https://youtu.be/T67-AMJug6w"]] },
    { t: "Cemetery Fungi Dig", cur: 0, from: "Jul", yr: "2026",
      d: "Collect cemetery soil samples for citizen science project on mycorrhizal fungi and urban fungal biodiversity.",
      n: "Maybe a data analysis sequel?" },
    { t: "Bayesian Statistics Bookclub", cur: 0, from: "Jul – Dec", yr: "2025",
      d: "Work through Statistical Rethinking by Richard McElreath with friends.",
      l: [["Browse the repo", "https://github.com/erictleung/statistical-rethinking-book-club"]] }
  ],

  /* ---------------- MICROSCOPE ---------------- */
  microscopy: [
    { t: "Snake skin", m: "shed", img: "microscopy/snake-skin.jpg" },
    { t: "Nematode", img: "microscopy/parasite-salmon.jpg", video: "microscopy/parasite-salmon.mp4" },
    { t: "Dog tick", img: "microscopy/dog-tick.jpg", video: "microscopy/dog-tick.mp4" },
    { t: "Earwig and aphids", img: "microscopy/earwig-aphids.jpg", video: "microscopy/earwig-aphids.mp4" },
    { t: "Tardigrade", img: "microscopy/tardigrade.jpg", video: "microscopy/tardigrade.mp4" },
    { t: "Unknown specimen", img: "microscopy/unknown-specimen.jpg", video: "microscopy/unknown-specimen.mp4" },
    { t: "Fungus gnat", m: "larva", img: "microscopy/fungal-gnat.jpg", video: "microscopy/fungal-gnat.mp4" }
  ],

  /* ---------------- ART ----------------
     r: width ÷ height of the picture (4:3 landscape = 1.333, 3:4 portrait = 0.75). */
  art: [
    { t: "Plaster Cast Study", m: "oil paint on canvas", img: "art/plaster-cast-study.jpg", r: 1.006 },
    { t: "Vegetarian Menu", m: "gold ink on cardstock", img: "art/vegetarian-menu.jpg", full: "art/vegetarian-menu-full.jpg", r: 1.333 },
    { t: "Insect Tote", m: "fabric paint on canvas", img: "art/insect-tote.jpg", full: "art/insect-tote-full.jpg", r: 1.333 },
    { t: "Carrier Pigeon", m: "pencil and marker on paper", img: "art/pigeon.jpg", full: "art/pigeon-full.jpg", r: 0.75 }
  ],

  /* ---------------- TOOLS ----------------
     Little apps I've built. img: a screenshot (the top of it shows on the page;
     click to see the whole thing). l: links, same as the quest log.
     d: a blank line (\n\n) starts a new paragraph.
     building: 1 shows an "In progress" tag. Remove it once people can use it,
     and add l: [["Try it", "https://..."]]. */
  tools: [
    { t: "Kapok Club", img: "tools/cantonese.jpg", building: 1,
      d: "Type or say something in English and get what Cantonese people would actually say, not the formal textbook version. Each word comes with jyutping and audio, plus a note on why it's said that way.\n\nNamed after the kapok (木棉), the red-flowering tree that is the city flower of Guangzhou." },
    { t: "Bite Size", img: "tools/bite-size.jpg",
      d: "Simplify recipes for when you just want to cook. Paste a recipe or a link and get the steps without a wall of text, each trimmed to a line or so, with its ingredients right next to each step.",
      l: [["Try it", "https://bite-size-recipes.vercel.app/"]] },
    { t: "Emaki", img: "tools/bloom-scroll.jpg",
      d: "A more intentional way to scroll. Custom feeds curated around my interests and long-term goals. Personal websites, creative projects, and visual inspiration.\n\nInspired by emaki (絵巻), Japanese illustrated handscrolls that are slowly unrolled by hand. Reimagining digital scrolling as an act of deliberate exploration rather than passive consumption.",
      l: [["Personal websites", "personal-web/index.html"], ["Tasty Vibes", "tasty-vibes/index.html"]] }
  ],

  /* ---------------- READING ----------------
     Newest first. status: "read" puts a red check beside it when you've
     finished it; "reading" or "next" leave it blank.
     note: your short comment, or "" for none. */
  reading: [
    { title: "Why Are Conversations Limited to About Four People? A Theoretical Exploration of the Conversation Size Constraint",
      source: "Krems & Wilkes", url: "https://www.sciencedirect.com/science/article/pii/S1090513818301491",
      status: "reading", note: "" },
    { title: "Why You Need Your Whole Body – From Head to Toes – to Think", source: "Anna Ciaunica",
      url: "https://aeon.co/essays/why-you-need-your-whole-body-from-head-to-toes-to-think", status: "reading", note: "" },
    { title: "How to Be More Ambitious: A Tutorial for Humans with Models", source: "Felix Rieseberg",
      url: "https://felixrieseberg.com/how-to-be-more-ambitious-a-tutorial-for-humans-with-models/", status: "reading", note: "" },
    { title: "Better Design Tips", source: "@AshAmplifies",
      url: "https://betterdesigntips.com/", status: "read", note: "" },
    { title: "Evaluating Empirical Claims: Practical Advice", source: "Sean Trott",
      url: "https://seantrott.substack.com/p/evaluating-empirical-claims-practical", status: "reading", note: "" },
    { title: "Reality Has a Surprising Amount of Detail", source: "John Salvatier",
      url: "https://johnsalvatier.org/blog/2017/reality-has-a-surprising-amount-of-detail", status: "reading", note: "" },
    { title: "You Can't Escape Construct Validity", source: "Sean Trott",
      url: "https://seantrott.substack.com/p/you-cant-escape-construct-validity", status: "reading", note: "" },
    { title: "Record Low Crime Rates Are Real, Not Just Reporting Bias or Improved Medical Care", source: "Scott Alexander",
      url: "https://www.astralcodexten.com/p/record-low-crime-rates-are-real-not", status: "reading", note: "" },
    { title: "Eternal Sunshine of a Slopless Mind", source: "Surya Narreddi",
      url: "https://surya.website/a-blog/eternal-sunshine-of-a-slopless-mind", status: "reading", note: "" },
    { title: "Improv Teaches Status and Spontaneity", source: "Life Improvement Schemes",
      url: "https://lifeimprovementschemes.substack.com/p/improv-teaches-status-and-spontaneity", status: "reading", note: "" },
    { title: "Lowering the Barr: Rethinking Causality in Complex Autoimmunity Through Epstein-Barr Virus in Multiple Sclerosis",
      source: "Neurology: Neuroimmunology & Neuroinflammation", url: "https://www.neurology.org/doi/10.1212/NXI.0000000000200680",
      status: "reading", note: "" },
    { title: "Which Kind of Science Reform", source: "Richard McElreath",
      url: "https://elevanth.org/blog/2025/07/09/which-kind-of-science-reform/", status: "reading", note: "" },
    { title: "Holding a Program in One's Head", source: "Paul Graham",
      url: "https://paulgraham.com/head.html", status: "reading", note: "" },
    { title: "The Work Between the Tasks", source: "Kevin L. Michel",
      url: "https://www.kevinmichel.com/forecaster/read/mind-not-feed/03-the-work-between-the-tasks/", status: "reading", note: "" },
    { title: "On Deep Breaks", source: "Cal Newport",
      url: "https://calnewport.com/on-deep-breaks/", status: "reading", note: "" },
    { title: "The Top Idea in Your Mind", source: "Paul Graham",
      url: "https://paulgraham.com/top.html", status: "reading", note: "" },
    { title: "Why Is It So Hard to Do My Work? The Challenge of Attention Residue When Switching Between Work Tasks",
      source: "Sophie Leroy", url: "https://www.sciencedirect.com/science/article/abs/pii/S0749597809000399",
      status: "reading", note: "" },
    { title: "Do the Simplest Thing That Could Possibly Work", source: "Sean Goedecke",
      url: "https://www.seangoedecke.com/the-simplest-thing-that-could-possibly-work/", status: "reading", note: "" },
    { title: "Everything I Know About Good System Design", source: "Sean Goedecke",
      url: "https://www.seangoedecke.com/good-system-design/", status: "reading", note: "" },
    { title: "Queuing Theory, Slack and Utilisation", source: "Tom Geraghty",
      url: "https://psychsafety.com/queueing-theory-slack-and-resilience/", status: "reading", note: "" },
    { title: "The Intent Debt", source: "Addy Osmani",
      url: "https://addyosmani.com/blog/intent-debt/", status: "reading", note: "" },
    { title: "How I Write Papers", source: "thoughtforms.life",
      url: "https://thoughtforms.life/how-i-write-papers/", status: "reading", note: "" },
    { title: "Time in the Chaos", source: "Sharon Li",
      url: "https://pages.cs.wisc.edu/~sharonli/time-in-the-chaos.html", status: "read",
      note: "“Optimize for your ability to adapt across many possible futures.”" },
    { title: "Bumbition", source: "Noahpinion",
      url: "https://www.noahpinion.blog/p/bumbition", status: "read",
      note: "Resonates with how I've been thinking lately about the need for mental space." },
    { title: "The Great Convergence", source: "Nicholas Charriere",
      url: "https://nicholascharriere.com/blog/the-great-convergence/", status: "reading", note: "" },
    { title: "Welcome to the B2A Economy", source: "a16z",
      url: "https://www.a16z.news/p/welcome-to-the-b2a-economy", status: "reading", note: "" }
  ],

  /* ---------------- THINGS I'M INTO ----------------
     Each one links to the home-page section it shows up in. */
  into: [
    ["aphids", "microscopy"], ["Bayesian statistics", "quests"], ["biodiversity", "about"], ["Cantonese", "tools"], ["causal inference", "quests"],
    ["cemeteries", "quests"], ["chainmail jewelry", "quests"], ["community", "about"], ["coworking", "quests"],
    ["epistemology", "about"], ["glowing mushrooms", "quests"], ["gold ink", "art"], ["machine learning", "quests"],
    ["murder mysteries", "quests"], ["nematodes", "microscopy"], ["nutrition", "about"], ["pigeons", "art"], ["recipes", "tools"],
    ["remixing ideas", "reading"], ["shipwrecks, on purpose", "quests"], ["tardigrades", "microscopy"],
    ["ube brownies", "quests"], ["veggies", "about"]
  ]
};
