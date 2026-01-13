import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Privacy Policy
      </h1>

      <div className="prose dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Introduction
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            At QuizSpark, we take your privacy seriously. This Privacy Policy
            explains how we collect, use, disclose, and safeguard your
            information when you use our service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Information We Collect
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">
                Personal Information
              </h3>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300">
                <li>Name and email address when you create an account</li>
                <li>Profile information you choose to provide</li>
                <li>Quiz results and performance data</li>
                <li>Communications between you and QuizSpark</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">
                Usage Information
              </h3>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300">
                <li>Log data and device information</li>
                <li>Quiz participation and interaction data</li>
                <li>Performance statistics and analytics</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300">
            <li>To provide and maintain our service</li>
            <li>To personalize your experience</li>
            <li>To improve our platform</li>
            <li>To communicate with you</li>
            <li>To ensure fair play and prevent cheating</li>
            <li>To maintain leaderboards and track progress</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Data Security
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            We implement appropriate security measures to protect your personal
            information. However, no method of transmission over the Internet is
            100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Your Rights
          </h2>
          <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300">
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to data processing</li>
            <li>Data portability</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Contact Us
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            If you have any questions about this Privacy Policy, please contact
            us at:
            <br />
            Email: privacy@quizspark.com
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Updates to This Policy
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the "effective date" at the top.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
