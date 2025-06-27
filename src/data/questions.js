
export const defaultQuestions = [
  {
    id: 1,
    round: 'technical',
    question: 'What is the difference between let, const, and var in JavaScript?',
    answer: 'let and const are block-scoped, while var is function-scoped. const cannot be reassigned after declaration, while let and var can be. let and const are not hoisted in the same way as var.',
    code: `// var - function scoped, hoisted
var x = 1;
if (true) {
  var x = 2; // same variable
}
console.log(x); // 2

// let - block scoped
let y = 1;
if (true) {
  let y = 2; // different variable
}
console.log(y); // 1

// const - block scoped, cannot be reassigned
const z = 1;
// z = 2; // Error!`,
    tags: ['JavaScript', 'Variables', 'ES6'],
    favorite: false,
    review: true,
    hot: false,
    images: []
  },
  {
    id: 2,
    round: 'technical',
    question: 'Explain closures in JavaScript with an example.',
    answer: 'A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned. This allows for data privacy and function factories.',
    code: `function outerFunction(x) {
  // This is the outer function's scope
  
  function innerFunction(y) {
    // This inner function has access to x
    console.log(x + y);
  }
  
  return innerFunction;
}

const myClosure = outerFunction(10);
myClosure(5); // Outputs: 15`,
    tags: ['JavaScript', 'Closures', 'Scope'],
    favorite: true,
    review: false,
    hot: true,
    images: []
  },
  {
    id: 3,
    round: 'technical',
    question: 'What is the Virtual DOM in React?',
    answer: 'The Virtual DOM is a JavaScript representation of the actual DOM. React uses it to efficiently update the UI by comparing the new virtual DOM with the previous one and only updating the parts that have changed.',
    code: `// React creates a virtual representation
const element = React.createElement(
  'div',
  { className: 'greeting' },
  'Hello, World!'
);

// Instead of directly manipulating DOM:
// document.createElement('div')
// div.className = 'greeting'
// div.textContent = 'Hello, World!'`,
    tags: ['React', 'Virtual DOM', 'Performance'],
    favorite: false,
    review: true,
    hot: false,
    images: []
  },
  {
    id: 4,
    round: 'hr',
    question: 'Tell me about yourself.',
    answer: 'I am a passionate software developer with expertise in modern web technologies. I enjoy solving complex problems and building user-friendly applications. I have experience with React, JavaScript, and full-stack development.',
    code: '',
    tags: ['Personal', 'Introduction'],
    favorite: false,
    review: false,
    hot: false,
    images: []
  },
  {
    id: 5,
    round: 'hr',
    question: 'What are your strengths and weaknesses?',
    answer: 'My strengths include problem-solving, quick learning, and teamwork. My weakness is that I sometimes spend too much time perfecting details, but I\'m learning to balance perfectionism with meeting deadlines.',
    code: '',
    tags: ['Self-assessment', 'Personal Development'],
    favorite: false,
    review: false,
    hot: false,
    images: []
  },
  {
    id: 6,
    round: 'technical',
    question: 'What are React Hooks?',
    answer: 'React Hooks are functions that let you use state and other React features in functional components. They were introduced in React 16.8 to eliminate the need for class components in most cases.',
    code: `import React, { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}`,
    tags: ['React', 'Hooks', 'useState', 'useEffect'],
    favorite: true,
    review: false,
    hot: true,
    images: []
  },
  {
    id: 7,
    round: 'telephonic',
    question: 'How do you handle asynchronous operations in JavaScript?',
    answer: 'JavaScript handles asynchronous operations using callbacks, Promises, and async/await. Modern approaches prefer Promises and async/await for better readability and error handling.',
    code: `// Using Promises
fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));

// Using async/await
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}`,
    tags: ['JavaScript', 'Async', 'Promises', 'Fetch'],
    favorite: false,
    review: true,
    hot: false,
    images: []
  },
  {
    id: 8,
    round: 'technical',
    question: 'Explain the concept of hoisting in JavaScript.',
    answer: 'Hoisting is JavaScript\'s behavior of moving declarations to the top of their scope during compilation. Variables declared with var and function declarations are hoisted, but let and const are not.',
    code: `console.log(x); // undefined (not error)
var x = 5;

// This is how JavaScript interprets it:
var x;
console.log(x); // undefined
x = 5;

// Function hoisting
sayHello(); // Works!

function sayHello() {
  console.log('Hello!');
}`,
    tags: ['JavaScript', 'Hoisting', 'Scope'],
    favorite: false,
    review: false,
    hot: false,
    images: []
  },
  {
    id: 9,
    round: 'behavioral',
    question: 'Describe a challenging project you worked on.',
    answer: 'I worked on a real-time chat application that required handling multiple concurrent users. The challenge was optimizing performance and ensuring message delivery. I implemented WebSocket connections and used Redis for caching.',
    code: `// WebSocket implementation
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    // Broadcast to all clients
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});`,
    tags: ['Project Experience', 'WebSocket', 'Real-time'],
    favorite: false,
    review: true,
    hot: false,
    images: []
  },
  {
    id: 10,
    round: 'system-design',
    question: 'How would you design a URL shortener like bit.ly?',
    answer: 'A URL shortener needs: 1) Database to store URL mappings, 2) Base62 encoding for short URLs, 3) Load balancers, 4) Caching layer, 5) Analytics tracking, 6) Rate limiting.',
    code: `// Basic URL shortening algorithm
function encodeBase62(num) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  
  while (num > 0) {
    result = chars[num % 62] + result;
    num = Math.floor(num / 62);
  }
  
  return result;
}

// Example: Convert ID 12345 to short code
const shortCode = encodeBase62(12345); // "3D7"`,
    tags: ['System Design', 'Scalability', 'Database'],
    favorite: true,
    review: false,
    hot: true,
    images: []
  },
  {
    id: 11,
    round: 'coding',
    question: 'Implement a function to reverse a linked list.',
    answer: 'To reverse a linked list, we iterate through the list and reverse the pointers. We need three pointers: previous, current, and next.',
    code: `class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

function reverseLinkedList(head) {
  let prev = null;
  let current = head;
  
  while (current !== null) {
    let next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  
  return prev; // new head
}`,
    tags: ['Data Structures', 'Linked List', 'Algorithms'],
    favorite: false,
    review: true,
    hot: false,
    images: []
  },
  {
    id: 12,
    round: 'technical',
    question: 'What is the difference between == and === in JavaScript?',
    answer: '== performs type coercion before comparison, while === performs strict comparison without type conversion. === is generally preferred for predictable behavior.',
    code: `// == with type coercion
console.log(5 == '5');    // true
console.log(0 == false);  // true
console.log(null == undefined); // true

// === strict comparison
console.log(5 === '5');   // false
console.log(0 === false); // false
console.log(null === undefined); // false`,
    tags: ['JavaScript', 'Operators', 'Type Coercion'],
    favorite: false,
    review: false,
    hot: false,
    images: []
  },
  {
    id: 13,
    round: 'introduction',
    question: 'Why do you want to work for our company?',
    answer: 'I\'m excited about your company\'s innovative approach to technology and the opportunity to work on challenging projects. Your commitment to professional development and collaborative culture aligns with my career goals.',
    code: '',
    tags: ['Motivation', 'Company Research'],
    favorite: false,
    review: false,
    hot: false,
    images: []
  },
  {
    id: 14,
    round: 'technical',
    question: 'Explain event delegation in JavaScript.',
    answer: 'Event delegation is a technique where you attach a single event listener to a parent element to handle events for its children. This is efficient for dynamic content and reduces memory usage.',
    code: `// Without delegation (inefficient for many items)
document.querySelectorAll('.button').forEach(btn => {
  btn.addEventListener('click', handleClick);
});

// With delegation (efficient)
document.getElementById('container').addEventListener('click', function(e) {
  if (e.target.classList.contains('button')) {
    handleClick(e);
  }
});`,
    tags: ['JavaScript', 'DOM', 'Events'],
    favorite: false,
    review: true,
    hot: false,
    images: []
  },
  {
    id: 15,
    round: 'coding',
    question: 'Write a function to check if a string is a palindrome.',
    answer: 'A palindrome reads the same forwards and backwards. We can solve this by comparing characters from both ends moving inward.',
    code: `function isPalindrome(str) {
  // Clean the string: remove non-alphanumeric and convert to lowercase
  const cleaned = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  
  let left = 0;
  let right = cleaned.length - 1;
  
  while (left < right) {
    if (cleaned[left] !== cleaned[right]) {
      return false;
    }
    left++;
    right--;
  }
  
  return true;
}

// Test
console.log(isPalindrome("A man, a plan, a canal: Panama")); // true`,
    tags: ['Algorithms', 'String Manipulation', 'Two Pointers'],
    favorite: true,
    review: false,
    hot: false,
    images: []
  },
  {
    id: 16,
    round: 'behavioral',
    question: 'How do you handle conflicts in a team?',
    answer: 'I believe in open communication and finding common ground. I listen to all perspectives, focus on the problem rather than personalities, and work collaboratively to find solutions that benefit the project.',
    code: '',
    tags: ['Team Work', 'Conflict Resolution', 'Communication'],
    favorite: false,
    review: false,
    hot: false,
    images: []
  },
  {
    id: 17,
    round: 'system-design',
    question: 'Design a chat system for millions of users.',
    answer: 'Key components: WebSocket servers for real-time communication, message queues, database sharding, CDN for media, load balancers, and caching. Consider horizontal scaling and data consistency.',
    code: `// Basic chat server architecture
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
  });
  
  socket.on('send-message', (data) => {
    socket.to(data.roomId).emit('receive-message', data);
  });
});`,
    tags: ['System Design', 'WebSocket', 'Scalability', 'Real-time'],
    favorite: false,
    review: true,
    hot: true,
    images: []
  },
  {
    id: 18,
    round: 'technical',
    question: 'What is the difference between null and undefined in JavaScript?',
    answer: 'undefined means a variable has been declared but not assigned a value. null is an assignment value representing no value or empty value. undefined is a type, null is an object.',
    code: `let a;
console.log(a); // undefined
console.log(typeof a); // "undefined"

let b = null;
console.log(b); // null
console.log(typeof b); // "object" (this is a known quirk)

// Checking for both
if (value == null) {
  // This catches both null and undefined
}

if (value === null || value === undefined) {
  // More explicit way
}`,
    tags: ['JavaScript', 'Data Types', 'null', 'undefined'],
    favorite: false,
    review: false,
    hot: false,
    images: []
  },
  {
    id: 19,
    round: 'coding',
    question: 'Implement a binary search algorithm.',
    answer: 'Binary search efficiently finds an element in a sorted array by repeatedly dividing the search interval in half. Time complexity is O(log n).',
    code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid; // Found the target
    } else if (arr[mid] < target) {
      left = mid + 1; // Search right half
    } else {
      right = mid - 1; // Search left half
    }
  }
  
  return -1; // Target not found
}

// Test
const sortedArray = [1, 3, 5, 7, 9, 11, 13];
console.log(binarySearch(sortedArray, 7)); // 3`,
    tags: ['Algorithms', 'Binary Search', 'Sorting'],
    favorite: true,
    review: false,
    hot: false,
    images: []
  },
  {
    id: 20,
    round: 'hr',
    question: 'Where do you see yourself in 5 years?',
    answer: 'In 5 years, I see myself as a senior developer or technical lead, mentoring junior developers and contributing to architectural decisions. I want to continue learning new technologies and possibly specialize in a specific domain.',
    code: '',
    tags: ['Career Goals', 'Professional Development'],
    favorite: false,
    review: false,
    hot: false,
    images: []
  }
];
