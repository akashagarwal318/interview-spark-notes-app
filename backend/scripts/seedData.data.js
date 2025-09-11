// Extracted question seed array from original seedData.js for clarity.
export const sampleQuestions = [
  {
    round: 'technical',
    question: 'What is the difference between let, const, and var in JavaScript?',
    answer: 'let and const were introduced in ES6. var has function scope while let and const have block scope. const cannot be reassigned after declaration. let can be reassigned but not redeclared in the same scope. var can be both reassigned and redeclared.',
    code: `// var example
var x = 1;
if (true) {
  var x = 2; // Same variable
  console.log(x); // 2
}
console.log(x); // 2

// let example
let y = 1;
if (true) {
  let y = 2; // Different variable
  console.log(y); // 2
}
console.log(y); // 1

// const example
const z = 1;
// z = 2; // TypeError: Assignment to constant variable`,
    tags: ['javascript', 'variables', 'es6', 'scope'],
    difficulty: 'medium',
    favorite: true,
    review: false,
    hot: true
  },
  {
    round: 'technical',
    question: 'Explain the concept of closures in JavaScript',
    answer: 'A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned. Closures are created every time a function is created. They are useful for data privacy, function factories, and maintaining state.',
    code: `function outerFunction(x) {
  // This is the outer function's scope
  
  function innerFunction(y) {
    // This inner function has access to x
    console.log(x + y);
  }
  
  return innerFunction;
}

const closure = outerFunction(10);
closure(5); // Outputs: 15`,
    tags: ['javascript', 'closures', 'scope', 'functions'],
    difficulty: 'hard',
    favorite: false,
    review: true,
    hot: false
  },
  {
    round: 'hr',
    question: 'Tell me about yourself',
    answer: 'This is an opportunity to give a brief professional summary. Focus on your relevant experience, key skills, and what you can bring to the role. Keep it concise and professional, typically 1-2 minutes.',
    tags: ['hr', 'introduction', 'personal'],
    difficulty: 'easy',
    company: 'General',
    position: 'Software Developer',
    favorite: false,
    review: false,
    hot: false
  },
  {
    round: 'system-design',
    question: 'Design a URL shortening service like bit.ly',
    answer: 'Key components: 1) URL encoding service to generate short URLs, 2) Database to store URL mappings, 3) Cache layer for frequently accessed URLs, 4) Load balancers for high availability, 5) Analytics service for tracking clicks. Consider scalability, availability, and consistency requirements.',
    tags: ['system-design', 'scalability', 'database', 'caching'],
    difficulty: 'hard',
    favorite: true,
    review: true,
    hot: true
  },
  {
    round: 'coding',
    question: 'Implement a function to reverse a string',
    answer: 'There are multiple approaches: using built-in methods, iterative approach, or recursive approach. The built-in method is simplest but understanding the iterative approach shows algorithmic thinking.',
    code: `// Method 1: Built-in methods
function reverseString1(str) {
  return str.split('').reverse().join('');
}

// Method 2: Iterative approach
function reverseString2(str) {
  let reversed = '';
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
}

// Method 3: Recursive approach
function reverseString3(str) {
  if (str === '') return '';
  return reverseString3(str.substr(1)) + str.charAt(0);
}`,
    tags: ['coding', 'algorithms', 'strings', 'recursion'],
    difficulty: 'easy',
    favorite: false,
    review: false,
    hot: false
  },
  {
    round: 'telephonic',
    question: 'How do you prioritize tasks when everything is urgent?',
    answer: 'Use impact vs effort, communicate with stakeholders, break tasks into smaller chunks and negotiate deadlines. Keep a running prioritized backlog and focus on delivering the highest value items first.',
    tags: ['communication', 'time-management'],
    difficulty: 'medium',
    favorite: true,
    review: false,
    hot: false
  },
  {
    round: 'technical',
    question: 'Explain the JavaScript event loop and microtasks vs macrotasks',
    answer: 'The event loop processes the call stack and the task queue. Microtasks (promises, mutation observers) run after the current task and before rendering; macrotasks (setTimeout, setInterval, I/O) are scheduled in the task queue.',
    tags: ['javascript', 'event-loop', 'async'],
    difficulty: 'hard',
    favorite: false,
    review: true,
    hot: true
  },
  {
    round: 'behavioral',
    question: 'Describe a time you resolved a conflict in a team',
    answer: 'Explain the context, actions you took to mediate, how you listened and proposed a compromise, and the outcome. Focus on communication and collaboration skills.',
    tags: ['behavioral', 'conflict', 'communication'],
    difficulty: 'easy',
    favorite: false,
    review: true,
    hot: false
  },
  {
    round: 'coding',
    question: 'Two Sum problem — return indices of the two numbers that add up to target',
    answer: 'Use a hashmap to store complements and return indices when found. O(n) time, O(n) space.',
    code: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
  return null;
}`,
    tags: ['algorithms', 'hashmap', 'array'],
    difficulty: 'easy',
    favorite: true,
    review: false,
    hot: false,
    company: 'Google',
    position: 'Software Engineer'
  },
  {
    round: 'system-design',
    question: 'Design a real-time chat system',
    answer: 'Consider WebSocket connections, presence, message delivery guarantees, sharding by conversation, and using caches for recent messages. Think about scaling, persistence, and fan-out strategies.',
    tags: ['system-design', 'websocket', 'scalability'],
    difficulty: 'hard',
    favorite: true,
    review: true,
    hot: true
  },
  {
    round: 'technical',
    question: 'Render a diagram image for architecture review',
    answer: 'This question contains an image to inspect how the Image Modal behaves in the UI.',
    images: [
      {
        name: 'diagram.png',
        data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=',
        size: 67,
        mimeType: 'image/png'
      }
    ],
    tags: ['diagram', 'image', 'ui'],
    difficulty: 'easy',
    favorite: false,
    review: false,
    hot: false
  },
  {
    round: 'technical',
    question: 'Stress test: very long question and answer to test UI rendering and database storage limits',
    answer: 'A'.repeat(2000) + '\n\n' + 'B'.repeat(2000),
    code: '',
    tags: ['long-text', 'stress-test'],
    difficulty: 'hard',
    favorite: false,
    review: true,
    hot: false
  },
  {
    round: 'coding',
    question: 'Large tag set to test tag UI performance',
    answer: 'This question has a large number of tags to ensure the frontend handles tag lists and filtering performance.',
    tags: Array.from({ length: 25 }, (_, i) => `tag-${i + 1}`),
    difficulty: 'medium',
    favorite: false,
    review: false,
    hot: false
  },
  {
    round: 'technical',
    question: 'Image heavy question to test upload/display',
    answer: 'Contains multiple images of varying sizes (placeholders).',
    images: [
      { name: 'img1.png', data: 'iVBORw0KGgoAAAANSUhEUgAAAAUA', size: 120, mimeType: 'image/png' },
      { name: 'img2.jpg', data: ' /9j/4AAQSkZJRgABAQAAAQABAAD', size: 2048, mimeType: 'image/jpeg' }
    ],
    tags: ['image', 'upload', 'ui'],
    difficulty: 'easy',
    favorite: false,
    review: false,
    hot: false
  },
  {
    round: 'technical',
    question: 'Code block search: find the phrase inside backticks',
    answer: 'This answer contains a fenced code block with backticks and markdown-like content.',
    code: "```js\n// Example with backticks and markdown-style code\nconst greeting = `Hello, ${name}`;\nconsole.log(greeting);\n```",
    tags: ['code', 'markdown', 'search'],
    difficulty: 'medium',
    favorite: false,
    review: true,
    hot: false
  },
  {
    round: 'hr',
    question: 'Duplicate and mixed-case tags test',
    answer: 'Tags include duplicates and varying cases to test normalization and deduplication in backend and frontend.',
    tags: ['React', 'react', 'REACT', 'frontend', 'FrontEnd'],
    difficulty: 'easy',
    favorite: false,
    review: false,
    hot: false
  },
  {
    round: 'behavioral',
    question: '国际化测试 — non-ASCII characters',
    answer: '这是一个包含非 ASCII 字符的问题，用于测试数据库与前端对 Unicode 文本的支持。',
    tags: ['i18n', 'unicode', '测试'],
    difficulty: 'easy',
    favorite: false,
    review: false,
    hot: false
  }
];
