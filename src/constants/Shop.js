// Name the images accordingly
// Use camelCase for the name of the image, aim to be distinctive and descriptive
// From broader characteristics to narrower ones
// Eg.:
// characters: girlMysteriousUmbrella
// pets: dogGoldenRetrieverHappy

export const CUSTOMIZABLE_IMAGES = {
  characters: {
    girlMysteriousUmbrella: {
      id: "girlMysteriousUmbrella",
      title: "Umbrella lady",
      cost: 0,
      path: require("../assets/customizable_home/low_poly_girl_umbrella.png"),
      type: "character",
    },
    boyHoodieBigBackpack: {
      id: "boyHoodieBigBackpack",
      title: "Backpack guy",
      cost: 0,
      path: require("../assets/customizable_home/low_poly_boy_bag.png"),
      type: "character",
    },
    manAstronautFlag: {
      id: "manAstronautFlag",
      title: "Astronaut",
      cost: 200,
      path: require("../assets/customizable_home/low_poly_man_astronaut_flag.png"),
      type: "character",
    },
    manSuitSunglasses: {
      id: "manSuitSunglasses",
      title: "Businessman",
      cost: 150,
      path: require("../assets/customizable_home/low_poly_man_suit_sunglasses.png"),
      type: "character",
    },
    girlSundressFlower: {
      id: "girlSundressFlower",
      title: "Flower girl",
      cost: 100,
      path: require("../assets/customizable_home/low_poly_lady_sundress_flowers.png"),
      type: "character",
    },
    boyTeddybear: {
      id: "boyTeddybear",
      title: "Bedtime boy",
      cost: 100,
      path: require("../assets/customizable_home/low_poly_boy_teddybear.png"),
      type: "character",
    },
    wizardPurpleStaff: {
      id: "wizardPurpleStaff",
      title: "Wizard",
      cost: 200,
      path: require("../assets/customizable_home/low_poly_wizard_purple_staff.png"),
      type: "character",
    },
    manBeardBag: {
      id: "manBeardBag",
      title: "Bearded man",
      cost: 150,
      path: require("../assets/customizable_home/low_poly_man_beard_bag.png"),
      type: "character",
    },
    // add more character images here...
  },
  pets: {
    dogGoldenRetrieverHappy: {
      id: "dogGoldenRetrieverHappy",
      title: "Gleeful Golden",
      cost: 50,
      path: require("../assets/customizable_home/low_poly_dog.png"),
      type: "pet",
    },
    catBlackJudging: {
      id: "catBlackJudging",
      title: "Black Cat",
      cost: 50,
      path: require("../assets/customizable_home/low_poly_black_cat.png"),
      type: "pet",
    },
    dogHuskyNeutral: {
      id: "dogHuskyNeutral",
      title: "Husky",
      cost: 50,
      path: require("../assets/customizable_home/low_poly_husky.png"),
      type: "pet",
    },
    snakeGreen: {
      id: "snakeGreen",
      title: "Green Snake",
      cost: 50,
      path: require("../assets/customizable_home/low_poly_snake.png"),
      type: "pet",
    },
    capybaraUnbothered: {
      id: "capybaraUnbothered",
      title: "Capybara",
      cost: 50,
      path: require("../assets/customizable_home/low_poly_capybara.png"),
      type: "pet",
    },
    monkeyNeutral: {
      id: "monkeyNeutral",
      title: "Monkey",
      cost: 50,
      path: require("../assets/customizable_home/low_poly_monkey.png"),
      type: "pet",
    },
    frogNeutral: {
      id: "frogGreen",
      title: "Green Frog",
      cost: 50,
      path: require("../assets/customizable_home/low_poly_frog.png"),
      type: "pet",
    },
    // add more pet images here...
  },
};

export const ART_STYLES = {
  lowPolyGame: {
    id: "lowPolyGame",
    title: "Low Poly Game",
    cost: 400,
    path: require("../assets/art_styles/art_low_poly_game.png"),
    prompt:
      "low poly art style, cute, trending on artstation, 3d render, monument valley, fez video game",
    type: "artStyle",
    examples: [
      {
        event: "A child opening presents on Christmas morning",
        image:
          "https://cdn.stablediffusionapi.com/generations/d79abf7e-7a4f-4ad4-8938-4646db4445fa-0.png",
      },
      {
        event: "A girl blowing out candles on her birthday cake",
        image:
          "https://cdn.stablediffusionapi.com/generations/a95ace9c-2422-47dd-aeab-7e75394c65fa-0.png",
      },
      {
        event: "A person scuba diving among coral reefs",
        image:
          "https://cdn.stablediffusionapi.com/generations/d9cd6a64-a427-46e0-94c8-43e4d5eea7f0-0.png",
      },
      {
        event: "A person playing a guitar on stage",
        image:
          "https://cdn.stablediffusionapi.com/generations/1f2b5b0a-0b0a-4b0a-9b0a-0b0a0b0a0b0a-0.png",
      },
      {
        event: "A person playing a guitar on stage",
        image:
          "https://cdn.stablediffusionapi.com/generations/1f2b5b0a-0b0a-4b0a-9b0a-0b0a0b0a0b0a-0.png",
      },
    ],
  },
  lineArt: {
    id: "lineArt",
    title: "Line Art",
    prompt:
      "line art, black and white, ink, portrait, stroke only, style moebius.",
    cost: 400,
    path: require("../assets/art_styles/art_line_art.png"),
    type: "artStyle",
    examples: [
      {
        event: "A person skiing down a snow-covered mountain",
        image:
          "https://cdn.stablediffusionapi.com/generations/d2bb8165-9129-4687-aa7f-f545a6e0738b-0.png",
      },
      {
        event: "A man proposing to his girlfriend under the stars",
        image:
          "https://cdn.stablediffusionapi.com/generations/a982a06b-ee99-4304-9014-1393ced68611-0.png",
      },
      {
        event: "A woman tending to her flowers in a garden",
        image:
          "https://cdn.stablediffusionapi.com/generations/1950ec19-bae1-4f40-bc20-f8a1316af6de-0.png",
      },
      {
        event: "A woman painting a portrait in her studio",
        image:
          "https://cdn.stablediffusionapi.com/generations/2eccbddc-7ec3-4a53-a770-2004ca8eaa40-0.png",
      },
      {
        event: "A couple walking their dog on a beach at sunset",
        image:
          "https://cdn.stablediffusionapi.com/generations/286e5f10-0afc-4084-84b2-6657e3ae95ff-0.png",
      },
    ],
  },
  beeple: {
    id: "beeple",
    title: "Beeple",
    prompt:
      "intricate artwork by Tooth Wu and wlop and beeple. octane render, trending on artstation, greg rutkowski very coherent symmetrical artwork. cinematic, hyper realism, high detail, octane render, 8k",
    cost: 400,
    path: require("../assets/art_styles/art_beeple.png"),
    type: "artStyle",
    examples: [
      {
        event: "A child opening presents on Christmas morning",
        image:
          "https://cdn.stablediffusionapi.com/generations/0039d7c6-d16a-4a8e-8592-f2845417e760-0.png",
      },
      {
        event: "Friends having a barbecue in the backyard",
        image:
          "https://cdn.stablediffusionapi.com/generations/3057a0ee-10ac-47bc-9216-434db952f421-0.png",
      },
      {
        event: "A man jogging on a trail in the forest",
        image:
          "https://cdn.stablediffusionapi.com/generations/9c004adc-b532-4cf4-8eca-b733c8e6f68b-0.png",
      },
      {
        event: "A person scuba diving among coral reefs",
        image:
          "https://cdn.stablediffusionapi.com/generations/5120a3be-f5ea-489f-a3d7-a3da793a8f85-0.png",
      },
      {
        event: "A person working on a laptop in a coffee shop",
        image:
          "https://cdn.stablediffusionapi.com/generations/1bddc6c2-f694-48b2-bb37-e3ebf8e4f2fa-0.png",
      },
    ],
  },
  miyazaki: {
    id: "miyazaki",
    title: "Miyazaki",
    prompt:
      "incredible, anime, Digital 2D, animated by Kyoto Animation, Studio Ghibli, Miyazaki, AKIRA art style, beautiful, gorgeous, dramatic lighting, rule of thirds, perfect composition, trending on ArtStation, 4K",
    cost: 400,
    path: require("../assets/art_styles/art_miyazaki.png"),
    type: "artStyle",
    examples: [
      {
        event: "A group of people playing a game of basketball",
        image:
          "https://cdn.stablediffusionapi.com/generations/69697759-7acf-4e04-9ef0-db860bfc780d-0.png",
      },
      {
        event: "A man cooking dinner in a modern kitchen",
        image:
          "https://cdn.stablediffusionapi.com/generations/f48b8757-7178-4f86-be57-1a45dca8e1d0-0.png",
      },
      {
        event: "A family watching a movie in their living room",
        image:
          "https://cdn.stablediffusionapi.com/generations/0cddd6f0-0495-46b5-896a-d33c99eaa540-0.png",
      },
      {
        event: "A man proposing to his girlfriend under the stars",
        image:
          "https://cdn.stablediffusionapi.com/generations/cf73218d-b826-4f2c-8fb0-7dd5a309e0ff-0.png",
      },
      {
        event: "A man sailing a boat on a calm lake",
        image:
          "https://cdn.stablediffusionapi.com/generations/62e6a1e9-6d86-41e3-a5c9-7fa96fa25f51-0.png",
      },
    ],
  },
  disneyPromotionalArt: {
    id: "disneyPromotionalArt",
    title: "Disney Promotional Art",
    prompt:
      "promotional art, concept artwork, 3 d render official art, promotional art, by artgerm, ilya kuvshinov katsuhiro villeneuve, jeremy lipkin and michael garmash and rob rey, disney pixar zootopia",
    cost: 400,
    path: require("../assets/art_styles/art_disney_promotional_art.png"),
    type: "artStyle",
    examples: [
      {
        event: "A family watching a movie in their living room",
        image:
          "https://cdn.stablediffusionapi.com/generations/b53eecdd-621b-487a-b923-508fecb6fdbb-0.png",
      },
      {
        event: "A person working on a laptop in a coffee shop",
        image:
          "https://cdn.stablediffusionapi.com/generations/6e504702-989f-4a63-bf2c-f7253c698f4c-0.png",
      },
      {
        event: "A group of friends having a barbecue in the backyard",
        image:
          "https://cdn.stablediffusionapi.com/generations/80b48711-a702-4695-8ae9-d865586ab038-0.png",
      },
      {
        event: "A person riding a horse in a meadow",
        image:
          "https://cdn.stablediffusionapi.com/generations/65e67f6e-187c-41f9-86c1-3de261e27073-0.png",
      },
      {
        event: "A woman tending to her flowers in a garden",
        image:
          "https://cdn.stablediffusionapi.com/generations/7d3bf34f-ac3a-478a-86f7-5e56fa267b60-0.png",
      },
    ],
  },
  postGrunge: {
    id: "postGrunge",
    title: "Post Grunge",
    prompt:
      "llustration, post grunge, concept art by josan gonzales and wlop, by james jean, Victo ngai, David Rubín, Mike Mignola, Laurie Greasley, highly detailed, sharp focus, alien, Trending on Artstation, HQ, deviantart, art by artgem",
    cost: 400,
    path: require("../assets/art_styles/art_post_grunge.png"),
    type: "artStyle",
    examples: [
      {
        event: "A person working on a laptop in a coffee shop",
        image:
          "https://cdn.stablediffusionapi.com/generations/a1102b3e-290e-4797-8c5a-67e89cdb9316-0.png",
      },
      {
        event: "A person riding a horse in a meadow",
        image:
          "https://cdn.stablediffusionapi.com/generations/4f4b375a-bef9-4006-9509-adc1e9419c5e-0.png",
      },
      {
        event: "A girl blowing out candles on her birthday cake",
        image:
          "https://cdn.stablediffusionapi.com/generations/e234110a-3d5f-45e8-aeee-714ac413c4aa-0.png",
      },
      {
        event: "A couple walking their dog on a beach during sunset",
        image:
          "https://cdn.stablediffusionapi.com/generations/9456ed9d-55e8-44a5-9b8b-e4afc3e1de59-0.png",
      },
      {
        event: "A man playing the guitar around a campfire",
        image:
          "https://cdn.stablediffusionapi.com/generations/d5847dd5-3105-4832-89cf-83589f9fbf3c-0.png",
      },
    ],
  },
  postModernism: {
    id: "postModernism",
    title: "Post Modernism",
    prompt: "acrylic on canvas in style of post modernism",
    cost: 400,
    path: require("../assets/art_styles/art_post_modernism.png"),
    type: "artStyle",
    examples: [
      {
        event: "A man playing the guitar around a campfire",
        image:
          "https://pub-8b49af329fae499aa563997f5d4068a4.r2.dev/generations/4ceb76d7-ca9d-44f6-9c79-613edeed179a-0.png",
      },
      {
        event: "A couple walking their dog on a beach during sunset",
        image:
          "https://pub-8b49af329fae499aa563997f5d4068a4.r2.dev/generations/deedf503-1fac-4856-8470-e7b381091bf5-0.png",
      },
      {
        event: "A child building a sandcastle on the beach",
        image:
          "https://cdn.stablediffusionapi.com/generations/4e11b644-bb12-4285-a88a-6a91016823cb-0.png",
      },
      {
        event: "A man cooking dinner in a modern kitchen",
        image:
          "https://cdn.stablediffusionapi.com/generations/03af822a-9415-4654-a772-66871cf79c7b-0.png",
      },
      {
        event: "A person riding a horse in a meadow",
        image:
          "https://cdn.stablediffusionapi.com/generations/03af822a-9415-4654-a772-66871cf79c7b-0.png",
      },
    ],
  },
  abstract: {
    id: "abstract",
    title: "Abstract",
    prompt: "abstract painting, using vibrant colour and erratic shapes.",
    cost: 400,
    path: require("../assets/art_styles/art_abstract.png"),
    type: "artStyle",
    examples: [
      {
        event: "A woman tending to her flowers in a garden",
        image:
          "https://cdn.stablediffusionapi.com/generations/19c70922-5977-4e8c-bea5-407c7988af6f-0.png",
      },
      {
        event: "A person working on a laptop in a coffee shop",
        image:
          "https://cdn.stablediffusionapi.com/generations/9887fae6-f986-4e95-8678-96921600b294-0.png",
      },
      {
        event: "A group of friends having a barbecue in the backyard",
        image:
          "https://cdn.stablediffusionapi.com/generations/c001cf62-96bf-4d7c-b49d-4b54d8438d09-0.png",
      },
      {
        event: "A group of people playing a game of basketball",
        image:
          "https://cdn.stablediffusionapi.com/generations/d6fd73ae-6e98-4a2b-8be7-0a4c0f5bd349-0.png",
      },
      {
        event: "A woman meditating in a peaceful garden",
        image:
          "https://cdn.stablediffusionapi.com/generations/1ea31ff1-3782-41ca-9cd2-4c5003818c34-0.png",
      },
    ],
  },
};
