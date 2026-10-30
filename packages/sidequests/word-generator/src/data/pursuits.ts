import type { GroupSource } from "./types";

export const SCIENCE: GroupSource = {
  id: "science",
  label: "Science and technology",
  categories: [
    {
      id: "science",
      label: "Science",
      pos: "noun",
      easy: "magnet energy germ",
      medium:
        "experiment gravity atom molecule microscope laboratory oxygen electricity friction spectrum",
      hard: "hypothesis catalyst photosynthesis equilibrium inertia velocity entropy",
    },
    {
      id: "technology",
      label: "Technology",
      pos: "noun",
      easy: "computer phone robot camera television radio keyboard screen battery internet website",
      medium: "laptop printer password microphone software gadget charger algorithm interface",
      hard: "processor encryption hologram circuitry automation",
    },
    {
      id: "shapes",
      label: "Shapes",
      pos: "noun",
      easy: "circle square triangle line dot cube",
      medium: "rectangle oval cylinder sphere cone spiral hexagon arc angle curve",
      hard: "parallelogram ellipse polygon helix symmetry perimeter vertex circumference",
    },
  ],
};

export const WORK: GroupSource = {
  id: "work",
  label: "Work and money",
  categories: [
    {
      id: "money",
      label: "Money and business",
      pos: "noun",
      easy: "money coin bank buy:v sell:v pay:v rich:a",
      medium:
        "wallet budget profit salary debt receipt bargain discount auction loan revenue inflation commerce",
      hard: "dividend frugal:a lucrative:a collateral austerity entrepreneur",
    },
    {
      id: "school",
      label: "School and office",
      pos: "noun",
      easy: "school pencil paper eraser ruler homework lesson meeting",
      medium:
        "notebook stapler calendar envelope folder deadline exam diploma semester thesis curriculum",
      hard: "syllabus memorandum dissertation tuition protractor",
    },
    {
      id: "making",
      label: "Making and fixing",
      pos: "verb",
      easy: "build fix make break dig push pull carry lift wash",
      medium: "repair assemble polish scrub sew weave construct gather stack",
      hard: "fabricate dismantle refurbish forge whittle renovate embroider",
    },
  ],
};

export const PLAY: GroupSource = {
  id: "play",
  label: "Sport and play",
  categories: [
    {
      id: "sports",
      label: "Sports",
      pos: "noun",
      easy: "football tennis cricket ball goal swim:v race team win:v",
      medium: "hockey archery marathon referee trophy medal stadium wrestling surfing skate:v",
      hard: "fencing decathlon javelin triathlon regatta equestrian:a slalom",
    },
    {
      id: "games",
      label: "Games and toys",
      pos: "noun",
      easy: "toy doll kite puzzle game teddy swing slide card clue",
      medium: "chess jigsaw seesaw trampoline domino hopscotch carousel scooter",
      hard: "kaleidoscope marionette croquet backgammon solitaire anagram",
    },
    {
      id: "adventure",
      label: "Outdoor adventure",
      pos: "noun",
      easy: "camp map treasure torch backpack hike adventure",
      medium: "compass canoe lantern campfire trail summit expedition explore:v",
      hard: "odyssey wilderness foray trailblazer reconnaissance escapade",
    },
  ],
};

export const TRAVEL: GroupSource = {
  id: "travel",
  label: "Travel and places",
  categories: [
    {
      id: "transport",
      label: "Getting around",
      pos: "noun",
      easy: "car bus train plane boat bicycle truck ship taxi helicopter",
      medium: "tractor ambulance submarine tram ferry motorcycle yacht wagon jet raft",
      hard: "gondola chariot catamaran rickshaw locomotive hovercraft schooner",
    },
    {
      id: "town",
      label: "Around town",
      pos: "noun",
      easy: "park shop zoo library market airport street road playground restaurant station",
      medium: "museum pharmacy cinema factory village suburb alley fountain plaza",
      hard: "boulevard metropolis promenade municipality thoroughfare bazaar precinct",
    },
    {
      id: "trips",
      label: "Trips and journeys",
      pos: "noun",
      easy: "holiday suitcase ticket trip hotel passport tourist journey",
      medium: "luggage souvenir voyage cruise postcard visa departure destination",
      hard: "itinerary excursion pilgrimage wanderlust sojourn expatriate nomad",
    },
  ],
};
