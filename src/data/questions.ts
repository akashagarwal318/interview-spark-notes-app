
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
    images: [
      {
        name: "react-lifecycle.png",
        data: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
        size: 45000
      }
    ]
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
    tags: ["HR", "Interview", "Introduction", "Career", "Self-presentation"],
    favorite: false,
    review: true,
    hot: false,
    images: [
      {
        name: "career-journey.jpg",
        data: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
        size: 52000
      }
    ]
  },
  {
    id: 4,
    round: 'telephonic',
    question: "Walk me through your most challenging project",
    answer: "Use the STAR method (Situation, Task, Action, Result):\n\n**Situation:** Set the context\n- What was the project?\n- What made it challenging?\n- What were the constraints?\n\n**Task:** Define your responsibility\n- What was your specific role?\n- What were you trying to achieve?\n\n**Action:** Explain what you did\n- What steps did you take?\n- What decisions did you make?\n- How did you overcome obstacles?\n\n**Result:** Share the outcome\n- What was achieved?\n- Include metrics if possible\n- What did you learn?",
    code: "",
    tags: ["Telephonic", "Project Management", "Problem Solving", "STAR Method", "Leadership"],
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
    tags: ["Introduction", "Company Research", "Motivation", "Career Goals", "Values"],
    favorite: false,
    review: true,
    hot: true,
    images: []
  },
  {
    id: 6,
    round: 'behavioral',
    question: "Describe a time when you had to work with a difficult team member",
    answer: "This question tests your interpersonal skills and conflict resolution abilities.\n\n**STAR Framework:**\n\n**Situation:** Team project with conflicting personalities\n**Task:** Maintain team productivity and harmony\n**Action:** \n- Initiated one-on-one conversation\n- Listened to their concerns\n- Found common ground\n- Established clear communication protocols\n- Focused on shared goals\n\n**Result:** \n- Improved team dynamics\n- Successfully completed project on time\n- Learned valuable conflict resolution skills\n\n**Key Tips:**\n- Stay professional and diplomatic\n- Focus on solutions, not blame\n- Show emotional intelligence\n- Demonstrate leadership qualities",
    code: "",
    tags: ["Behavioral", "Teamwork", "Conflict Resolution", "Leadership", "Communication"],
    favorite: false,
    review: false,
    hot: true,
    images: [
      {
        name: "teamwork.jpg",
        data: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop",
        size: 48000
      }
    ]
  },
  {
    id: 7,
    round: 'system-design',
    question: "Design a URL shortener like bit.ly",
    answer: "System design for URL shortener:\n\n**Requirements:**\n- Functional: Shorten URLs, redirect to original URL, custom aliases\n- Non-functional: 100:1 read/write ratio, low latency, high availability\n\n**High-level Design:**\n1. **API Gateway** - Rate limiting, authentication\n2. **Application Servers** - Business logic\n3. **Database** - URL mappings storage\n4. **Cache** - Frequently accessed URLs\n5. **CDN** - Global distribution\n\n**Database Schema:**\n- URLs table: id, original_url, short_url, created_at, expires_at\n- Analytics table: url_id, timestamp, user_agent, ip_address\n\n**Encoding Strategy:**\n- Base62 encoding (a-z, A-Z, 0-9)\n- 7 characters = 62^7 = 3.5 trillion URLs\n\n**Scalability:**\n- Database sharding by URL hash\n- Read replicas for analytics\n- Caching layer (Redis/Memcached)\n- Load balancers",
    code: `// URL encoding algorithm\nclass URLShortener {\n  private static final String ALPHABET = \"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789\";\n  private static final int BASE = ALPHABET.length();\n  \n  public String encode(long id) {\n    StringBuilder sb = new StringBuilder();\n    while (id > 0) {\n      sb.append(ALPHABET.charAt((int)(id % BASE)));\n      id /= BASE;\n    }\n    return sb.reverse().toString();\n  }\n  \n  public long decode(String shortUrl) {\n    long id = 0;\n    for (char c : shortUrl.toCharArray()) {\n      id = id * BASE + ALPHABET.indexOf(c);\n    }\n    return id;\n  }\n}`,
    tags: ["System Design", "Scalability", "Database", "Caching", "Architecture"],
    favorite: true,
    review: true,
    hot: false,
    images: [
      {
        name: "system-architecture.png",
        data: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop",
        size: 38000
      }
    ]
  },
  {
    id: 8,
    round: 'coding',
    question: "Implement a function to find the longest palindromic substring",
    answer: "Several approaches to solve this problem:\n\n**1. Brute Force (O(n³)):**\n- Check all substrings\n- Verify if each is palindrome\n\n**2. Expand Around Centers (O(n²)):**\n- For each character, expand outward\n- Handle both odd and even length palindromes\n\n**3. Dynamic Programming (O(n²)):**\n- Build table of palindrome substrings\n- Use previous results\n\n**4. Manacher's Algorithm (O(n)):**\n- Linear time solution\n- Complex implementation\n\n**Optimal Approach:** Expand around centers\n- Time: O(n²), Space: O(1)\n- Easy to understand and implement",
    code: `def longestPalindrome(s):\n    if not s:\n        return \"\"\n    \n    start = 0\n    max_len = 1\n    \n    def expand_around_center(left, right):\n        while left >= 0 and right < len(s) and s[left] == s[right]:\n            left -= 1\n            right += 1\n        return right - left - 1\n    \n    for i in range(len(s)):\n        # Odd length palindromes\n        len1 = expand_around_center(i, i)\n        # Even length palindromes\n        len2 = expand_around_center(i, i + 1)\n        \n        current_max = max(len1, len2)\n        \n        if current_max > max_len:\n            max_len = current_max\n            start = i - (current_max - 1) // 2\n    \n    return s[start:start + max_len]\n\n# Test cases\nprint(longestPalindrome(\"babad\"))  # \"bab\" or \"aba\"\nprint(longestPalindrome(\"cbbd\"))   # \"bb\"\nprint(longestPalindrome(\"a\"))      # \"a\"\nprint(longestPalindrome(\"ac\"))     # \"a\"`,
    tags: ["Coding", "Algorithms", "String Manipulation", "Dynamic Programming", "Python"],
    favorite: true,
    review: false,
    hot: true,
    images: []
  },
  {
    id: 9,
    round: 'technical',
    question: "What are React Hooks and why were they introduced?",
    answer: "React Hooks are functions that let you use state and lifecycle features in functional components.\n\n**Why Hooks were introduced:**\n1. **Complex components** - Class components became hard to understand\n2. **Confusing classes** - 'this' keyword confusion, binding issues\n3. **Hard to reuse stateful logic** - No good way to share stateful logic between components\n4. **Performance** - Classes don't minify well and make hot reloading unreliable\n\n**Built-in Hooks:**\n- useState - State management\n- useEffect - Side effects\n- useContext - Context consumption\n- useReducer - Complex state logic\n- useMemo - Memoization\n- useCallback - Function memoization\n- useRef - Direct DOM access\n\n**Rules of Hooks:**\n1. Only call at the top level\n2. Only call from React functions\n3. Always call in the same order",
    code: `// Before Hooks (Class Component)\nclass Counter extends React.Component {\n  constructor(props) {\n    super(props);\n    this.state = { count: 0 };\n    this.handleClick = this.handleClick.bind(this);\n  }\n  \n  componentDidMount() {\n    document.title = \`Count: \${this.state.count}\`;\n  }\n  \n  componentDidUpdate() {\n    document.title = \`Count: \${this.state.count}\`;\n  }\n  \n  handleClick() {\n    this.setState({ count: this.state.count + 1 });\n  }\n  \n  render() {\n    return (\n      <button onClick={this.handleClick}>\n        Count: {this.state.count}\n      </button>\n    );\n  }\n}\n\n// After Hooks (Functional Component)\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  \n  useEffect(() => {\n    document.title = \`Count: \${count}\`;\n  });\n  \n  return (\n    <button onClick={() => setCount(count + 1)}>\n      Count: {count}\n    </button>\n  );\n}`,
    tags: ["React", "Hooks", "Functional Components", "State Management", "Modern React"],
    favorite: false,
    review: true,
    hot: false,
    images: []
  },
  {
    id: 10,
    round: 'behavioral',
    question: "Tell me about a time you failed and how you handled it",
    answer: "This question assesses your self-awareness, resilience, and ability to learn from mistakes.\n\n**STAR Method Example:**\n\n**Situation:** Led a project with tight deadline\n**Task:** Deliver new feature for product launch\n**Action:** \n- Underestimated complexity\n- Didn't communicate risks early\n- Tried to solve everything alone\n\n**Result:** Missed deadline, delayed product launch\n\n**Learning & Recovery:**\n- Took full responsibility\n- Analyzed what went wrong\n- Implemented better project planning\n- Improved communication with stakeholders\n- Created risk assessment framework\n\n**Key Principles:**\n- Be honest and authentic\n- Show accountability\n- Focus on learning and growth\n- Demonstrate resilience\n- Explain preventive measures taken",
    code: "",
    tags: ["Behavioral", "Failure", "Learning", "Accountability", "Growth Mindset"],
    favorite: false,
    review: false,
    hot: false,
    images: []
  },
  {
    id: 11,
    round: 'system-design',
    question: "Design a chat application like WhatsApp",
    answer: "High-level system design for chat application:\n\n**Functional Requirements:**\n- Send/receive messages\n- Online/offline status\n- Group chats\n- Message delivery status\n- File sharing\n\n**Non-functional Requirements:**\n- Low latency (<100ms)\n- High availability (99.9%)\n- Scalable (millions of users)\n- Secure end-to-end encryption\n\n**Architecture Components:**\n1. **Load Balancer** - Distribute traffic\n2. **API Gateway** - Authentication, rate limiting\n3. **Chat Service** - Message processing\n4. **Presence Service** - Online/offline status\n5. **Notification Service** - Push notifications\n6. **Media Service** - File uploads\n7. **Database** - Message storage\n8. **Message Queue** - Async processing\n\n**Real-time Communication:**\n- WebSockets for real-time messaging\n- Socket.IO for fallback support\n- HTTP long polling as backup",
    code: `// WebSocket server implementation\nconst io = require('socket.io')(server);\nconst redis = require('redis');\nconst client = redis.createClient();\n\nio.on('connection', (socket) => {\n  console.log('User connected:', socket.id);\n  \n  // Join user to their rooms\n  socket.on('join-room', (roomId) => {\n    socket.join(roomId);\n    // Update user presence\n    client.sadd(\`room:\${roomId}:users\`, socket.userId);\n  });\n  \n  // Handle message sending\n  socket.on('send-message', async (data) => {\n    const { roomId, message, userId } = data;\n    \n    // Save message to database\n    const savedMessage = await saveMessage({\n      roomId,\n      message,\n      userId,\n      timestamp: new Date()\n    });\n    \n    // Broadcast to room\n    io.to(roomId).emit('new-message', savedMessage);\n    \n    // Send push notification to offline users\n    const offlineUsers = await getOfflineUsers(roomId);\n    sendPushNotifications(offlineUsers, savedMessage);\n  });\n  \n  socket.on('disconnect', () => {\n    // Update user presence\n    updateUserPresence(socket.userId, 'offline');\n  });\n});`,
    tags: ["System Design", "Real-time", "WebSockets", "Scalability", "Chat"],
    favorite: true,
    review: true,
    hot: true,
    images: [
      {
        name: "chat-architecture.png",
        data: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=300&fit=crop",
        size: 44000
      }
    ]
  },
  {
    id: 12,
    round: 'coding',
    question: "Implement a function to detect if a linked list has a cycle",
    answer: "Classic problem solved using Floyd's Cycle Detection Algorithm (Tortoise and Hare).\n\n**Approach:**\n1. Use two pointers - slow and fast\n2. Slow moves one step, fast moves two steps\n3. If there's a cycle, they will eventually meet\n4. If fast reaches null, no cycle exists\n\n**Time Complexity:** O(n)\n**Space Complexity:** O(1)\n\n**Why it works:**\n- If there's a cycle, fast pointer will eventually catch up to slow pointer\n- Fast pointer gains one position on slow pointer each iteration\n- They will meet within the cycle\n\n**Follow-up Questions:**\n- Find the starting point of the cycle\n- Find the length of the cycle\n- Remove the cycle",
    code: `# Definition for singly-linked list\nclass ListNode:\n    def __init__(self, x):\n        self.val = x\n        self.next = None\n\ndef hasCycle(head):\n    \"\"\"\n    Detect if linked list has a cycle\n    Time: O(n), Space: O(1)\n    \"\"\"\n    if not head or not head.next:\n        return False\n    \n    slow = head\n    fast = head.next\n    \n    while fast and fast.next:\n        if slow == fast:\n            return True\n        slow = slow.next\n        fast = fast.next.next\n    \n    return False\n\ndef detectCycleStart(head):\n    \"\"\"\n    Find the starting node of the cycle\n    \"\"\"\n    if not head or not head.next:\n        return None\n    \n    # Phase 1: Detect if cycle exists\n    slow = fast = head\n    \n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast:\n            break\n    else:\n        return None  # No cycle\n    \n    # Phase 2: Find cycle start\n    slow = head\n    while slow != fast:\n        slow = slow.next\n        fast = fast.next\n    \n    return slow\n\n# Test the function\n# Create a cycle: 1 -> 2 -> 3 -> 4\n#                      ^         |\n#                      |_________|\nnode1 = ListNode(1)\nnode2 = ListNode(2)\nnode3 = ListNode(3)\nnode4 = ListNode(4)\n\nnode1.next = node2\nnode2.next = node3\nnode3.next = node4\nnode4.next = node2  # Creates cycle\n\nprint(hasCycle(node1))  # True\nprint(detectCycleStart(node1).val)  # 2`,
    tags: ["Coding", "Linked List", "Two Pointers", "Cycle Detection", "Algorithms"],
    favorite: true,
    review: false,
    hot: false,
    images: []
  },
  {
    id: 13,
    round: 'hr',
    question: "What are your salary expectations?",
    answer: "This is a negotiation question that requires preparation and strategy.\n\n**Research First:**\n- Industry standards for your role\n- Company size and location factors\n- Your experience level and skills\n- Market demand for your expertise\n\n**Response Strategies:**\n\n**1. Turn it back to them:**\n\"I'm sure you have a fair range budgeted for this position. What is that range?\"\n\n**2. Give a range:**\n\"Based on my research and experience, I'm looking for something in the range of $X to $Y.\"\n\n**3. Focus on total compensation:**\n\"I'm interested in the total compensation package, including benefits, growth opportunities, and work-life balance.\"\n\n**Tips:**\n- Never give the first number if possible\n- If pressed, give a range with your target at the bottom\n- Consider the entire package, not just salary\n- Be prepared to justify your expectations",
    code: "",
    tags: ["HR", "Salary Negotiation", "Compensation", "Career Growth", "Interview Strategy"],
    favorite: false,
    review: true,
    hot: false,
    images: []
  },
  {
    id: 14,
    round: 'telephonic',
    question: "Explain the difference between SQL and NoSQL databases",
    answer: "Fundamental differences between SQL and NoSQL databases:\n\n**SQL Databases (RDBMS):**\n- **Structure:** Fixed schema, tables with rows and columns\n- **Query Language:** Structured Query Language (SQL)\n- **ACID Properties:** Atomicity, Consistency, Isolation, Durability\n- **Scalability:** Vertical scaling (scale up)\n- **Examples:** MySQL, PostgreSQL, Oracle, SQL Server\n\n**NoSQL Databases:**\n- **Structure:** Flexible schema, various data models\n- **Query Language:** Database-specific APIs\n- **BASE Properties:** Basically Available, Soft state, Eventually consistent\n- **Scalability:** Horizontal scaling (scale out)\n- **Types:** Document, Key-Value, Column-family, Graph\n\n**When to use SQL:**\n- Complex queries and transactions\n- Strong consistency requirements\n- Established applications\n- ACID compliance needed\n\n**When to use NoSQL:**\n- Rapid development and iteration\n- Large scale and high performance\n- Flexible data models\n- Horizontal scaling requirements",
    code: `-- SQL Example (MySQL)\nCREATE TABLE users (\n    id INT PRIMARY KEY AUTO_INCREMENT,\n    name VARCHAR(100) NOT NULL,\n    email VARCHAR(100) UNIQUE,\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\nSELECT u.name, COUNT(o.id) as order_count\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nWHERE u.created_at >= '2023-01-01'\nGROUP BY u.id, u.name\nORDER BY order_count DESC;\n\n// NoSQL Example (MongoDB)\n// Flexible document structure\n{\n  \"_id\": ObjectId(\"...\"),\n  \"name\": \"John Doe\",\n  \"email\": \"john@example.com\",\n  \"profile\": {\n    \"age\": 30,\n    \"interests\": [\"programming\", \"music\"],\n    \"address\": {\n      \"city\": \"San Francisco\",\n      \"country\": \"USA\"\n    }\n  },\n  \"orders\": [\n    {\n      \"id\": \"order_123\",\n      \"total\": 99.99,\n      \"items\": [\"laptop\", \"mouse\"]\n    }\n  ]\n}`,
    tags: ["Database", "SQL", "NoSQL", "System Design", "Data Modeling"],
    favorite: false,
    review: false,
    hot: true,
    images: [
      {
        name: "database-comparison.png",
        data: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop",
        size: 41000
      }
    ]
  },
  {
    id: 15,
    round: 'introduction',
    question: "What are your biggest strengths and weaknesses?",
    answer: "Strategic approach to discussing strengths and weaknesses:\n\n**Strengths Framework:**\n1. **Choose relevant strengths** for the role\n2. **Provide specific examples** with metrics\n3. **Show impact** on previous roles\n\n**Example Strengths:**\n- Problem-solving with complex technical challenges\n- Leadership and team collaboration\n- Adaptability to new technologies\n- Strong communication skills\n\n**Weaknesses Strategy:**\n1. **Choose real weaknesses** (not humble brags)\n2. **Show self-awareness** and growth mindset\n3. **Explain steps taken** to improve\n4. **Demonstrate progress** made\n\n**Good Weakness Examples:**\n- \"I used to struggle with public speaking, so I joined Toastmasters and now regularly present at team meetings\"\n- \"I sometimes focus too much on perfecting details, so I've learned to set deadlines and prioritize impact\"\n\n**Avoid:**\n- \"I'm a perfectionist\" (cliché)\n- \"I work too hard\" (not genuine)\n- Critical weaknesses for the role",
    code: "",
    tags: ["Introduction", "Self-Assessment", "Strengths", "Weaknesses", "Personal Development"],
    favorite: true,
    review: false,
    hot: false,
    images: []
  }
];
