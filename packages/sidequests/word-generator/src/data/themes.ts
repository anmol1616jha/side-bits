import type { ThemeSource } from "./types";

/**
 * Scenes that link words from different categories. Every word here must also
 * be in a category (the tests check), which is where its difficulty comes
 * from. A theme lists words at all difficulties; generation filters them.
 */
export const THEMES: ThemeSource[] = [
  {
    id: "seaside",
    label: "By the sea",
    words:
      "ocean sea wave beach island sunset holiday camera crab starfish dolphin seal seagull boat yacht sand swim sunshine lighthouse cliff picnic salty " +
      "lagoon tide bay pelican souvenir postcard cruise ferry sandal coral surfing " +
      "cove inlet promenade albatross barnacle plankton catamaran schooner regatta",
  },
  {
    id: "winter",
    label: "Winter days",
    words:
      "snow ice cold glove scarf coat boot blanket penguin night warm cocoa " +
      "blizzard frost sweater cardigan shiver candle slipper midnight glacier " +
      "sleet solstice tundra brittle shudder hibernate gale",
  },
  {
    id: "kitchen",
    label: "In the kitchen",
    words:
      "cook bake boil chop stir pour spoon knife bowl plate chef bread egg cheese sugar honey hungry " +
      "kettle sponge napkin whisk simmer knead grate roast garlic cinnamon apron recipe " +
      "colander ladle decanter larder marinate braise garnish piquant pungent sommelier",
  },
  {
    id: "party",
    label: "Party time",
    words:
      "party birthday gift balloon cake candy cupcake friend game dance music clown magic excited happy laugh " +
      "confetti costume giggle cheerful festival carnival lollipop " +
      "jubilant elated revelry masquerade gala banquet kaleidoscope",
  },
  {
    id: "hospital",
    label: "At the hospital",
    words:
      "doctor nurse hospital medicine pill bandage cough sick sneeze " +
      "fever vaccine injury bruise pulse infection symptom surgeon ambulance nervous anxious patient diagnosis skull " +
      "antidote ailment malady convalescence placebo cartilage tendon wince",
  },
  {
    id: "camping",
    label: "Camping trip",
    words:
      "camp tent map torch backpack hike forest river mountain star moon night owl bear fox " +
      "compass canoe lantern campfire trail summit marshmallow mosquito wander hatchet " +
      "wilderness foray escapade thicket bramble lichen meander trudge",
  },
  {
    id: "space",
    label: "Into space",
    words:
      "sun moon star planet rocket astronaut sky robot computer energy dream " +
      "comet galaxy meteor asteroid orbit eclipse telescope satellite universe gravity oxygen explore " +
      "nebula constellation cosmos supernova zenith velocity inertia eternity luminous infinitesimal",
  },
  {
    id: "farm",
    label: "On the farm",
    words:
      "farm barn cow horse pig sheep chicken duck goat pony farmer corn pumpkin carrot potato field egg milk morning " +
      "tractor donkey rooster goose calf mule meadow windmill wagon rake wheelbarrow bucket dawn " +
      "heifer foal livestock poultry filly bullock scythe sickle",
  },
  {
    id: "city",
    label: "City life",
    words:
      "street road park shop market restaurant bus taxi train noise crowd " +
      "museum cinema station skyscraper tram pharmacy plaza alley suburb mayor citizen " +
      "boulevard metropolis thoroughfare precinct bazaar municipality bureaucracy cacophony hubbub",
  },
  {
    id: "school",
    label: "School days",
    words:
      "school pencil paper eraser ruler homework lesson teacher book library friend learn remember forget bored " +
      "exam notebook calendar deadline diploma semester curious nervous chapter dictionary experiment " +
      "curriculum syllabus thesis tuition protractor diligent comprehend",
  },
  {
    id: "spooky",
    label: "Spooky night",
    words:
      "ghost witch monster night moon owl spider castle scared whisper " +
      "vampire midnight shadow curse spell potion scream rustle echo crackle gloomy candle lantern " +
      "mausoleum labyrinth incantation apprehensive forlorn shudder grimace",
  },
  {
    id: "mystery",
    label: "Solving a mystery",
    words:
      "secret puzzle guess judge jail clue " +
      "detective witness verdict mystery riddle whisper lantern alley shadow midnight " +
      "deduce surmise discern speculate ponder hypothesis tribunal furtively surreptitiously",
  },
  {
    id: "garden",
    label: "In the garden",
    words:
      "flower tree grass leaf seed rose root bush sunflower bee butterfly worm snail caterpillar rain dig " +
      "tulip ivy vine blossom moss beetle slug hose rake shovel puddle " +
      "sapling foliage hydrangea wisteria topiary magnolia trowel chrysalis larva",
  },
  {
    id: "storm",
    label: "Stormy weather",
    words:
      "storm rain thunder lightning wind cloud umbrella crash boom bang scared " +
      "hail drizzle hurricane tornado flood gust raincoat rumble lighthouse " +
      "monsoon squall deluge tempest cloudburst torrent flinch",
  },
  {
    id: "jungle",
    label: "Jungle expedition",
    words:
      "jungle tiger monkey snake parrot frog map adventure river waterfall " +
      "gorilla leopard python cobra chameleon iguana vine fern orchid bamboo canoe compass expedition humidity " +
      "tarantula anaconda orangutan pangolin mantis cicada foliage thicket",
  },
  {
    id: "undersea",
    label: "Under the sea",
    words:
      "fish shark whale dolphin octopus crab turtle jellyfish starfish ocean treasure " +
      "lobster squid seahorse stingray coral eel oyster pearl submarine mermaid current " +
      "barnacle plankton narwhal manatee cuttlefish urchin barracuda iridescent",
  },
  {
    id: "concert",
    label: "Live music",
    words:
      "music song drum guitar piano sing dance band stage ticket " +
      "violin trumpet harp melody rhythm chorus orchestra concert audience applause spotlight microphone echo " +
      "crescendo symphony sonata aria overture serenade encore ensemble resonance",
  },
  {
    id: "royal",
    label: "Royal court",
    words:
      "king queen crown prince palace castle gold diamond " +
      "throne feast ruby emerald sapphire tower jewel " +
      "chandelier tapestry citadel turret banquet regalia sovereignty monarchy jubilee pageant brooch",
  },
  {
    id: "ancient",
    label: "Ancient world",
    words:
      "treasure king desert " +
      "pyramid temple statue fossil legend century mosaic pottery fortress " +
      "antiquity epoch millennium ancestor oracle prophecy amulet talisman manuscript parable fresco chariot aqueduct mausoleum",
  },
  {
    id: "travel",
    label: "Big trip",
    words:
      "holiday suitcase ticket trip hotel passport tourist journey airport plane train map camera beach " +
      "luggage souvenir voyage cruise postcard visa departure destination explore " +
      "itinerary excursion pilgrimage wanderlust sojourn nomad gondola rickshaw",
  },
  {
    id: "sports-day",
    label: "Sports day",
    words:
      "football tennis cricket ball goal swim race team win run jump proud tired whistle " +
      "referee trophy medal stadium marathon sprint dash leap stretch gasp muscle ankle cheerful " +
      "decathlon javelin triathlon elated jubilant tenacious",
  },
  {
    id: "studio",
    label: "Art studio",
    words:
      "paint draw picture crayon artist glue clay red blue yellow purple " +
      "sculpture canvas portrait sketch easel gallery mosaic pottery collage creative scarlet turquoise museum " +
      "fresco silhouette etching palette calligraphy engraving curator vermilion dappled eccentric",
  },
  {
    id: "cafe",
    label: "Café morning",
    words:
      "coffee tea milk juice cake cookie pancake honey sugar morning cup chef waiter bake " +
      "cocoa espresso cappuccino smoothie milkshake muffin waffle pastry biscuit syrup napkin buttery " +
      "meringue sorbet praline macaroon beverage delectable",
  },
  {
    id: "night-in",
    label: "Quiet night in",
    words:
      "bed sofa lamp pillow blanket book story movie tea sleep yawn dream soft warm fluffy cat evening " +
      "cocoa slipper cardigan candle rug curtain calm midnight " +
      "solitude nostalgia wistful contemplate ruminate velvety",
  },
  {
    id: "wedding",
    label: "Wedding day",
    words:
      "wedding gift party dance music cake flower rose ring dress family mother father love happy proud " +
      "guest ceremony anniversary feast confetti reunion cousin bracelet necklace cheerful blossom " +
      "banquet gala spouse kinship cufflink waistcoat attire elated",
  },
  {
    id: "desert",
    label: "Across the desert",
    words:
      "desert sand sun hot dry lizard snake " +
      "camel cactus oasis dune scorpion cobra vulture drought plateau canyon compass expedition " +
      "nomad escarpment steppe mesa wilderness perspire",
  },
  {
    id: "office",
    label: "Office day",
    words:
      "meeting computer keyboard screen phone pencil paper money coffee tired bored " +
      "calendar folder envelope stapler notebook laptop printer password software salary budget profit deadline bossy " +
      "memorandum dividend entrepreneur diligent meticulous pragmatic",
  },
  {
    id: "fairy-tale",
    label: "Once upon a time",
    words:
      "dragon magic fairy witch wizard unicorn castle palace tower king queen prince treasure forest story brave " +
      "goblin mermaid spell potion troll curse ogre elf cottage fable legend riddle " +
      "sorcery enchantment talisman prophecy labyrinth incantation amulet",
  },
  {
    id: "volcano",
    label: "Fire and stone",
    words:
      "volcano mountain rock stone crystal diamond gold iron coal cave hot " +
      "marble granite quartz boulder fossil cliff canyon rumble " +
      "obsidian basalt sediment caldera crag chasm",
  },
  {
    id: "woods",
    label: "Into the woods",
    words:
      "forest tree leaf branch bush mushroom deer fox rabbit owl wolf bear walk " +
      "oak pine moss fern squirrel badger hedgehog woodpecker beetle trail rustle stroll wander " +
      "sapling foliage lichen thicket bramble meander amble gnarled dappled",
  },
  {
    id: "circus",
    label: "At the circus",
    words:
      "circus clown puppet balloon ticket lion tiger elephant horse funny silly spin hop " +
      "audience applause costume trampoline carnival spotlight tiptoe wobble stumble " +
      "pantomime marionette encore pirouette",
  },
];
