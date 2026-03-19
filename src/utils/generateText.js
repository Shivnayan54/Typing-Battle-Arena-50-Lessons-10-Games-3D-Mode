// Hard vocabulary words for TypeNova
const HARD_WORDS = [
  "juxtaposition", "quintessential", "philosophical", "transcendental",
  "hyperbolic", "conscientious", "multifaceted", "magnanimous", "perspicacious",
  "ephemeral", "eloquent", "labyrinthine", "melancholy", "serendipity",
  "loquacious", "ubiquitous", "surreptitious", "ostentatious", "ambiguous",
  "meticulous", "exacerbate", "idiosyncratic", "nonchalant", "precocious",
  "vociferous", "acquiesce", "recalcitrant", "circumlocution", "dilapidated",
  "ineffable", "impetuous", "luminescent", "metamorphose", "obfuscate",
  "paradigm", "quintessentially", "reverberate", "scrupulous", "tenacious",
  "unequivocal", "vacillate", "whimsical", "xenophobia", "zealous",
  "aberration", "ameliorate", "cacophony", "dexterous", "enigmatic",
  "fastidious", "garrulous", "harbinger", "inscrutable", "juxtapose",
  "kaleidoscope", "laconic", "mnemonic", "nefarious", "oblivious",
  "pedantic", "quandary", "resplendent", "sanguine", "trepidation",
  "ulterior", "verbiage", "wistful", "yielding", "zealotry",
  "alacrity", "benevolent", "clandestine", "disconcerting", "enumerate",
  "fulminate", "gregarious", "halcyon", "intransigent", "juggernaut",
  "kinetic", "lambent", "machiavellian", "nihilistic", "omnipotent",
  "pernicious", "querulous", "rapturous", "solipsistic", "tangential",
  "unassailable", "vicarious", "wanderlust", "xenophilic", "youthfulness",
  "zeitgeist", "abstraction", "bureaucratic", "complacency", "deliberate",
  "equanimity", "fortuitous", "grandiose", "hegemony", "imperious",
  "jeopardize", "kinesthetic", "lackadaisical", "magnanimity", "nebulous",
  "omniscient", "perspicuity", "quintillion", "resilience", "stochastic",
  "transcendence", "utilitarian", "vindictive", "willingness", "xenophile",
];

const MEDIUM_WORDS = [
  "journey", "achieve", "creative", "beautiful", "inspire", "transform",
  "develop", "explore", "balance", "freedom", "growth", "harmony",
  "imagine", "justice", "knowledge", "language", "mindful", "natural",
  "organize", "patience", "quality", "respect", "success", "together",
  "universe", "valuable", "wonder", "excellent", "thoughtful", "practice",
  "persevere", "motivate", "innovate", "discover", "challenge", "believe",
  "confident", "dedicated", "effective", "flexible", "generous", "helpful",
  "inspired", "joyful", "kindness", "learning", "momentum", "nurture",
  "optimism", "profound", "question", "reliable", "strength", "thankful",
];

// Intelligent sentence templates using hard words
const SENTENCE_TEMPLATES = [
  "The {adj} scholar demonstrated a {adj2} understanding of {concept} that left the audience in absolute awe.",
  "Her {adj} approach to solving {concept} problems proved both innovative and remarkably {adj2}.",
  "In a {adj} display of wisdom, the philosopher articulated a {adj2} theory about the nature of {concept}.",
  "The {adj} researcher's {adj2} findings challenged long-held assumptions about {concept} in modern science.",
  "With {adj} precision and {adj2} attention to detail, the analyst uncovered the hidden patterns of {concept}.",
];

const ADJECTIVES = [
  "quintessential", "meticulous", "perspicacious", "magnanimous", "eloquent",
  "fastidious", "scrupulous", "tenacious", "resplendent", "luminescent",
];

const CONCEPTS = [
  "consciousness", "paradigm shifts", "philosophical reasoning", "transcendental logic",
  "multifaceted systems", "ephemeral phenomena", "cognitive dissonance",
  "metamorphic cycles", "eloquent discourse", "juxtaposition",
];

export const generateHardWords = (count = 60) => {
  const words = [];
  for (let i = 0; i < count; i++) {
    // Mix 70% hard, 30% medium
    const pool = Math.random() < 0.7 ? HARD_WORDS : MEDIUM_WORDS;
    words.push(pool[Math.floor(Math.random() * pool.length)]);
  }
  return words.join(' ');
};

export const generateSentenceParagraph = (sentenceCount = 4) => {
  const sentences = [];
  for (let i = 0; i < sentenceCount; i++) {
    const template = SENTENCE_TEMPLATES[Math.floor(Math.random() * SENTENCE_TEMPLATES.length)];
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const adj2 = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const concept = CONCEPTS[Math.floor(Math.random() * CONCEPTS.length)];
    sentences.push(template.replace('{adj}', adj).replace('{adj2}', adj2).replace('{concept}', concept));
  }
  return sentences.join(' ');
};

export const generateRandomWords = (count = 50) => {
  const result = [];
  const pool = [...HARD_WORDS, ...MEDIUM_WORDS];
  for (let i = 0; i < count; i++) {
    result.push(pool[Math.floor(Math.random() * pool.length)]);
  }
  return result.join(' ');
};

export const getRandomSentence = () => {
  const template = SENTENCE_TEMPLATES[Math.floor(Math.random() * SENTENCE_TEMPLATES.length)];
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const adj2 = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const concept = CONCEPTS[Math.floor(Math.random() * CONCEPTS.length)];
  return template.replace('{adj}', adj).replace('{adj2}', adj2).replace('{concept}', concept);
};

export const getWordsForLevel = (level = "beginner") => {
  switch (level) {
    case "beginner": return generateRandomWords(25);
    case "intermediate": return generateHardWords(40);
    case "advanced": return generateHardWords(60);
    case "hard": return generateHardWords(80);
    case "endless": return generateHardWords(100);
    default: return generateRandomWords(30);
  }
};

export const HARD_WORDS_POOL = HARD_WORDS;
