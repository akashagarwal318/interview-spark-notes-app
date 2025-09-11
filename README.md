# 🚀 Interview Assistant - MERN Stack Application

A modern, comprehensive interview preparation application built with React, Redux Toolkit, and Express.js. Features a MongoDB backend for persistent data storage, advanced question management, and intelligent search capabilities.

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Development Guide](#-development-guide)
- [Component Library](#-component-library)

## ✨ Features

### 🎯 Question Management
- **Create & Edit**: Add comprehensive interview questions with rich text formatting
- **Code Snippets**: Syntax-highlighted code blocks with language selection
- **Image Support**: Upload and display images with questions (base64 storage)
- **Tags System**: Organize questions with colorful, searchable tags
- **Status Tracking**: Mark questions as favorites, for review, or hot topics
- **Round Organization**: Categorize by interview rounds (technical, behavioral, etc.)

### 🔍 Advanced Search & Filtering
- **Full-Text Search**: Search across questions, answers, code, and tags
- **Smart Filters**: Multi-dimensional filtering by round, tags, status, difficulty
- **Real-time Results**: Instant search with debounced input
- **Custom Rounds**: Create and manage custom interview round categories
- **Clear Filters**: One-click filter reset with visual indicators

### 📊 Analytics & Statistics
- **Real-time Stats**: Dashboard with comprehensive metrics
- **Progress Tracking**: Monitor preparation progress over time
- **Tag Analytics**: Most used tags and categorization insights
- **Round Distribution**: Visual breakdown of questions by interview rounds

### 🎨 User Experience
- **Dark/Light Theme**: System preference detection with manual toggle
- **Responsive Design**: Mobile-first approach, works on all devices
- **Auto-Save**: Automatic form persistence during editing
- **Keyboard Shortcuts**: Efficient navigation and form handling
- **Loading States**: Smooth loading indicators for all operations

### 🚀 Performance Features
- **Pagination**: Efficient data loading with customizable page sizes
- **Lazy Loading**: Images and content loaded on demand
- **Debounced Search**: Optimized search performance
- **Redux State Management**: Centralized state with automatic updates

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **JavaScript (ES6+)** - Latest JavaScript features, no TypeScript
- **Redux Toolkit** - Simplified state management with RTK Query
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Radix UI Components** - Accessible, customizable UI primitives
- **Lucide React** - Beautiful, customizable icons
- **Vite** - Fast build tool and development server

### Backend
- **Node.js 18+** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Joi** - Data validation and sanitization
- **Helmet** - Security middleware for Express
- **CORS** - Cross-origin resource sharing
- **Compression** - Response compression middleware

### Development Tools
- **ESLint** - Code linting and style enforcement
- **PostCSS** - CSS post-processing with Tailwind
- **Nodemon** - Automatic server restart during development
- **Docker** - Containerization support (optional)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB (local installation or MongoDB Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd interview-spark-notes-app
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. **Environment setup**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Configure your environment variables
   # Edit .env file with your settings
   ```

4. **Database setup**
   ```bash
   # Start MongoDB (if running locally)
   mongod
   
   # Seed the database with sample data
   cd backend
   npm run seed
   cd ..
   ```

5. **Start the application**
   ```bash
   # Terminal 1: Start backend server
   cd backend
   npm run dev
   
   # Terminal 2: Start frontend development server
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Database: MongoDB on port 27017

## 📁 Project Structure

```
interview-spark-notes-app/
├── 📁 backend/                    # Express.js API server
│   ├── 📁 middleware/            # Custom middleware
│   ├── 📁 models/                # Mongoose schemas
│   ├── 📁 routes/                # API route handlers
│   ├── 📁 scripts/               # Database utilities
│   ├── package.json              # Backend dependencies
│   └── server.js                 # Express server entry
├── 📁 src/                       # React frontend source
│   ├── 📁 components/            # React components
│   │   ├── 📁 filters/          # Search and filter components
│   │   ├── 📁 forms/            # Form components
│   │   ├── 📁 layout/           # Layout components
│   │   ├── 📁 modals/           # Modal components
│   │   ├── 📁 pagination/       # Pagination controls
│   │   ├── 📁 questions/        # Question-related components
│   │   ├── 📁 stats/            # Statistics components
│   │   └── 📁 ui/               # Reusable UI components
│   ├── 📁 hooks/                 # Custom React hooks
│   ├── 📁 lib/                   # Utility libraries
│   ├── 📁 pages/                 # Page components
│   ├── 📁 services/              # API service layers
│   ├── 📁 store/                 # Redux store configuration
│   │   └── 📁 slices/           # Redux slices
│   ├── 📁 theme/                 # Theme configuration
│   └── 📁 utils/                 # Utility functions
├── 📁 public/                    # Static assets
├── package.json                  # Frontend dependencies
├── vite.config.ts               # Vite configuration
├── tailwind.config.ts           # Tailwind CSS configuration
└── README.md                    # Project documentation
```

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Questions Endpoints

#### Get Questions
```http
GET /questions?page=1&limit=10&search=react&round=technical&tags=javascript,react
```

#### Create Question
```http
POST /questions
Content-Type: application/json

{
  "round": "technical",
  "question": "What is React?",
  "answer": "React is a JavaScript library...",
  "code": "const App = () => <div>Hello</div>",
  "codeLanguage": "javascript",
  "tags": ["react", "javascript"],
  "difficulty": "easy",
  "company": "Google",
  "position": "Frontend Developer"
}
```

#### Update Question
```http
PUT /questions/:id
Content-Type: application/json

{
  "question": "Updated question text",
  "answer": "Updated answer",
  "favorite": true
}
```

#### Delete Question
```http
DELETE /questions/:id
```

### Tags Endpoints

#### Get All Tags
```http
GET /tags
```

#### Get Tag Usage Statistics
```http
GET /tags/stats
```

### Statistics Endpoints

#### Get Dashboard Statistics
```http
GET /stats/dashboard
```

#### Get Round Distribution
```http
GET /stats/rounds
```

## 🛠️ Development Guide

### Frontend Development

#### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

#### Adding New Components
1. Create component file in appropriate `src/components/` subdirectory
2. Use functional components with hooks
3. Include TypeScript-style JSDoc comments for props
4. Export component as default export

#### State Management
- Use Redux Toolkit for global state
- Create slices in `src/store/slices/`
- Use createAsyncThunk for API calls
- Follow the established patterns in questionsSlice.js

#### Styling Guidelines
- Use Tailwind CSS utility classes
- Create reusable components in `src/components/ui/`
- Follow the established design system
- Use CSS custom properties for theme variables

### Backend Development

#### Available Scripts
```bash
npm start            # Start production server
npm run dev          # Start development server with nodemon
npm run seed         # Seed database with sample data
```

#### API Development
1. Create routes in `backend/routes/`
2. Use Joi for request validation
3. Follow RESTful conventions
4. Include proper error handling
5. Add JSDoc comments for endpoints

#### Database Schema
- Questions: Core interview question data
- Tags: Reusable categorization system
- Indexes: Optimized for search and filtering

## 🎨 Component Library

### UI Components
Our custom UI component library built on Radix UI primitives:

#### Core Components
- **Button** - Various styles and sizes
- **Input** - Form input with validation states
- **Textarea** - Multi-line text input
- **Select** - Dropdown selection component
- **Card** - Content container with header/body
- **Badge** - Status and tag indicators
- **DropdownMenu** - Contextual action menus

#### Specialized Components
- **AdvancedCodeEditor** - Syntax-highlighted code editor with fullscreen mode
- **CodeBlock** - Read-only syntax-highlighted code display
- **QuestionCard** - Complete question display with all features
- **SearchFilters** - Advanced filtering interface
- **PaginationControls** - Data navigation controls

### Theme System
- CSS custom properties for consistent theming
- Dark/light mode with system preference detection
- Accessible color contrasts
- Consistent spacing and typography scales

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following our coding standards
4. Test your changes thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Coding Standards
- Use meaningful variable and function names
- Write comprehensive JSDoc comments
- Follow the established file structure
- Include proper error handling
- Write tests for new features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

For support, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ by the Interview Assistant Team**
