# 🚀 Interview Assistant - MERN Stack Application

A comprehensive interview preparation application built with React frontend and Node.js/Express backend, featuring MongoDB for data persistence. This application helps you organize, manage, and review interview questions across different rounds with advanced filtering and search capabilities.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)

## ✨ Features

### Frontend Features
- 🎯 **Question Management**: Add, edit, delete, and organize interview questions
- 🔍 **Advanced Search**: Full-text search across questions, answers, and tags
- 🏷️ **Smart Filtering**: Filter by round type, tags, favorites, review status, and hot questions
- 📊 **Real-time Statistics**: Dashboard with comprehensive stats and trends
- 🌙 **Dark/Light Mode**: Toggle between themes with persistence
- 📱 **Responsive Design**: Mobile-first design that works on all devices
- ⚡ **Offline Support**: Continue working when disconnected (with sync when online)
- 🔄 **Real-time Updates**: Automatic data synchronization
- 📈 **Analytics**: Track your preparation progress with detailed insights

### Backend Features
- 🗄️ **MongoDB Integration**: Robust data persistence with indexes for performance
- 🔐 **Data Validation**: Comprehensive input validation and sanitization
- 📡 **RESTful API**: Clean, documented API endpoints
- 🚀 **Performance Optimized**: Pagination, caching, and query optimization
- 🛡️ **Security**: Helmet, CORS, rate limiting, and input validation
- 📊 **Statistics Engine**: Advanced analytics and reporting
- 🏷️ **Tag Management**: Automatic tag creation and management
- 🔍 **Full-Text Search**: MongoDB text search with relevance scoring

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **Redux Toolkit** - State management with RTK Query
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Express Rate Limit** - Rate limiting middleware
- **Morgan** - HTTP request logger

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Concurrently** - Run multiple commands
- **Nodemon** - Auto-restart server during development

## 📁 Project Structure

```
interview-spark-notes-app/
├── backend/                 # Node.js/Express backend
│   ├── models/             # Mongoose models
│   │   ├── Question.js     # Question schema
│   │   └── Tag.js          # Tag schema
│   ├── routes/             # API routes
│   │   ├── questions.js    # Question endpoints
│   │   ├── tags.js         # Tag endpoints
│   │   └── stats.js        # Statistics endpoints
│   ├── middleware/         # Custom middleware
│   │   └── validation.js   # Input validation
│   ├── scripts/            # Utility scripts
│   │   └── seedData.js     # Database seeding
│   ├── .env                # Environment variables
│   ├── server.js           # Express server setup
│   └── package.json        # Backend dependencies
├── src/                    # React frontend
│   ├── components/         # React components
│   │   ├── layout/         # Layout components
│   │   ├── stats/          # Statistics components
│   │   ├── filters/        # Filter components
│   │   ├── forms/          # Form components
│   │   ├── questions/      # Question components
│   │   ├── modals/         # Modal components
│   │   └── pagination/     # Pagination components
│   ├── pages/              # Page components
│   ├── services/           # API service layer
│   │   ├── api.js          # Base API service
│   │   ├── questionService.js
│   │   ├── tagService.js
│   │   └── statsService.js
│   ├── store/              # Redux store
│   │   ├── index.js        # Store configuration
│   │   └── slices/         # Redux slices
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   └── theme/              # Theme configuration
├── .env                    # Frontend environment variables
├── package.json            # Frontend dependencies
└── README.md               # This file
```

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd interview-spark-notes-app
   ```

2. **Install all dependencies**
   ```bash
   npm run full:install
   ```

3. **Configure environment variables**
   
   **Frontend (.env):**
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME="Interview Assistant"
   VITE_ENABLE_OFFLINE_MODE=true
   ```

   **Backend (backend/.env):**
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/interview-assistant
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas connection string in MONGODB_URI
   ```

5. **Seed the database (optional)**
   ```bash
   npm run backend:seed
   ```

6. **Start the development servers**
   ```bash
   npm run full:dev
   ```

   This will start:
   - Backend server on http://localhost:5000
   - Frontend development server on http://localhost:5173

## ⚙️ Configuration

### Environment Variables

#### Frontend (.env)
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |
| `VITE_APP_NAME` | Application name | `"Interview Assistant"` |
| `VITE_ENABLE_OFFLINE_MODE` | Enable offline functionality | `true` |
| `VITE_DEBUG` | Enable debug mode | `false` |

#### Backend (backend/.env)
| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/interview-assistant` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:5173` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |

## 📖 Usage

### Basic Operations

1. **Adding Questions**
   - Click "Add New Question" button
   - Fill in the question details
   - Select appropriate round type
   - Add tags for better organization
   - Upload images if needed

2. **Searching and Filtering**
   - Use the search bar for full-text search
   - Filter by round type (Technical, HR, etc.)
   - Use status filters (Favorites, Review, Hot)
   - Sort by date or alphabetically

3. **Managing Questions**
   - Mark questions as favorites ⭐
   - Flag questions for review 📌
   - Mark important questions as hot 🔥
   - Edit or delete questions as needed

4. **Statistics and Analytics**
   - View quick stats on the dashboard
   - Track your preparation progress
   - Analyze question distribution by rounds
   - Monitor trending topics

### Advanced Features

#### Offline Mode
- Continue working without internet connection
- Changes are automatically synced when online
- Offline indicator shows connection status

#### Bulk Operations
- Select multiple questions for bulk actions
- Export questions to different formats
- Import questions from CSV/JSON

#### Tag Management
- Auto-suggested tags based on content
- Tag categories for better organization
- Popular tags with usage statistics

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Questions Endpoints

#### GET /questions
Get all questions with filtering and pagination

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `round` - Filter by round type
- `search` - Search term
- `sortBy` - Sort order (newest, oldest, alphabetical)
- `favorite` - Filter favorites (true/false)
- `review` - Filter review items (true/false)
- `hot` - Filter hot items (true/false)
- `tags` - Filter by tags (comma-separated)

**Response:**
```json
{
  "status": "success",
  "data": {
    "questions": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalQuestions": 50,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### POST /questions
Create a new question

**Request Body:**
```json
{
  "round": "technical",
  "question": "Question text",
  "answer": "Answer text",
  "code": "Optional code snippet",
  "tags": ["javascript", "react"],
  "difficulty": "medium",
  "company": "Optional company name",
  "position": "Optional position"
}
```

#### PUT /questions/:id
Update an existing question

#### DELETE /questions/:id
Delete a question

#### PATCH /questions/:id/toggle/:field
Toggle question status (favorite, review, hot)

### Tags Endpoints

#### GET /tags
Get all tags

#### GET /tags/popular
Get popular tags

#### POST /tags/sync
Synchronize tags from questions

### Statistics Endpoints

#### GET /stats
Get comprehensive statistics

#### GET /stats/dashboard
Get dashboard statistics

#### GET /stats/trends
Get trend data

## 🔧 Development

### Available Scripts

#### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

#### Backend
```bash
npm run backend:dev      # Start backend in development mode
npm run backend:start    # Start backend in production mode
npm run backend:seed     # Seed database with sample data
```

#### Full Stack
```bash
npm run full:dev         # Start both frontend and backend
npm run full:install     # Install all dependencies
```

### Database Schema

#### Question Model
```javascript
{
  round: String,           // technical, hr, telephonic, etc.
  question: String,        // Question text (required)
  answer: String,          // Answer text (required)
  code: String,            // Optional code snippet
  tags: [String],          // Array of tags
  images: [ImageSchema],   // Array of base64 images
  favorite: Boolean,       // Favorite status
  review: Boolean,         // Review status
  hot: Boolean,            // Hot status
  difficulty: String,      // easy, medium, hard
  company: String,         // Company name
  position: String,        // Position title
  notes: String,           // Additional notes
  createdAt: Date,         // Auto-generated
  updatedAt: Date          // Auto-generated
}
```

#### Tag Model
```javascript
{
  name: String,            // Tag name (unique)
  count: Number,           // Usage count
  color: String,           // Display color
  category: String,        // Tag category
  description: String,     // Tag description
  isActive: Boolean        // Active status
}
```

### Adding New Features

1. **Frontend Components**
   - Create component in appropriate directory
   - Add to index.js if needed
   - Update routes if it's a page

2. **Backend Endpoints**
   - Add route in appropriate route file
   - Add validation middleware if needed
   - Update API documentation

3. **Database Models**
   - Define schema in models directory
   - Add indexes for performance
   - Update seed data if needed

## 🚀 Deployment

### Frontend (Netlify/Vercel)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder**

3. **Set environment variables**
   - `VITE_API_URL` - Your backend API URL

### Backend (Railway/Render/DigitalOcean)

1. **Set environment variables**
   ```env
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_uri
   CORS_ORIGIN=your_frontend_url
   ```

2. **Deploy with your preferred platform**

### Docker Deployment

1. **Create Dockerfile for frontend**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   EXPOSE 5173
   CMD ["npm", "run", "preview"]
   ```

2. **Create Dockerfile for backend**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY backend/package*.json ./
   RUN npm install
   COPY backend/ .
   EXPOSE 5000
   CMD ["npm", "start"]
   ```

3. **Use Docker Compose**
   ```yaml
   version: '3.8'
   services:
     frontend:
       build: .
       ports:
         - "5173:5173"
     backend:
       build:
         context: .
         dockerfile: backend/Dockerfile
       ports:
         - "5000:5000"
       environment:
         - MONGODB_URI=mongodb://mongo:27017/interview-assistant
     mongo:
       image: mongo:5
       ports:
         - "27017:27017"
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards

- Use ESLint configuration provided
- Follow conventional commit format
- Add JSDoc comments for functions
- Write tests for new features
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB team for the robust database
- Tailwind CSS for the utility-first CSS framework
- All contributors and testers

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](../../issues) page
2. Create a new issue if your problem isn't already documented
3. Provide detailed information about your environment and the issue

---

**Happy Coding! 🚀**
