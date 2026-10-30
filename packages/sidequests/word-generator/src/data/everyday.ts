import type { GroupSource } from "./types";

export const FOOD: GroupSource = {
  id: "food",
  label: "Food and drink",
  categories: [
    {
      id: "fruit",
      label: "Fruit",
      pos: "noun",
      easy: "apple banana orange grape strawberry lemon cherry pear peach watermelon pineapple",
      medium: "mango coconut plum apricot raspberry blueberry lime avocado fig papaya cranberry",
      hard: "pomegranate persimmon guava nectarine quince elderberry gooseberry",
    },
    {
      id: "vegetables",
      label: "Vegetables",
      pos: "noun",
      easy: "carrot potato tomato onion corn pea bean pumpkin cucumber",
      medium: "lettuce cabbage broccoli spinach celery garlic cauliflower radish turnip asparagus",
      hard: "artichoke parsnip leek shallot fennel rhubarb watercress legume",
    },
    {
      id: "dishes",
      label: "Meals and dishes",
      pos: "noun",
      easy: "pizza sandwich soup salad bread pasta rice cheese egg",
      medium: "curry stew noodle dumpling casserole sushi porridge taco broth recipe",
      hard: "risotto chowder paella brisket charcuterie crouton",
    },
    {
      id: "sweets",
      label: "Sweets and baking",
      pos: "noun",
      easy: "cake cookie candy chocolate pie honey sugar pancake cupcake jelly",
      medium:
        "muffin waffle pudding caramel syrup biscuit custard brownie lollipop marshmallow pastry cinnamon",
      hard: "meringue marzipan praline sorbet nougat butterscotch confection macaroon",
    },
    {
      id: "drinks",
      label: "Drinks",
      pos: "noun",
      easy: "water milk juice tea coffee lemonade",
      medium: "cocoa smoothie milkshake cider espresso cappuccino",
      hard: "beverage libation concoction elixir nectar",
    },
    {
      id: "cooking",
      label: "In the kitchen",
      pos: "verb",
      easy: "cook bake boil fry chop mix stir pour slice peel",
      medium: "roast grill whisk simmer knead grate melt toast sprinkle squeeze",
      hard: "marinate braise sear poach blanch baste garnish ferment curdle",
    },
    {
      id: "tastes",
      label: "Tastes",
      pos: "adjective",
      easy: "sweet sour salty spicy juicy delicious tasty creamy",
      medium: "bitter tangy bland zesty smoky buttery fruity minty",
      hard: "piquant succulent acrid pungent palatable insipid delectable umami:n",
    },
  ],
};

export const HOME: GroupSource = {
  id: "home",
  label: "Home and things",
  categories: [
    {
      id: "furniture",
      label: "Furniture and rooms",
      pos: "noun",
      easy: "bed chair table sofa lamp door window desk kitchen bathroom stairs",
      medium: "cupboard wardrobe drawer cabinet attic basement hallway balcony stool bench",
      hard: "banister mantelpiece chandelier alcove vestibule larder",
    },
    {
      id: "household",
      label: "Around the house",
      pos: "noun",
      easy: "cup plate spoon fork knife bowl pillow blanket towel clock key umbrella",
      medium: "kettle candle broom bucket basket vase sponge napkin curtain rug",
      hard: "colander ladle thimble decanter heirloom trinket",
    },
    {
      id: "clothing",
      label: "Clothes and accessories",
      pos: "noun",
      easy: "shirt hat shoe sock coat dress jacket glove scarf boot skirt",
      medium: "sweater sandal apron cardigan raincoat slipper uniform collar bracelet necklace",
      hard: "waistcoat cufflink cravat brooch garment attire regalia",
    },
    {
      id: "tools",
      label: "Tools",
      pos: "noun",
      easy: "hammer ladder rope scissors brush shovel tape",
      medium: "wrench drill screwdriver chisel rake wheelbarrow hatchet pulley hose",
      hard: "trowel anvil mallet pickaxe sickle scythe winch",
    },
    {
      id: "buildings",
      label: "Buildings",
      pos: "noun",
      easy: "house castle tower bridge tent barn hut palace garage farm",
      medium:
        "cottage skyscraper lighthouse temple fortress cabin mansion warehouse windmill pyramid",
      hard: "citadel monastery mausoleum aqueduct belfry turret rampart",
    },
  ],
};

export const BODY: GroupSource = {
  id: "body",
  label: "Body and health",
  categories: [
    {
      id: "body-parts",
      label: "Parts of the body",
      pos: "noun",
      easy: "hand foot eye ear nose mouth arm leg head hair tooth finger",
      medium: "elbow ankle wrist shoulder knee eyebrow chin cheek forehead skull lung muscle",
      hard: "torso abdomen cartilage tendon sinew vertebra palate",
    },
    {
      id: "health",
      label: "Health and medicine",
      pos: "noun",
      easy: "medicine cough pill bandage hospital headache sick:a",
      medium:
        "fever vaccine allergy vitamin injury bruise blister pulse infection symptom diagnosis",
      hard: "antidote ailment malady contagion convalescence placebo",
    },
    {
      id: "body-actions",
      label: "Things bodies do",
      pos: "verb",
      easy: "sleep yawn smile laugh cry blink hug clap kick sneeze",
      medium: "shiver sniff wink nod frown stretch gasp sigh hiccup snore",
      hard: "grimace flinch wince shudder salivate perspire convulse hibernate",
    },
  ],
};
