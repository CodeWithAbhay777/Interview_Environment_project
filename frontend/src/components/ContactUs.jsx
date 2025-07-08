

import React, { useState } from 'react';

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can integrate this with email service or backend API
    alert("Thank you for contacting us!");
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section className="bg-violet-50 py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Contact Info */}
        <div>
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Contact Us</h2>
          <p className="text-gray-700 mb-4">
            Got a question or feedback? Reach out and we’ll get back to you shortly.
          </p>
          <div className="text-gray-600">
            <p className="mb-2">📧 Email: support@jobifyai.com</p>
            <p className="mb-2">📞 Phone: (+91) 84675 42169</p>
            {/*<p>📍 Location: Remote First, Global Impact 🌍</p>*/}
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-violet-400"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-violet-400"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows="4"
            required
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-violet-400"
          ></textarea>
          <button
            type="submit"
            className="bg-[#6A38C2] text-white px-6 py-3 rounded-md hover:bg-[#582ea5] transition-all"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactUs;