
export const defaultQuestions = [
  {
    id: 1,
    question: "What is a closure in JavaScript?",
    answer: "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned. It gives you access to an outer function's scope from an inner function.",
    code: `function outerFunction(x) {
  // This is the outer function's scope
  
  function innerFunction(y) {
    // This inner function has access to x
    console.log(x + y);
  }
  
  return innerFunction;
}

const myFunction = outerFunction(10);
myFunction(5); // Output: 15`,
    round: 'technical',
    tags: ['javascript', 'closures', 'functions', 'scope'],
    favorite: true,
    review: false,
    hot: false,
    images: []
  },
  {
    id: 2,
    question: "Tell me about yourself",
    answer: "I am a passionate software developer with 3 years of experience in full-stack development. I have worked with React, Node.js, and various databases. I enjoy solving complex problems and building user-friendly applications.",
    round: 'hr',
    tags: ['introduction', 'personal', 'experience'],
    favorite: false,
    review: true,
    hot: false,
    images: []
  },
  {
    id: 3,
    question: "What is the difference between let, const, and var?",
    answer: "var has function scope and is hoisted. let and const have block scope. const cannot be reassigned after declaration, while let can be. let and const are not hoisted in the same way as var.",
    code: `// var - function scoped, hoisted
function example() {
  console.log(x); // undefined (hoisted)
  var x = 1;
  
  if (true) {
    var x = 2; // Same variable
    console.log(x); // 2
  }
  console.log(x); // 2
}

// let - block scoped
function example2() {
  let y = 1;
  
  if (true) {
    let y = 2; // Different variable
    console.log(y); // 2
  }
  console.log(y); // 1
}

// const - block scoped, cannot be reassigned
const z = 1;
// z = 2; // Error!`,
    round: 'technical',
    tags: ['javascript', 'variables', 'scope', 'hoisting'],
    favorite: false,
    review: false,
    hot: true,
    images: []
  },
  {
    id: 4,
    question: "Why do you want to work here?",
    answer: "I'm excited about this opportunity because your company is known for innovation and has a strong culture of continuous learning. The projects you work on align with my interests in modern web technologies, and I believe I can contribute meaningfully to your team.",
    round: 'hr',
    tags: ['motivation', 'company', 'culture'],
    favorite: false,
    review: true,
    hot: false,
    images: []
  },
  {
    id: 5,
    question: "Explain the concept of hoisting in JavaScript",
    answer: "Hoisting is JavaScript's default behavior of moving declarations to the top of their scope. Variables declared with var and function declarations are hoisted, but let and const are not hoisted in the same way.",
    code: `console.log(x); // undefined (not error)
var x = 5;

// This is how JavaScript interprets it:
// var x;
// console.log(x); // undefined
// x = 5;

// Function hoisting
console.log(myFunction()); // "Hello!"

function myFunction() {
  return "Hello!";
}

// let and const are not hoisted
console.log(y); // ReferenceError
let y = 10;`,
    round: 'technical',
    tags: ['javascript', 'hoisting', 'variables', 'functions'],
    favorite: true,
    review: false,
    hot: false,
    images: []
  },
  {
    id: 6,
    question: "What are your salary expectations?",
    answer: "I'm open to discussing compensation based on the role's responsibilities and the company's budget. I'm more interested in finding the right fit and growth opportunities. Could you share the salary range for this position?",
    round: 'hr',
    tags: ['salary', 'negotiation', 'compensation'],
    favorite: false,
    review: false,
    hot: false,
    images: []
  },
  {
    id: 7,
    question: "What is the event loop in JavaScript?",
    answer: "The event loop is what allows JavaScript to perform non-blocking operations despite being single-threaded. It continuously checks the call stack and callback queue, moving callbacks to the stack when it's empty.",
    code: `console.log('Start');

setTimeout(() => {
  console.log('Timeout callback');
}, 0);

Promise.resolve().then(() => {
  console.log('Promise callback');
});

console.log('End');

// Output order:
// Start
// End  
// Promise callback
// Timeout callback`,
    round: 'technical',
    tags: ['javascript', 'event-loop', 'asynchronous', 'promises'],
    favorite: true,
    review: true,
    hot: true,
    images: []
  },
  {
    id: 8,
    question: "Describe a challenging project you worked on",
    answer: "I worked on a real-time chat application that needed to handle thousands of concurrent users. The main challenge was optimizing the WebSocket connections and implementing efficient message queuing. I used Redis for caching and message brokering.",
    round: 'behavioral',
    tags: ['projects', 'challenges', 'problem-solving', 'real-time'],
    favorite: false,
    review: true,
    hot: false,
    images: []
  },
  {
    id: 9,
    question: "What is React Virtual DOM?",
    answer: "Virtual DOM is a JavaScript representation of the actual DOM. React uses it to improve performance by minimizing expensive DOM operations. When state changes, React compares the new virtual DOM with the previous one and updates only the changed parts.",
    code: `// Virtual DOM concept
const virtualElement = {
  type: 'div',
  props: {
    className: 'container',
    children: [
      {
        type: 'h1',
        props: {
          children: 'Hello World'
        }
      }
    ]
  }
};

// React renders this efficiently
function MyComponent() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="container">
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`,
    round: 'technical',
    tags: ['react', 'virtual-dom', 'performance', 'rendering'],
    favorite: true,
    review: false,
    hot: true,
    images: []
  },
  {
    id: 10,
    question: "How do you handle work-life balance?",
    answer: "I prioritize time management and set clear boundaries. I use productivity techniques like time-blocking and take regular breaks. I also make sure to disconnect after work hours and pursue hobbies that help me recharge.",
    round: 'hr',
    tags: ['work-life-balance', 'productivity', 'personal-development'],
    favorite: false,
    review: false,
    hot: false,
    images: []
  },
  {
    id: 11,
    question: "Explain JavaScript Promises",
    answer: "Promises are objects that represent the eventual completion or failure of an asynchronous operation. They have three states: pending, fulfilled, or rejected. Promises help avoid callback hell and provide better error handling.",
    code: `// Creating a Promise
const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    if (Math.random() > 0.5) {
      resolve('Success!');
    } else {
      reject('Error occurred');
    }
  }, 1000);
});

// Using Promises
myPromise
  .then(result => console.log(result))
  .catch(error => console.log(error));

// Async/await syntax
async function handlePromise() {
  try {
    const result = await myPromise;
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}`,
    round: 'technical',
    tags: ['javascript', 'promises', 'asynchronous', 'async-await'],
    favorite: true,
    review: true,
    hot: false,
    images: []
  },
  {
    id: 12,
    question: "What motivates you in your work?",
    answer: "I'm motivated by solving complex problems and seeing the impact of my work on users. I enjoy learning new technologies and collaborating with talented teams. The opportunity to grow and take on new challenges keeps me engaged.",
    round: 'behavioral',
    tags: ['motivation', 'growth', 'teamwork', 'problem-solving'],
    favorite: false,
    review: false,
    hot: false,
    images: []
  },
  {
    id: 13,
    question: "What is CSS Grid vs Flexbox?",
    answer: "CSS Grid is a two-dimensional layout system for complex layouts, while Flexbox is one-dimensional for simpler layouts. Grid is better for overall page layout, Flexbox is better for component-level layout.",
    code: `/* CSS Grid - 2D Layout */
.grid-container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 20px;
  height: 100vh;
}

.header { grid-area: 1 / 1 / 2 / 4; }
.sidebar { grid-area: 2 / 1 / 3 / 2; }
.main { grid-area: 2 / 2 / 3 / 3; }
.aside { grid-area: 2 / 3 / 3 / 4; }
.footer { grid-area: 3 / 1 / 4 / 4; }

/* Flexbox - 1D Layout */
.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

.flex-item {
  flex: 1;
  margin: 0 10px;
}`,
    round: 'technical',
    tags: ['css', 'grid', 'flexbox', 'layout', 'responsive'],
    favorite: false,
    review: true,
    hot: false,
    images: []
  },
  {
    id: 14,
    question: "Describe your experience with team collaboration",
    answer: "I've worked in agile teams using tools like Jira and Slack. I participate actively in stand-ups, code reviews, and sprint planning. I believe in clear communication and knowledge sharing to help the team succeed.",
    round: 'behavioral',
    tags: ['teamwork', 'collaboration', 'agile', 'communication'],
    favorite: false,
    review: false,
    hot: false,
    images: []
  },
  {
    id: 15,
    question: "What are React Hooks?",
    answer: "Hooks are functions that let you use state and other React features in functional components. They were introduced in React 16.8 and include useState, useEffect, useContext, and more.",
    code: `import React, { useState, useEffect } from 'react';

function Counter() {
  // useState Hook
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  // useEffect Hook
  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);

  // Custom Hook
  function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
      try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        return initialValue;
      }
    });

    const setValue = (value) => {
      try {
        setStoredValue(value);
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.log(error);
      }
    };

    return [storedValue, setValue];
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`,
    round: 'technical',
    tags: ['react', 'hooks', 'useState', 'useEffect', 'functional-components'],
    favorite: true,
    review: false,
    hot: true,
    images: []
  },
  {
    id: 16,
    question: "How do you stay updated with technology trends?",
    answer: "I follow tech blogs, participate in developer communities, attend webinars, and work on side projects. I also take online courses and read documentation of new technologies to stay current.",
    round: 'behavioral',
    tags: ['learning', 'technology', 'growth', 'continuous-improvement'],
    favorite: false,
    review: false,
    hot: false,
    images: []
  },
  {
    id: 17,
    question: "Explain REST API design principles",
    answer: "REST APIs should be stateless, use standard HTTP methods (GET, POST, PUT, DELETE), have consistent URL patterns, return appropriate status codes, and use JSON for data exchange.",
    code: `// RESTful API Examples

// GET - Retrieve data
GET /api/users          // Get all users
GET /api/users/123      // Get user with ID 123

// POST - Create new resource
POST /api/users
{
  "name": "John Doe",
  "email": "john@example.com"
}

// PUT - Update entire resource
PUT /api/users/123
{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}

// PATCH - Partial update
PATCH /api/users/123
{
  "email": "newemail@example.com"
}

// DELETE - Remove resource
DELETE /api/users/123

// Status Codes
// 200 - OK
// 201 - Created
// 204 - No Content
// 400 - Bad Request
// 401 - Unauthorized
// 404 - Not Found
// 500 - Internal Server Error`,
    round: 'technical',
    tags: ['api', 'rest', 'http', 'backend', 'design-patterns'],
    favorite: false,
    review: true,
    hot: false,
    images: []
  },
  {
    id: 18,
    question: "What's your biggest weakness?",
    answer: "I sometimes spend too much time perfecting code instead of moving forward. I've been working on finding the right balance between quality and productivity by setting time limits for tasks.",
    round: 'hr',
    tags: ['weakness', 'self-improvement', 'productivity', 'balance'],
    favorite: false,
    review: false,
    hot: false,
    images: []
  },
  {
    id: 19,
    question: "What is database normalization?",
    answer: "Database normalization is the process of organizing data to reduce redundancy and improve data integrity. It involves dividing large tables into smaller ones and defining relationships between them.",
    code: `-- First Normal Form (1NF)
-- Eliminate repeating groups
CREATE TABLE Students (
  student_id INT PRIMARY KEY,
  name VARCHAR(100),
  course VARCHAR(100)
);

-- Second Normal Form (2NF)  
-- Eliminate partial dependencies
CREATE TABLE Students (
  student_id INT PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE Courses (
  course_id INT PRIMARY KEY,
  course_name VARCHAR(100)
);

CREATE TABLE Enrollments (
  student_id INT,
  course_id INT,
  grade CHAR(1),
  PRIMARY KEY (student_id, course_id),
  FOREIGN KEY (student_id) REFERENCES Students(student_id),
  FOREIGN KEY (course_id) REFERENCES Courses(course_id)
);

-- Third Normal Form (3NF)
-- Eliminate transitive dependencies
CREATE TABLE Students (
  student_id INT PRIMARY KEY,
  name VARCHAR(100),
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES Departments(department_id)
);

CREATE TABLE Departments (
  department_id INT PRIMARY KEY,
  department_name VARCHAR(100),
  building VARCHAR(100)
);`,
    round: 'technical',
    tags: ['database', 'sql', 'normalization', 'data-modeling'],
    favorite: false,
    review: true,
    hot: false,
    images: []
  },
  {
    id: 20,
    question: "Where do you see yourself in 5 years?",
    answer: "I see myself as a senior developer or technical lead, mentoring junior developers and architecting complex systems. I want to contribute to open source projects and possibly speak at tech conferences.",
    round: 'hr',
    tags: ['career-goals', 'future', 'leadership', 'growth'],
    favorite: false,
    review: false,
    hot: false,
    images: []
  }
];
