import mongoose from 'mongoose';
import Question from '../models/Question.js';
import Tag from '../models/Tag.js';

// Connect to MongoDB
try {
  await mongoose.connect('mongodb://localhost:27017/interview-spark-notes');
  console.log('Connected to MongoDB');
} catch (err) {
  console.error('MongoDB connection error:', err);
  process.exit(1);
}

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
      { name: 'layout', color: '#A55EEA' },
      { name: 'mongodb', color: '#4DB33D' },
      { name: 'aggregation', color: '#589636' },
      { name: 'database', color: '#336791' },
      { name: 'queries', color: '#FF6B35' }
    ];

    const createdTags = await Tag.insertMany(tags);
    console.log(`Created ${createdTags.length} tags`);

    // Create sample questions
    const questions = [
      {
        round: "technical",
        question: "How does the useState hook work in React?",
        answer: "useState is a React Hook that allows you to add state to functional components. It returns an array with the current state value and a function to update it.",
        code: `import React, { useState } from 'react';

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
        company: "Tech Corp",
        tags: [createdTags[0]._id, createdTags[1]._id, createdTags[2]._id, createdTags[3]._id],
        difficulty: "medium",
        createdAt: new Date()
      },
      {
        round: "technical", 
        question: "What's the difference between Promises and async/await?",
        answer: "Async/await is syntactic sugar over Promises, making asynchronous code look more like synchronous code. It makes error handling easier with try/catch blocks.",
        code: `// Using Promises
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
        company: "Web Solutions",
        tags: [createdTags[1]._id, createdTags[4]._id, createdTags[5]._id],
        difficulty: "medium",
        createdAt: new Date()
      },
      {
        round: "technical",
        question: "How does the Node.js event loop work?",
        answer: "The event loop is what allows Node.js to perform non-blocking I/O operations despite JavaScript being single-threaded, by offloading operations to the system kernel whenever possible.",
        code: `console.log('Start');

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
        company: "Node Experts",
        tags: [createdTags[6]._id, createdTags[7]._id, createdTags[1]._id],
        difficulty: "hard",
        createdAt: new Date()
      },
      {
        round: "technical",
        question: "Explain the main properties of CSS Flexbox.",
        answer: "Flexbox is a one-dimensional layout method for arranging items in rows or columns. Key properties include display: flex, flex-direction, justify-content, align-items, and flex-wrap.",
        code: `.container {
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
        company: "Design Agency",
        tags: [createdTags[8]._id, createdTags[9]._id, createdTags[10]._id],
        difficulty: "easy",
        createdAt: new Date()
      },
      {
        round: "technical",
        question: "How do you use MongoDB aggregation pipeline for complex queries?",
        answer: "Aggregation pipeline processes documents through multiple stages, each transforming the data. Common stages include $match, $group, $project, $sort, $lookup.",
        code: `// Find average order value by category
db.orders.aggregate([
  // Stage 1: Match orders from last 30 days
  {
    $match: {
      createdAt: {
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      },
      status: "completed"
    }
  },
  
  // Stage 2: Lookup product details
  {
    $lookup: {
      from: "products",
      localField: "productId",
      foreignField: "_id",
      as: "product"
    }
  },
  
  // Stage 3: Unwind product array
  { $unwind: "$product" },
  
  // Stage 4: Group by category and calculate stats
  {
    $group: {
      _id: "$product.category",
      totalOrders: { $sum: 1 },
      avgOrderValue: { $avg: "$totalAmount" },
      maxOrderValue: { $max: "$totalAmount" },
      totalRevenue: { $sum: "$totalAmount" }
    }
  },
  
  // Stage 5: Sort by total revenue
  { $sort: { totalRevenue: -1 } }
]);`,
        company: "Data Corp",
        tags: [createdTags[11]._id, createdTags[12]._id, createdTags[13]._id, createdTags[14]._id],
        difficulty: "hard",
        createdAt: new Date()
      },
      {
        round: "hr",
        question: "Tell me about yourself.",
        answer: "This is a common opening question. Structure your answer using the present-past-future format. Talk about your current role, relevant past experiences, and future goals aligned with the position.",
        code: "",
        company: "HR Solutions",
        tags: [],
        difficulty: "easy",
        createdAt: new Date()
      },
      {
        round: "behavioral",
        question: "Describe a challenging project you worked on.",
        answer: "Use the STAR method (Situation, Task, Action, Result) to structure your response. Focus on specific challenges, your problem-solving approach, and quantifiable outcomes.",
        code: "",
        company: "Behavioral Corp",
        tags: [],
        difficulty: "medium",
        createdAt: new Date()
      },
      {
        round: "system-design",
        question: "Design a URL shortener like bit.ly",
        answer: "Key components: URL encoding service, database for mapping, cache layer, analytics service. Consider scalability, load balancing, and data consistency.",
        code: `// Basic URL shortener algorithm
class URLShortener {
  constructor() {
    this.urlMap = new Map();
    this.counter = 1000;
  }
  
  encode(longUrl) {
    const shortCode = this.encodeBase62(this.counter++);
    this.urlMap.set(shortCode, longUrl);
    return shortCode;
  }
  
  decode(shortCode) {
    return this.urlMap.get(shortCode) || null;
  }
  
  encodeBase62(num) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    while (num > 0) {
      result = chars[num % 62] + result;
      num = Math.floor(num / 62);
    }
    return result;
  }
}`,
        company: "System Design Inc",
        tags: [createdTags[1]._id, createdTags[13]._id],
        difficulty: "hard",
        createdAt: new Date()
      },
      {
        round: "coding",
        question: "Implement a function to reverse a linked list.",
        answer: "You can reverse a linked list iteratively or recursively. The iterative approach uses three pointers: previous, current, and next.",
        code: `// Iterative approach
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
}

// Recursive approach
function reverseLinkedListRecursive(head) {
  if (head === null || head.next === null) {
    return head;
  }
  
  let newHead = reverseLinkedListRecursive(head.next);
  head.next.next = head;
  head.next = null;
  
  return newHead;
}`,
        company: "Coding Challenge Corp",
        tags: [createdTags[1]._id],
        difficulty: "medium",
        createdAt: new Date()
      },
      {
        round: "telephonic",
        question: "Walk me through your resume.",
        answer: "Start with a brief overview, then dive into each role chronologically. Highlight achievements, technologies used, and impact. Connect your experience to the role you're applying for.",
        code: "",
        company: "Remote Corp",
        tags: [],
        difficulty: "easy",
        createdAt: new Date()
      }
    ];

    const createdQuestions = await Question.insertMany(questions);
    console.log(`Created ${createdQuestions.length} questions`);

    console.log('Seed data created successfully!');
    console.log('You now have comprehensive test data covering all interview rounds and features!');
    
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seed function
seedData();
