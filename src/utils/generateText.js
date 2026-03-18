const wordBank = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "I", 
  "it", "for", "not", "on", "with", "he", "as", "you", "do", "at", 
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", 
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", 
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
  "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
  "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
  "even", "new", "want", "because", "any", "these", "give", "day", "most", "us"
];

const sentences = [
  "The quick brown fox jumps over the lazy dog.",
  "Programming is the art of telling another human what one wants the computer to do.",
  "React makes it painless to create interactive UIs.",
  "Tailwind CSS is a utility-first CSS framework.",
  "A journey of a thousand miles begins with a single step.",
  "To be or not to be, that is the question.",
  "All that glitters is not gold.",
  "Practice makes perfect, especially when learning to type fast."
];

export const generateRandomWords = (count = 50) => {
  const result = [];
  for (let i = 0; i < count; i++) {
    const randomIdx = Math.floor(Math.random() * wordBank.length);
    result.push(wordBank[randomIdx]);
  }
  return result.join(" ");
};

export const getRandomSentence = () => {
  const randomIdx = Math.floor(Math.random() * sentences.length);
  return sentences[randomIdx];
};

export const getWordsForLevel = (level = "beginner") => {
  switch(level) {
    case "beginner":
      return generateRandomWords(20);
    case "intermediate":
      return generateRandomWords(40);
    case "advanced":
      return generateRandomWords(60);
    case "programming":
      return "const func = (arg) => { return arg * 2; }; function test() { console.log('Hello World!'); } import React from 'react'; export default App;";
    default:
      return generateRandomWords(30);
  }
};
