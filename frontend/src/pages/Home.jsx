import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { 
  Play, 
  Trophy, 
  Users, 
  BookOpen, 
  Star, 
  ArrowRight,
  CheckCircle,
  Zap,
  Target,
  Award
} from 'lucide-react'

const Home = () => {
  const { user } = useSelector((state) => state.auth)

  const features = [
    {
      icon: BookOpen,
      title: 'Multiple Categories',
      description: 'Choose from various quiz categories including Science, History, Sports, and more.'
    },
    {
      icon: Trophy,
      title: 'Leaderboards',
      description: 'Compete with other players and climb the global and category-specific leaderboards.'
    },
    {
      icon: Target,
      title: 'Progress Tracking',
      description: 'Track your performance, view detailed analytics, and monitor your improvement.'
    },
    {
      icon: Award,
      title: 'Achievements',
      description: 'Earn badges and achievements as you complete quizzes and reach milestones.'
    },
    {
      icon: Zap,
      title: 'Real-time Results',
      description: 'Get instant feedback on your answers with detailed explanations.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Join a community of learners and challenge yourself with others.'
    }
  ]

  const stats = [
    { label: 'Active Users', value: '10,000+', icon: Users },
    { label: 'Quiz Categories', value: '25+', icon: BookOpen },
    { label: 'Questions Available', value: '5,000+', icon: Target },
    { label: 'Quizzes Completed', value: '50,000+', icon: Trophy }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-purple-700 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Welcome to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                QuizSpark
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 animate-slide-up">
              Test your knowledge, compete with others, and spark your learning journey
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
              {user ? (
                <Link
                  to="/dashboard"
                  className="btn btn-lg bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start Playing
                </Link>
              ) : (
                <>
                  <Link
                    to="/auth/register"
                    className="btn btn-lg bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    Get Started Free
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                  <Link
                    to="/categories"
                    className="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 text-lg font-semibold"
                  >
                    Browse Categories
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-xl"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg mb-4">
                  <stat.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose QuizSpark?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover what makes our quiz platform the perfect choice for learners and competitors alike
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="card card-hover p-6 text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-200">
                  <feature.icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get started with QuizSpark in just a few simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-full text-2xl font-bold mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Choose a Category
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Browse through our extensive collection of quiz categories and pick your favorite topic.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-full text-2xl font-bold mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Take the Quiz
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Answer questions at your own pace with our intuitive interface and real-time feedback.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-full text-2xl font-bold mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Track Progress
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                View your results, track your improvement, and compete on the leaderboards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Test Your Knowledge?
          </h2>
          <p className="text-xl mb-8 text-gray-100 max-w-2xl mx-auto">
            Join thousands of learners who are already improving their knowledge with QuizSpark
          </p>
          
          {user ? (
            <Link
              to="/categories"
              className="btn btn-lg bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Play className="h-5 w-5 mr-2" />
              Start a Quiz Now
            </Link>
          ) : (
            <Link
              to="/auth/register"
              className="btn btn-lg bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Join QuizSpark Today
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home