{/*import React from 'react';

const PlatformOverview = () => {
  return (
    <section className="bg-white py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Platform Overview</h2>
        <p className="text-gray-600 mb-8">
          Our AI-driven interview simulation platform bridges the gap between practice and performance.
        </p>

        <ul className="space-y-4 text-left max-w-md mx-auto">
          <li className="flex items-start gap-3">
            <span className="text-green-500 text-xl">✔️</span>
            <p className="text-gray-700">Real-Time Feedback</p>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-500 text-xl">✔️</span>
            <p className="text-gray-700">AI + Human Evaluation</p>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-500 text-xl">✔️</span>
            <p className="text-gray-700">Plagiarism Check</p>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default PlatformOverview;*/}

import React from 'react';
import { CheckCircle } from 'lucide-react'; // Or use any icon library you prefer

const features = [
  {
    title: 'Real-Time Feedback',
    description: 'Receive instant, actionable feedback on your answers to improve on the spot.',
  },
  {
    title: 'AI + Human Evaluation',
    description: 'Your performance is assessed by both intelligent algorithms and expert reviewers for balanced insights.',
  },
  {
    title: 'Plagiarism Detection',
    description: 'Ensure originality with built-in plagiarism checks on your answers.',
  },
  {
    title: 'Role-Based Questions',
    description: 'Simulations are tailored for your job role — from tech to marketing and beyond.',
  },
  {
    title: 'Performance Reports',
    description: 'Download detailed evaluation reports to track progress over time.',
  },
];

const PlatformOverview = () => {
  return (
    <section className="bg-gradient-to-b from-white via-violet-50 to-white py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Platform Overview</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Our AI-driven interview simulation platform bridges the gap between practice and performance by offering
            intelligent, human-like evaluations and tools to track your growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition"
            >
              <CheckCircle className="text-violet-500 w-6 h-6 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformOverview;