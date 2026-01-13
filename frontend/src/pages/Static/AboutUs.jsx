import React from "react";

const AboutUs = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        About QuizSpark
      </h1>

      <div className="prose dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            QuizSpark is dedicated to making learning engaging and accessible
            through interactive quizzes. We believe that knowledge becomes more
            meaningful when it's challenged and tested in an interactive
            environment.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            What We Offer
          </h2>
          <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300">
            <li>
              Diverse range of quiz categories to test and expand your knowledge
            </li>
            <li>Interactive learning experience with immediate feedback</li>
            <li>Progress tracking and performance analytics</li>
            <li>Competitive leaderboard system</li>
            <li>User-friendly interface for seamless quiz-taking experience</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Our Values
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">
                Education First
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We prioritize educational value in every quiz we create and
                feature on our platform.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">
                Accessibility
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We strive to make learning accessible to everyone, anywhere, at
                any time.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">
                Innovation
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We continuously improve our platform to provide the best
                learning experience.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">
                Community
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We foster a supportive community of learners and knowledge
                enthusiasts.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
