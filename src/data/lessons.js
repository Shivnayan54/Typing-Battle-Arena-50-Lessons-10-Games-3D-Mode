// src/data/lessons.js — TypeNova 5-Tier Lesson Structure
export const LESSONS = [
  // BEGINNER (1-10) — Entry level, home row, basic words
  { id: 1, section: 'Beginner', title: 'Home Row Basics', text: 'asdf jkl; asdf jkl; asdf jkl;', targetWpm: 15, targetAccuracy: 85, xpReward: 50 },
  { id: 2, section: 'Beginner', title: 'Home Row Extended', text: 'sad lad fall dad flask glad', targetWpm: 15, targetAccuracy: 85, xpReward: 50 },
  { id: 3, section: 'Beginner', title: 'Top Row Introduce', text: 'qwer uiop qwerty ytrewq top row', targetWpm: 20, targetAccuracy: 85, xpReward: 60 },
  { id: 4, section: 'Beginner', title: 'Words on Top Row', text: 'were you out of your route quiet', targetWpm: 20, targetAccuracy: 85, xpReward: 60 },
  { id: 5, section: 'Beginner', title: 'Bottom Row Basics', text: 'zxcv mnb mnbvcxz can box max', targetWpm: 20, targetAccuracy: 85, xpReward: 70 },
  { id: 6, section: 'Beginner', title: 'All Alphabets', text: 'crazy zap max vox quiz just fly', targetWpm: 25, targetAccuracy: 85, xpReward: 70 },
  { id: 7, section: 'Beginner', title: 'Short Words', text: 'the quick red fox is sad and glad', targetWpm: 25, targetAccuracy: 85, xpReward: 80 },
  { id: 8, section: 'Beginner', title: 'Easy Sentences', text: 'hello there friend. glad to see you here.', targetWpm: 30, targetAccuracy: 85, xpReward: 80 },
  { id: 9, section: 'Beginner', title: 'Punctuation Focus', text: 'yes, sir. no, way. wait, really?', targetWpm: 30, targetAccuracy: 85, xpReward: 90 },
  { id: 10, section: 'Beginner', title: 'Beginner Final Test', text: 'congratulations on finishing the beginner section. you are doing great.', targetWpm: 35, targetAccuracy: 90, xpReward: 150 },

  // INTERMEDIATE (11-20) — Capital letters, numbers, longer text
  { id: 11, section: 'Intermediate', title: 'Capital Letters', text: 'The Quick Brown Fox Jumps Over The Lazy Dog.', targetWpm: 30, targetAccuracy: 85, xpReward: 100 },
  { id: 12, section: 'Intermediate', title: 'Numbers Introduction', text: '1 2 3 4 5 6 7 8 9 0 then 10 20 50 100', targetWpm: 25, targetAccuracy: 85, xpReward: 100 },
  { id: 13, section: 'Intermediate', title: 'Numbers and Letters', text: 'I have 5 apples and 20 bananas from 3 stores.', targetWpm: 30, targetAccuracy: 85, xpReward: 110 },
  { id: 14, section: 'Intermediate', title: 'Common Symbols', text: 'Contact us at a@b.com for details. Price: $10.', targetWpm: 30, targetAccuracy: 85, xpReward: 110 },
  { id: 15, section: 'Intermediate', title: 'More Punctuation', text: 'Wait! Are you sure? Yes, I am absolutely certain.', targetWpm: 35, targetAccuracy: 85, xpReward: 120 },
  { id: 16, section: 'Intermediate', title: 'Fluid Reading', text: 'Reading and typing at the same time takes consistent practice.', targetWpm: 40, targetAccuracy: 85, xpReward: 120 },
  { id: 17, section: 'Intermediate', title: 'Longer Sentences', text: 'The sky is a very beautiful shade of deep blue today.', targetWpm: 40, targetAccuracy: 85, xpReward: 130 },
  { id: 18, section: 'Intermediate', title: 'Double Letters', text: 'Successfully addressing all issues takes effort and coffee.', targetWpm: 40, targetAccuracy: 85, xpReward: 130 },
  { id: 19, section: 'Intermediate', title: 'Number Practice', text: 'Call 555-0199 or 555-0198 by 5:30 PM on March 3rd.', targetWpm: 30, targetAccuracy: 85, xpReward: 140 },
  { id: 20, section: 'Intermediate', title: 'Intermediate Final', text: 'You have mastered the basics. Keep pushing your limits every single day.', targetWpm: 45, targetAccuracy: 90, xpReward: 200 },

  // ADVANCED (21-35) — Complex words, sustained speed, technical text
  { id: 21, section: 'Advanced', title: 'Paragraphs Part 1', text: 'Typing is a critical skill in the modern world. Millions rely on it every single day.', targetWpm: 45, targetAccuracy: 90, xpReward: 150 },
  { id: 22, section: 'Advanced', title: 'Fast Fingers', text: 'Try to type this as quickly as you possibly can without making any mistakes.', targetWpm: 50, targetAccuracy: 90, xpReward: 150 },
  { id: 23, section: 'Advanced', title: 'Complex Words', text: 'philosophical unequivocally infrastructure phenomenon ubiquitous', targetWpm: 45, targetAccuracy: 90, xpReward: 160 },
  { id: 24, section: 'Advanced', title: 'Mixed Cases', text: 'The NASA rover landed on Mars. NASA used a lot of complex code.', targetWpm: 50, targetAccuracy: 90, xpReward: 160 },
  { id: 25, section: 'Advanced', title: 'Dialogue', text: '"Hello," she said. "How are you doing today?" asked the curious stranger.', targetWpm: 50, targetAccuracy: 90, xpReward: 170 },
  { id: 26, section: 'Advanced', title: 'Time Pressure', text: 'Every second counts when you are working against the clock on a deadline.', targetWpm: 55, targetAccuracy: 90, xpReward: 170 },
  { id: 27, section: 'Advanced', title: 'Alternating Hands', text: 'dismantle authentic right hand left hand typical standard layout.', targetWpm: 55, targetAccuracy: 90, xpReward: 180 },
  { id: 28, section: 'Advanced', title: 'Difficult Symbols', text: 'He paid $45.99 for the 100% cotton shirt; what a steal it was!', targetWpm: 50, targetAccuracy: 90, xpReward: 180 },
  { id: 29, section: 'Advanced', title: 'Sustained Typing', text: 'Your endurance will be tested here. Maintain your speed throughout this very long and demanding sentence.', targetWpm: 60, targetAccuracy: 90, xpReward: 190 },
  { id: 30, section: 'Advanced', title: 'Scientific Text', text: 'Mitochondria is the powerhouse of the cell, generating ATP through oxidative phosphorylation.', targetWpm: 60, targetAccuracy: 92, xpReward: 200 },
  { id: 31, section: 'Advanced', title: 'Quotes Master', text: '"The only limit to our realization of tomorrow will be our doubts of today." - Franklin D. Roosevelt', targetWpm: 65, targetAccuracy: 92, xpReward: 200 },
  { id: 32, section: 'Advanced', title: 'Speed Focus', text: 'Push yourself hard and see how fast you can accurately type this long string of words.', targetWpm: 65, targetAccuracy: 92, xpReward: 210 },
  { id: 33, section: 'Advanced', title: 'Technical Vocabulary', text: 'Asynchronous JavaScript and XML allows dynamic web page content updates without full page reload.', targetWpm: 65, targetAccuracy: 93, xpReward: 220 },
  { id: 34, section: 'Advanced', title: 'Legal Text', text: 'In witness whereof, the parties hereunto have set their hands to these presents as of the date written.', targetWpm: 65, targetAccuracy: 94, xpReward: 240 },
  { id: 35, section: 'Advanced', title: 'Advanced Final Test', text: 'You have reached the peak of standard typing ability. You are now in the top tier of typists worldwide.', targetWpm: 75, targetAccuracy: 95, xpReward: 350 },

  // PRO (36-45) — Coding symbols, high accuracy, high speed
  { id: 36, section: 'Pro', title: 'HTML Tags', text: '<div> <span> <a href="#">Link</a> </span> </div>', targetWpm: 55, targetAccuracy: 95, xpReward: 300 },
  { id: 37, section: 'Pro', title: 'CSS Properties', text: 'display: flex; justify-content: center; align-items: center; gap: 1rem;', targetWpm: 60, targetAccuracy: 95, xpReward: 300 },
  { id: 38, section: 'Pro', title: 'JavaScript Variables', text: 'const name = "Alice"; let count = 0; var legacy = true;', targetWpm: 65, targetAccuracy: 95, xpReward: 310 },
  { id: 39, section: 'Pro', title: 'JS Functions', text: 'function add(a, b) { return a + b; } console.log(add(10, 20));', targetWpm: 65, targetAccuracy: 96, xpReward: 320 },
  { id: 40, section: 'Pro', title: 'React Hooks', text: 'const [state, setState] = useState(null); useEffect(() => {}, []);', targetWpm: 60, targetAccuracy: 96, xpReward: 330 },
  { id: 41, section: 'Pro', title: 'JSON Objects', text: '{"user": {"id": 1, "role": "admin", "active": true, "score": 9000}}', targetWpm: 60, targetAccuracy: 96, xpReward: 340 },
  { id: 42, section: 'Pro', title: 'Arrow Functions', text: 'data.map((item) => item.id).filter(id => id > 0);', targetWpm: 65, targetAccuracy: 96, xpReward: 350 },
  { id: 43, section: 'Pro', title: 'Python Code', text: 'def greet(name): return f"Hello, {name}!" print(greet("World"))', targetWpm: 60, targetAccuracy: 96, xpReward: 360 },
  { id: 44, section: 'Pro', title: 'Complex Methods', text: 'Object.entries(filters).forEach(([key, value]) => setFilter(key, value));', targetWpm: 65, targetAccuracy: 97, xpReward: 380 },
  { id: 45, section: 'Pro', title: 'Pro Final Test', text: 'const result = array.reduce((acc, cur) => ({ ...acc, [cur.key]: cur.value }), {});', targetWpm: 70, targetAccuracy: 97, xpReward: 450 },

  // ELITE (46-50) — Maximum difficulty, master level
  { id: 46, section: 'Elite', title: 'C++ Advanced', text: '#include <iostream> using namespace std; int main() { cout << "TypeNova"; return 0; }', targetWpm: 65, targetAccuracy: 97, xpReward: 400 },
  { id: 47, section: 'Elite', title: 'SQL Queries', text: 'SELECT users.name FROM users JOIN scores ON users.id = scores.user_id WHERE scores.wpm > 100;', targetWpm: 65, targetAccuracy: 97, xpReward: 430 },
  { id: 48, section: 'Elite', title: 'Hard Vocabulary', text: 'juxtaposition quintessential philosophical transcendental hyperbolic conscientious magnanimous perspicacious', targetWpm: 70, targetAccuracy: 98, xpReward: 460 },
  { id: 49, section: 'Elite', title: 'Ultimate Speed', text: 'The perspicacious and magnanimous philosopher eloquently juxtaposed quintessential transcendental concepts.', targetWpm: 80, targetAccuracy: 98, xpReward: 490 },
  { id: 50, section: 'Elite', title: 'TypeNova Legend', text: 'class Master { constructor(xp) { this.xp = xp; } display() { console.log("Legend"); } } new Master(99999).display();', targetWpm: 80, targetAccuracy: 98, xpReward: 500 },
];
