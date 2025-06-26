
export interface Question {
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

export const defaultQuestions: Question[] = [
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
    code: `// Basic closure example\nfunction outerFunction(x) {\n  // This is the outer function's scope\n  const outerVariable = x;\n  \n  function innerFunction(y) {\n    // This inner function has access to outerVariable\n    console.log(outerVariable + y);\n  }\n  \n  return innerFunction;\n}\n\nconst addFive = outerFunction(5);\naddFive(10); // Outputs: 15\n\n// Practical example - Counter with closure\nfunction createCounter() {\n  let count = 0;\n  \n  return {\n    increment: function() {\n      count++;\n      return count;\n    },\n    decrement: function() {\n      count--;\n      return count;\n    },\n    getCount: function() {\n      return count;\n    }\n  };\n}\n\nconst counter = createCounter();\nconsole.log(counter.increment()); // 1\nconsole.log(counter.increment()); // 2\nconsole.log(counter.getCount());  // 2`,
    tags: ["JavaScript", "Functions", "Scope", "Closures", "ES6"],
    favorite: true,
    review: true,
    hot: false,
    images: []
  },
  {
    id: 3,
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
    id: 4,
    round: 'telephonic',
    question: "Walk me through your most challenging project",
    answer: "Use the STAR method (Situation, Task, Action, Result):\n\n**Situation:** Set the context\n- What was the project?\n- What made it challenging?\n- What were the constraints?\n\n**Task:** Define your responsibility\n- What was your specific role?\n- What were you trying to achieve?\n\n**Action:** Explain what you did\n- What steps did you take?\n- What decisions did you make?\n- How did you overcome obstacles?\n\n**Result:** Share the outcome\n- What was achieved?\n- Include metrics if possible\n- What did you learn?",
    code: "",
    tags: ["Telephonic", "Project Management", "Problem Solving", "STAR Method"],
    favorite: true,
    review: false,
    hot: false,
    images: []
  },
  {
    id: 5,
    round: 'introduction',
    question: "Why are you interested in this position and our company?",
    answer: "Research the company and role beforehand. Structure your answer around:\n\n**Role Alignment:**\n- How your skills match the requirements\n- Specific aspects of the role that excite you\n- Growth opportunities you see\n\n**Company Interest:**\n- What attracts you to the company culture\n- Products/services you admire\n- Company mission/values alignment\n- Recent news or achievements\n\n**Mutual Benefit:**\n- What you can contribute\n- How you can add value\n- Your career goals alignment",
    code: "",
    tags: ["Introduction", "Company Research", "Motivation", "Career Goals"],
    favorite: false,
    review: true,
    hot: true,
    images: []
  }
];
