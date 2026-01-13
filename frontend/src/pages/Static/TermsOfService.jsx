import React from "react";

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Terms of Service
      </h1>

      <div className="prose dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            By accessing and using QuizSpark, you accept and agree to be bound
            by the terms and provision of this agreement. If you do not agree to
            abide by the above, please do not use this service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            2. Description of Service
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            QuizSpark provides an online platform for users to participate in
            educational quizzes, track their progress, and compete with other
            users. We reserve the right to modify or discontinue any aspect of
            the service at any time.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            3. User Accounts
          </h2>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              To access certain features of the service, you must register for
              an account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>
                Accept responsibility for all activities that occur under your
                account
              </li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            4. User Conduct
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            You agree not to:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300">
            <li>Use the service for any illegal purpose</li>
            <li>
              Attempt to gain unauthorized access to any part of the service
            </li>
            <li>Interfere with or disrupt the service</li>
            <li>Share answers or cheat during quizzes</li>
            <li>Create multiple accounts for unfair advantages</li>
            <li>Harass, abuse, or harm other users</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            5. Intellectual Property
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            All content, features, and functionality of QuizSpark, including but
            not limited to text, graphics, logos, and quiz content, are owned by
            QuizSpark and are protected by copyright, trademark, and other
            intellectual property laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            6. Limitation of Liability
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            QuizSpark shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages arising out of or relating to
            your use of the service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            7. Changes to Terms
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            We reserve the right to modify these terms at any time. We will
            notify users of any material changes by posting the new terms on the
            site. Your continued use of the service after such modifications
            constitutes your acceptance of the modified terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            8. Contact Information
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            If you have any questions about these Terms, please contact us at:
            <br />
            Email: terms@quizspark.com
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;
