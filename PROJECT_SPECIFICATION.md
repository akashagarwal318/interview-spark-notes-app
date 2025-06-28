
# Interview Assistant - Complete Project Specification

## Project Overview
A comprehensive React-based interview preparation application that allows users to manage interview questions across different rounds, with advanced filtering, search, and organization features.

## Core Technologies
- **Frontend Framework**: React 18 with JavaScript (NO TypeScript)
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI (MUI) v5
- **Build Tool**: Vite
- **Styling**: Material-UI theme system with light/dark mode
- **Icons**: Material-UI Icons
- **Storage**: localStorage for persistence

## Project Structure
```
src/
├── components/
│   ├── layout/
│   │   └── Header.js
│   ├── stats/
│   │   └── QuickStats.js
│   ├── filters/
│   │   └── SearchFilters.js
│   ├── forms/
│   │   └── QuestionForm.js
│   ├── questions/
│   │   └── QuestionCard.js
│   ├── modals/
│   │   └── ImageModal.js
│   ├── pagination/
│   │   └── PaginationControls.js
│   └── ui/ (shadcn components - optional)
├── pages/
│   └── InterviewAssistant.js
├── store/
│   ├── index.js
│   └── slices/
│       ├── questionsSlice.js
│       └── uiSlice.js
├── theme/
│   └── theme.js
├── hooks/
│   ├── useDebounce.js
│   └── useLocalStorage.js
├── App.js
├── main.js
└── index.css
```

## Features Specification

### 1. Header Component (src/components/layout/Header.js)
- **Title**: "🚀 Interview Assistant" with responsive typography
- **Buttons**:
  - "Add New Question" button with EditIcon
  - "All Questions" button to reset filters with ViewListIcon
  - Theme toggle button (light/dark mode) with appropriate icons
- **Responsive Design**: Flexbox layout with proper wrapping for mobile
- **Actions**: Dispatches setFormVisible, resetFilters, toggleTheme

### 2. Quick Stats Component (src/components/stats/QuickStats.js)
- **Stats Display**: 4 cards in a responsive grid
  - Total Questions count
  - ⭐ Favorites count
  - 📌 Review count  
  - 🔥 Hot List count
- **Styling**: Material-UI Cards with color-coded numbers
- **Data Source**: Redux state questions.items with filtering

### 3. Search & Filters Component (src/components/filters/SearchFilters.js)
- **Search Bar**: Full-text search across questions, answers, and tags
- **Round Filter**: Dropdown with options:
  - All Rounds
  - Technical Round
  - HR Round
  - Telephonic Round
  - Introduction Round
  - Behavioral Round
  - System Design Round
  - Coding Round
- **Sort Options**:
  - Newest First
  - Oldest First
  - Alphabetical
- **Quick Filters**: Toggle buttons for Favorites, Review, Hot
- **Layout**: Responsive grid with proper spacing

### 4. Question Form Component (src/components/forms/QuestionForm.js)
- **Visibility**: Controlled by Redux state ui.isFormVisible
- **Fields**:
  - Round selection (dropdown with all round types)
  - Question text (required, multiline)
  - Answer text (required, multiline with 6 rows)
  - Code snippet (optional, multiline with 8 rows, monospace font)
  - Tags (comma-separated input)
  - Image upload (multiple files, file input)
- **Actions**: Submit (validates required fields), Cancel
- **Image Processing**: Converts files to base64 for storage
- **Form Reset**: Clears all fields after submit/cancel

### 5. Question Card Component (src/components/questions/QuestionCard.js)
- **Header**: Round chip (color-coded) and creation date
- **Content**: Question title, expandable answer section
- **Code Display**: Syntax-highlighted code blocks when present
- **Image Gallery**: Thumbnail images that open in modal when clicked
- **Tags**: Chip display of all tags
- **Actions**:
  - Favorite toggle (star icon)
  - Review toggle (bookmark icon)
  - Hot toggle (fire icon)
  - Delete button with confirmation
  - Expand/collapse for full content
- **Styling**: Material-UI Card with borders and proper spacing

### 6. Image Modal Component (src/components/modals/ImageModal.js)
- **Full-screen overlay**: Dark background with centered image
- **Close functionality**: Close button and click-outside-to-close
- **Responsive**: Max 90% viewport width/height
- **Controls**: Close icon button positioned absolutely

### 7. Pagination Controls Component (src/components/pagination/PaginationControls.js)
- **Per Page Selection**: Dropdown with options: 5, 10, 15, 20, 25, 50
- **Page Navigation**: Material-UI Pagination with first/last buttons
- **Results Counter**: "Showing X-Y of Z questions" text
- **Auto-scroll**: Scrolls to top when page changes
- **Conditional Rendering**: Hides when no results

### 8. Redux Store Structure

#### Questions Slice (src/store/slices/questionsSlice.js)
**State**:
```javascript
{
  items: [], // All questions
  filteredItems: [], // Filtered/sorted questions
  loading: false,
  currentRound: 'all',
  searchTerm: '',
  currentPage: 1,
  questionsPerPage: 10,
  sortBy: 'newest',
  filters: {
    favorite: false,
    review: false,
    hot: false
  }
}
```

**Actions**:
- `loadQuestions`: Loads from localStorage
- `saveQuestions`: Saves to localStorage
- `addQuestion`: Adds new question with generated ID and timestamp
- `updateQuestion`: Updates existing question by ID
- `deleteQuestion`: Removes question by ID
- `setCurrentRound`: Changes round filter
- `setSearchTerm`: Updates search term
- `setCurrentPage`: Changes current page
- `setQuestionsPerPage`: Changes items per page
- `setSortBy`: Changes sort order
- `setFilters`: Updates filter toggles
- `applyFilters`: Complex filtering logic combining all filters

#### UI Slice (src/store/slices/uiSlice.js)
**State**:
```javascript
{
  theme: 'light',
  isFormVisible: false,
  imageModal: {
    isOpen: false,
    imageSrc: ''
  }
}
```

**Actions**:
- `setTheme`: Sets theme and saves to localStorage
- `toggleTheme`: Switches between light/dark
- `setFormVisible`: Shows/hides question form
- `setImageModal`: Controls image modal state
- `resetFilters`: Resets all filters (handled by questionsSlice)

### 9. Question Data Structure
```javascript
{
  id: "timestamp_string",
  round: "technical|hr|telephonic|introduction|behavioral|system-design|coding",
  question: "Question text",
  answer: "Answer text",
  code: "Optional code snippet",
  tags: ["tag1", "tag2"],
  images: [
    {
      name: "filename.jpg",
      data: "data:image/jpeg;base64,...",
      size: 12345
    }
  ],
  createdAt: "2024-01-01T00:00:00.000Z",
  favorite: false,
  review: false,
  hot: false
}
```

### 10. Theme Configuration (src/theme/theme.js)
- **Light Theme**: Primary blue (#1976d2), Secondary pink (#dc004e)
- **Dark Theme**: Primary light blue (#90caf9), Secondary light pink (#f48fb1)
- **Auto-switching**: Based on user preference stored in localStorage

### 11. Persistence Strategy
- **Questions**: Stored in localStorage key 'interviewQuestions'
- **Theme**: Stored in localStorage key 'interviewAssistantTheme'
- **Auto-save**: Questions auto-save on every change
- **Load on startup**: Automatically loads saved data on app initialization

### 12. Responsive Design Requirements
- **Mobile First**: All components must work on mobile devices
- **Breakpoints**: Uses Material-UI responsive grid system
- **Header**: Responsive button layout with wrapping
- **Stats**: 2 columns on mobile, 4 on desktop
- **Filters**: Stacked on mobile, horizontal on desktop
- **Cards**: Full width with proper spacing
- **Form**: Full width inputs with proper mobile keyboard support

### 13. User Experience Features
- **Debounced Search**: Search input has built-in debouncing
- **Smooth Animations**: Material-UI transitions for all interactions
- **Loading States**: Loading indicator during data operations
- **Empty States**: Friendly messages when no data found
- **Confirmation Dialogs**: Delete confirmations to prevent accidents
- **Auto-scroll**: Page navigation scrolls to top
- **Keyboard Support**: Full keyboard navigation support

### 14. Error Handling
- **Try-catch blocks**: Around localStorage operations
- **Graceful degradation**: App works without localStorage
- **User feedback**: Alert messages for validation errors
- **Console logging**: Error logging for debugging

### 15. Performance Optimizations
- **Memoization**: Components use React.memo where appropriate
- **Efficient filtering**: Single filter function handles all criteria
- **Image optimization**: Base64 storage with size tracking
- **Pagination**: Only renders visible items
- **Debounced inputs**: Prevents excessive re-renders

## Installation & Setup
```bash
npm install
npm run dev
```

## Dependencies
```json
{
  "@reduxjs/toolkit": "latest",
  "react-redux": "latest",
  "@mui/material": "latest",
  "@mui/icons-material": "latest",
  "@emotion/react": "latest",
  "@emotion/styled": "latest",
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "react-router-dom": "latest"
}
```

## File Extensions
- **ALL FILES MUST BE .js or .jsx** - NO TypeScript files (.ts/.tsx)
- **NO type definitions** - Pure JavaScript implementation
- **NO TypeScript configurations** - Standard JavaScript project setup

This specification ensures 100% reproducibility of the Interview Assistant application with all features, styling, and functionality intact.
