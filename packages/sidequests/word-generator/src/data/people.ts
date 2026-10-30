import type { GroupSource } from "./types";

export const SOCIETY: GroupSource = {
  id: "society",
  label: "People and society",
  categories: [
    {
      id: "people",
      label: "Family and people",
      pos: "noun",
      easy: "mother father baby brother sister friend family child crowd",
      medium: "cousin uncle aunt nephew niece twin stranger guest toddler teenager",
      hard: "ancestor sibling spouse descendant progeny matriarch acquaintance kinship",
    },
    {
      id: "jobs",
      label: "Jobs",
      pos: "noun",
      easy: "doctor teacher farmer pilot chef nurse dentist firefighter clown waiter",
      medium:
        "plumber carpenter mechanic lawyer journalist librarian architect electrician surgeon detective",
      hard: "cartographer sommelier curator diplomat cobbler veterinarian astronomer",
    },
    {
      id: "law",
      label: "Law, rulers and government",
      pos: "noun",
      easy: "king queen law jail judge vote flag crown prince election president court",
      medium: "mayor jury citizen parliament witness throne verdict legislation",
      hard: "sovereignty tribunal amnesty referendum embargo bureaucracy monarchy",
    },
    {
      id: "celebrations",
      label: "Celebrations",
      pos: "noun",
      easy: "party birthday wedding gift picnic balloon firework",
      medium: "parade festival carnival anniversary ceremony reunion graduation feast confetti",
      hard: "jubilee gala banquet pageant revelry commemoration masquerade",
    },
  ],
};

export const CULTURE: GroupSource = {
  id: "culture",
  label: "Arts and stories",
  categories: [
    {
      id: "music",
      label: "Music",
      pos: "noun",
      easy: "song drum guitar piano music sing:v dance:v band whistle",
      medium: "violin trumpet flute harp cello melody rhythm chorus orchestra concert",
      hard: "crescendo symphony sonata cadence aria overture serenade",
    },
    {
      id: "art",
      label: "Art and craft",
      pos: "noun",
      easy: "paint:v draw:v picture crayon artist glue clay",
      medium: "sculpture statue canvas portrait sketch easel gallery mosaic pottery collage",
      hard: "fresco silhouette etching tapestry palette calligraphy engraving",
    },
    {
      id: "stories",
      label: "Stories and writing",
      pos: "noun",
      easy: "book story page letter comic diary author",
      medium: "poem novel chapter fable legend riddle dictionary biography magazine",
      hard: "anthology epilogue prologue manuscript sonnet allegory memoir parable synopsis",
    },
    {
      id: "stage",
      label: "Stage and screen",
      pos: "noun",
      easy: "movie actor stage circus puppet cartoon director",
      medium: "audience applause costume rehearsal spotlight script comedy tragedy premiere",
      hard: "encore ensemble understudy protagonist pantomime improvisation monologue",
    },
    {
      id: "fantasy",
      label: "Myth and magic",
      pos: "noun",
      easy: "dragon magic fairy ghost witch wizard monster unicorn",
      medium: "goblin mermaid vampire spell potion troll curse phoenix ogre elf",
      hard: "sorcery enchantment talisman prophecy oracle labyrinth incantation amulet",
    },
  ],
};
