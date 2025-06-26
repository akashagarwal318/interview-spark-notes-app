
import React, { useState, useEffect } from 'react';
import Header from './Header';
import QuickStats from './QuickStats';
import SearchFilters from './SearchFilters';
import QuestionForm from './QuestionForm';
import QuestionCard from './QuestionCard';
import ImageModal from './ImageModal';

interface Question {
  id: number;
  round: string;
  question: string;
  answer: string;
  code?: string;
  tags?: string[];
  favorite: boolean;
  review: boolean;
  hot: boolean;
  images?: Array<{ name: string; data: string; size: number }>;
}

const InterviewAssistant: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [currentTheme, setCurrentTheme] = useState('light');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());
  const [editingQuestions, setEditingQuestions] = useState<Set<number>>(new Set());
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('question');
  const [currentRound, setCurrentRound] = useState('technical');
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);
  const [activeStatusFilter, setActiveStatusFilter] = useState('all');
  
  // Image modal
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [currentImageSrc, setCurrentImageSrc] = useState('');

  // Initialize with comprehensive dummy data
  useEffect(() => {
    const dummyQuestions: Question[] = [
      {
        id: 1,
        round: 'technical',
        question: "What is useEffect in React and how does it work?",
        answer: "useEffect is a React Hook that lets you perform side effects in functional components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount combined in React class components.\n\nKey points:\n- Runs after every render by default\n- Can be controlled with dependency array\n- Can return cleanup function\n- Essential for data fetching, subscriptions, timers\n\nThe dependency array controls when the effect runs:\n- No array: runs after every render\n- Empty array []: runs only once after initial render\n- With dependencies [dep1, dep2]: runs when dependencies change",
        code: `import React, { useEffect, useState } from 'react';\n\nfunction Example() {\n  const [count, setCount] = useState(0);\n  const [name, setName] = useState('');\n\n  // Effect without dependency - runs after every render\n  useEffect(() => {\n    document.title = \`You clicked \${count} times\`;\n  });\n\n  // Effect with dependency - runs only when count changes\n  useEffect(() => {\n    console.log('Count changed:', count);\n  }, [count]);\n\n  // Effect with cleanup\n  useEffect(() => {\n    const timer = setInterval(() => {\n      console.log('Timer tick');\n    }, 1000);\n\n    return () => clearInterval(timer); // Cleanup\n  }, []);\n\n  // Effect for data fetching\n  useEffect(() => {\n    if (name) {\n      fetch(\`/api/user/\${name}\`)\n        .then(response => response.json())\n        .then(data => console.log(data));\n    }\n  }, [name]);\n\n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>\n        Click me\n      </button>\n      <input \n        value={name} \n        onChange={(e) => setName(e.target.value)} \n        placeholder="Enter name"\n      />\n    </div>\n  );\n}`,
        tags: ["React", "Hooks", "JavaScript", "Lifecycle", "Side Effects"],
        favorite: true,
        review: false,
        hot: true,
        images: []
      },
      {
        id: 2,
        round: 'technical',
        question: "Explain closures in JavaScript with practical examples",
        answer: "A closure is a function that retains access to its lexical scope even when the function is executed outside that scope. In other words, a closure gives you access to an outer function's scope from an inner function.\n\nKey characteristics:\n- Inner function has access to outer function's variables\n- Variables remain accessible even after outer function returns\n- Creates private variables and methods\n- Commonly used in module patterns and callbacks\n\nCommon use cases:\n- Data privacy and encapsulation\n- Function factories\n- Callbacks and event handlers\n- Module pattern implementation",
        code: `// Basic closure example\nfunction outerFunction(x) {\n  // This is the outer function's scope\n  const outerVariable = x;\n  \n  function innerFunction(y) {\n    // This inner function has access to outerVariable\n    console.log(outerVariable + y);\n  }\n  \n  return innerFunction;\n}\n\nconst addFive = outerFunction(5);\naddFive(10); // Outputs: 15\n\n// Practical example - Counter with closure\nfunction createCounter() {\n  let count = 0;\n  \n  return {\n    increment: function() {\n      count++;\n      return count;\n    },\n    decrement: function() {\n      count--;\n      return count;\n    },\n    getCount: function() {\n      return count;\n    }\n  };\n}\n\nconst counter = createCounter();\nconsole.log(counter.increment()); // 1\nconsole.log(counter.increment()); // 2\nconsole.log(counter.getCount());  // 2\n\n// Module pattern with closure\nconst calculator = (function() {\n  let result = 0;\n  \n  return {\n    add: function(x) {\n      result += x;\n      return this;\n    },\n    multiply: function(x) {\n      result *= x;\n      return this;\n    },\n    getResult: function() {\n      return result;\n    },\n    reset: function() {\n      result = 0;\n      return this;\n    }\n  };\n})();\n\ncalculator.add(5).multiply(3).getResult(); // 15`,
        tags: ["JavaScript", "Functions", "Scope", "Closures", "ES6"],
        favorite: true,
        review: true,
        hot: false,
        images: []
      },
      {
        id: 3,
        round: 'technical',
        question: "What are the differences between var, let, and const in JavaScript?",
        answer: "The main differences between var, let, and const relate to scope, hoisting, and reassignment:\n\n**var:**\n- Function-scoped or globally-scoped\n- Hoisted and initialized with undefined\n- Can be redeclared and reassigned\n- Creates properties on global object\n\n**let:**\n- Block-scoped\n- Hoisted but not initialized (temporal dead zone)\n- Cannot be redeclared in same scope\n- Can be reassigned\n\n**const:**\n- Block-scoped\n- Hoisted but not initialized\n- Cannot be redeclared or reassigned\n- Must be initialized at declaration\n- For objects/arrays, contents can be modified",
        code: `// var examples\nfunction varExample() {\n  if (true) {\n    var x = 1;\n  }\n  console.log(x); // 1 - accessible outside block\n}\n\n// Hoisting with var\nconsole.log(hoistedVar); // undefined (not error)\nvar hoistedVar = 'Hello';\n\n// let examples\nfunction letExample() {\n  if (true) {\n    let y = 2;\n  }\n  // console.log(y); // ReferenceError: y is not defined\n}\n\n// Temporal dead zone with let\n// console.log(hoistedLet); // ReferenceError\nlet hoistedLet = 'World';\n\n// const examples\nconst PI = 3.14159;\n// PI = 3.14; // TypeError: Assignment to constant variable\n\n// const with objects\nconst person = { name: 'John', age: 30 };\nperson.age = 31; // This is allowed - we're modifying contents\nperson.city = 'New York'; // This is also allowed\n// person = {}; // TypeError: Assignment to constant variable\n\n// const with arrays\nconst numbers = [1, 2, 3];\nnumbers.push(4); // Allowed\nnumbers[0] = 0;  // Allowed\n// numbers = []; // TypeError: Assignment to constant variable\n\n// Block scope demonstration\nfor (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), i * 100); // 0, 1, 2\n}\n\nfor (var j = 0; j < 3; j++) {\n  setTimeout(() => console.log(j), j * 100); // 3, 3, 3\n}`,
        tags: ["JavaScript", "Variables", "Scope", "ES6", "Hoisting"],
        favorite: false,
        review: true,
        hot: false,
        images: []
      },
      {
        id: 4,
        round: 'hr',
        question: "Tell me about yourself and your career journey",
        answer: "This is your elevator pitch. Structure it using the Present-Past-Future format:\n\n**Present:** What you're doing now\n- Current role and key responsibilities\n- Major achievements or projects\n- Technologies you're working with\n\n**Past:** Relevant experience\n- Previous roles that led to current position\n- Key skills developed\n- Major accomplishments\n\n**Future:** Why you're here\n- Career goals and aspirations\n- How this role fits your growth plan\n- What you hope to contribute\n\n**Tips:**\n- Keep it concise (2-3 minutes)\n- Focus on professional aspects\n- Tailor to the role you're applying for\n- Include specific examples and metrics\n- Practice until it sounds natural",
        code: "",
        tags: ["HR", "Interview", "Introduction", "Career"],
        favorite: false,
        review: true,
        hot: false,
        images: []
      },
      {
        id: 5,
        round: 'hr',
        question: "What are your biggest strengths and weaknesses?",
        answer: "**Strengths:** Choose 2-3 relevant strengths with specific examples\n\nExample approach:\n- Problem-solving: 'I excel at breaking down complex problems into manageable parts. In my last project, I solved a performance issue that was affecting 10,000+ users by identifying the root cause through systematic debugging.'\n- Communication: 'I'm skilled at explaining technical concepts to non-technical stakeholders, which has helped bridge gaps between development and business teams.'\n\n**Weaknesses:** Choose real weaknesses that you're actively working to improve\n\nGood approach:\n- 'I used to struggle with delegation because I wanted to ensure quality, but I've learned to trust my team more and provide clear guidelines instead of doing everything myself.'\n- 'I sometimes focus too much on perfecting code, which can slow down delivery. I'm learning to balance quality with pragmatic deadlines.'\n\n**What to avoid:**\n- Fake weaknesses ('I work too hard')\n- Weaknesses critical to the role\n- Not showing how you're improving",
        code: "",
        tags: ["HR", "Self-assessment", "Personal Development"],
        favorite: false,
        review: false,
        hot: true,
        images: []
      },
      {
        id: 6,
        round: 'telephonic',
        question: "Walk me through your most challenging project",
        answer: "Use the STAR method (Situation, Task, Action, Result):\n\n**Situation:** Set the context\n- What was the project?\n- What made it challenging?\n- What were the constraints?\n\n**Task:** Define your responsibility\n- What was your specific role?\n- What were you trying to achieve?\n\n**Action:** Explain what you did\n- What steps did you take?\n- What decisions did you make?\n- How did you overcome obstacles?\n\n**Result:** Share the outcome\n- What was achieved?\n- Include metrics if possible\n- What did you learn?\n\n**Example structure:**\n'I led the development of a real-time dashboard that needed to handle 100k+ concurrent users. The challenge was achieving sub-second response times with complex data aggregations. I implemented a microservices architecture with Redis caching and WebSocket connections, which reduced response time by 75% and successfully handled peak loads during our product launch.'",
        code: "",
        tags: ["Telephonic", "Project Management", "Problem Solving", "STAR Method"],
        favorite: true,
        review: false,
        hot: false,
        images: []
      },
      {
        id: 7,
        round: 'introduction',
        question: "Why are you interested in this position and our company?",
        answer: "Research the company and role beforehand. Structure your answer around:\n\n**Role Alignment:**\n- How your skills match the requirements\n- Specific aspects of the role that excite you\n- Growth opportunities you see\n\n**Company Interest:**\n- What attracts you to the company culture\n- Products/services you admire\n- Company mission/values alignment\n- Recent news or achievements\n\n**Mutual Benefit:**\n- What you can contribute\n- How you can add value\n- Your career goals alignment\n\n**Example:**\n'I'm excited about this role because it combines my passion for React development with machine learning, which aligns perfectly with my career goals. I've followed your company's innovative work in AI-powered user interfaces, particularly your recent product launch that improved user engagement by 40%. I believe my experience in building scalable frontend applications and my recent ML certification would help me contribute immediately while growing my skills in this emerging field.'",
        code: "",
        tags: ["Introduction", "Company Research", "Motivation", "Career Goals"],
        favorite: false,
        review: true,
        hot: true,
        images: []
      },
      {
        id: 8,
        round: 'technical',
        question: "Explain async/await vs Promises in JavaScript",
        answer: "Both async/await and Promises handle asynchronous operations, but async/await provides a more readable, synchronous-looking syntax.\n\n**Promises:**\n- Represent eventual completion/failure of async operation\n- Use .then() and .catch() for chaining\n- Can lead to callback hell with complex chains\n- Native ES6 feature\n\n**Async/Await:**\n- Syntactic sugar over Promises\n- Makes async code look synchronous\n- Better error handling with try/catch\n- Easier to debug and read\n- ES2017 feature\n\n**When to use which:**\n- Use async/await for linear, sequential operations\n- Use Promises for parallel operations or functional programming\n- Both can be mixed in the same codebase",
        code: `// Promise-based approach\nfunction fetchUserData(userId) {\n  return fetch(\`/api/users/\${userId}\`)\n    .then(response => {\n      if (!response.ok) {\n        throw new Error('User not found');\n      }\n      return response.json();\n    })\n    .then(user => {\n      return fetch(\`/api/posts/\${user.id}\`);\n    })\n    .then(response => response.json())\n    .then(posts => {\n      return { user, posts };\n    })\n    .catch(error => {\n      console.error('Error:', error);\n      throw error;\n    });\n}\n\n// Async/await approach\nasync function fetchUserDataAsync(userId) {\n  try {\n    const response = await fetch(\`/api/users/\${userId}\`);\n    if (!response.ok) {\n      throw new Error('User not found');\n    }\n    \n    const user = await response.json();\n    const postsResponse = await fetch(\`/api/posts/\${user.id}\`);\n    const posts = await postsResponse.json();\n    \n    return { user, posts };\n  } catch (error) {\n    console.error('Error:', error);\n    throw error;\n  }\n}\n\n// Parallel operations with Promise.all\nasync function fetchMultipleUsers(userIds) {\n  try {\n    const promises = userIds.map(id => \n      fetch(\`/api/users/\${id}\`).then(r => r.json())\n    );\n    const users = await Promise.all(promises);\n    return users;\n  } catch (error) {\n    console.error('Error fetching users:', error);\n  }\n}\n\n// Error handling comparison\n// With Promises\nfetchUser(1)\n  .then(user => console.log(user))\n  .catch(error => console.error(error));\n\n// With async/await\nasync function handleUser() {\n  try {\n    const user = await fetchUser(1);\n    console.log(user);\n  } catch (error) {\n    console.error(error);\n  }\n}`,
        tags: ["JavaScript", "Async", "Promises", "ES6", "ES2017"],
        favorite: true,
        review: false,
        hot: true,
        images: []
      },
      {
        id: 9,
        round: 'technical',
        question: "What is the Virtual DOM and how does React use it?",
        answer: "The Virtual DOM is a programming concept where a 'virtual' representation of the UI is kept in memory and synced with the 'real' DOM through a process called reconciliation.\n\n**How it works:**\n1. React creates a virtual representation of the DOM in JavaScript\n2. When state changes, React creates a new Virtual DOM tree\n3. React compares (diffs) the new tree with the previous tree\n4. React calculates the minimum changes needed\n5. React updates only the changed parts in the real DOM\n\n**Benefits:**\n- Performance: Batches DOM updates and minimizes reflows\n- Predictability: Makes UI updates more predictable\n- Abstraction: Developers work with declarative code\n- Cross-browser compatibility: React handles browser differences\n\n**Reconciliation Process:**\n- Element type changes: Replace entire subtree\n- Same element type: Update changed attributes\n- Component elements: Update props and re-render\n- Lists: Use keys for efficient updates",
        code: `// Example of how Virtual DOM works conceptually\n\n// Initial state\nconst initialVDOM = {\n  type: 'div',\n  props: {\n    className: 'container',\n    children: [\n      {\n        type: 'h1',\n        props: { children: 'Hello World' }\n      },\n      {\n        type: 'p',\n        props: { children: 'Counter: 0' }\n      }\n    ]\n  }\n};\n\n// After state change\nconst newVDOM = {\n  type: 'div',\n  props: {\n    className: 'container',\n    children: [\n      {\n        type: 'h1',\n        props: { children: 'Hello World' } // Same, no update needed\n      },\n      {\n        type: 'p',\n        props: { children: 'Counter: 1' } // Changed, needs update\n      }\n    ]\n  }\n};\n\n// React Component example\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  \n  // This JSX creates Virtual DOM elements\n  return (\n    <div className=\"container\">\n      <h1>Hello World</h1>\n      <p>Counter: {count}</p>\n      <button onClick={() => setCount(count + 1)}>\n        Increment\n      </button>\n    </div>\n  );\n}\n\n// Key prop example for efficient list updates\nfunction TodoList({ todos }) {\n  return (\n    <ul>\n      {todos.map(todo => (\n        <li key={todo.id}> {/* Key helps React identify items */}\n          <input \n            type=\"checkbox\" \n            checked={todo.completed}\n            onChange={() => toggleTodo(todo.id)}\n          />\n          {todo.text}\n        </li>\n      ))}\n    </ul>\n  );\n}\n\n// Without keys, React might re-render entire list\n// With keys, React can identify which items changed`,
        tags: ["React", "Virtual DOM", "Performance", "Reconciliation", "JSX"],
        favorite: true,
        review: true,
        hot: false,
        images: []
      },
      {
        id: 10,
        round: 'technical',
        question: "Explain CSS Flexbox layout with practical examples",
        answer: "Flexbox is a CSS layout method that provides an efficient way to arrange, distribute, and align items in a container, even when their size is unknown or dynamic.\n\n**Key Concepts:**\n- **Flex Container**: The parent element with display: flex\n- **Flex Items**: Direct children of the flex container\n- **Main Axis**: Primary axis along which flex items are laid out\n- **Cross Axis**: Perpendicular to the main axis\n\n**Container Properties:**\n- flex-direction: row | column | row-reverse | column-reverse\n- justify-content: Alignment along main axis\n- align-items: Alignment along cross axis\n- flex-wrap: nowrap | wrap | wrap-reverse\n- gap: Space between items\n\n**Item Properties:**\n- flex-grow: How much an item should grow\n- flex-shrink: How much an item should shrink\n- flex-basis: Initial size before free space is distributed\n- align-self: Override align-items for individual item",
        code: `/* Basic Flexbox Setup */\n.container {\n  display: flex;\n  flex-direction: row; /* default */\n  justify-content: space-between;\n  align-items: center;\n  gap: 20px;\n  padding: 20px;\n}\n\n/* Centering content (very common pattern) */\n.center-container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n}\n\n/* Navigation bar example */\n.navbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 1rem 2rem;\n  background: #333;\n}\n\n.nav-links {\n  display: flex;\n  list-style: none;\n  gap: 2rem;\n  margin: 0;\n  padding: 0;\n}\n\n/* Card layout with equal height */\n.card-container {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 1rem;\n  justify-content: space-between;\n}\n\n.card {\n  flex: 1 1 300px; /* grow | shrink | basis */\n  min-width: 300px;\n  max-width: 400px;\n  padding: 1rem;\n  border: 1px solid #ddd;\n  border-radius: 8px;\n}\n\n/* Responsive sidebar layout */\n.layout {\n  display: flex;\n  min-height: 100vh;\n}\n\n.sidebar {\n  flex: 0 0 250px; /* Don't grow, don't shrink, fixed width */\n  background: #f5f5f5;\n  padding: 1rem;\n}\n\n.main-content {\n  flex: 1; /* Take remaining space */\n  padding: 1rem;\n}\n\n/* Form layout with flexbox */\n.form-row {\n  display: flex;\n  gap: 1rem;\n  margin-bottom: 1rem;\n}\n\n.form-field {\n  flex: 1;\n}\n\n.form-field.small {\n  flex: 0 0 100px; /* Fixed width for small fields */\n}\n\n/* Media queries for responsive design */\n@media (max-width: 768px) {\n  .container {\n    flex-direction: column;\n  }\n  \n  .layout {\n    flex-direction: column;\n  }\n  \n  .sidebar {\n    flex: none;\n    width: 100%;\n  }\n  \n  .form-row {\n    flex-direction: column;\n  }\n}`,
        tags: ["CSS", "Flexbox", "Layout", "Responsive", "Frontend"],
        favorite: false,
        review: false,
        hot: true,
        images: []
      }
    ];

    const stored = localStorage.getItem('interviewQuestions');
    if (stored) {
      setQuestions(JSON.parse(stored));
    } else {
      setQuestions(dummyQuestions);
      localStorage.setItem('interviewQuestions', JSON.stringify(dummyQuestions));
    }
  }, []);

  // Load theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('interviewAssistantTheme') || 'light';
    setCurrentTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = questions.filter(q => q.round === currentRound);

    if (activeStatusFilter !== 'all') {
      filtered = filtered.filter(q => q[activeStatusFilter as keyof Question] === true);
    }

    if (activeTagFilter) {
      filtered = filtered.filter(q => q.tags?.includes(activeTagFilter));
    }

    if (searchTerm) {
      filtered = filtered.filter(q => {
        switch (searchType) {
          case 'question':
            return q.question.toLowerCase().includes(searchTerm.toLowerCase());
          case 'answer':
            return q.answer.toLowerCase().includes(searchTerm.toLowerCase());
          case 'code':
            return q.code?.toLowerCase().includes(searchTerm.toLowerCase());
          case 'tags':
            return q.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
          default:
            return false;
        }
      });
    }

    setFilteredQuestions(filtered);
  }, [questions, currentRound, activeStatusFilter, activeTagFilter, searchTerm, searchType]);

  const saveQuestions = (newQuestions: Question[]) => {
    setQuestions(newQuestions);
    localStorage.setItem('interviewQuestions', JSON.stringify(newQuestions));
  };

  const handleAddQuestion = (questionData: any) => {
    const newQuestion: Question = {
      id: Date.now(),
      ...questionData,
      favorite: false,
      review: false,
      hot: false
    };
    const updatedQuestions = [newQuestion, ...questions];
    saveQuestions(updatedQuestions);
    setIsFormVisible(false);
  };

  const handleToggleExpand = (id: number) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedQuestions(newExpanded);
  };

  const handleToggleEdit = (id: number) => {
    const newEditing = new Set(editingQuestions);
    if (newEditing.has(id)) {
      newEditing.delete(id);
    } else {
      newEditing.add(id);
    }
    setEditingQuestions(newEditing);
  };

  const handleToggleStatus = (id: number, status: 'favorite' | 'review' | 'hot') => {
    const updatedQuestions = questions.map(q => {
      if (q.id === id) {
        return { ...q, [status]: !q[status] };
      }
      return q;
    });
    saveQuestions(updatedQuestions);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this question?')) {
      const updatedQuestions = questions.filter(q => q.id !== id);
      saveQuestions(updatedQuestions);
    }
  };

  const handleSave = (id: number, field: string, value: string) => {
    const updatedQuestions = questions.map(q => {
      if (q.id === id) {
        if (field === 'tags') {
          return { ...q, tags: value.split(',').map(tag => tag.trim()).filter(tag => tag) };
        } else {
          return { ...q, [field]: value };
        }
      }
      return q;
    });
    saveQuestions(updatedQuestions);
  };

  const handleRemoveImage = (questionId: number, imageIndex: number) => {
    const updatedQuestions = questions.map(q => {
      if (q.id === questionId && q.images) {
        const newImages = [...q.images];
        newImages.splice(imageIndex, 1);
        return { ...q, images: newImages };
      }
      return q;
    });
    saveQuestions(updatedQuestions);
  };

  const handleThemeToggle = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('interviewAssistantTheme', newTheme);
  };

  const handleShowAll = () => {
    setSearchTerm('');
    setActiveTagFilter(null);
    setActiveStatusFilter('all');
  };

  const handleImageClick = (imageSrc: string) => {
    setCurrentImageSrc(imageSrc);
    setImageModalOpen(true);
  };

  const getAllTags = () => {
    const allTags = new Set<string>();
    questions
      .filter(q => q.round === currentRound)
      .forEach(q => {
        q.tags?.forEach(tag => allTags.add(tag));
      });
    return Array.from(allTags).sort();
  };

  const getStats = () => ({
    total: questions.length,
    favorites: questions.filter(q => q.favorite).length,
    review: questions.filter(q => q.review).length,
    hot: questions.filter(q => q.hot).length
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-6xl mx-auto p-6">
        <Header
          onAddQuestion={() => setIsFormVisible(true)}
          onShowAll={handleShowAll}
          onToggleTheme={handleThemeToggle}
          currentTheme={currentTheme}
        />

        <QuickStats stats={getStats()} />

        <SearchFilters
          searchTerm={searchTerm}
          searchType={searchType}
          currentRound={currentRound}
          activeTagFilter={activeTagFilter}
          activeStatusFilter={activeStatusFilter}
          tags={getAllTags()}
          onSearchChange={setSearchTerm}
          onSearchTypeChange={setSearchType}
          onRoundChange={setCurrentRound}
          onTagFilter={setActiveTagFilter}
          onStatusFilter={setActiveStatusFilter}
        />

        <QuestionForm
          isVisible={isFormVisible}
          currentRound={currentRound}
          onSubmit={handleAddQuestion}
          onCancel={() => setIsFormVisible(false)}
        />

        <div className="space-y-6">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4 opacity-50">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No questions found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try adjusting your search terms or add a new question.</p>
            </div>
          ) : (
            filteredQuestions.map(question => (
              <QuestionCard
                key={question.id}
                question={question}
                isExpanded={expandedQuestions.has(question.id)}
                isEditing={editingQuestions.has(question.id)}
                onToggleExpand={() => handleToggleExpand(question.id)}
                onToggleEdit={() => handleToggleEdit(question.id)}
                onToggleStatus={(status) => handleToggleStatus(question.id, status)}
                onDelete={() => handleDelete(question.id)}
                onSave={(field, value) => handleSave(question.id, field, value)}
                onImageClick={handleImageClick}
                onRemoveImage={(imageIndex) => handleRemoveImage(question.id, imageIndex)}
              />
            ))
          )}
        </div>

        <ImageModal
          isOpen={imageModalOpen}
          imageSrc={currentImageSrc}
          onClose={() => setImageModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default InterviewAssistant;
