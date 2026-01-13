const mongoose = require('mongoose');
const User = require('../src/models/User');
const Category = require('../src/models/Category');
const Question = require('../src/models/Question');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas successfully!');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      console.log('Admin credentials:');
      console.log('Email:', process.env.ADMIN_EMAIL);
      console.log('Password:', process.env.ADMIN_PASSWORD);
      return;
    }
    
    // Create admin user using .env credentials
    const adminUser = await User.create({
      username: 'admin',
      email: process.env.ADMIN_EMAIL || 'admin@quizspark.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('Email:', adminUser.email);
    console.log('Password:', process.env.ADMIN_PASSWORD);
    console.log('Role:', adminUser.role);
    
    // Check if categories already exist
    const existingCategories = await Category.find();
    if (existingCategories.length > 0) {
      console.log('Categories already exist:', existingCategories.length);
    } else {
      // Create sample categories
      const categories = await Category.insertMany([
        {
          name: 'Science',
          slug: 'science',
          description: 'Physics, Chemistry, Biology, and more scientific topics',
          color: '#3B82F6',
          icon: '🔬',
          isActive: true,
          stats: {
            totalQuestions: 0,
            totalQuizzes: 0
          }
        },
        {
          name: 'History',
          slug: 'history',
          description: 'World history, ancient civilizations, and historical events',
          color: '#10B981',
          icon: '📚',
          isActive: true,
          stats: {
            totalQuestions: 0,
            totalQuizzes: 0
          }
        },
        {
          name: 'Technology',
          slug: 'technology',
          description: 'Programming, gadgets, innovations, and tech history',
          color: '#8B5CF6',
          icon: '💻',
          isActive: true,
          stats: {
            totalQuestions: 0,
            totalQuizzes: 0
          }
        },
        {
          name: 'Sports',
          slug: 'sports',
          description: 'Sports trivia, rules, records, and famous athletes',
          color: '#F59E0B',
          icon: '⚽',
          isActive: true,
          stats: {
            totalQuestions: 0,
            totalQuizzes: 0
          }
        },
        {
          name: 'Geography',
          slug: 'geography',
          description: 'Countries, capitals, landmarks, and natural wonders',
          color: '#EF4444',
          icon: '🌍',
          isActive: true,
          stats: {
            totalQuestions: 0,
            totalQuizzes: 0
          }
        }
      ]);
      
      console.log('✅ Categories created:', categories.length);
      
      // Create sample questions
      const questions = await Question.insertMany([
        {
          question: 'What is the chemical symbol for gold?',
          options: [
            { text: 'Go', isCorrect: false },
            { text: 'Au', isCorrect: true },
            { text: 'Ag', isCorrect: false },
            { text: 'Gd', isCorrect: false }
          ],
          category: categories[0]._id, // Science
          difficulty: 'easy',
          points: 10,
          type: 'multiple-choice',
          explanation: 'Au comes from the Latin word "aurum" meaning gold.',
          createdBy: adminUser._id,
          isActive: true,
          stats: {
            timesAnswered: 0,
            timesCorrect: 0
          }
        },
        {
          question: 'Who was the first person to walk on the moon?',
          options: [
            { text: 'Buzz Aldrin', isCorrect: false },
            { text: 'Neil Armstrong', isCorrect: true },
            { text: 'John Glenn', isCorrect: false },
            { text: 'Alan Shepard', isCorrect: false }
          ],
          category: categories[1]._id, // History
          difficulty: 'medium',
          points: 15,
          type: 'multiple-choice',
          explanation: 'Neil Armstrong was the first person to walk on the moon on July 20, 1969.',
          createdBy: adminUser._id,
          isActive: true,
          stats: {
            timesAnswered: 0,
            timesCorrect: 0
          }
        },
        {
          question: 'Which programming language is known as the "language of the web"?',
          options: [
            { text: 'Python', isCorrect: false },
            { text: 'Java', isCorrect: false },
            { text: 'JavaScript', isCorrect: true },
            { text: 'C++', isCorrect: false }
          ],
          category: categories[2]._id, // Technology
          difficulty: 'easy',
          points: 10,
          type: 'multiple-choice',
          explanation: 'JavaScript is widely known as the language of the web for client-side scripting.',
          createdBy: adminUser._id,
          isActive: true,
          stats: {
            timesAnswered: 0,
            timesCorrect: 0
          }
        },
        {
          question: 'In which sport would you perform a slam dunk?',
          options: [
            { text: 'Football', isCorrect: false },
            { text: 'Basketball', isCorrect: true },
            { text: 'Tennis', isCorrect: false },
            { text: 'Baseball', isCorrect: false }
          ],
          category: categories[3]._id, // Sports
          difficulty: 'easy',
          points: 10,
          type: 'multiple-choice',
          explanation: 'A slam dunk is a basketball shot where the player jumps and scores by putting the ball directly through the basket.',
          createdBy: adminUser._id,
          isActive: true,
          stats: {
            timesAnswered: 0,
            timesCorrect: 0
          }
        },
        {
          question: 'What is the capital of Australia?',
          options: [
            { text: 'Sydney', isCorrect: false },
            { text: 'Melbourne', isCorrect: false },
            { text: 'Canberra', isCorrect: true },
            { text: 'Perth', isCorrect: false }
          ],
          category: categories[4]._id, // Geography
          difficulty: 'medium',
          points: 15,
          type: 'multiple-choice',
          explanation: 'Canberra is the capital city of Australia, not Sydney or Melbourne as many people think.',
          createdBy: adminUser._id,
          isActive: true,
          stats: {
            timesAnswered: 0,
            timesCorrect: 0
          }
        }
      ]);
      
      console.log('✅ Sample questions created:', questions.length);
      
      // Update category stats
      for (let category of categories) {
        const questionCount = questions.filter(q => q.category.toString() === category._id.toString()).length;
        await Category.findByIdAndUpdate(category._id, {
          'stats.totalQuestions': questionCount
        });
      }
      
      console.log('✅ Category stats updated');
    }
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Admin Login Credentials:');
    console.log('Email:', process.env.ADMIN_EMAIL);
    console.log('Password:', process.env.ADMIN_PASSWORD);
    console.log('\n🚀 You can now login at: http://localhost:5173/auth/login');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

// Handle process termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

seedAdmin();