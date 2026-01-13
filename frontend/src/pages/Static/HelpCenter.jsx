import React from "react";

const HelpCenter = () => {
  const faqs = [
    {
      question: "How do I start a quiz?",
      answer:
        'To start a quiz, navigate to the Categories page, select your preferred category, and click on "Start Quiz". Make sure you\'re logged in to save your progress.',
    },
    {
      question: "How is my score calculated?",
      answer:
        "Your score is calculated based on correct answers and completion time. Each correct answer adds points, and finishing quickly can earn you bonus points.",
    },
    {
      question: "Can I review my past quizzes?",
      answer:
        "Yes! Visit the Quiz History section to see all your past attempts, scores, and review the questions and answers.",
    },
    {
      question: "How does the leaderboard work?",
      answer:
        "The leaderboard ranks users based on their total points earned from quizzes. It's updated in real-time and shows the top performers.",
    },
    {
      question: "Can I change my profile information?",
      answer:
        "Yes, you can update your profile information including name, avatar, and password in the Profile section.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Help Center
      </h1>

      <div className="space-y-8">
        {/* Search Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            How can we help you?
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search for help..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              Search
            </button>
          </div>
        </div>

        {/* Popular Topics */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Popular Topics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "Getting Started",
              "Account Settings",
              "Quiz Taking",
              "Scoring System",
              "Technical Issues",
              "Privacy & Security",
            ].map((topic) => (
              <div
                key={topic}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
              >
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  {topic}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Still Need Help */}
        <section className="text-center bg-primary-50 dark:bg-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Still Need Help?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Can't find what you're looking for? Contact our support team.
          </p>
          <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            Contact Support
          </button>
        </section>
      </div>
    </div>
  );
};

export default HelpCenter;
