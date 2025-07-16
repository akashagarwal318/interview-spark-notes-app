const mongoose = require('mongoose');
const Question = require('../models/Question');
const Tag = require('../models/Tag');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/interview-spark-notes')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const seedData = async () => {
  try {
    // Clear existing data
    await Question.deleteMany({});
    await Tag.deleteMany({});
    console.log('Cleared existing data');

    // Create tags first
    const tags = [
      { name: 'react', color: '#61DAFB' },
      { name: 'javascript', color: '#F7DF1E' },
      { name: 'hooks', color: '#FF6B6B' },
      { name: 'state', color: '#4ECDC4' },
      { name: 'async', color: '#45B7D1' },
      { name: 'promises', color: '#96CEB4' },
      { name: 'nodejs', color: '#339933' },
      { name: 'event-loop', color: '#FF9F43' },
      { name: 'css', color: '#1572B6' },
      { name: 'flexbox', color: '#FF6B6B' },
      { name: 'layout', color: '#A55EEA' }
    ];

    const createdTags = await Tag.insertMany(tags);
    console.log(`Created ${createdTags.length} tags`);

    // Create sample questions
    const questions = [
      {
        title: "React useState Hook",
        question: "How does the useState hook work in React?",
        answer: "useState is a React Hook that allows you to add state to functional components. It returns an array with the current state value and a function to update it.",
        codeSnippet: `import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`,
        language: "javascript",
        difficulty: "Medium",
        category: "React",
        tags: [createdTags[0]._id, createdTags[1]._id, createdTags[2]._id, createdTags[3]._id],
        notes: "useState preserves state between re-renders. The state update function can accept a new value or a function that receives the previous state.",
        imageUrl: "https://via.placeholder.com/400x300/61DAFB/FFFFFF?text=React+useState",
        isBookmarked: true,
        lastReviewed: new Date(),
        reviewCount: 5,
        createdAt: new Date()
      },
      {
        title: "JavaScript Async/Await",
        question: "What's the difference between Promises and async/await?",
        answer: "Async/await is syntactic sugar over Promises, making asynchronous code look more like synchronous code. It makes error handling easier with try/catch blocks.",
        codeSnippet: `// Using Promises
function fetchUserPromise(id) {
  return fetch('/api/users/' + id)
    .then(response => response.json())
    .then(user => {
      console.log('User:', user);
      return user;
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Using Async/Await
async function fetchUserAsync(id) {
  try {
    const response = await fetch('/api/users/' + id);
    const user = await response.json();
    console.log('User:', user);
    return user;
  } catch (error) {
    console.error('Error:', error);
  }
}`,
        language: "javascript",
        difficulty: "Medium",
        category: "JavaScript",
        tags: [createdTags[1]._id, createdTags[4]._id, createdTags[5]._id],
        notes: "Async/await makes code more readable but remember it's still using Promises underneath. Always handle errors with try/catch.",
        imageUrl: "https://via.placeholder.com/400x300/F7DF1E/000000?text=JS+Async/Await",
        isBookmarked: false,
        lastReviewed: new Date(),
        reviewCount: 3,
        createdAt: new Date()
      },
      {
        title: "Node.js Event Loop",
        question: "How does the Node.js event loop work?",
        answer: "The event loop is what allows Node.js to perform non-blocking I/O operations despite JavaScript being single-threaded, by offloading operations to the system kernel whenever possible.",
        codeSnippet: `console.log('Start');

// Immediate
setImmediate(() => {
  console.log('setImmediate');
});

// Timeout
setTimeout(() => {
  console.log('setTimeout');
}, 0);

// Process next tick
process.nextTick(() => {
  console.log('nextTick');
});

// Promise
Promise.resolve().then(() => {
  console.log('Promise');
});

console.log('End');

// Output: Start, End, nextTick, Promise, setTimeout, setImmediate`,
        language: "javascript",
        difficulty: "Hard",
        category: "Node.js",
        tags: [createdTags[6]._id, createdTags[7]._id, createdTags[1]._id],
        notes: "Event loop phases: Timer, Pending callbacks, Idle/Prepare, Poll, Check, Close callbacks. process.nextTick and Promise callbacks have higher priority.",
        imageUrl: "https://via.placeholder.com/400x300/339933/FFFFFF?text=Node.js+Event+Loop",
        isBookmarked: true,
        lastReviewed: new Date(),
        reviewCount: 4,
        createdAt: new Date()
      },
      {
        title: "CSS Flexbox Layout",
        question: "Explain the main properties of CSS Flexbox.",
        answer: "Flexbox is a one-dimensional layout method for arranging items in rows or columns. Key properties include display: flex, flex-direction, justify-content, align-items, and flex-wrap.",
        codeSnippet: `.container {
  display: flex;
  flex-direction: row; /* row, column, row-reverse, column-reverse */
  justify-content: space-between; /* flex-start, center, space-around, space-evenly */
  align-items: center; /* flex-start, flex-end, center, stretch, baseline */
  flex-wrap: wrap; /* nowrap, wrap, wrap-reverse */
  gap: 1rem;
}

.item {
  flex: 1; /* flex-grow: 1, flex-shrink: 1, flex-basis: 0% */
  /* Or individually: */
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: 200px;
}`,
        language: "css",
        difficulty: "Easy",
        category: "CSS",
        tags: [createdTags[8]._id, createdTags[9]._id, createdTags[10]._id],
        notes: "Remember the difference between justify-content (main axis) and align-items (cross axis). Flex-basis sets the initial size before free space is distributed.",
        imageUrl: "https://via.placeholder.com/400x300/1572B6/FFFFFF?text=CSS+Flexbox",
        isBookmarked: false,
        lastReviewed: new Date(),
        reviewCount: 2,
        createdAt: new Date()
      }
    ];

    const createdQuestions = await Question.insertMany(questions);
    console.log(`Created ${createdQuestions.length} questions`);

    console.log('Seed data created successfully!');
    
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedData();
