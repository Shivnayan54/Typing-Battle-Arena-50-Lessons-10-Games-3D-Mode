// src/data/lessons.js
export const LESSONS = [
  // BEGINNER (1-10)
  { id: 1, section: 'Beginner', title: 'Home Row Basics', text: 'asdf jkl; asdf jkl; asdf jkl;', targetWpm: 15, targetAccuracy: 85, xpReward: 50 },
  { id: 2, section: 'Beginner', title: 'Home Row Extended', text: 'sad lad fall dad flask', targetWpm: 15, targetAccuracy: 85, xpReward: 50 },
  { id: 3, section: 'Beginner', title: 'Top Row Introduce', text: 'qwer uiui qwerty ytrewq', targetWpm: 20, targetAccuracy: 85, xpReward: 60 },
  { id: 4, section: 'Beginner', title: 'Words on Top Row', text: 'were you out out of your route', targetWpm: 20, targetAccuracy: 85, xpReward: 60 },
  { id: 5, section: 'Beginner', title: 'Bottom Row Basics', text: 'zxcv mnb mnbvcvxz', targetWpm: 20, targetAccuracy: 85, xpReward: 70 },
  { id: 6, section: 'Beginner', title: 'All Alphabets', text: 'crazy crazy zap zap max max', targetWpm: 25, targetAccuracy: 85, xpReward: 70 },
  { id: 7, section: 'Beginner', title: 'Short Words', text: 'the quick red fox is sad', targetWpm: 25, targetAccuracy: 85, xpReward: 80 },
  { id: 8, section: 'Beginner', title: 'Easy Sentences', text: 'hello there friend. glad to see you.', targetWpm: 30, targetAccuracy: 85, xpReward: 80 },
  { id: 9, section: 'Beginner', title: 'Punctuation Focus', text: 'yes, sir. no, way.', targetWpm: 30, targetAccuracy: 85, xpReward: 90 },
  { id: 10, section: 'Beginner', title: 'Beginner Final Test', text: 'congratulations on finishing the beginner section. you are doing great.', targetWpm: 35, targetAccuracy: 90, xpReward: 150 },

  // ELEMENTARY (11-20)
  { id: 11, section: 'Elementary', title: 'Capital Letters', text: 'The Quick Brown Fox Jumps Over.', targetWpm: 30, targetAccuracy: 85, xpReward: 100 },
  { id: 12, section: 'Elementary', title: 'Numbers Introduction', text: '1 2 3 4 5 6 7 8 9 0', targetWpm: 25, targetAccuracy: 85, xpReward: 100 },
  { id: 13, section: 'Elementary', title: 'Numbers & Letters', text: 'I have 5 apples and 20 bananas.', targetWpm: 30, targetAccuracy: 85, xpReward: 110 },
  { id: 14, section: 'Elementary', title: 'Common Symbols', text: 'a@b.com is an email address.', targetWpm: 30, targetAccuracy: 85, xpReward: 110 },
  { id: 15, section: 'Elementary', title: 'More Punctuation', text: 'Wait! Are you sure? Yes, I am.', targetWpm: 35, targetAccuracy: 85, xpReward: 120 },
  { id: 16, section: 'Elementary', title: 'Fluid Reading', text: 'Reading and typing at the same time takes practice.', targetWpm: 40, targetAccuracy: 85, xpReward: 120 },
  { id: 17, section: 'Elementary', title: 'Longer Sentences', text: 'The sky is a very beautiful shade of blue today.', targetWpm: 40, targetAccuracy: 85, xpReward: 130 },
  { id: 18, section: 'Elementary', title: 'Double Letters', text: 'Successfully addressing the issues takes coffee.', targetWpm: 40, targetAccuracy: 85, xpReward: 130 },
  { id: 19, section: 'Elementary', title: 'Number Pad Practice', text: '123 456 789 159 357', targetWpm: 30, targetAccuracy: 85, xpReward: 140 },
  { id: 20, section: 'Elementary', title: 'Elementary Final', text: 'You have mastered the basics! Keep pushing your limits.', targetWpm: 45, targetAccuracy: 90, xpReward: 200 },

  // INTERMEDIATE (21-30)
  { id: 21, section: 'Intermediate', title: 'Paragraphs Part 1', text: 'Typing is a critical skill in the modern world. Millions rely on it daily.', targetWpm: 45, targetAccuracy: 90, xpReward: 150 },
  { id: 22, section: 'Intermediate', title: 'Fast Fingers', text: 'Try to type this as quickly as you possibly can without making mistakes.', targetWpm: 50, targetAccuracy: 90, xpReward: 150 },
  { id: 23, section: 'Intermediate', title: 'Complex Words', text: 'Phenomenon philosophical unequivocally infrastructure.', targetWpm: 45, targetAccuracy: 90, xpReward: 160 },
  { id: 24, section: 'Intermediate', title: 'Mixed Cases', text: 'The NASA rover landed on Mars. NASA used a lot of code.', targetWpm: 50, targetAccuracy: 90, xpReward: 160 },
  { id: 25, section: 'Intermediate', title: 'Dialogue', text: '"Hello," she said. "How are you doing today?"', targetWpm: 50, targetAccuracy: 90, xpReward: 170 },
  { id: 26, section: 'Intermediate', title: 'Time Pressure', text: 'Every second counts when you are working against the clock.', targetWpm: 55, targetAccuracy: 90, xpReward: 170 },
  { id: 27, section: 'Intermediate', title: 'Alternating Hands', text: 'dismantle authentic right hand left hand typical layout.', targetWpm: 55, targetAccuracy: 90, xpReward: 180 },
  { id: 28, section: 'Intermediate', title: 'Difficult Symbols', text: 'He paid $45.99 for the 100% Cotton shirt; it was a steal!', targetWpm: 50, targetAccuracy: 90, xpReward: 180 },
  { id: 29, section: 'Intermediate', title: 'Sustained Typing', text: 'Your endurance will be tested here. Maintain your speed throughout this long sentence.', targetWpm: 60, targetAccuracy: 90, xpReward: 190 },
  { id: 30, section: 'Intermediate', title: 'Intermediate Final', text: 'You are now an intermediate typist. Your fingers are learning muscle memory.', targetWpm: 65, targetAccuracy: 92, xpReward: 250 },

  // ADVANCED (31-40)
  { id: 31, section: 'Advanced', title: 'Speed Focus 1', text: 'Push yourself. See how fast you can accurately type this string of text.', targetWpm: 65, targetAccuracy: 92, xpReward: 200 },
  { id: 32, section: 'Advanced', title: 'Scientific Text', text: 'Mitochondria is the powerhouse of the cell, generating ATP.', targetWpm: 60, targetAccuracy: 92, xpReward: 200 },
  { id: 33, section: 'Advanced', title: 'Quotes', text: '"The only limit to our realization of tomorrow will be our doubts of today." - FDR', targetWpm: 65, targetAccuracy: 92, xpReward: 210 },
  { id: 34, section: 'Advanced', title: 'High Density Numbers', text: 'Call 1-800-555-0199 or 1-800-555-0198 by 5:30 PM.', targetWpm: 60, targetAccuracy: 92, xpReward: 210 },
  { id: 35, section: 'Advanced', title: 'Technical Vocabulary', text: 'Asynchronous JavaScript and XML allows dynamic web page updates.', targetWpm: 65, targetAccuracy: 93, xpReward: 220 },
  { id: 36, section: 'Advanced', title: 'Complex Sentences', text: 'Despite the overwhelming odds, they managed to complete the project before the absolute deadline of midnight.', targetWpm: 70, targetAccuracy: 93, xpReward: 220 },
  { id: 37, section: 'Advanced', title: 'Legal Text', text: 'In witness whereof, the parties hereunto have set their hands to these presents.', targetWpm: 65, targetAccuracy: 94, xpReward: 230 },
  { id: 38, section: 'Advanced', title: 'Burst Speed', text: 'Type this burst as fast as physically possible right now.', targetWpm: 75, targetAccuracy: 94, xpReward: 240 },
  { id: 39, section: 'Advanced', title: 'Endurance Draft', text: 'A long passage that requires focus. If you lose your rhythm, your speed will drastically drop off.', targetWpm: 70, targetAccuracy: 94, xpReward: 250 },
  { id: 40, section: 'Advanced', title: 'Advanced Final Test', text: 'You have reached the peak of standard typing. You are in the top tier of typists globally.', targetWpm: 80, targetAccuracy: 95, xpReward: 350 },

  // PRO / CODING MODE (41-50)
  { id: 41, section: 'Pro Code', title: 'HTML Tags', text: '<div> <span> <a href="#">Link</a> </span> </div>', targetWpm: 55, targetAccuracy: 95, xpReward: 300 },
  { id: 42, section: 'Pro Code', title: 'CSS Properties', text: 'display: flex; justify-content: center; align-items: center;', targetWpm: 60, targetAccuracy: 95, xpReward: 300 },
  { id: 43, section: 'Pro Code', title: 'JavaScript Variables', text: 'const name = "Alice"; let count = 0; var oldWay = true;', targetWpm: 65, targetAccuracy: 95, xpReward: 310 },
  { id: 44, section: 'Pro Code', title: 'JS Functions', text: 'function add(a, b) { return a + b; }', targetWpm: 65, targetAccuracy: 96, xpReward: 320 },
  { id: 45, section: 'Pro Code', title: 'React Hooks', text: 'const [state, setState] = useState(null); useEffect(() => {}, []);', targetWpm: 60, targetAccuracy: 96, xpReward: 330 },
  { id: 46, section: 'Pro Code', title: 'JSON Objects', text: '{"user": {"id": 1, "role": "admin", "active": true}}', targetWpm: 60, targetAccuracy: 96, xpReward: 340 },
  { id: 47, section: 'Pro Code', title: 'Arrow Functions', text: 'data.map((item) => <div key={item.id}>{item.name}</div>);', targetWpm: 60, targetAccuracy: 96, xpReward: 350 },
  { id: 48, section: 'Pro Code', title: 'C++ Includes', text: '#include <iostream> using namespace std; int main() { return 0; }', targetWpm: 55, targetAccuracy: 95, xpReward: 360 },
  { id: 49, section: 'Pro Code', title: 'Complex Methods', text: 'Object.entries(filters).forEach(([key, value]) => setFilter(key, value));', targetWpm: 65, targetAccuracy: 97, xpReward: 380 },
  { id: 50, section: 'Pro Code', title: 'Ultimate Master', text: 'class Master { constructor(xp) { this.xp = xp; } display() { console.log("Legend"); } }', targetWpm: 70, targetAccuracy: 98, xpReward: 500 },
];
