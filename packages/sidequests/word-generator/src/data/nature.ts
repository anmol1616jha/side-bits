import type { GroupSource } from "./types";

export const NATURE: GroupSource = {
  id: "nature",
  label: "Nature",
  categories: [
    {
      id: "water",
      label: "Bodies of water",
      pos: "noun",
      easy: "ocean river lake sea pond stream waterfall wave puddle",
      medium: "creek bay tide current canal reservoir lagoon swamp marsh rapids geyser",
      hard: "estuary fjord tributary bayou inlet cove confluence rivulet torrent cascade",
    },
    {
      id: "landscape",
      label: "Land and landscapes",
      pos: "noun",
      easy: "mountain hill forest desert beach island valley cave field jungle volcano",
      medium: "canyon cliff meadow prairie plateau glacier dune ravine oasis tundra peninsula",
      hard: "escarpment archipelago steppe isthmus moorland crag chasm promontory mesa caldera",
    },
    {
      id: "weather",
      label: "Weather",
      pos: "noun",
      easy: "rain snow wind storm cloud thunder lightning rainbow fog sunshine ice",
      medium:
        "hail drizzle breeze blizzard hurricane tornado mist frost drought flood humidity gust overcast:a",
      hard: "monsoon squall deluge sleet zephyr gale tempest precipitation cloudburst",
    },
    {
      id: "sky",
      label: "Sky and space",
      pos: "noun",
      easy: "sun moon star planet sky rocket astronaut sunset sunrise",
      medium:
        "comet galaxy meteor asteroid orbit eclipse telescope satellite universe twilight horizon",
      hard: "nebula constellation cosmos supernova solstice equinox aurora zenith firmament celestial:a",
    },
    {
      id: "plants",
      label: "Plants and trees",
      pos: "noun",
      easy: "tree flower grass leaf seed rose root branch bush sunflower mushroom",
      medium: "oak pine cactus fern moss vine ivy blossom tulip bamboo orchid willow",
      hard: "sapling foliage lichen magnolia hydrangea thicket bramble wisteria topiary",
    },
    {
      id: "rocks",
      label: "Rocks, metals and gems",
      pos: "noun",
      easy: "rock stone gold silver diamond crystal iron coal sand",
      medium:
        "marble granite copper pearl ruby emerald quartz boulder fossil bronze sapphire jewel",
      hard: "obsidian amethyst topaz basalt sediment alabaster onyx garnet pewter",
    },
  ],
};

export const ANIMALS: GroupSource = {
  id: "animals",
  label: "Animals",
  categories: [
    {
      id: "wild-animals",
      label: "Wild animals",
      pos: "noun",
      easy: "lion tiger elephant bear monkey giraffe zebra wolf fox rabbit deer kangaroo",
      medium:
        "cheetah leopard gorilla rhinoceros buffalo moose raccoon squirrel hedgehog badger otter beaver hyena camel",
      hard: "armadillo porcupine lemur jackal wildebeest platypus mongoose orangutan anteater pangolin",
    },
    {
      id: "farm-animals",
      label: "Farm animals and pets",
      pos: "noun",
      easy: "dog cat cow horse pig sheep chicken duck goat puppy kitten pony",
      medium: "donkey rooster turkey goose calf mule llama ferret stallion hamster",
      hard: "heifer foal livestock poultry filly bullock",
    },
    {
      id: "birds",
      label: "Birds",
      pos: "noun",
      easy: "eagle owl parrot penguin swan crow pigeon robin",
      medium:
        "sparrow hawk falcon flamingo ostrich pelican vulture woodpecker hummingbird peacock seagull stork",
      hard: "albatross heron kingfisher osprey nightingale condor cormorant egret",
    },
    {
      id: "sea-creatures",
      label: "Sea creatures",
      pos: "noun",
      easy: "fish shark whale dolphin octopus crab turtle jellyfish starfish seal",
      medium: "lobster squid seahorse stingray walrus coral shrimp eel oyster orca",
      hard: "barnacle plankton narwhal manatee cuttlefish crustacean urchin barracuda",
    },
    {
      id: "minibeasts",
      label: "Insects and creepy crawlies",
      pos: "noun",
      easy: "bee ant butterfly spider worm snail caterpillar mosquito",
      medium:
        "beetle grasshopper dragonfly moth firefly cockroach wasp termite scorpion centipede slug",
      hard: "cicada locust larva chrysalis tarantula mantis",
    },
    {
      id: "reptiles",
      label: "Reptiles and amphibians",
      pos: "noun",
      easy: "frog snake lizard crocodile dinosaur",
      medium: "alligator tortoise toad python cobra chameleon iguana tadpole gecko viper",
      hard: "salamander newt anaconda amphibian",
    },
  ],
};
