import React, { useState } from 'react';

const JobApplicationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    resume: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Replace this with backend integration
    alert("Application submitted successfully!");
    setFormData({ name: '', email: '', resume: '', message: '' });
  };

  return (
    <section className="py-20 px-6 md:px-12 lg:px-24 bg-white min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Job Application</h2>
        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 p-8 rounded-lg shadow-md">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-violet-400 outline-none"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-violet-400 outline-none"
          />
          <input
            type="file"
            name="resume"
            accept=".pdf,.doc,.docx"
            required
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md bg-white"
          />
          <textarea
            name="message"
            placeholder="Cover Letter / Message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-violet-400 outline-none"
          />
          <button
            type="submit"
            className="bg-[#6A38C2] text-white px-6 py-3 rounded-md hover:bg-[#582ea5] transition-all"
          >
            Submit Application
          </button>
        </form>
      </div>
    </section>
  );
};

export default JobApplicationForm;