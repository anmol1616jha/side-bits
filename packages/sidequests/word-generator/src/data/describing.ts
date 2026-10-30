import type { GroupSource } from "./types";

export const MIND: GroupSource = {
  id: "mind",
  label: "Mind and feelings",
  categories: [
    {
      id: "feelings",
      label: "Feelings",
      pos: "adjective",
      easy: "happy sad angry scared tired excited proud lonely bored calm hungry",
      medium:
        "nervous jealous grateful anxious embarrassed cheerful furious gloomy confused relieved curious",
      hard: "melancholy euphoric wistful elated forlorn indignant apprehensive despondent jubilant exasperated nostalgic",
    },
    {
      id: "traits",
      label: "Personality",
      pos: "adjective",
      easy: "kind brave funny shy smart lazy friendly polite rude silly",
      medium:
        "generous stubborn clumsy patient loyal humble bossy selfish cautious creative honest",
      hard: "meticulous gregarious tenacious pragmatic magnanimous candid diligent eccentric obstinate benevolent audacious frivolous",
    },
    {
      id: "thinking",
      label: "Thinking",
      pos: "verb",
      easy: "think know learn remember forget guess dream wish understand imagine wonder believe",
      medium: "decide suppose recall predict solve focus doubt",
      hard: "ponder contemplate deduce speculate comprehend deliberate ruminate discern surmise",
    },
    {
      id: "speaking",
      label: "Ways of speaking",
      pos: "verb",
      easy: "talk say shout whisper ask answer call tell",
      medium:
        "mumble giggle argue explain complain announce gossip chatter stammer boast elaborate scream",
      hard: "murmur exclaim proclaim articulate reiterate implore retort enunciate bellow banter",
    },
  ],
};

export const DESCRIBING: GroupSource = {
  id: "describing",
  label: "Moving and describing",
  categories: [
    {
      id: "movement",
      label: "Ways of moving",
      pos: "verb",
      easy: "walk run jump hop skip crawl fly fall spin roll climb march",
      medium: "stroll tiptoe dash wander leap glide stumble sprint wobble",
      hard: "saunter meander amble trudge scurry careen lurch traipse pirouette stagger",
    },
    {
      id: "sounds",
      label: "Sounds",
      pos: "noun",
      easy: "bang buzz ring beep boom crash pop roar bark noise",
      medium: "rustle sizzle crackle squeak hiss rumble thud chime echo clatter",
      hard: "cacophony reverberate:v din resonance staccato hubbub tumult jangle",
    },
    {
      id: "textures",
      label: "Touch and texture",
      pos: "adjective",
      easy: "soft rough smooth sticky wet dry fluffy cold warm bumpy hot",
      medium: "slimy fuzzy silky prickly crunchy greasy damp crisp gritty spongy",
      hard: "velvety coarse gnarled supple brittle viscous pliable sodden gossamer lustrous",
    },
    {
      id: "size",
      label: "Size and shape",
      pos: "adjective",
      easy: "big small tall short long tiny huge round thin wide",
      medium: "enormous narrow giant slender massive shallow steep curved hollow jagged",
      hard: "colossal minuscule gargantuan diminutive voluminous elongated cavernous lofty infinitesimal angular",
    },
    {
      id: "light",
      label: "Light and colour",
      pos: "adjective",
      easy: "red blue green yellow pink purple black white brown bright",
      medium: "golden shiny glow:v sparkle:v shadow:n glitter:v dim pale scarlet violet turquoise",
      hard: "luminous iridescent translucent opaque radiant vermilion incandescent dappled chartreuse",
    },
    {
      id: "manner",
      label: "How it happens",
      pos: "adverb",
      easy: "quickly slowly loudly quietly gently carefully happily suddenly",
      medium: "eagerly bravely rarely calmly secretly patiently boldly barely proudly",
      hard: "reluctantly surreptitiously begrudgingly inadvertently nonchalantly vehemently furtively haphazardly",
    },
  ],
};

export const IDEAS: GroupSource = {
  id: "ideas",
  label: "Time and ideas",
  categories: [
    {
      id: "time",
      label: "Time",
      pos: "noun",
      easy: "day night morning week year today tomorrow yesterday minute evening century weekend season moment future",
      medium: "decade midnight dawn dusk schedule",
      hard: "eternity millennium epoch fortnight interim hiatus antiquity posterity hindsight interlude",
    },
    {
      id: "big-ideas",
      label: "Big ideas",
      pos: "noun",
      easy: "love hope fear peace truth luck idea secret power success",
      medium: "freedom justice courage wisdom democracy mystery chaos balance silence integrity",
      hard: "serendipity paradox resilience nostalgia ambiguity irony solitude camaraderie empathy utopia hubris",
    },
  ],
};
