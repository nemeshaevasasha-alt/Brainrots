
/* =========================================================
   GROW YOUR PETS
   CLEAN FULL VERSION
========================================================= */


/* =========================================================
   APPWRITE
   MUST EXIST BEFORE GAME STARTS
========================================================= */

const appwriteClient =
  new Appwrite.Client();

appwriteClient
  .setEndpoint(
    "https://cloud.appwrite.io/v1"
  )
  .setProject(
    "6a7c219f003ce33e42bc"
  );


const appwriteTables =
  new Appwrite.TablesDB(
    appwriteClient
  );


const adminAccount =
  new Appwrite.Account(
    appwriteClient
  );


const SERVER_DATABASE_ID =
  "6a7c24a1002dbf55d43f";

const SERVER_TABLE_ID =
  "serverstate";

const SERVER_ROW_ID =
  "6a7c2651002766206e0b";

const ADMIN_USER_ID =
  "6a7c2927003364eb534c";


/* =========================================================
   SERVER STATE
========================================================= */

var serverState = null;


/* =========================================================
   GAME STATE
========================================================= */

let money = 500;

let ownedPets = [];

let selectedPets = [];

let nextPetTimer = 4;

let activeFusion = null;

let currentGameEvent = null;

let localAdminEvent = null;

let localAdminEventEndsAt = 0;

let localLuckyPercent = 0;

let localLuckyEndsAt = 0;


const MAX_PETS = 10;

const FUSION_TIME =
  15 * 60;

const EVENT_MULTIPLIER =
  3;

const EVENT_HIT_CHANCE =
  0.30;


/* =========================================================
   EVENTS
========================================================= */

const gameEvents = [

  {
    id: "lava",
    name: "LAVA",
    emoji: "🌋",
    particle: "🔥"
  },

  {
    id: "winter",
    name: "WINTER",
    emoji: "❄️",
    particle: "❄️"
  },

  {
    id: "yinyang",
    name: "YIN YANG",
    emoji: "☯️",
    particle: "☯️"
  }

];


/* =========================================================
   MUTATIONS
========================================================= */

const mutations = [

  {
    name: "Normal",
    chance: 93.4,
    multiplier: 1,
    emoji: ""
  },

  {
    name: "Golden",
    chance: 5,
    multiplier: 2,
    emoji: "🟡"
  },

  {
    name: "Diamond",
    chance: 1,
    multiplier: 5,
    emoji: "💎"
  },

  {
    name: "Rainbow",
    chance: 0.5,
    multiplier: 10,
    emoji: "🌈"
  },

  {
    name: "Void",
    chance: 0.1,
    multiplier: 25,
    emoji: "🌌"
  }

];


/* =========================================================
   ECONOMY
========================================================= */

const rarityEconomy = {

  common: {
    minPrice: 25,
    maxPrice: 500,
    minIncome: 1,
    maxIncome: 12
  },

  uncommon: {
    minPrice: 600,
    maxPrice: 3000,
    minIncome: 15,
    maxIncome: 60
  },

  rare: {
    minPrice: 3500,
    maxPrice: 15000,
    minIncome: 80,
    maxIncome: 300
  },

  epic: {
    minPrice: 18000,
    maxPrice: 80000,
    minIncome: 400,
    maxIncome: 1500
  },

  legendary: {
    minPrice: 100000,
    maxPrice: 500000,
    minIncome: 2000,
    maxIncome: 8000
  },

  mythic: {
    minPrice: 650000,
    maxPrice: 3000000,
    minIncome: 12000,
    maxIncome: 50000
  },

  godly: {
    minPrice: 4000000,
    maxPrice: 25000000,
    minIncome: 80000,
    maxIncome: 500000
  },

  secret: {
    minPrice: 40000000,
    maxPrice: 1500000000,
    minIncome: 1000000,
    maxIncome: 30000000
  }

};


/* =========================================================
   CARPET PETS
========================================================= */

const petData = [

  /* COMMON */

  ["Mouse","🐭","common"],
  ["Bunny","🐰","common"],
  ["Chicken","🐔","common"],
  ["Frog","🐸","common"],
  ["Hamster","🐹","common"],
  ["Duck","🦆","common"],
  ["Turtle","🐢","common"],
  ["Snail","🐌","common"],
  ["Squirrel","🐿️","common"],
  ["Sparrow","🐦","common"],
  ["Crab","🦀","common"],
  ["Bee","🐝","common"],
  ["Butterfly","🦋","common"],
  ["Fish","🐟","common"],
  ["Mole","🐾","common"],
  ["Pigeon","🐦","common"],
  ["Gecko","🦎","common"],


  /* UNCOMMON */

  ["Cat","🐱","uncommon"],
  ["Dog","🐶","uncommon"],
  ["Goat","🐐","uncommon"],
  ["Pig","🐷","uncommon"],
  ["Raccoon","🦝","uncommon"],
  ["Penguin","🐧","uncommon"],
  ["Hedgehog","🦔","uncommon"],
  ["Otter","🦦","uncommon"],
  ["Llama","🦙","uncommon"],
  ["Deer","🦌","uncommon"],
  ["Seal","🦭","uncommon"],
  ["Flamingo","🦩","uncommon"],
  ["Bat","🦇","uncommon"],
  ["Alpaca","🦙","uncommon"],
  ["Beaver","🦫","uncommon"],
  ["Meerkat","🐾","uncommon"],


  /* RARE */

  ["Fox","🦊","rare"],
  ["Koala","🐨","rare"],
  ["Wolf","🐺","rare"],
  ["Eagle","🦅","rare"],
  ["Crocodile","🐊","rare"],
  ["Parrot","🦜","rare"],
  ["Boar","🐗","rare"],
  ["Peacock","🦚","rare"],
  ["Dolphin","🐬","rare"],
  ["Kangaroo","🦘","rare"],
  ["Octopus","🐙","rare"],
  ["Owl","🦉","rare"],
  ["Buffalo","🐃","rare"],
  ["Lynx","🐈","rare"],
  ["Swordfish","🐟","rare"],
  ["Chameleon","🦎","rare"],
  ["Moose","🫎","rare"],


  /* EPIC */

  ["Panda","🐼","epic"],
  ["Tiger","🐯","epic"],
  ["Gorilla","🦍","epic"],
  ["Cobra","🐍","epic"],
  ["Shark","🦈","epic"],
  ["Rhino","🦏","epic"],
  ["Scorpion","🦂","epic"],
  ["Elephant","🐘","epic"],
  ["Hippo","🦛","epic"],
  ["Jaguar","🐆","epic"],
  ["Orca","🐋","epic"],
  ["Komodo","🦎","epic"],
  ["Giant Squid","🦑","epic"],
  ["Black Panther","🐈‍⬛","epic"],
  ["Manta Ray","🌊","epic"],
  ["Anaconda","🐍","epic"],
  ["Stegosaurus","🦕","epic"],


  /* LEGENDARY */

  ["Lion","🦁","legendary"],
  ["White Tiger","🐅","legendary"],
  ["Mammoth","🦣","legendary"],
  ["Phoenix","🔥","legendary"],
  ["Polar Bear","🐻‍❄️","legendary"],
  ["T-Rex","🦖","legendary"],
  ["Sabertooth","🐯🦷","legendary"],
  ["Ancient Turtle","🐢✨","legendary"],
  ["Lava Gorilla","🌋🦍","legendary"],
  ["Ice Mammoth","❄️🦣","legendary"],
  ["Golden Falcon","🌟🦅","legendary"],
  ["Shadow Panther","🌑🐈‍⬛","legendary"],


  /* MYTHIC */

  ["Unicorn","🦄","mythic"],
  ["Griffin","🦅🦁","mythic"],
  ["Hydra","🐉","mythic"],
  ["Sea Dragon","🌊🐉","mythic"],
  ["Cerberus","🐺🐺🐺","mythic"],
  ["Moon Fox","🌙🦊","mythic"],
  ["Crystal Deer","💎🦌","mythic"],
  ["Spirit Stag","👻🦌","mythic"],
  ["Volcano Turtle","🌋🐢","mythic"],
  ["Frost Griffin","❄️🦅🦁","mythic"],


  /* GODLY */

  ["Dragon","🐲","godly"],
  ["Thunder Wolf","⚡🐺","godly"],
  ["Solar Eagle","☀️🦅","godly"],
  ["Galaxy Lion","🌌🦁","godly"],
  ["Storm Dragon","⛈️🐲","godly"],
  ["Celestial Whale","✨🐋","godly"],
  ["Nebula Dragon","🌌🐲","godly"],
  ["Titan Kraken","🌊🐙","godly"],


  /* SECRET */

  ["Cosmic Beast","👾","secret"],
  ["Void Serpent","🕳️🐍","secret"],
  ["Time Dragon","⏳🐉","secret"],
  ["Infinity Beast","♾️👹","secret"],
  ["Reality Eater","🌀👹","secret"]

];


const pets =
  petData.map(
    function(data) {

      return {
        name: data[0],
        emoji: data[1],
        rarity: data[2],
        price: 0,
        income: 0
      };

    }
  );


/* =========================================================
   FUSION PETS
========================================================= */

const fusionRecipes = [

  {
    pets: ["Mouse","Bunny"],
    result: {
      name: "Mousunny",
      emoji: "🐭🐰",
      rarity: "rare",
      income: 0
    }
  },

  {
    pets: ["Cat","Dog"],
    result: {
      name: "CatDog",
      emoji: "🐱🐶",
      rarity: "epic",
      income: 0
    }
  },

  {
    pets: ["Fox","Panda"],
    result: {
      name: "Foxanda",
      emoji: "🦊🐼",
      rarity: "legendary",
      income: 0
    }
  },

  {
    pets: ["Lion","Unicorn"],
    result: {
      name: "UniLion",
      emoji: "🦁🦄",
      rarity: "godly",
      income: 0
    }
  },

  {
    pets: ["Tiger","Dragon"],
    result: {
      name: "Dragon Tiger",
      emoji: "🐯🐲",
      rarity: "secret",
      income: 0
    }
  },

  {
    pets: ["Crocodile","Shark"],
    result: {
      name: "CrocoShark",
      emoji: "🐊🦈",
      rarity: "legendary",
      income: 0
    }
  },

  {
    pets: ["Lion","Eagle"],
    result: {
      name: "Winged Lion",
      emoji: "🦁🪽",
      rarity: "mythic",
      income: 0
    }
  },

  {
    pets: ["Wolf","Dragon"],
    result: {
      name: "Dragon Wolf",
      emoji: "🐺🐲",
      rarity: "godly",
      income: 0
    }
  },

  {
    pets: ["Penguin","Shark"],
    result: {
      name: "Frost Shark",
      emoji: "❄️🦈",
      rarity: "mythic",
      income: 0
    }
  },

  {
    pets: ["Octopus","Dragon"],
    result: {
      name: "OctoDragon",
      emoji: "🐙🐲",
      rarity: "godly",
      income: 0
    }
  },

  {
    pets: ["Phoenix","Wolf"],
    result: {
      name: "Fire Wolf",
      emoji: "🔥🐺",
      rarity: "mythic",
      income: 0
    }
  },

  {
    pets: ["T-Rex","Shark"],
    result: {
      name: "Rex Shark",
      emoji: "🦖🦈",
      rarity: "godly",
      income: 0
    }
  },

  {
    pets: ["Moon Fox","Solar Eagle"],
    result: {
      name: "Eclipse Beast",
      emoji: "🌘🦊🦅",
      rarity: "secret",
      income: 0
    }
  },

  {
    pets: ["Black Panther","Moon Fox"],
    result: {
      name: "Lunar Panther",
      emoji: "🌙🐈‍⬛",
      rarity: "mythic",
      income: 0
    }
  },

  {
    pets: ["Phoenix","Sea Dragon"],
    result: {
      name: "Steam Dragon",
      emoji: "♨️🐉",
      rarity: "godly",
      income: 0
    }
  },

  {
    pets: ["T-Rex","Mammoth"],
    result: {
      name: "Prehistoric Titan",
      emoji: "🦖🦣",
      rarity: "godly",
      income: 0
    }
  },

  {
    pets: ["Void Serpent","Time Dragon"],
    result: {
      name: "Chrono Serpent",
      emoji: "⏳🐍",
      rarity: "secret",
      income: 0
    }
  },

  {
    pets: ["Infinity Beast","Cosmic Beast"],
    result: {
      name: "Multiverse Beast",
      emoji: "♾️🌌👹",
      rarity: "secret",
      income: 0
    }
  }

];
/* =========================================================
   PART 2
   ECONOMY + LUCKY + SERVER EVENTS + SPAWN
========================================================= */


/* =========================================================
   NICE NUMBER
========================================================= */

function niceNumber(number) {

  if (number >= 1000000) {
    return Math.round(number / 100000) * 100000;
  }

  if (number >= 100000) {
    return Math.round(number / 10000) * 10000;
  }

  if (number >= 10000) {
    return Math.round(number / 1000) * 1000;
  }

  if (number >= 1000) {
    return Math.round(number / 100) * 100;
  }

  if (number >= 100) {
    return Math.round(number / 10) * 10;
  }

  return Math.round(number);
}


/* =========================================================
   BALANCE NORMAL PETS
========================================================= */

function rebalancePets() {

  Object.keys(
    rarityEconomy
  ).forEach(
    function(rarity) {

      const group =
        pets.filter(
          function(pet) {

            return (
              pet.rarity ===
              rarity
            );

          }
        );


      const economy =
        rarityEconomy[
          rarity
        ];


      group.forEach(
        function(pet, index) {

          const progress =
            group.length === 1
              ? 0.5
              : index /
                (
                  group.length - 1
                );


          pet.price =
            niceNumber(

              economy.minPrice +

              (
                economy.maxPrice -
                economy.minPrice
              )

              *

              progress

            );


          pet.income =
            niceNumber(

              economy.minIncome +

              (
                economy.maxIncome -
                economy.minIncome
              )

              *

              progress

            );

        }
      );

    }
  );

}


/* =========================================================
   BALANCE FUSIONS
========================================================= */

function rebalanceFusions() {

  fusionRecipes.forEach(
    function(recipe) {

      const economy =
        rarityEconomy[
          recipe.result.rarity
        ];


      recipe.result.income =
        niceNumber(
          economy.maxIncome *
          1.2
        );

    }
  );

}


rebalancePets();

rebalanceFusions();


/* =========================================================
   MONEY FORMAT
========================================================= */

function formatMoney(number) {

  number =
    Math.floor(
      Number(number) || 0
    );


  if (
    number >=
    1000000000000
  ) {

    return (
      number /
      1000000000000
    ).toFixed(1) + "T";

  }


  if (
    number >=
    1000000000
  ) {

    return (
      number /
      1000000000
    ).toFixed(1) + "B";

  }


  if (
    number >=
    1000000
  ) {

    return (
      number /
      1000000
    ).toFixed(1) + "M";

  }


  if (
    number >=
    1000
  ) {

    return (
      number /
      1000
    ).toFixed(1) + "K";

  }


  return number.toString();

}


/* =========================================================
   MUTATION
========================================================= */

function rollMutation() {

  const roll =
    Math.random() * 100;


  let total = 0;


  for (
    const mutation
    of mutations
  ) {

    total +=
      mutation.chance;


    if (
      roll <= total
    ) {

      return mutation;

    }

  }


  return mutations[0];

}


/* =========================================================
   LUCKY SYSTEM
========================================================= */

function getLuckyPercent() {

  const now =
    Date.now();


  /*
    LOCAL ADMIN LUCK
  */

  if (
    localLuckyPercent > 0 &&
    localLuckyEndsAt > now
  ) {

    return Math.max(
      0,
      Number(
        localLuckyPercent
      ) || 0
    );

  }


  /*
    SERVER LUCK
  */

  if (serverState) {

    const serverLucky =
      Number(
        serverState.luckyPercent ||
        serverState.luckPercent ||
        0
      );


    const serverLuckyEndsAt =
      Number(
        serverState.luckyEndsAt ||
        serverState.luckEndsAt ||
        0
      );


    if (
      serverLucky > 0 &&
      serverLuckyEndsAt > now
    ) {

      return serverLucky;

    }

  }


  return 0;

}


/* =========================================================
   CHOOSE RARITY
========================================================= */

function chooseRarity() {

  const lucky =
    Math.max(
      0,
      getLuckyPercent()
    );


  /*
    Luck pushes the roll toward
    rarer pets.

    10% luck gives a noticeable
    improvement without making
    rare pets guaranteed.
  */

  const baseRoll =
    Math.random() * 100;


  const luckBoost =
    Math.min(
      35,
      lucky * 0.35
    );


  const roll =
    Math.min(
      99.999,
      baseRoll +
      luckBoost
    );


  if (roll < 50) {
    return "common";
  }


  if (roll < 77) {
    return "uncommon";
  }


  if (roll < 90) {
    return "rare";
  }


  if (roll < 96) {
    return "epic";
  }


  if (roll < 98.5) {
    return "legendary";
  }


  if (roll < 99.5) {
    return "mythic";
  }


  if (roll < 99.9) {
    return "godly";
  }


  return "secret";

}


/* =========================================================
   CHOOSE PET
========================================================= */

function choosePet() {

  const rarity =
    chooseRarity();


  const available =
    pets.filter(
      function(pet) {

        return (
          pet.rarity ===
          rarity
        );

      }
    );


  if (
    available.length === 0
  ) {

    return pets[0];

  }


  return available[
    Math.floor(
      Math.random() *
      available.length
    )
  ];

}


/* =========================================================
   EVENT TIME FORMAT
========================================================= */

function formatEventTime(seconds) {

  seconds =
    Math.max(
      0,
      Math.floor(
        Number(seconds) || 0
      )
    );


  const minutes =
    Math.floor(
      seconds / 60
    );


  const secs =
    seconds % 60;


  return (

    String(minutes)
      .padStart(2, "0")

    +

    ":"

    +

    String(secs)
      .padStart(2, "0")

  );

}


/* =========================================================
   GET ACTIVE EVENT
========================================================= */

function getActiveEvent() {

  const now =
    Date.now();


  /*
    LOCAL ADMIN EVENT
  */

  if (
    localAdminEvent &&
    localAdminEventEndsAt > now
  ) {

    return {
      event:
        localAdminEvent,

      endsAt:
        localAdminEventEndsAt,

      source:
        "local"
    };

  }


  /*
    SERVER EVENT
  */

  if (serverState) {

    const eventName =
      String(
        serverState.activeEvent ||
        "none"
      ).toLowerCase();


    const eventEndsAt =
      Number(
        serverState.eventEndsAt ||
        0
      );


    if (
      eventName !== "none" &&
      eventEndsAt > now
    ) {

      const foundEvent =
        gameEvents.find(
          function(event) {

            return (
              event.id ===
              eventName
            );

          }
        );


      if (foundEvent) {

        return {
          event:
            foundEvent,

          endsAt:
            eventEndsAt,

          source:
            "server"
        };

      }

    }

  }


  return null;

}


/* =========================================================
   UPDATE EVENT DISPLAY
========================================================= */

function updateEventDisplay() {

  const active =
    getActiveEvent();


  const icon =
    document.getElementById(
      "eventIcon"
    );


  const title =
    document.getElementById(
      "eventTitle"
    );


  const description =
    document.getElementById(
      "eventDescription"
    );


  const timer =
    document.getElementById(
      "eventTimer"
    );


  const bar =
    document.getElementById(
      "eventBar"
    );


  if (active) {

    currentGameEvent =
      active.event;


    const secondsLeft =
      Math.ceil(
        (
          active.endsAt -
          Date.now()
        ) /
        1000
      );


    if (icon) {

      icon.textContent =
        active.event.emoji;

    }


    if (title) {

      title.textContent =
        active.event.name +
        " EVENT";

    }


    if (description) {

      description.textContent =
        active.source === "server"

          ? "🌍 SERVER EVENT • 30% HIT • ×3 MONEY"

          : "👑 ADMIN EVENT • 30% HIT • ×3 MONEY";

    }


    if (timer) {

      timer.textContent =
        formatEventTime(
          secondsLeft
        );

    }


    if (bar) {

      bar.dataset.event =
        active.event.id;

    }


    return;

  }


  /*
    EVENT EXPIRED
  */

  currentGameEvent =
    null;


  if (
    localAdminEvent &&
    localAdminEventEndsAt <=
    Date.now()
  ) {

    localAdminEvent =
      null;

    localAdminEventEndsAt =
      0;

  }


  if (icon) {

    icon.textContent =
      "⏳";

  }


  if (title) {

    title.textContent =
      "NO SERVER EVENT";

  }


  if (description) {

    const lucky =
      getLuckyPercent();


    if (lucky > 0) {

      description.textContent =
        "🍀 " +
        lucky +
        "% LUCK ACTIVE";

    } else {

      description.textContent =
        "Waiting for admin event";

    }

  }


  if (timer) {

    timer.textContent =
      "--:--";

  }


  if (bar) {

    delete bar.dataset.event;

  }

}


/* =========================================================
   LOAD SERVER STATE
========================================================= */

async function loadServerState() {

  try {

    const row =
      await appwriteTables
        .getRow({

          databaseId:
            SERVER_DATABASE_ID,

          tableId:
            SERVER_TABLE_ID,

          rowId:
            SERVER_ROW_ID

        });


    serverState =
      row;


    updateEventDisplay();


    console.log(
      "SERVER STATE:",
      serverState
    );

  }

  catch (error) {

    console.error(
      "APPWRITE SERVER ERROR:",
      error
    );

  }

}


/* =========================================================
   EVENT VISUAL STYLES
========================================================= */

function createEventStyles() {

  if (
    document.getElementById(
      "growPetsEventStyles"
    )
  ) {

    return;

  }


  const style =
    document.createElement(
      "style"
    );


  style.id =
    "growPetsEventStyles";


  style.textContent = `

    .event-bar[data-event="lava"] {
      background:
        linear-gradient(
          90deg,
          #3d0800,
          #a92b00,
          #3d0800
        );
    }


    .event-bar[data-event="winter"] {
      background:
        linear-gradient(
          90deg,
          #0d3d59,
          #3f91b5,
          #0d3d59
        );
    }


    .event-bar[data-event="yinyang"] {
      background:
        linear-gradient(
          90deg,
          #050505,
          #777,
          #e8e8e8,
          #777,
          #050505
        );
    }


    .event-tag {
      margin-top: 4px;
      padding: 4px;
      border-radius: 6px;
      color: white;
      font-size: 8px;
      font-weight: 900;
    }


    .event-tag.lava {
      background:
        linear-gradient(
          #ff721c,
          #a82100
        );
    }


    .event-tag.winter {
      background:
        linear-gradient(
          #9befff,
          #2787b4
        );
    }


    .event-tag.yinyang {
      background:
        linear-gradient(
          90deg,
          #111,
          #aaa
        );
    }


    .event-impact {
      animation:
        eventImpact
        .75s ease;
    }


    .event-hit-lava {
      box-shadow:
        0 0 32px #ff5b00,
        0 7px 0 rgba(0,0,0,.3);
    }


    .event-hit-winter {
      box-shadow:
        0 0 32px #c5f7ff,
        0 7px 0 rgba(0,0,0,.3);
    }


    .event-hit-yinyang {
      box-shadow:
        0 0 32px white,
        0 7px 0 rgba(0,0,0,.3);
    }


    @keyframes eventImpact {

      0% {
        transform:
          translateX(0)
          scale(1);
      }

      20% {
        transform:
          translateX(-8px)
          scale(1.1);
      }

      40% {
        transform:
          translateX(8px)
          scale(1.1);
      }

      60% {
        transform:
          translateX(-5px)
          scale(1.08);
      }

      80% {
        transform:
          translateX(5px)
          scale(1.04);
      }

      100% {
        transform:
          translateX(0)
          scale(1);
      }

    }


    .event-hit-text {
      position: absolute;
      left: 50%;
      top: 5px;
      width: 92%;
      transform:
        translateX(-50%);
      padding: 5px;
      border-radius: 7px;
      background:
        rgba(0,0,0,.85);
      color: white;
      font-size: 9px;
      font-weight: 900;
      z-index: 100;
      pointer-events: none;
    }

  `;


  document.head.appendChild(
    style
  );

}


/* =========================================================
   EVENT HIT ANIMATION
========================================================= */

function playEventHit(
  card,
  event
) {

  if (
    !card ||
    !event
  ) {

    return;

  }


  card.classList.add(
    "event-impact"
  );


  card.classList.add(
    "event-hit-" +
    event.id
  );


  const hitText =
    document.createElement(
      "div"
    );


  hitText.className =
    "event-hit-text";


  hitText.textContent =
    event.emoji +
    " " +
    event.name +
    " HIT! ×3";


  card.appendChild(
    hitText
  );


  setTimeout(
    function() {

      if (
        hitText.parentNode
      ) {

        hitText.remove();

      }


      card.classList.remove(
        "event-impact"
      );

    },

    1000
  );

}


/* =========================================================
   SPAWN PET
========================================================= */

function spawnPet() {

  const carpet =
    document.getElementById(
      "carpet"
    );


  if (!carpet) {

    console.warn(
      "CARPET NOT FOUND"
    );

    return;

  }


  const pet =
    choosePet();


  if (!pet) {

    return;

  }


  const mutation =
    rollMutation();


  /*
    REFRESH CURRENT EVENT
    BEFORE SPAWN
  */

  const active =
    getActiveEvent();


  currentGameEvent =
    active
      ? active.event
      : null;


  let eventHit =
    null;


  if (
    currentGameEvent &&
    Math.random() <
    EVENT_HIT_CHANCE
  ) {

    eventHit =
      currentGameEvent;

  }


  const eventMultiplier =
    eventHit
      ? EVENT_MULTIPLIER
      : 1;


  const finalIncome =

    pet.income *

    mutation.multiplier *

    eventMultiplier;


  const card =
    document.createElement(
      "div"
    );


  card.className =
    "walking-pet " +
    pet.rarity;


  card.innerHTML = `

    <div class="walk-emoji">

      ${mutation.emoji}
      ${pet.emoji}

    </div>


    <div class="walk-name">

      ${
        mutation.name !==
        "Normal"

          ? mutation.name +
            " "

          : ""
      }

      ${pet.name}

    </div>


    <div class="walk-rarity">

      ${pet.rarity.toUpperCase()}

    </div>


    ${
      eventHit

        ? `

          <div
            class="event-tag ${eventHit.id}"
          >

            ${eventHit.emoji}
            ${eventHit.name}
            ×3

          </div>

        `

        : ""
    }


    <div class="walk-income">

      +$${formatMoney(
        finalIncome
      )}/sec

    </div>


    <div class="walk-price">

      💰 $${formatMoney(
        pet.price
      )}

    </div>


    <button
      class="buy-btn"
      type="button"
    >

      BUY

    </button>

  `;


  carpet.appendChild(
    card
  );


  if (eventHit) {

    setTimeout(
      function() {

        playEventHit(
          card,
          eventHit
        );

      },

      120
    );

  }


  let bought =
    false;


  const buyButton =
    card.querySelector(
      ".buy-btn"
    );


  function buyThisPet() {

    if (bought) {

      return;

    }


    if (
      ownedPets.length >=
      MAX_PETS
    ) {

      showMessage(
        "❌ BASE FULL!"
      );

      return;

    }


    if (
      money <
      pet.price
    ) {

      showMessage(
        "💸 NOT ENOUGH MONEY!"
      );

      return;

    }


    bought =
      true;


    money -=
      pet.price;


    ownedPets.push({

      id:
        Date.now() +
        Math.random(),

      name:
        pet.name,

      emoji:
        pet.emoji,

      rarity:
        pet.rarity,

      mutation:
        mutation.name,

      mutationEmoji:
        mutation.emoji,

      multiplier:
        mutation.multiplier,

      eventEffect:
        eventHit
          ? eventHit.id
          : null,

      eventName:
        eventHit
          ? eventHit.name
          : null,

      eventEmoji:
        eventHit
          ? eventHit.emoji
          : "",

      eventMultiplier:
        eventMultiplier,

      income:
        finalIncome,

      stored:
        0,

      fusion:
        false

    });


    card.remove();


    updateGame();


    scanOwnedPetsForIndex();


    if (eventHit) {

      showMessage(

        eventHit.emoji +
        " " +
        eventHit.name +
        " " +
        pet.name +
        " ×3!"

      );

    }

    else if (
      mutation.name !==
      "Normal"
    ) {

      showMessage(

        mutation.emoji +
        " " +
        mutation.name +
        " " +
        pet.name +
        " BOUGHT!"

      );

    }

    else {

      showMessage(

        "🐾 " +
        pet.name +
        " BOUGHT!"

      );

    }

  }


  if (buyButton) {

    buyButton.onclick =
      function(event) {

        event.stopPropagation();

        buyThisPet();

      };

  }


  card.onclick =
    function(event) {

      if (
        event.target.closest(
          ".buy-btn"
        )
      ) {

        return;

      }


      buyThisPet();

    };


  setTimeout(
    function() {

      if (
        card.parentNode &&
        !bought
      ) {

        card.remove();

      }

    },

    13000
  );

}


/* =========================================================
   SERVER / EVENT TIMERS
========================================================= */

createEventStyles();


loadServerState();


setInterval(
  function() {

    updateEventDisplay();

  },

  1000
);


setInterval(
  function() {

    loadServerState();

  },

  3000
);
/* =========================================================
   PART 3
   BASE + MONEY + SELECT + REMOVE + FUSION
========================================================= */


/* =========================================================
   MESSAGE
========================================================= */

let messageTimer = null;

function showMessage(text) {

  const message =
    document.getElementById("message");

  if (!message) {
    console.log(text);
    return;
  }

  message.textContent = text;
  message.classList.add("show");

  clearTimeout(messageTimer);

  messageTimer =
    setTimeout(
      function() {
        message.classList.remove("show");
      },
      1500
    );
}


/* =========================================================
   READY MONEY
========================================================= */

function getReadyMoney() {

  let total = 0;

  ownedPets.forEach(
    function(pet) {

      total +=
        Math.floor(
          Number(pet.stored) || 0
        );

    }
  );

  return total;
}


/* =========================================================
   COLLECT ALL
========================================================= */

function collectAll() {

  const amount =
    getReadyMoney();

  if (amount <= 0) {

    showMessage(
      "💰 NOTHING YET!"
    );

    return;
  }


  ownedPets.forEach(
    function(pet) {

      const petMoney =
        Math.floor(
          Number(pet.stored) || 0
        );

      money += petMoney;

      pet.stored -= petMoney;

    }
  );


  updateGame();


  showMessage(
    "💵 +$" +
    formatMoney(amount)
  );
}


/* =========================================================
   BASE
========================================================= */

function renderBase() {

  const slots =
    document.getElementById(
      "slots"
    );

  if (!slots) {
    return;
  }


  slots.innerHTML = "";


  for (
    let i = 0;
    i < MAX_PETS;
    i++
  ) {

    const slot =
      document.createElement(
        "div"
      );

    const pet =
      ownedPets[i];


    /*
      EMPTY SLOT
    */

    if (!pet) {

      slot.className =
        "slot empty";

      slot.textContent = "+";

      slots.appendChild(slot);

      continue;
    }


    const selected =
      selectedPets.includes(
        pet.id
      );


    slot.className =
      selected
        ? "slot selected"
        : "slot";


    slot.innerHTML = `

      <div class="pet-emoji">

        ${pet.mutationEmoji || ""}
        ${pet.emoji}

      </div>


      <div class="pet-name">

        ${
          pet.mutation &&
          pet.mutation !== "Normal"

            ? pet.mutation + " "

            : ""
        }

        ${pet.name}

      </div>


      <div class="pet-rarity">

        ${String(
          pet.rarity
        ).toUpperCase()}

      </div>


      ${
        pet.eventEffect

          ? `

            <div
              class="event-tag ${pet.eventEffect}"
            >

              ${pet.eventEmoji || ""}
              ${pet.eventName || ""}
              ×${pet.eventMultiplier || 3}

            </div>

          `

          : ""
      }


      <div class="pet-income">

        +$${formatMoney(
          pet.income
        )}/s

      </div>


      <div class="pet-stored">

        💰 $${formatMoney(
          pet.stored || 0
        )}

      </div>


      <button
        class="select-btn"
        data-id="${pet.id}"
        type="button"
      >

        ${
          selected
            ? "SELECTED"
            : "SELECT"
        }

      </button>


      <button
        class="remove-btn"
        data-id="${pet.id}"
        type="button"
      >

        REMOVE

      </button>

    `;


    slots.appendChild(slot);
  }
}


/* =========================================================
   SELECT PET
========================================================= */

function selectPet(id) {

  if (activeFusion) {

    showMessage(
      "🧬 FUSION LAB IS BUSY!"
    );

    return;
  }


  if (
    selectedPets.includes(id)
  ) {

    selectedPets =
      selectedPets.filter(
        function(selectedId) {

          return (
            selectedId !== id
          );

        }
      );

    updateGame();

    return;
  }


  if (
    selectedPets.length >= 2
  ) {

    showMessage(
      "🧬 ONLY 2 PETS!"
    );

    return;
  }


  selectedPets.push(id);

  updateGame();
}


/* =========================================================
   REMOVE PET
========================================================= */

function removePet(id) {

  ownedPets =
    ownedPets.filter(
      function(pet) {

        return (
          pet.id !== id
        );

      }
    );


  selectedPets =
    selectedPets.filter(
      function(selectedId) {

        return (
          selectedId !== id
        );

      }
    );


  updateGame();


  showMessage(
    "🗑️ PET REMOVED"
  );
}


/* =========================================================
   FUSION SLOTS
========================================================= */

function renderFusionSlots() {

  const machine =
    document.getElementById(
      "fusionMachine"
    );


  if (!machine) {
    return;
  }


  if (activeFusion) {

    machine.classList.add(
      "hidden"
    );

    return;
  }


  machine.classList.remove(
    "hidden"
  );


  const slot1 =
    document.getElementById(
      "fusionSlot1"
    );


  const slot2 =
    document.getElementById(
      "fusionSlot2"
    );


  const pet1 =
    ownedPets.find(
      function(pet) {

        return (
          pet.id ===
          selectedPets[0]
        );

      }
    );


  const pet2 =
    ownedPets.find(
      function(pet) {

        return (
          pet.id ===
          selectedPets[1]
        );

      }
    );


  drawFusionSlot(
    slot1,
    pet1
  );


  drawFusionSlot(
    slot2,
    pet2
  );
}


/* =========================================================
   DRAW FUSION SLOT
========================================================= */

function drawFusionSlot(
  element,
  pet
) {

  if (!element) {
    return;
  }


  if (!pet) {

    element.innerHTML = `

      <div class="fusion-question">
        ?
      </div>

      <div>
        SELECT PET
      </div>

    `;

    return;
  }


  element.innerHTML = `

    <div class="fusion-selected-emoji">

      ${pet.mutationEmoji || ""}
      ${pet.emoji}

    </div>


    <div class="fusion-selected-name">

      ${
        pet.mutation &&
        pet.mutation !== "Normal"

          ? pet.mutation + " "

          : ""
      }

      ${pet.name}

    </div>

  `;
}


/* =========================================================
   FIND FUSION
========================================================= */

function findFusionRecipe(
  pet1,
  pet2
) {

  if (
    !pet1 ||
    !pet2
  ) {

    return null;
  }


  const selectedNames =
    [
      pet1.name,
      pet2.name
    ]
      .sort()
      .join("|");


  return fusionRecipes.find(
    function(recipe) {

      return (
        [...recipe.pets]
          .sort()
          .join("|")
        ===
        selectedNames
      );

    }
  ) || null;
}


/* =========================================================
   START FUSION
========================================================= */

function startFusion() {

  if (activeFusion) {

    showMessage(
      "⏱️ FUSION ALREADY RUNNING!"
    );

    return;
  }


  if (
    selectedPets.length !== 2
  ) {

    showMessage(
      "🧬 SELECT 2 PETS!"
    );

    return;
  }


  const pet1 =
    ownedPets.find(
      function(pet) {

        return (
          pet.id ===
          selectedPets[0]
        );

      }
    );


  const pet2 =
    ownedPets.find(
      function(pet) {

        return (
          pet.id ===
          selectedPets[1]
        );

      }
    );


  if (
    !pet1 ||
    !pet2
  ) {

    selectedPets = [];

    updateGame();

    return;
  }


  const recipe =
    findFusionRecipe(
      pet1,
      pet2
    );


  if (!recipe) {

    showMessage(
      "❌ NO FUSION FOUND!"
    );

    return;
  }


  /*
    STRONGEST MUTATION WINS
  */

  const bestMultiplier =
    Math.max(
      Number(
        pet1.multiplier
      ) || 1,

      Number(
        pet2.multiplier
      ) || 1
    );


  const inheritedMutation =
    mutations.find(
      function(mutation) {

        return (
          mutation.multiplier ===
          bestMultiplier
        );

      }
    ) || mutations[0];


  /*
    EVENT EFFECT
  */

  let inheritedEvent =
    null;


  if (pet1.eventEffect) {

    inheritedEvent = {

      id:
        pet1.eventEffect,

      name:
        pet1.eventName,

      emoji:
        pet1.eventEmoji

    };

  }

  else if (pet2.eventEffect) {

    inheritedEvent = {

      id:
        pet2.eventEffect,

      name:
        pet2.eventName,

      emoji:
        pet2.eventEmoji

    };

  }


  const eventMultiplier =
    inheritedEvent
      ? EVENT_MULTIPLIER
      : 1;


  /*
    REMOVE ORIGINAL PETS
  */

  const idsToRemove =
    [...selectedPets];


  ownedPets =
    ownedPets.filter(
      function(pet) {

        return (
          !idsToRemove.includes(
            pet.id
          )
        );

      }
    );


  /*
    CREATE FUSION JOB
  */

  activeFusion = {

    pet1: {

      name:
        pet1.name,

      emoji:
        pet1.emoji

    },


    pet2: {

      name:
        pet2.name,

      emoji:
        pet2.emoji

    },


    result: {

      name:
        recipe.result.name,

      emoji:
        recipe.result.emoji,

      rarity:
        recipe.result.rarity,

      mutation:
        inheritedMutation.name,

      mutationEmoji:
        inheritedMutation.emoji,

      multiplier:
        inheritedMutation.multiplier,

      eventEffect:
        inheritedEvent
          ? inheritedEvent.id
          : null,

      eventName:
        inheritedEvent
          ? inheritedEvent.name
          : null,

      eventEmoji:
        inheritedEvent
          ? inheritedEvent.emoji
          : "",

      eventMultiplier:
        eventMultiplier,

      income:

        recipe.result.income *

        inheritedMutation.multiplier *

        eventMultiplier

    },


    totalTime:
      FUSION_TIME,


    timeLeft:
      FUSION_TIME,


    complete:
      false

  };


  selectedPets = [];


  updateGame();


  showMessage(
    "🧬 FUSION STARTED!"
  );
}


/* =========================================================
   FUSION TIMER
========================================================= */

function updateFusionTimer() {

  if (
    !activeFusion ||
    activeFusion.complete
  ) {

    return;
  }


  activeFusion.timeLeft--;


  if (
    activeFusion.timeLeft <= 0
  ) {

    activeFusion.timeLeft = 0;

    activeFusion.complete =
      true;


    showMessage(
      "✨ FUSION COMPLETE!"
    );
  }


  renderFusionProgress();
}


/* =========================================================
   FUSION PROGRESS
========================================================= */

function renderFusionProgress() {

  const progress =
    document.getElementById(
      "fusionProgress"
    );


  const fuseButton =
    document.getElementById(
      "fuseButton"
    );


  const clearButton =
    document.getElementById(
      "clearFusion"
    );


  const claimButton =
    document.getElementById(
      "claimButton"
    );


  const subtitle =
    document.getElementById(
      "fusionSubtitle"
    );


  /*
    If the HTML doesn't contain
    fusion controls, don't crash.
  */

  if (
    !progress ||
    !fuseButton ||
    !clearButton ||
    !claimButton
  ) {

    return;
  }


  /*
    NO ACTIVE FUSION
  */

  if (!activeFusion) {

    progress.classList.add(
      "hidden"
    );


    fuseButton.classList.remove(
      "hidden"
    );


    clearButton.classList.remove(
      "hidden"
    );


    claimButton.classList.add(
      "hidden"
    );


    if (subtitle) {

      subtitle.textContent =
        "Select 2 pets and discover a new pet!";

    }


    return;
  }


  /*
    ACTIVE FUSION
  */

  progress.classList.remove(
    "hidden"
  );


  fuseButton.classList.add(
    "hidden"
  );


  clearButton.classList.add(
    "hidden"
  );


  const minutes =
    Math.floor(
      activeFusion.timeLeft /
      60
    );


  const seconds =
    activeFusion.timeLeft %
    60;


  const timer =
    document.getElementById(
      "fusionTimer"
    );


  if (timer) {

    timer.textContent =

      String(minutes)
        .padStart(2, "0")

      +

      ":"

      +

      String(seconds)
        .padStart(2, "0");

  }


  const pair =
    document.getElementById(
      "fusionPair"
    );


  if (pair) {

    pair.textContent =

      activeFusion.pet1.emoji +
      " " +
      activeFusion.pet1.name +

      " + " +

      activeFusion.pet2.emoji +
      " " +
      activeFusion.pet2.name;

  }


  const percent =

    (
      (
        activeFusion.totalTime -
        activeFusion.timeLeft
      )

      /

      activeFusion.totalTime

    )

    *

    100;


  const fill =
    document.getElementById(
      "progressFill"
    );


  if (fill) {

    fill.style.width =
      Math.max(
        0,
        Math.min(
          100,
          percent
        )
      ) + "%";

  }


  const status =
    document.getElementById(
      "fusionStatus"
    );


  if (
    activeFusion.complete
  ) {

    if (status) {

      status.textContent =
        "✨ COMPLETE!";

    }


    if (timer) {

      timer.textContent =
        "READY";

    }


    if (subtitle) {

      subtitle.textContent =
        "Your new pet is ready!";

    }


    claimButton.classList.remove(
      "hidden"
    );

  }

  else {

    if (status) {

      status.textContent =
        "FUSING...";

    }


    if (subtitle) {

      subtitle.textContent =
        "The Fusion Machine is working...";

    }


    claimButton.classList.add(
      "hidden"
    );
  }
}


/* =========================================================
   CLAIM FUSION
========================================================= */

function claimFusion() {

  if (
    !activeFusion ||
    !activeFusion.complete
  ) {

    return;
  }


  if (
    ownedPets.length >=
    MAX_PETS
  ) {

    showMessage(
      "❌ MAKE SPACE IN YOUR BASE!"
    );

    return;
  }


  const result =
    activeFusion.result;


  ownedPets.push({

    id:
      Date.now() +
      Math.random(),

    name:
      result.name,

    emoji:
      result.emoji,

    rarity:
      result.rarity,

    mutation:
      result.mutation,

    mutationEmoji:
      result.mutationEmoji,

    multiplier:
      result.multiplier,

    eventEffect:
      result.eventEffect,

    eventName:
      result.eventName,

    eventEmoji:
      result.eventEmoji,

    eventMultiplier:
      result.eventMultiplier,

    income:
      result.income,

    stored:
      0,

    fusion:
      true

  });


  const claimedName =
    result.name;


  activeFusion = null;


  updateGame();


  if (
    typeof scanOwnedPetsForIndex ===
    "function"
  ) {

    scanOwnedPetsForIndex();
  }


  showMessage(
    "✨ " +
    claimedName +
    " CLAIMED!"
  );
}


/* =========================================================
   CLEAR FUSION SELECTION
========================================================= */

function clearFusionSelection() {

  if (activeFusion) {

    showMessage(
      "🧬 FUSION IS RUNNING!"
    );

    return;
  }


  selectedPets = [];


  updateGame();
}


/* =========================================================
   UPDATE GAME
========================================================= */

function updateGame() {

  const moneyElement =
    document.getElementById(
      "money"
    );


  if (moneyElement) {

    moneyElement.textContent =
      formatMoney(
        money
      );

  }


  const petCount =
    document.getElementById(
      "petCount"
    );


  if (petCount) {

    petCount.textContent =
      ownedPets.length;

  }


  const readyMoney =
    document.getElementById(
      "readyMoney"
    );


  if (readyMoney) {

    readyMoney.textContent =
      formatMoney(
        getReadyMoney()
      );

  }


  renderBase();

  renderFusionSlots();

  renderFusionProgress();
}


/* =========================================================
   BASE BUTTON EVENTS
========================================================= */

document.addEventListener(
  "click",

  function(event) {

    const selectButton =
      event.target.closest(
        ".select-btn"
      );


    if (selectButton) {

      event.preventDefault();

      event.stopPropagation();


      selectPet(
        Number(
          selectButton.dataset.id
        )
      );


      return;
    }


    const removeButton =
      event.target.closest(
        ".remove-btn"
      );


    if (removeButton) {

      event.preventDefault();

      event.stopPropagation();


      removePet(
        Number(
          removeButton.dataset.id
        )
      );


      return;
    }

  }
);


/* =========================================================
   MAIN BUTTONS
========================================================= */

const collectButton =
  document.getElementById(
    "collectAll"
  );


if (collectButton) {

  collectButton.onclick =
    collectAll;
}


const fuseButton =
  document.getElementById(
    "fuseButton"
  );


if (fuseButton) {

  fuseButton.onclick =
    startFusion;
}


const clearFusionButton =
  document.getElementById(
    "clearFusion"
  );


if (clearFusionButton) {

  clearFusionButton.onclick =
    clearFusionSelection;
}


const claimButton =
  document.getElementById(
    "claimButton"
  );


if (claimButton) {

  claimButton.onclick =
    claimFusion;
}


/* =========================================================
   INCOME TIMER
========================================================= */

setInterval(
  function() {

    ownedPets.forEach(
      function(pet) {

        pet.stored =
          (
            Number(
              pet.stored
            ) || 0
          )

          +

          (
            Number(
              pet.income
            ) || 0
          );

      }
    );


    updateGame();

  },

  1000
);


/* =========================================================
   FUSION TIMER LOOP
========================================================= */

setInterval(
  function() {

    updateFusionTimer();

  },

  1000
);


/* =========================================================
   INITIAL BASE UPDATE
========================================================= */

updateGame();
/* =========================================================
   TEMPORARY STARTUP FIX
   MAKES PARTS 1-3 RUN
========================================================= */


/* temporary index function until Part 4 */

if (
  typeof window.scanOwnedPetsForIndex !==
  "function"
) {

  window.scanOwnedPetsForIndex =
    function() {};

}


/* START FIRST PET */

spawnPet();


/* PET CARPET TIMER */



/* FINAL START UPDATE */

updateGame();

updateEventDisplay();

console.log(
  "GROW YOUR PETS STARTED ✅"
);
/* =========================================================
   PART 4
   INDEX + SPAWN TIMER
========================================================= */


/* =========================================================
   INDEX STATE
========================================================= */

let currentIndexType =
  "Normal";


const discoveredIndex = {

  Normal:
    new Set(),

  Golden:
    new Set(),

  Diamond:
    new Set(),

  Rainbow:
    new Set(),

  Void:
    new Set()

};


/* =========================================================
   ALL INDEX PETS
========================================================= */

function getAllIndexPets() {

  const allPets = [];


  pets.forEach(
    function(pet) {

      allPets.push({

        name:
          pet.name,

        emoji:
          pet.emoji,

        rarity:
          pet.rarity,

        income:
          pet.income,

        fusion:
          false

      });

    }
  );


  fusionRecipes.forEach(
    function(recipe) {

      allPets.push({

        name:
          recipe.result.name,

        emoji:
          recipe.result.emoji,

        rarity:
          recipe.result.rarity,

        income:
          recipe.result.income,

        fusion:
          true

      });

    }
  );


  return allPets;

}


/* =========================================================
   SAVE INDEX
========================================================= */

function saveIndex() {

  const data = {

    Normal:
      Array.from(
        discoveredIndex.Normal
      ),

    Golden:
      Array.from(
        discoveredIndex.Golden
      ),

    Diamond:
      Array.from(
        discoveredIndex.Diamond
      ),

    Rainbow:
      Array.from(
        discoveredIndex.Rainbow
      ),

    Void:
      Array.from(
        discoveredIndex.Void
      )

  };


  try {

    localStorage.setItem(
      "growYourPetsIndex",
      JSON.stringify(data)
    );

  }

  catch (error) {

    console.log(
      "INDEX SAVE FAILED",
      error
    );

  }

}


/* =========================================================
   LOAD INDEX
========================================================= */

function loadIndex() {

  try {

    const saved =
      localStorage.getItem(
        "growYourPetsIndex"
      );


    if (!saved) {
      return;
    }


    const data =
      JSON.parse(saved);


    discoveredIndex.Normal =
      new Set(
        data.Normal || []
      );


    discoveredIndex.Golden =
      new Set(
        data.Golden || []
      );


    discoveredIndex.Diamond =
      new Set(
        data.Diamond || []
      );


    discoveredIndex.Rainbow =
      new Set(
        data.Rainbow || []
      );


    discoveredIndex.Void =
      new Set(
        data.Void || []
      );

  }

  catch (error) {

    console.log(
      "INDEX LOAD FAILED",
      error
    );

  }

}


/* =========================================================
   SCAN OWNED PETS
========================================================= */

function scanOwnedPetsForIndex() {

  let changed =
    false;


  ownedPets.forEach(
    function(pet) {

      const type =
        pet.mutation ||
        "Normal";


      if (
        !discoveredIndex[type]
      ) {

        return;
      }


      if (
        !discoveredIndex[type]
          .has(pet.name)
      ) {

        discoveredIndex[type]
          .add(pet.name);


        changed =
          true;

      }

    }
  );


  if (changed) {

    saveIndex();

    renderPetIndex();

  }

}


/* =========================================================
   INDEX MULTIPLIER
========================================================= */

function getIndexMultiplier(
  type
) {

  if (
    type === "Golden"
  ) {
    return 2;
  }


  if (
    type === "Diamond"
  ) {
    return 5;
  }


  if (
    type === "Rainbow"
  ) {
    return 10;
  }


  if (
    type === "Void"
  ) {
    return 25;
  }


  return 1;

}


/* =========================================================
   INDEX EMOJI
========================================================= */

function getIndexEmoji(
  type
) {

  if (
    type === "Golden"
  ) {
    return "🟡";
  }


  if (
    type === "Diamond"
  ) {
    return "💎";
  }


  if (
    type === "Rainbow"
  ) {
    return "🌈";
  }


  if (
    type === "Void"
  ) {
    return "🌌";
  }


  return "";

}


/* =========================================================
   RENDER INDEX
========================================================= */

function renderPetIndex() {

  const grid =
    document.getElementById(
      "indexGrid"
    );


  if (!grid) {
    return;
  }


  const allPets =
    getAllIndexPets();


  const discovered =
    discoveredIndex[
      currentIndexType
    ];


  const multiplier =
    getIndexMultiplier(
      currentIndexType
    );


  const mutationEmoji =
    getIndexEmoji(
      currentIndexType
    );


  grid.innerHTML =
    "";


  allPets.forEach(
    function(pet) {

      const unlocked =
        discovered.has(
          pet.name
        );


      const card =
        document.createElement(
          "div"
        );


      card.className =

        "index-pet " +

        pet.rarity +

        " " +

        (
          unlocked
            ? "discovered"
            : "locked"
        );


      if (
        !unlocked &&
        pet.fusion
      ) {

        card.innerHTML = `

          <div class="index-pet-emoji">
            ❓
          </div>

          <div class="index-pet-name">
            ???
          </div>

          <div class="index-pet-rarity">
            SECRET FUSION
          </div>

        `;

      }

      else if (
        !unlocked
      ) {

        card.innerHTML = `

          <div class="index-pet-emoji">
            ❓
          </div>

          <div class="index-pet-name">

            ${pet.name}

          </div>

          <div class="index-pet-rarity">

            ${pet.rarity.toUpperCase()}

          </div>

        `;

      }

      else {

        card.innerHTML = `

          <div class="index-pet-emoji">

            ${mutationEmoji}
            ${pet.emoji}

          </div>


          <div class="index-pet-name">

            ${
              currentIndexType !==
              "Normal"

                ? currentIndexType +
                  " "

                : ""
            }

            ${pet.name}

          </div>


          <div class="index-pet-rarity">

            ${pet.rarity.toUpperCase()}

          </div>


          <div class="index-pet-income">

            +$${formatMoney(

              pet.income *
              multiplier

            )}/s

          </div>

        `;

      }


      grid.appendChild(
        card
      );

    }
  );


  const counter =
    document.getElementById(
      "indexCounter"
    );


  if (counter) {

    counter.textContent =

      discovered.size +

      " / " +

      allPets.length;

  }

}


/* =========================================================
   OPEN INDEX
========================================================= */

function openPetIndex() {

  const overlay =
    document.getElementById(
      "indexOverlay"
    );


  if (!overlay) {
    return;
  }


  overlay.classList.remove(
    "hidden"
  );


  renderPetIndex();

}


/* =========================================================
   CLOSE INDEX
========================================================= */

function closePetIndex() {

  const overlay =
    document.getElementById(
      "indexOverlay"
    );


  if (!overlay) {
    return;
  }


  overlay.classList.add(
    "hidden"
  );

}


/* =========================================================
   INDEX BUTTONS
========================================================= */

const openIndexButton =
  document.getElementById(
    "openIndexButton"
  );


if (openIndexButton) {

  openIndexButton.onclick =
    openPetIndex;

}


const closeIndexButton =
  document.getElementById(
    "closeIndexButton"
  );


if (closeIndexButton) {

  closeIndexButton.onclick =
    closePetIndex;

}


/* =========================================================
   INDEX TABS
========================================================= */

document
  .querySelectorAll(
    ".index-tab"
  )
  .forEach(
    function(button) {

      button.onclick =
        function() {

          currentIndexType =
            button.dataset.indexType;


          document
            .querySelectorAll(
              ".index-tab"
            )
            .forEach(
              function(tab) {

                tab.classList.remove(
                  "active"
                );

              }
            );


          button.classList.add(
            "active"
          );


          renderPetIndex();

        };

    }
  );


/* =========================================================
   INDEX DISCOVERY TIMER
========================================================= */

setInterval(
  function() {

    scanOwnedPetsForIndex();

  },

  1000
);


/* =========================================================
   CLEAN SPAWN TIMER
========================================================= */

setInterval(
  function() {

    nextPetTimer--;


    if (
      nextPetTimer <= 0
    ) {

      spawnPet();

      nextPetTimer =
        4;

    }


    const timer =
      document.getElementById(
        "timer"
      );


    if (timer) {

      timer.textContent =
        nextPetTimer;

    }

  },

  1000
);


/* =========================================================
   LOAD INDEX
========================================================= */

loadIndex();

scanOwnedPetsForIndex();

renderPetIndex();
/* =========================================================
   PART 5
   ADMIN LOGIN + ADMIN PANEL
========================================================= */


/* =========================================================
   APPWRITE
========================================================= */
/* Appwrite + Admin account already created in Part 1 */

/* =========================================================
   ELEMENTS
========================================================= */

const adminOpenButton =
  document.getElementById(
    "adminOpenButton"
  );

const adminLoginOverlay =
  document.getElementById(
    "adminLoginOverlay"
  );

const adminLoginButton =
  document.getElementById(
    "adminLoginButton"
  );

const adminLoginClose =
  document.getElementById(
    "adminLoginClose"
  );

const adminEmail =
  document.getElementById(
    "adminEmail"
  );

const adminPassword =
  document.getElementById(
    "adminPassword"
  );

const adminLoginMessage =
  document.getElementById(
    "adminLoginMessage"
  );

const adminPanelOverlay =
  document.getElementById(
    "adminPanelOverlay"
  );

const adminPanelClose =
  document.getElementById(
    "adminPanelClose"
  );


/* =========================================================
   ADMIN STATE
========================================================= */

let isAdminLoggedIn =
  false;


/* =========================================================
   CHECK ADMIN
========================================================= */

async function refreshAdminStatus() {

  try {

    const user =
      await adminAccount.get();


    if (
      user.$id ===
      ADMIN_USER_ID
    ) {

      isAdminLoggedIn =
        true;


      if (adminOpenButton) {

        adminOpenButton.innerHTML =
          "👑✅";

      }


      return true;

    }

  }

  catch (error) {

    /* no active session */

  }


  isAdminLoggedIn =
    false;


  if (adminOpenButton) {

    adminOpenButton.innerHTML =
      "👑";

  }


  return false;

}


/* =========================================================
   OPEN CROWN
========================================================= */

if (adminOpenButton) {

  adminOpenButton.onclick =
    async function() {

      const admin =
        await refreshAdminStatus();


      /*
         ALREADY LOGGED IN
      */

      if (admin) {

        if (adminPanelOverlay) {

          adminPanelOverlay
            .classList
            .remove(
              "hidden"
            );

        }


        return;

      }


      /*
         NEED LOGIN
      */

      if (adminLoginOverlay) {

        adminLoginOverlay
          .classList
          .remove(
            "hidden"
          );

      }


      if (adminLoginMessage) {

        adminLoginMessage
          .textContent =
            "";

      }

    };

}


/* =========================================================
   CLOSE LOGIN
========================================================= */

if (adminLoginClose) {

  adminLoginClose.onclick =
    function() {

      if (adminLoginOverlay) {

        adminLoginOverlay
          .classList
          .add(
            "hidden"
          );

      }

    };

}


/* =========================================================
   LOGIN
========================================================= */

if (adminLoginButton) {

  adminLoginButton.onclick =
    async function() {

      if (
        !adminEmail ||
        !adminPassword
      ) {

        return;

      }


      const email =
        adminEmail.value.trim();


      const password =
        adminPassword.value;


      if (
        !email ||
        !password
      ) {

        if (adminLoginMessage) {

          adminLoginMessage
            .textContent =
              "Enter email and password.";

        }


        return;

      }


      adminLoginButton.disabled =
        true;


      if (adminLoginMessage) {

        adminLoginMessage
          .textContent =
            "Logging in...";

      }


      try {

        /*
           REMOVE EXISTING SESSION
        */

        try {

          await adminAccount
            .deleteSession({

              sessionId:
                "current"

            });

        }

        catch (error) {}


        /*
           LOGIN
        */

        await adminAccount
          .createEmailPasswordSession({

            email:
              email,

            password:
              password

          });


        /*
           GET USER
        */

        const user =
          await adminAccount.get();


        /*
           VERIFY ADMIN ID
        */

        if (
          user.$id !==
          ADMIN_USER_ID
        ) {

          try {

            await adminAccount
              .deleteSession({

                sessionId:
                  "current"

              });

          }

          catch (error) {}


          isAdminLoggedIn =
            false;


          if (adminLoginMessage) {

            adminLoginMessage
              .textContent =
                "❌ NOT ADMIN";

          }


          adminLoginButton.disabled =
            false;


          return;

        }


        /*
           SUCCESS
        */

        isAdminLoggedIn =
          true;


        if (adminOpenButton) {

          adminOpenButton.innerHTML =
            "👑✅";

        }


        if (adminLoginMessage) {

          adminLoginMessage
            .textContent =
              "👑 ADMIN ACCESS GRANTED";

        }


        showMessage(
          "👑 ADMIN LOGGED IN!"
        );


        /*
           CLOSE LOGIN
        */

        if (adminLoginOverlay) {

          adminLoginOverlay
            .classList
            .add(
              "hidden"
            );

        }


        /*
           OPEN PANEL
        */

        if (adminPanelOverlay) {

          adminPanelOverlay
            .classList
            .remove(
              "hidden"
            );

        }

      }

      catch (error) {

        console.error(
          "ADMIN LOGIN ERROR:",
          error
        );


        if (adminLoginMessage) {

          adminLoginMessage
            .textContent =

              "❌ " +

              (
                error.message ||
                "LOGIN FAILED"
              );

        }

      }


      adminLoginButton.disabled =
        false;

    };

}


/* =========================================================
   CLOSE ADMIN PANEL
========================================================= */

if (adminPanelClose) {

  adminPanelClose.onclick =
    function() {

      if (adminPanelOverlay) {

        adminPanelOverlay
          .classList
          .add(
            "hidden"
          );

      }

    };

}


/* =========================================================
   INITIAL ADMIN CHECK
========================================================= */

refreshAdminStatus();


console.log(
  "PART 5 ADMIN LOADED ✅"
);
/* =========================================================
   PART 6
   ADMIN COMMANDS
========================================================= */


/* =========================================================
   ADMIN COMMAND ELEMENTS
========================================================= */

const p6TargetMe =
  document.getElementById(
    "adminTargetMe"
  );

const p6TargetServer =
  document.getElementById(
    "adminTargetServer"
  );

const p6PetSelect =
  document.getElementById(
    "adminPetSelect"
  );

const p6MutationSelect =
  document.getElementById(
    "adminMutationSelect"
  );

const p6GivePet =
  document.getElementById(
    "adminGivePet"
  );

const p6FinishFusion =
  document.getElementById(
    "adminFinishFusion"
  );

const p6Lava =
  document.getElementById(
    "adminLava"
  );

const p6Winter =
  document.getElementById(
    "adminWinter"
  );

const p6YinYang =
  document.getElementById(
    "adminYinYang"
  );

const p6StopEvent =
  document.getElementById(
    "adminStopEvent"
  );

const p6Lucky10 =
  document.getElementById(
    "adminLucky10"
  );

const p6StopLucky =
  document.getElementById(
    "adminStopLucky"
  );

const p6Message =
  document.getElementById(
    "adminPanelMessage"
  );


let p6Target =
  "me";


/* =========================================================
   ADMIN CHECK
========================================================= */

async function p6CheckAdmin() {

  try {

    const user =
      await adminAccount.get();


    return (
      user.$id ===
      ADMIN_USER_ID
    );

  }

  catch (error) {

    return false;

  }

}


/* =========================================================
   MESSAGE
========================================================= */

function p6AdminMessage(text) {

  if (p6Message) {

    p6Message.textContent =
      text;

  }


  showMessage(text);

}


/* =========================================================
   TARGET BUTTONS
========================================================= */

if (p6TargetMe) {

  p6TargetMe.onclick =
    function() {

      p6Target =
        "me";


      p6TargetMe
        .classList
        .add(
          "active"
        );


      if (p6TargetServer) {

        p6TargetServer
          .classList
          .remove(
            "active"
          );

      }


      p6AdminMessage(
        "👤 Target: ME"
      );

    };

}


if (p6TargetServer) {

  p6TargetServer.onclick =
    function() {

      p6Target =
        "server";


      p6TargetServer
        .classList
        .add(
          "active"
        );


      if (p6TargetMe) {

        p6TargetMe
          .classList
          .remove(
            "active"
          );

      }


      p6AdminMessage(
        "🌍 Target: ALL SERVER"
      );

    };

}


/* =========================================================
   FILL PET LIST
========================================================= */

function p6FillPetList() {

  if (!p6PetSelect) {

    return;

  }


  p6PetSelect.innerHTML = `

    <option value="">
      SELECT PET
    </option>

  `;


  pets.forEach(
    function(pet) {

      const option =
        document.createElement(
          "option"
        );


      option.value =
        "normal|" +
        pet.name;


      option.textContent =

        pet.emoji +
        " " +
        pet.name +
        " [" +
        pet.rarity.toUpperCase() +
        "]";


      p6PetSelect
        .appendChild(
          option
        );

    }
  );


  fusionRecipes.forEach(
    function(recipe) {

      const option =
        document.createElement(
          "option"
        );


      option.value =
        "fusion|" +
        recipe.result.name;


      option.textContent =

        "🧬 " +
        recipe.result.emoji +
        " " +
        recipe.result.name +
        " [" +
        recipe.result.rarity.toUpperCase() +
        "]";


      p6PetSelect
        .appendChild(
          option
        );

    }
  );

}


/* =========================================================
   FIND ADMIN PET
========================================================= */

function p6FindPet(
  value
) {

  if (!value) {

    return null;

  }


  const parts =
    value.split("|");


  const type =
    parts[0];


  const name =
    parts
      .slice(1)
      .join("|");


  if (
    type === "normal"
  ) {

    const pet =
      pets.find(
        function(item) {

          return (
            item.name ===
            name
          );

        }
      );


    if (!pet) {

      return null;

    }


    return {

      name:
        pet.name,

      emoji:
        pet.emoji,

      rarity:
        pet.rarity,

      income:
        pet.income,

      fusion:
        false

    };

  }


  if (
    type === "fusion"
  ) {

    const recipe =
      fusionRecipes.find(
        function(item) {

          return (
            item.result.name ===
            name
          );

        }
      );


    if (!recipe) {

      return null;

    }


    return {

      name:
        recipe.result.name,

      emoji:
        recipe.result.emoji,

      rarity:
        recipe.result.rarity,

      income:
        recipe.result.income,

      fusion:
        true

    };

  }


  return null;

}


/* =========================================================
   GET MUTATION
========================================================= */

function p6GetMutation() {

  const selectedName =
    p6MutationSelect
      ? p6MutationSelect.value
      : "Normal";


  return (

    mutations.find(
      function(mutation) {

        return (
          mutation.name ===
          selectedName
        );

      }
    )

    ||

    mutations[0]

  );

}


/* =========================================================
   GIVE PET TO ME
========================================================= */

async function p6GivePetToMe() {

  const admin =
    await p6CheckAdmin();


  if (!admin) {

    p6AdminMessage(
      "❌ NOT ADMIN"
    );

    return;

  }


  if (
    ownedPets.length >=
    MAX_PETS
  ) {

    p6AdminMessage(
      "❌ BASE FULL"
    );

    return;

  }


  const pet =
    p6FindPet(
      p6PetSelect
        ? p6PetSelect.value
        : ""
    );


  if (!pet) {

    p6AdminMessage(
      "🐾 SELECT A PET"
    );

    return;

  }


  const mutation =
    p6GetMutation();


  const income =

    pet.income *

    mutation.multiplier;


  ownedPets.push({

    id:
      Date.now() +
      Math.random(),

    name:
      pet.name,

    emoji:
      pet.emoji,

    rarity:
      pet.rarity,

    mutation:
      mutation.name,

    mutationEmoji:
      mutation.emoji,

    multiplier:
      mutation.multiplier,

    eventEffect:
      null,

    eventName:
      null,

    eventEmoji:
      "",

    eventMultiplier:
      1,

    income:
      income,

    stored:
      0,

    fusion:
      pet.fusion

  });


  updateGame();

  scanOwnedPetsForIndex();


  p6AdminMessage(

    "🎁 " +
    mutation.emoji +
    " " +
    mutation.name +
    " " +
    pet.name +
    " ADDED!"

  );

}






/* =========================================================
   GIVE MONEY
========================================================= */

document
  .querySelectorAll(
    ".admin-money"
  )
  .forEach(
    function(button) {

      button.onclick =
        async function() {

          const admin =
            await p6CheckAdmin();


          if (!admin) {

            p6AdminMessage(
              "❌ NOT ADMIN"
            );

            return;

          }


          const amount =
            Number(
              button.dataset.money ||
              0
            );


          if (
            p6Target === "me"
          ) {

            money +=
              amount;


            updateGame();


            p6AdminMessage(

              "💰 +$" +
              formatMoney(
                amount
              )

            );

          }

          else {

            p6AdminMessage(
              "🌍 Server Give Money needs the next Appwrite command table"
            );

          }

        };

    }
  );


/* =========================================================
   FINISH FUSION
========================================================= */

if (p6FinishFusion) {

  p6FinishFusion.onclick =
    async function() {

      const admin =
        await p6CheckAdmin();


      if (!admin) {

        p6AdminMessage(
          "❌ NOT ADMIN"
        );

        return;

      }


      if (
        p6Target !== "me"
      ) {

        p6AdminMessage(
          "🧬 Finish Fusion is ME only"
        );

        return;

      }


      if (!activeFusion) {

        p6AdminMessage(
          "🧬 NO ACTIVE FUSION"
        );

        return;

      }


      activeFusion.timeLeft =
        0;


      activeFusion.complete =
        true;


      renderFusionProgress();


      p6AdminMessage(
        "⚡ FUSION FINISHED!"
      );

    };

}


/* =========================================================
   SERVER EVENT
========================================================= */

async function p6StartServerEvent(
  eventId
) {

  const admin =
    await p6CheckAdmin();


  if (!admin) {

    p6AdminMessage(
      "❌ NOT ADMIN"
    );

    return;

  }


  try {

    const endsAt =

      Date.now() +

      (
        10 *
        60 *
        1000
      );


    const updated =
      await appwriteTables
        .updateRow({

          databaseId:
            SERVER_DATABASE_ID,

          tableId:
            SERVER_TABLE_ID,

          rowId:
            SERVER_ROW_ID,

          data: {

            activeEvent:
              eventId,

            eventEndsAt:
              endsAt

          }

        });


    serverState =
      updated;


    updateEventDisplay();


    const event =
      gameEvents.find(
        function(item) {

          return (
            item.id ===
            eventId
          );

        }
      );


    p6AdminMessage(

      event.emoji +
      " " +
      event.name +
      " FOR ALL SERVER!"

    );

  }

  catch (error) {

    console.error(
      error
    );


    p6AdminMessage(

      "❌ " +
      (
        error.message ||
        "EVENT FAILED"
      )

    );

  }

}


/* =========================================================
   ME EVENT
========================================================= */

function p6StartMeEvent(
  eventId
) {

  const event =
    gameEvents.find(
      function(item) {

        return (
          item.id ===
          eventId
        );

      }
    );


  if (!event) {

    return;

  }


  localAdminEvent =
    event;


  localAdminEventEndsAt =

    Date.now() +

    (
      10 *
      60 *
      1000
    );


  updateEventDisplay();


  p6AdminMessage(

    event.emoji +
    " " +
    event.name +
    " FOR YOU!"

  );

}


/* =========================================================
   EVENT ROUTER
========================================================= */

function p6RunEvent(
  eventId
) {

  if (
    p6Target === "server"
  ) {

    p6StartServerEvent(
      eventId
    );

  }

  else {

    p6StartMeEvent(
      eventId
    );

  }

}


/* =========================================================
   EVENT BUTTONS
========================================================= */

if (p6Lava) {

  p6Lava.onclick =
    function() {

      p6RunEvent(
        "lava"
      );

    };

}


if (p6Winter) {

  p6Winter.onclick =
    function() {

      p6RunEvent(
        "winter"
      );

    };

}


if (p6YinYang) {

  p6YinYang.onclick =
    function() {

      p6RunEvent(
        "yinyang"
      );

    };

}


/* =========================================================
   STOP EVENT
========================================================= */

if (p6StopEvent) {

  p6StopEvent.onclick =
    async function() {

      if (
        p6Target === "me"
      ) {

        localAdminEvent =
          null;

        localAdminEventEndsAt =
          0;


        updateEventDisplay();


        p6AdminMessage(
          "⛔ YOUR EVENT STOPPED"
        );


        return;

      }


      const admin =
        await p6CheckAdmin();


      if (!admin) {

        p6AdminMessage(
          "❌ NOT ADMIN"
        );

        return;

      }


      try {

        const updated =
          await appwriteTables
            .updateRow({

              databaseId:
                SERVER_DATABASE_ID,

              tableId:
                SERVER_TABLE_ID,

              rowId:
                SERVER_ROW_ID,

              data: {

                activeEvent:
                  "none",

                eventEndsAt:
                  0

              }

            });


        serverState =
          updated;


        updateEventDisplay();


        p6AdminMessage(
          "⛔ SERVER EVENT STOPPED"
        );

      }

      catch (error) {

        p6AdminMessage(

          "❌ " +
          (
            error.message ||
            "FAILED"
          )

        );

      }

    };

}


/* =========================================================
   10% LUCK
========================================================= */

if (p6Lucky10) {

  p6Lucky10.onclick =
    async function() {

      if (
        p6Target === "me"
      ) {

        localLuckyPercent =
          10;


        localLuckyEndsAt =

          Date.now() +

          (
            10 *
            60 *
            1000
          );


        updateEventDisplay();


        p6AdminMessage(
          "🍀 10% LUCK FOR YOU!"
        );


        return;

      }


      const admin =
        await p6CheckAdmin();


      if (!admin) {

        p6AdminMessage(
          "❌ NOT ADMIN"
        );

        return;

      }


      try {

        const updated =
          await appwriteTables
            .updateRow({

              databaseId:
                SERVER_DATABASE_ID,

              tableId:
                SERVER_TABLE_ID,

              rowId:
                SERVER_ROW_ID,

              data: {

                luckyPercent:
                  10,

                luckyEndsAt:

                  Date.now() +

                  (
                    10 *
                    60 *
                    1000
                  )

              }

            });


        serverState =
          updated;


        p6AdminMessage(
          "🍀 10% LUCK FOR ALL SERVER!"
        );

      }

      catch (error) {

        p6AdminMessage(

          "❌ " +
          (
            error.message ||
            "FAILED"
          )

        );

      }

    };

}


/* =========================================================
   STOP LUCK
========================================================= */

if (p6StopLucky) {

  p6StopLucky.onclick =
    async function() {

      if (
        p6Target === "me"
      ) {

        localLuckyPercent =
          0;

        localLuckyEndsAt =
          0;


        updateEventDisplay();


        p6AdminMessage(
          "⛔ YOUR LUCK STOPPED"
        );


        return;

      }


      const admin =
        await p6CheckAdmin();


      if (!admin) {

        p6AdminMessage(
          "❌ NOT ADMIN"
        );

        return;

      }


      try {

        const updated =
          await appwriteTables
            .updateRow({

              databaseId:
                SERVER_DATABASE_ID,

              tableId:
                SERVER_TABLE_ID,

              rowId:
                SERVER_ROW_ID,

              data: {

                luckyPercent:
                  0,

                luckyEndsAt:
                  0

              }

            });


        serverState =
          updated;


        p6AdminMessage(
          "⛔ SERVER LUCK STOPPED"
        );

      }

      catch (error) {

        p6AdminMessage(

          "❌ " +
          (
            error.message ||
            "FAILED"
          )

        );

      }

    };

}


/* =========================================================
   START PART 6
========================================================= */

p6FillPetList();


console.log(
  "PART 6 ADMIN COMMANDS LOADED ✅"
);
/* =========================================================
   ADMIN CROWN SAFE FIX
========================================================= */

window.addEventListener(
  "load",
  function() {

    const crown =
      document.getElementById(
        "adminOpenButton"
      );

    const login =
      document.getElementById(
        "adminLoginOverlay"
      );

    const panel =
      document.getElementById(
        "adminPanelOverlay"
      );


    if (!crown) {

      console.log(
        "ADMIN CROWN NOT FOUND"
      );

      return;
    }


    /* make sure nothing blocks it */

    crown.style.pointerEvents =
      "auto";

    crown.style.zIndex =
      "20000";


    crown.addEventListener(
      "click",

      async function(event) {

        event.preventDefault();
        event.stopPropagation();


        try {

          const user =
            await adminAccount.get();


          if (
            user.$id ===
            ADMIN_USER_ID
          ) {

            if (panel) {

              panel.classList.remove(
                "hidden"
              );

            }


            return;
          }

        }

        catch (error) {

          /* no login session */

        }


        if (login) {

          login.classList.remove(
            "hidden"
          );

        }

      },

      true
    );


    console.log(
      "ADMIN CROWN READY 👑"
    );

  }
);
/* =========================================================
   FIX ADMIN MONEY BUTTONS
========================================================= */

document.addEventListener(
  "click",

  async function(event) {

    const moneyButton =
      event.target.closest(
        ".admin-money"
      );


    if (!moneyButton) {
      return;
    }


    event.preventDefault();
    event.stopPropagation();


    try {

      const user =
        await adminAccount.get();


      if (
        user.$id !==
        ADMIN_USER_ID
      ) {

        showMessage(
          "❌ NOT ADMIN"
        );

        return;
      }


      const amount =
        Number(
          moneyButton.dataset.money ||
          0
        );


      money +=
        amount;


      updateGame();


      showMessage(
        "💰 +$" +
        formatMoney(amount)
      );


      const adminMessage =
        document.getElementById(
          "adminPanelMessage"
        );


      if (adminMessage) {

        adminMessage.textContent =
          "💰 +$" +
          formatMoney(amount);

      }

    }

    catch (error) {

      console.error(
        "ADMIN MONEY ERROR:",
        error
      );

    }

  },

  true
);
/* =========================================================
   FIX ADMIN GIVE PET - ME
========================================================= */

document.addEventListener(
  "click",

  async function(event) {

    const giveButton =
      event.target.closest(
        "#adminGivePet"
      );

    if (!giveButton) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();


    try {

      /* CHECK ADMIN */

      const user =
        await adminAccount.get();

      if (
        user.$id !==
        ADMIN_USER_ID
      ) {

        showMessage(
          "❌ NOT ADMIN"
        );

        return;
      }


      /* CHECK BASE */

      if (
        ownedPets.length >=
        MAX_PETS
      ) {

        showMessage(
          "❌ BASE FULL!"
        );

        return;
      }


      /* GET SELECTED PET */

      const petSelect =
        document.getElementById(
          "adminPetSelect"
        );

      const mutationSelect =
        document.getElementById(
          "adminMutationSelect"
        );


      if (
        !petSelect ||
        !petSelect.value
      ) {

        showMessage(
          "🐾 SELECT A PET"
        );

        return;
      }


      const pet =
        p6FindPet(
          petSelect.value
        );


      if (!pet) {

        showMessage(
          "❌ PET NOT FOUND"
        );

        return;
      }


      /* GET MUTATION */

      const mutationName =
        mutationSelect
          ? mutationSelect.value
          : "Normal";


      const mutation =
        mutations.find(
          function(item) {

            return (
              item.name ===
              mutationName
            );

          }
        ) || mutations[0];


      /* CREATE PET */

      ownedPets.push({

        id:
          Date.now() +
          Math.random(),

        name:
          pet.name,

        emoji:
          pet.emoji,

        rarity:
          pet.rarity,

        mutation:
          mutation.name,

        mutationEmoji:
          mutation.emoji,

        multiplier:
          mutation.multiplier,

        eventEffect:
          null,

        eventName:
          null,

        eventEmoji:
          "",

        eventMultiplier:
          1,

        income:
          pet.income *
          mutation.multiplier,

        stored:
          0,

        fusion:
          pet.fusion

      });


      /* UPDATE GAME */

      updateGame();

      scanOwnedPetsForIndex();


      showMessage(
        "🎁 " +
        mutation.emoji +
        " " +
        mutation.name +
        " " +
        pet.name +
        " ADDED!"
      );


      const adminMessage =
        document.getElementById(
          "adminPanelMessage"
        );


      if (adminMessage) {

        adminMessage.textContent =
          "🎁 " +
          pet.name +
          " ADDED!";

      }

    }

    catch (error) {

      console.error(
        "ADMIN GIVE PET ERROR:",
        error
      );


      showMessage(
        "❌ GIVE PET FAILED"
      );

    }

  },

  true
);
/* =========================================================
   SERVER COMMANDS
========================================================= */

const SERVER_COMMANDS_TABLE_ID =
  "server_commands";


async function sendServerCommand(data) {

  try {

    const user =
      await adminAccount.get();


    if (
      user.$id !==
      ADMIN_USER_ID
    ) {

      throw new Error(
        "NOT ADMIN"
      );

    }


    const now =
      Date.now();


    const commandData = {

      commandType:
        data.commandType,

      petName:
        data.petName || "",

      mutation:
        data.mutation || "",

      message:
        data.message || "",

      amount:
        Number(
          data.amount || 0
        ),

      gameCommandId:
        "cmd_" +
        now +
        "_" +
        Math.floor(
          Math.random() *
          100000
        ),

      gameCreatedAt:
        now,

      target:
        "server"

    };


    const row =
      await appwriteTables.createRow({

        databaseId:
          SERVER_DATABASE_ID,

        tableId:
          SERVER_COMMANDS_TABLE_ID,

        rowId:
          Appwrite.ID.unique(),

        data:
          commandData

      });


    console.log(
      "SERVER COMMAND SENT:",
      row
    );


    return row;

  }

  catch (error) {

    console.error(
      "SERVER COMMAND ERROR:",
      error
    );


    showMessage(
      "❌ SERVER COMMAND FAILED"
    );


    throw error;

  }

}
/* =========================================================
   TEST: ALL SERVER MONEY
========================================================= */

document.addEventListener(
  "click",
  async function(event) {

    const button =
      event.target.closest(
        '.admin-money[data-money="1000"]'
      );

    if (!button) {
      return;
    }


    /*
      ONLY WHEN TARGET = SERVER
    */

    if (
      typeof p6Target === "undefined" ||
      p6Target !== "server"
    ) {
      return;
    }


    event.preventDefault();
    event.stopPropagation();


    try {

      await sendServerCommand({

        commandType:
          "giveMoney",

        amount:
          1000

      });


      showMessage(
        "🌍 +$1K SENT TO SERVER!"
      );


      const msg =
        document.getElementById(
          "adminPanelMessage"
        );


      if (msg) {

        msg.textContent =
          "🌍 +$1K COMMAND SENT!";

      }

    }

    catch (error) {

      console.error(error);

    }

  },

  true
);
/* =========================================================
   SAFE SERVER COMMAND RECEIVER
========================================================= */

function getUsedServerCommands() {

  try {

    return JSON.parse(
      localStorage.getItem(
        "growPetsUsedServerCommands"
      ) || "[]"
    );

  } catch (error) {

    return [];

  }

}


function markServerCommandUsed(commandId) {

  const used =
    getUsedServerCommands();


  if (
    used.includes(commandId)
  ) {

    return;

  }


  used.push(commandId);


  while (
    used.length > 100
  ) {

    used.shift();

  }


  localStorage.setItem(
    "growPetsUsedServerCommands",
    JSON.stringify(used)
  );

}


/* =========================================================
   RUN SERVER COMMAND
========================================================= */

function runServerCommand(command) {

  if (!command) {
    return;
  }


  if (
    command.target !== "server"
  ) {

    return;

  }


  if (
    command.commandType ===
    "giveMoney"
  ) {

    const amount =
      Number(
        command.amount || 0
      );


    if (
      amount > 0
    ) {

      money += amount;

      updateGame();


      showMessage(
        "🌍 ADMIN GAVE +$" +
        formatMoney(amount)
      );

    }

  }

}


/* =========================================================
   READ SERVER COMMANDS
========================================================= */

async function checkServerCommandsSafe() {

  try {

    const result =
      await appwriteTables.listRows({

        databaseId:
          SERVER_DATABASE_ID,

        tableId:
          SERVER_COMMANDS_TABLE_ID

      });


    const rows =
      result.rows || [];


    const used =
      getUsedServerCommands();


    rows.forEach(
      function(command) {

        const commandId =
          command.gameCommandId;


        if (!commandId) {
          return;
        }


        if (
          used.includes(commandId)
        ) {

          return;

        }


        runServerCommand(command);

        markServerCommandUsed(
          commandId
        );

      }
    );

  }

  catch (error) {

    console.error(
      "SAFE COMMAND ERROR:",
      error
    );

  }

}


/* =========================================================
   START
========================================================= */

setInterval(
  checkServerCommandsSafe,
  3000
);
/* =========================================================
   FIX ALL SERVER GIVE PET
========================================================= */

document.addEventListener(
  "click",

  async function(event) {

    const button =
      event.target.closest(
        "#adminGivePet"
      );


    if (!button) {
      return;
    }


    if (
      typeof p6Target === "undefined" ||
      p6Target !== "server"
    ) {
      return;
    }


    event.preventDefault();
    event.stopPropagation();


    try {

      const petSelect =
        document.getElementById(
          "adminPetSelect"
        );


      const mutationSelect =
        document.getElementById(
          "adminMutationSelect"
        );


      if (
        !petSelect ||
        !petSelect.value
      ) {

        showMessage(
          "🐾 SELECT A PET"
        );

        return;
      }


      const pet =
        p6FindPet(
          petSelect.value
        );


      if (!pet) {

        showMessage(
          "❌ PET NOT FOUND"
        );

        return;
      }


      const mutationName =
        mutationSelect
          ? mutationSelect.value
          : "Normal";


      await sendServerCommand({

        commandType:
          "givePet",

        petName:
          pet.name,

        mutation:
          mutationName

      });


      showMessage(
        "🌍 PET SENT TO SERVER!"
      );


      const msg =
        document.getElementById(
          "adminPanelMessage"
        );


      if (msg) {

        msg.textContent =
          "🌍 " +
          mutationName +
          " " +
          pet.name +
          " SENT!";

      }

    }

    catch (error) {

      console.error(
        "ALL SERVER GIVE PET ERROR:",
        error
      );

    }

  },

  true
);
/* =========================================================
   SERVER COMMAND RECEIVER
   PART 1 - STATE
========================================================= */

const processedServerCommands =
  new Set();


function getCommandId(command) {

  if (!command) {
    return null;
  }

  return (
    command.$id ||
    command.id ||
    null
  );
}


console.log(
  "SERVER COMMAND RECEIVER PART 1 READY ✅"
);
/* =========================================================
   SERVER COMMAND RECEIVER
   PART 2 - READ COMMANDS
========================================================= */

async function fetchServerCommands() {

  try {

    const result =
      await appwriteTables.listRows({

        databaseId:
          SERVER_DATABASE_ID,

        tableId:
          SERVER_COMMANDS_TABLE_ID

      });


    const rows =
      result.rows || [];


    console.log(
      "SERVER COMMANDS:",
      rows
    );


    return rows;

  }

  catch (error) {

    console.error(
      "SERVER COMMAND FETCH ERROR:",
      error
    );


    return [];

  }

}
/* =========================================================
   SERVER COMMAND RECEIVER
   PART 3 - APPLY GIVE PET
========================================================= */

function applyGivePetCommand(command) {

  if (
    !command ||
    command.commandType !== "givePet"
  ) {
    return;
  }


  const commandId =
    getCommandId(command);


  if (!commandId) {
    return;
  }


  if (
    processedServerCommands.has(
      commandId
    )
  ) {
    return;
  }


  if (
    ownedPets.length >= MAX_PETS
  ) {

    showMessage(
      "🌍 ADMIN PET MISSED - BASE FULL!"
    );

    processedServerCommands.add(
      commandId
    );

    return;
  }


  const normalPet =
    pets.find(
      function(pet) {

        return (
          pet.name ===
          command.petName
        );

      }
    );


  const fusionRecipe =
    fusionRecipes.find(
      function(recipe) {

        return (
          recipe.result.name ===
          command.petName
        );

      }
    );


  let pet =
    null;


  if (normalPet) {

    pet = {

      name:
        normalPet.name,

      emoji:
        normalPet.emoji,

      rarity:
        normalPet.rarity,

      income:
        normalPet.income,

      fusion:
        false

    };

  }


  else if (fusionRecipe) {

    pet = {

      name:
        fusionRecipe.result.name,

      emoji:
        fusionRecipe.result.emoji,

      rarity:
        fusionRecipe.result.rarity,

      income:
        fusionRecipe.result.income,

      fusion:
        true

    };

  }


  if (!pet) {

    processedServerCommands.add(
      commandId
    );

    return;
  }


  const mutation =
    mutations.find(
      function(item) {

        return (
          item.name ===
          command.mutation
        );

      }
    ) || mutations[0];


  ownedPets.push({

    id:
      Date.now() +
      Math.random(),

    name:
      pet.name,

    emoji:
      pet.emoji,

    rarity:
      pet.rarity,

    mutation:
      mutation.name,

    mutationEmoji:
      mutation.emoji,

    multiplier:
      mutation.multiplier,

    eventEffect:
      null,

    eventName:
      null,

    eventEmoji:
      "",

    eventMultiplier:
      1,

    income:
      pet.income *
      mutation.multiplier,

    stored:
      0,

    fusion:
      pet.fusion

  });


  processedServerCommands.add(
    commandId
  );


  updateGame();

  scanOwnedPetsForIndex();


  showMessage(
    "🌍 ADMIN GAVE YOU " +
    mutation.emoji +
    " " +
    mutation.name +
    " " +
    pet.name +
    "!"
  );

}
/* =========================================================
   SERVER COMMAND RECEIVER
   PART 4 - POLL AND APPLY
========================================================= */

async function pollServerCommands() {

  const rows =
    await fetchServerCommands();


  rows.forEach(
    function(command) {

      applyGivePetCommand(
        command
      );

    }
  );

}


/* run once now */

pollServerCommands();


/* then check every 3 seconds */

setInterval(
  pollServerCommands,
  3000
);
/* =========================================================
   SERVER COMMAND MEMORY FIX
========================================================= */

function loadProcessedServerCommandsSafe() {

  try {

    const saved =
      JSON.parse(
        localStorage.getItem(
          "growPetsProcessedServerCommands"
        ) || "[]"
      );

    return new Set(saved);

  }

  catch (error) {

    return new Set();

  }

}


const savedProcessedCommands =
  loadProcessedServerCommandsSafe();


savedProcessedCommands.forEach(
  function(id) {

    processedServerCommands.add(id);

  }
);


function rememberServerCommandSafe(commandId) {

  if (!commandId) {
    return;
  }


  processedServerCommands.add(
    commandId
  );


  try {

    const latest =
      Array.from(
        processedServerCommands
      )
      .slice(-200);


    localStorage.setItem(
      "growPetsProcessedServerCommands",
      JSON.stringify(latest)
    );

  }

  catch (error) {

    console.error(
      "COMMAND SAVE ERROR:",
      error
    );

  }

}


/* =========================================================
   WRAP GIVE PET COMMAND
========================================================= */

const originalApplyGivePetCommand =
  applyGivePetCommand;


applyGivePetCommand =
  function(command) {

    if (!command) {
      return;
    }


    const commandId =
      getCommandId(command);


    if (
      commandId &&
      processedServerCommands.has(
        commandId
      )
    ) {

      return;

    }


    originalApplyGivePetCommand(
      command
    );


    if (commandId) {

      rememberServerCommandSafe(
        commandId
      );

    }

  };
/* =========================================================
   ADMIN ANNOUNCEMENT
========================================================= */

const adminAnnouncementInput =
  document.getElementById(
    "adminAnnouncementInput"
  );

const adminSendAnnouncement =
  document.getElementById(
    "adminSendAnnouncement"
  );


if (adminSendAnnouncement) {

  adminSendAnnouncement.onclick =
    async function() {

      const admin =
        await p6CheckAdmin();


      if (!admin) {

        p6AdminMessage(
          "❌ NOT ADMIN"
        );

        return;
      }


      const text =
        adminAnnouncementInput
          ? adminAnnouncementInput.value.trim()
          : "";


      if (!text) {

        p6AdminMessage(
          "📢 WRITE A MESSAGE"
        );

        return;
      }


      try {

        await sendServerCommand({

          commandType:
            "announcement",

          message:
            text

        });


        p6AdminMessage(
          "📢 ANNOUNCEMENT SENT!"
        );


        adminAnnouncementInput.value =
          "";

      }

      catch (error) {

        console.error(
          "ANNOUNCEMENT ERROR:",
          error
        );


        p6AdminMessage(
          "❌ ANNOUNCEMENT FAILED"
        );

      }

    };

}
/* =========================================================
   ANNOUNCEMENT RECEIVER - SAFE APPEND
========================================================= */

async function checkAnnouncementsSafe() {

  try {

    const result =
      await appwriteTables.listRows({

        databaseId:
          SERVER_DATABASE_ID,

        tableId:
          SERVER_COMMANDS_TABLE_ID

      });


    const rows =
      result.rows || [];


    rows.forEach(
      function(command) {

        if (
          !command ||
          command.commandType !==
          "announcement"
        ) {
          return;
        }


        const commandId =
          command.$id ||
          command.gameCommandId;


        if (!commandId) {
          return;
        }


        if (
          processedServerCommands.has(
            commandId
          )
        ) {
          return;
        }


        const text =
          String(
            command.message || ""
          ).trim();


        if (!text) {

          processedServerCommands.add(
            commandId
          );

          if (
            typeof rememberServerCommandSafe ===
            "function"
          ) {

            rememberServerCommandSafe(
              commandId
            );

          }

          return;
        }


        showMessage(
          "📢 " + text
        );


        processedServerCommands.add(
          commandId
        );


        if (
          typeof rememberServerCommandSafe ===
          "function"
        ) {

          rememberServerCommandSafe(
            commandId
          );

        }

      }
    );

  }

  catch (error) {

    console.error(
      "ANNOUNCEMENT RECEIVE ERROR:",
      error
    );

  }

}


/* check every 3 seconds */

setInterval(
  checkAnnouncementsSafe,
  3000
);


/* check once on load */

checkAnnouncementsSafe();
let serverAnnouncementTimer;


function showServerAnnouncement(text) {

  const box =
    document.getElementById(
      "serverAnnouncement"
    );


  if (!box) {
    return;
  }


  box.textContent =
    "📢 " + text;


  box.classList.remove(
    "hidden"
  );


  requestAnimationFrame(
    function() {

      box.classList.add(
        "show"
      );

    }
  );


  clearTimeout(
    serverAnnouncementTimer
  );


  serverAnnouncementTimer =
    setTimeout(
      function() {

        box.classList.remove(
          "show"
        );


        setTimeout(
          function() {

            box.classList.add(
              "hidden"
            );

          },

          250
        );

      },

      5000
    );

}
