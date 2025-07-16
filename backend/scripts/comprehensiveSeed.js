import mongoose from 'mongoose';
import Question from '../models/Question.js';
import Tag from '../models/Tag.js';

const dummyData = {
  // Comprehensive dummy questions covering ALL features
  questions: [
    {
      title: "Explain React useState Hook",
      question: "What is useState hook in React and how do you use it?",
      answer: "useState is a React Hook that lets you add state to functional components. It returns an array with two elements: the current state value and a function to update it.",
      codeSnippet: `import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

export default Counter;`,
      language: "javascript",
      difficulty: "Easy",
      category: "React",
      tags: ["react", "hooks", "state-management", "frontend"],
      notes: "This is a fundamental React concept. Make sure to understand the syntax and usage patterns.",
      imageUrl: "https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=React+useState",
      isBookmarked: true,
      lastReviewed: new Date('2024-01-15'),
      reviewCount: 5,
      createdAt: new Date('2024-01-10')
    },
    {
      title: "JavaScript Async/Await vs Promises",
      question: "What's the difference between async/await and Promises in JavaScript?",
      answer: "Async/await is syntactic sugar built on top of Promises. It makes asynchronous code look more like synchronous code, improving readability and error handling.",
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
      tags: ["javascript", "async", "promises", "es6"],
      notes: "Key difference: async/await provides better error handling with try/catch and more readable code flow.",
      imageUrl: "https://via.placeholder.com/600x400/10B981/FFFFFF?text=Async+Await",
      isBookmarked: false,
      lastReviewed: new Date('2024-02-01'),
      reviewCount: 3,
      createdAt: new Date('2024-01-20')
    },
    {
      title: "Node.js Event Loop Explained",
      question: "How does the Node.js Event Loop work?",
      answer: "The Event Loop is the core of Node.js asynchronous programming. It handles execution of multiple callbacks and ensures non-blocking I/O operations.",
      codeSnippet: `console.log('Start');

setTimeout(() => {
  console.log('Timeout 1');
}, 0);

setImmediate(() => {
  console.log('Immediate 1');
});

process.nextTick(() => {
  console.log('Next Tick 1');
});

Promise.resolve().then(() => {
  console.log('Promise 1');
});

console.log('End');

// Output order:
// Start
// End
// Next Tick 1
// Promise 1
// Timeout 1
// Immediate 1`,
      language: "javascript",
      difficulty: "Hard",
      category: "Node.js",
      tags: ["nodejs", "event-loop", "backend", "asynchronous"],
      notes: "Understanding the event loop phases: Timer, Pending callbacks, Poll, Check, Close callbacks. Process.nextTick and Promises have higher priority.",
      imageUrl: "https://via.placeholder.com/500x350/EF4444/FFFFFF?text=Event+Loop",
      isBookmarked: true,
      lastReviewed: new Date('2024-02-10'),
      reviewCount: 8,
      createdAt: new Date('2024-01-25')
    },
    {
      title: "CSS Flexbox Layout",
      question: "Explain CSS Flexbox and its main properties",
      answer: "Flexbox is a one-dimensional layout method for arranging items in rows or columns. It provides efficient space distribution and alignment capabilities.",
      codeSnippet: `.container {
  display: flex;
  flex-direction: row; /* or column */
  justify-content: center; /* main axis alignment */
  align-items: center; /* cross axis alignment */
  flex-wrap: wrap; /* allow wrapping */
  gap: 20px; /* space between items */
}

.item {
  flex: 1; /* flex-grow: 1, flex-shrink: 1, flex-basis: 0% */
  /* or specific values */
  flex-grow: 2;
  flex-shrink: 0;
  flex-basis: 200px;
}

/* Responsive flex example */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
}`,
      language: "css",
      difficulty: "Medium",
      category: "CSS",
      tags: ["css", "layout", "flexbox", "responsive"],
      notes: "Remember: justify-content affects main axis, align-items affects cross axis. Main axis changes with flex-direction.",
      imageUrl: "https://via.placeholder.com/700x300/8B5CF6/FFFFFF?text=CSS+Flexbox",
      isBookmarked: false,
      lastReviewed: new Date('2024-02-05'),
      reviewCount: 2,
      createdAt: new Date('2024-01-30')
    },
    {
      title: "MongoDB Aggregation Pipeline",
      question: "How do you use MongoDB aggregation pipeline for complex queries?",
      answer: "Aggregation pipeline processes documents through multiple stages, each transforming the data. Common stages include $match, $group, $project, $sort, $lookup.",
      codeSnippet: `// Find average order value by category
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
  { $sort: { totalRevenue: -1 } },
  
  // Stage 6: Project final fields
  {
    $project: {
      category: "$_id",
      totalOrders: 1,
      avgOrderValue: { $round: ["$avgOrderValue", 2] },
      maxOrderValue: 1,
      totalRevenue: { $round: ["$totalRevenue", 2] },
      _id: 0
    }
  }
]);`,
      language: "javascript",
      difficulty: "Hard",
      category: "Database",
      tags: ["mongodb", "aggregation", "database", "queries"],
      notes: "Aggregation pipeline is powerful for complex data analysis. Each stage feeds into the next. Use $explain to optimize performance.",
      imageUrl: "https://via.placeholder.com/450x400/059669/FFFFFF?text=MongoDB+Pipeline",
      isBookmarked: true,
      lastReviewed: new Date('2024-02-08'),
      reviewCount: 6,
      createdAt: new Date('2024-02-01')
    },
    {
      title: "Python List Comprehensions vs Generator Expressions",
      question: "What's the difference between list comprehensions and generator expressions in Python?",
      answer: "List comprehensions create lists in memory immediately, while generator expressions create iterator objects that yield items on-demand, saving memory.",
      codeSnippet: `# List Comprehension - creates list in memory
squares_list = [x**2 for x in range(1000000)]
print(type(squares_list))  # <class 'list'>
print(f"Size: {squares_list.__sizeof__()} bytes")

# Generator Expression - creates iterator
squares_gen = (x**2 for x in range(1000000))
print(type(squares_gen))  # <class 'generator'>
print(f"Size: {squares_gen.__sizeof__()} bytes")

# Memory efficient filtering with generators
def process_large_file(filename):
    with open(filename, 'r') as file:
        # Generator - processes line by line
        valid_lines = (line.strip() for line in file 
                      if line.strip() and not line.startswith('#'))
        
        for line in valid_lines:
            yield process_line(line)

# vs. List comprehension (loads everything)
def process_large_file_memory_heavy(filename):
    with open(filename, 'r') as file:
        # List - loads all in memory
        valid_lines = [line.strip() for line in file 
                      if line.strip() and not line.startswith('#')]
        
        return [process_line(line) for line in valid_lines]

# Performance comparison
import timeit
import sys

# List comprehension
def list_comp():
    return [x**2 for x in range(10000)]

# Generator expression
def gen_exp():
    return (x**2 for x in range(10000))

print("List comprehension time:", 
      timeit.timeit(list_comp, number=1000))
print("Generator expression time:", 
      timeit.timeit(gen_exp, number=1000))`,
      language: "python",
      difficulty: "Medium",
      category: "Python",
      tags: ["python", "generators", "memory-optimization", "performance"],
      notes: "Use generators for large datasets or when you don't need all results at once. They're lazy-evaluated and memory efficient.",
      imageUrl: "https://via.placeholder.com/550x350/F59E0B/FFFFFF?text=Python+Generators",
      isBookmarked: false,
      lastReviewed: new Date('2024-02-12'),
      reviewCount: 4,
      createdAt: new Date('2024-02-05')
    },
    {
      title: "Docker Multi-stage Builds",
      question: "How do you optimize Docker images using multi-stage builds?",
      answer: "Multi-stage builds allow you to use multiple FROM statements in a Dockerfile, copying only necessary artifacts to the final image, reducing size and attack surface.",
      codeSnippet: `# Multi-stage build for Node.js application
# Stage 1: Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production stage
FROM node:18-alpine AS production

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

WORKDIR /app

# Copy only necessary files from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Change ownership to non-root user
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["node", "dist/server.js"]

# Alternative: Multi-stage with different base images
FROM golang:1.19-alpine AS go-builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Final stage with minimal image
FROM alpine:3.18
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=go-builder /app/main .
CMD ["./main"]`,
      language: "dockerfile",
      difficulty: "Medium",
      category: "DevOps",
      tags: ["docker", "containers", "optimization", "devops"],
      notes: "Multi-stage builds can reduce image size by 90%. Only copy what you need to the final stage. Use .dockerignore to exclude unnecessary files.",
      imageUrl: "https://via.placeholder.com/600x300/3B82F6/FFFFFF?text=Docker+Multi-stage",
      isBookmarked: true,
      lastReviewed: new Date('2024-02-15'),
      reviewCount: 3,
      createdAt: new Date('2024-02-08')
    },
    {
      title: "TypeScript Generics and Utility Types",
      question: "How do you use TypeScript generics and built-in utility types effectively?",
      answer: "Generics allow you to create reusable components that work with multiple types. Utility types provide convenient type transformations for common patterns.",
      codeSnippet: `// Generic function with constraints
interface Lengthable {
  length: number;
}

function logLength<T extends Lengthable>(arg: T): T {
  console.log(arg.length);
  return arg;
}

// Generic class with multiple type parameters
class ApiResponse<TData, TError = Error> {
  constructor(
    public data: TData | null,
    public error: TError | null,
    public status: number
  ) {}

  isSuccess(): this is ApiResponse<TData, null> {
    return this.error === null;
  }
}

// Utility types examples
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  isActive: boolean;
}

// Pick - select specific properties
type UserPublic = Pick<User, 'id' | 'name' | 'email'>;

// Omit - exclude specific properties
type UserCreate = Omit<User, 'id' | 'createdAt'>;

// Partial - make all properties optional
type UserUpdate = Partial<User>;

// Required - make all properties required
type UserRequired = Required<User>;

// Record - create object type with specific keys and values
type UserRoles = Record<'admin' | 'user' | 'guest', boolean>;

// Advanced generic with conditional types
type ApiResult<T> = T extends string 
  ? { message: T } 
  : T extends number 
    ? { count: T } 
    : { data: T };

// Mapped types
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

// Template literal types (TypeScript 4.1+)
type EventName<T extends string> = \`on\${Capitalize<T>}\`;
type ClickEvent = EventName<'click'>; // 'onClick'

// Function overloads with generics
function createArray<T>(length: number, value: T): T[];
function createArray<T>(items: T[]): T[];
function createArray<T>(lengthOrItems: number | T[], value?: T): T[] {
  if (typeof lengthOrItems === 'number') {
    return Array(lengthOrItems).fill(value);
  }
  return lengthOrItems;
}`,
      language: "typescript",
      difficulty: "Hard",
      category: "TypeScript",
      tags: ["typescript", "generics", "types", "advanced"],
      notes: "Generics provide type safety while maintaining flexibility. Use constraints to limit generic types. Utility types save time and improve code quality.",
      imageUrl: "https://via.placeholder.com/500x400/6366F1/FFFFFF?text=TypeScript+Generics",
      isBookmarked: true,
      lastReviewed: new Date('2024-02-18'),
      reviewCount: 7,
      createdAt: new Date('2024-02-10')
    },
    {
      title: "AWS Lambda with API Gateway",
      question: "How do you deploy a serverless API using AWS Lambda and API Gateway?",
      answer: "AWS Lambda with API Gateway creates scalable serverless APIs. Lambda handles the compute, while API Gateway manages HTTP requests, authentication, and routing.",
      codeSnippet: `// Lambda function (Node.js)
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };

  try {
    const { httpMethod, pathParameters, body, queryStringParameters } = event;
    
    switch (httpMethod) {
      case 'GET':
        if (pathParameters && pathParameters.id) {
          // Get single item
          const result = await dynamodb.get({
            TableName: 'Users',
            Key: { id: pathParameters.id }
          }).promise();
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(result.Item)
          };
        } else {
          // List items with pagination
          const params = {
            TableName: 'Users',
            Limit: queryStringParameters?.limit || 10
          };
          
          if (queryStringParameters?.lastKey) {
            params.ExclusiveStartKey = JSON.parse(
              decodeURIComponent(queryStringParameters.lastKey)
            );
          }
          
          const result = await dynamodb.scan(params).promise();
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              items: result.Items,
              lastKey: result.LastEvaluatedKey
            })
          };
        }
        
      case 'POST':
        const newItem = JSON.parse(body);
        newItem.id = context.awsRequestId;
        newItem.createdAt = new Date().toISOString();
        
        await dynamodb.put({
          TableName: 'Users',
          Item: newItem
        }).promise();
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify(newItem)
        };
        
      case 'PUT':
        const updateItem = JSON.parse(body);
        const updateResult = await dynamodb.update({
          TableName: 'Users',
          Key: { id: pathParameters.id },
          UpdateExpression: 'SET #name = :name, email = :email',
          ExpressionAttributeNames: {
            '#name': 'name'
          },
          ExpressionAttributeValues: {
            ':name': updateItem.name,
            ':email': updateItem.email
          },
          ReturnValues: 'ALL_NEW'
        }).promise();
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(updateResult.Attributes)
        };
        
      case 'DELETE':
        await dynamodb.delete({
          TableName: 'Users',
          Key: { id: pathParameters.id }
        }).promise();
        
        return {
          statusCode: 204,
          headers,
          body: ''
        };
        
      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }
  } catch (error) {
    console.error('Error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: error.message
      })
    };
  }
};

// Serverless.yml configuration
/*
service: user-api

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1
  environment:
    DYNAMODB_TABLE: \${self:service}-\${self:provider.stage}
  iamRoleStatements:
    - Effect: Allow
      Action:
        - dynamodb:Query
        - dynamodb:Scan
        - dynamodb:GetItem
        - dynamodb:PutItem
        - dynamodb:UpdateItem
        - dynamodb:DeleteItem
      Resource: "arn:aws:dynamodb:\${opt:region, self:provider.region}:*:table/\${self:provider.environment.DYNAMODB_TABLE}"

functions:
  api:
    handler: index.handler
    events:
      - http:
          path: /users
          method: get
          cors: true
      - http:
          path: /users
          method: post
          cors: true
      - http:
          path: /users/{id}
          method: get
          cors: true
      - http:
          path: /users/{id}
          method: put
          cors: true
      - http:
          path: /users/{id}
          method: delete
          cors: true

resources:
  Resources:
    UsersTable:
      Type: 'AWS::DynamoDB::Table'
      Properties:
        TableName: \${self:provider.environment.DYNAMODB_TABLE}
        AttributeDefinitions:
          - AttributeName: id
            AttributeType: S
        KeySchema:
          - AttributeName: id
            KeyType: HASH
        BillingMode: PAY_PER_REQUEST
*/`,
      language: "javascript",
      difficulty: "Hard",
      category: "AWS",
      tags: ["aws", "lambda", "serverless", "api-gateway", "cloud"],
      notes: "Lambda cold starts can impact performance. Use provisioned concurrency for consistent latency. Monitor costs as Lambda can get expensive with high traffic.",
      imageUrl: "https://via.placeholder.com/650x350/FF6B35/FFFFFF?text=AWS+Lambda+API",
      isBookmarked: false,
      lastReviewed: new Date('2024-02-20'),
      reviewCount: 5,
      createdAt: new Date('2024-02-12')
    },
    {
      title: "React Custom Hooks Pattern",
      question: "How do you create and optimize custom React hooks?",
      answer: "Custom hooks extract component logic into reusable functions. They start with 'use' and can call other hooks. Great for sharing stateful logic between components.",
      codeSnippet: `import { useState, useEffect, useCallback, useRef } from 'react';

// Custom hook for API data fetching
function useApi<T>(url: string, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const abortControllerRef = useRef<AbortController>();
  
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      
      const response = await fetch(url, {
        ...options,
        signal: abortControllerRef.current.signal
      });
      
      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    } finally {
      setLoading(false);
    }
  }, [url, options]);
  
  useEffect(() => {
    fetchData();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);
  
  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);
  
  return { data, loading, error, refetch };
}

// Custom hook for local storage with sync
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(\`Error reading localStorage key "\${key}":\`, error);
      return initialValue;
    }
  });
  
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(\`Error setting localStorage key "\${key}":\`, error);
    }
  }, [key, storedValue]);
  
  return [storedValue, setValue];
}

// Custom hook for debounced values
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

// Custom hook for intersection observer
function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  threshold = 0.1,
  rootMargin = '0px'
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold, rootMargin }
    );
    
    observer.observe(element);
    
    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, threshold, rootMargin]);
  
  return isIntersecting;
}

// Usage example component
function UserProfile({ userId }: { userId: string }) {
  const { data: user, loading, error, refetch } = useApi<User>(
    \`/api/users/\${userId}\`
  );
  
  const [notes, setNotes] = useLocalStorage(\`user-notes-\${userId}\`, '');
  const debouncedNotes = useDebounce(notes, 500);
  const elementRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(elementRef);
  
  // Auto-save notes when debounced value changes
  useEffect(() => {
    if (debouncedNotes && user) {
      // Save to server
      fetch(\`/api/users/\${userId}/notes\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: debouncedNotes })
      });
    }
  }, [debouncedNotes, userId, user]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div ref={elementRef}>
      <h1>{user?.name}</h1>
      <p>Email: {user?.email}</p>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add your notes..."
      />
      {isVisible && <p>Profile is visible!</p>}
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}`,
      language: "typescript",
      difficulty: "Medium",
      category: "React",
      tags: ["react", "hooks", "patterns", "reusability"],
      notes: "Custom hooks should be pure and predictable. Use useCallback and useMemo for optimization. Always clean up subscriptions and cancel requests.",
      imageUrl: "https://via.placeholder.com/600x400/EC4899/FFFFFF?text=React+Custom+Hooks",
      isBookmarked: true,
      lastReviewed: new Date('2024-02-22'),
      reviewCount: 9,
      createdAt: new Date('2024-02-15')
    }
  ],
  
  // Tags to create
  tags: [
    { name: "react", color: "#61DAFB", category: "Frontend" },
    { name: "javascript", color: "#F7DF1E", category: "Language" },
    { name: "typescript", color: "#3178C6", category: "Language" },
    { name: "nodejs", color: "#339933", category: "Backend" },
    { name: "python", color: "#3776AB", category: "Language" },
    { name: "css", color: "#1572B6", category: "Frontend" },
    { name: "mongodb", color: "#47A248", category: "Database" },
    { name: "docker", color: "#2496ED", category: "DevOps" },
    { name: "aws", color: "#232F3E", category: "Cloud" },
    { name: "hooks", color: "#61DAFB", category: "React" },
    { name: "async", color: "#F7DF1E", category: "JavaScript" },
    { name: "promises", color: "#F7DF1E", category: "JavaScript" },
    { name: "event-loop", color: "#339933", category: "Node.js" },
    { name: "flexbox", color: "#1572B6", category: "CSS" },
    { name: "layout", color: "#1572B6", category: "CSS" },
    { name: "aggregation", color: "#47A248", category: "MongoDB" },
    { name: "generators", color: "#3776AB", category: "Python" },
    { name: "containers", color: "#2496ED", category: "Docker" },
    { name: "serverless", color: "#FF9900", category: "AWS" },
    { name: "lambda", color: "#FF9900", category: "AWS" },
    { name: "generics", color: "#3178C6", category: "TypeScript" },
    { name: "patterns", color: "#61DAFB", category: "React" },
    { name: "optimization", color: "#4CAF50", category: "Performance" },
    { name: "state-management", color: "#764ABC", category: "React" },
    { name: "frontend", color: "#42A5F5", category: "General" },
    { name: "backend", color: "#66BB6A", category: "General" },
    { name: "database", color: "#FFA726", category: "General" },
    { name: "devops", color: "#AB47BC", category: "General" },
    { name: "cloud", color: "#FF7043", category: "General" },
    { name: "advanced", color: "#8D6E63", category: "Level" },
    { name: "es6", color: "#F7DF1E", category: "JavaScript" },
    { name: "responsive", color: "#1572B6", category: "CSS" },
    { name: "queries", color: "#47A248", category: "Database" },
    { name: "memory-optimization", color: "#3776AB", category: "Performance" },
    { name: "performance", color: "#4CAF50", category: "General" },
    { name: "api-gateway", color: "#FF9900", category: "AWS" },
    { name: "types", color: "#3178C6", category: "TypeScript" },
    { name: "reusability", color: "#61DAFB", category: "Patterns" }
  ]
};

// Function to seed the database
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/interview-assistant');
    console.log('📊 Connected to MongoDB');
    
    // Clear existing data
    await Question.deleteMany({});
    await Tag.deleteMany({});
    console.log('🗑️ Cleared existing data');
    
    // Create tags first
    console.log('🏷️ Creating tags...');
    const createdTags = await Tag.insertMany(dummyData.tags);
    console.log(`✅ Created ${createdTags.length} tags`);
    
    // Create tag name to ID mapping
    const tagMap = {};
    createdTags.forEach(tag => {
      tagMap[tag.name] = tag._id;
    });
    
    // Process questions and map tag names to IDs
    console.log('❓ Creating questions...');
    const processedQuestions = dummyData.questions.map(question => ({
      ...question,
      tags: question.tags.map(tagName => tagMap[tagName]).filter(Boolean)
    }));
    
    const createdQuestions = await Question.insertMany(processedQuestions);
    console.log(`✅ Created ${createdQuestions.length} questions`);
    
    console.log('🎉 Database seeding completed successfully!');
    console.log(`
📊 Summary:
   • ${createdTags.length} tags created
   • ${createdQuestions.length} questions created
   • All features covered: images, code snippets, tags, filters, etc.
   • Ready for comprehensive testing!
`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export default seedDatabase;
