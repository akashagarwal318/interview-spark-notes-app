import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from '../models/Question.js';
import Tag from '../models/Tag.js';

// Load environment variables
dotenv.config();

// Sample data for initial seeding
const sampleQuestions = [
  {
    round: 'technical',
    question: 'What is the difference between let, const, and var in JavaScript?',
    answer: 'let and const were introduced in ES6. var has function scope while let and const have block scope. const cannot be reassigned after declaration. let can be reassigned but not redeclared in the same scope. var can be both reassigned and redeclared.',
    code: `// var example
var x = 1;
if (true) {
  var x = 2; // Same variable
  console.log(x); // 2
}
console.log(x); // 2

// let example
let y = 1;
if (true) {
  let y = 2; // Different variable
  console.log(y); // 2
}
console.log(y); // 1

// const example
const z = 1;
// z = 2; // TypeError: Assignment to constant variable`,
    tags: ['javascript', 'variables', 'es6', 'scope'],
    difficulty: 'medium',
    favorite: true,
    review: false,
    hot: true
  },
  {
    round: 'technical',
    question: 'Explain the concept of closures in JavaScript',
    answer: 'A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned. Closures are created every time a function is created. They are useful for data privacy, function factories, and maintaining state.',
    code: `function outerFunction(x) {
  // This is the outer function's scope
  
  function innerFunction(y) {
    // This inner function has access to x
    console.log(x + y);
  }
  
  return innerFunction;
}

const closure = outerFunction(10);
closure(5); // Outputs: 15`,
    tags: ['javascript', 'closures', 'scope', 'functions'],
    difficulty: 'hard',
    favorite: false,
    review: true,
    hot: false
  },
  {
    round: 'hr',
    question: 'Tell me about yourself',
    answer: 'This is an opportunity to give a brief professional summary. Focus on your relevant experience, key skills, and what you can bring to the role. Keep it concise and professional, typically 1-2 minutes.',
    tags: ['hr', 'introduction', 'personal'],
    difficulty: 'easy',
    company: 'General',
    position: 'Software Developer',
    favorite: false,
    review: false,
    hot: false
  },
  {
    round: 'system-design',
    question: 'Design a URL shortening service like bit.ly',
    answer: 'Key components: 1) URL encoding service to generate short URLs, 2) Database to store URL mappings, 3) Cache layer for frequently accessed URLs, 4) Load balancers for high availability, 5) Analytics service for tracking clicks. Consider scalability, availability, and consistency requirements.',
    tags: ['system-design', 'scalability', 'database', 'caching'],
    difficulty: 'hard',
    favorite: true,
    review: true,
    hot: true
  },
  {
    round: 'coding',
    question: 'Implement a function to reverse a string',
    answer: 'There are multiple approaches: using built-in methods, iterative approach, or recursive approach. The built-in method is simplest but understanding the iterative approach shows algorithmic thinking.',
    code: `// Method 1: Built-in methods
function reverseString1(str) {
  return str.split('').reverse().join('');
}

// Method 2: Iterative approach
function reverseString2(str) {
  let reversed = '';
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
}

// Method 3: Recursive approach
function reverseString3(str) {
  if (str === '') return '';
  return reverseString3(str.substr(1)) + str.charAt(0);
}`,
    tags: ['coding', 'algorithms', 'strings', 'recursion'],
    difficulty: 'easy',
    favorite: false,
    review: false,
    hot: false
  }
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/interview-assistant');
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data
    await Question.deleteMany({});
    await Tag.deleteMany({});
    console.log('🗑️  Cleared existing data');
    
    // Insert sample questions
    const questions = await Question.insertMany(sampleQuestions);
    console.log(`✅ Inserted ${questions.length} sample questions`);
    
    // Create tags from questions
    const allTags = new Set();
    questions.forEach(question => {
      question.tags.forEach(tag => allTags.add(tag));
    });
    
    const tagDocuments = Array.from(allTags).map(tagName => {
      const count = questions.filter(q => q.tags.includes(tagName)).length;
      return {
        name: tagName,
        count,
        category: getCategoryForTag(tagName)
      };
    });
    
    await Tag.insertMany(tagDocuments);
    console.log(`✅ Created ${tagDocuments.length} tags`);
    
    // Display summary
    const stats = {
      totalQuestions: await Question.countDocuments(),
      favorites: await Question.countDocuments({ favorite: true }),
      reviews: await Question.countDocuments({ review: true }),
      hot: await Question.countDocuments({ hot: true }),
      totalTags: await Tag.countDocuments()
    };
    
    console.log('\n📊 Seeding Summary:');
    console.log(`   Total Questions: ${stats.totalQuestions}`);
    console.log(`   Favorites: ${stats.favorites}`);
    console.log(`   Reviews: ${stats.reviews}`);
    console.log(`   Hot: ${stats.hot}`);
    console.log(`   Total Tags: ${stats.totalTags}`);
    
    console.log('\n🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

const getCategoryForTag = (tagName) => {
  const categories = {
    technology: ['javascript', 'react', 'node', 'mongodb', 'sql', 'python', 'java'],
    concept: ['closures', 'scope', 'variables', 'algorithms', 'data-structures'],
    framework: ['react', 'angular', 'vue', 'express', 'spring'],
    language: ['javascript', 'python', 'java', 'c++', 'go'],
    tool: ['git', 'docker', 'kubernetes', 'aws', 'linux'],
    skill: ['problem-solving', 'debugging', 'testing', 'optimization']
  };
  
  for (const [category, tags] of Object.entries(categories)) {
    if (tags.includes(tagName.toLowerCase())) {
      return category;
    }
  }
  return 'other';
};

// Function to migrate localStorage data (can be called separately)
export const migrateLocalStorageData = async (localStorageData) => {
  try {
    console.log('🔄 Starting localStorage data migration...');
    
    if (!Array.isArray(localStorageData)) {
      throw new Error('Invalid data format. Expected an array of questions.');
    }
    
    let migrated = 0;
    let skipped = 0;
    
    for (const item of localStorageData) {
      try {
        // Check if question already exists
        const existing = await Question.findOne({ 
          question: item.question,
          answer: item.answer 
        });
        
        if (existing) {
          skipped++;
          continue;
        }
        
        // Transform the data to match our schema
        const questionData = {
          round: item.round || 'technical',
          question: item.question,
          answer: item.answer,
          code: item.code || '',
          tags: item.tags || [],
          images: item.images || [],
          favorite: item.favorite || false,
          review: item.review || false,
          hot: item.hot || false,
          difficulty: item.difficulty || 'medium',
          company: item.company || '',
          position: item.position || '',
          notes: item.notes || ''
        };
        
        const question = new Question(questionData);
        await question.save();
        migrated++;
        
      } catch (itemError) {
        console.error(`Error migrating item:`, itemError);
        skipped++;
      }
    }
    
    // Update tag counts
    const allTags = await Question.distinct('tags');
    for (const tagName of allTags) {
      if (!tagName) continue;
      
      const count = await Question.countDocuments({ tags: tagName });
      await Tag.findOneAndUpdate(
        { name: tagName },
        { 
          $set: { count },
          $setOnInsert: { 
            name: tagName,
            category: getCategoryForTag(tagName)
          }
        },
        { upsert: true }
      );
    }
    
    console.log(`✅ Migration completed: ${migrated} migrated, ${skipped} skipped`);
    return { migrated, skipped };
    
  } catch (error) {
    console.error('❌ Error migrating localStorage data:', error);
    throw error;
  }
};

// Main execution
const main = async () => {
  try {
    await connectDB();
    await seedDatabase();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default { seedDatabase, migrateLocalStorageData };
