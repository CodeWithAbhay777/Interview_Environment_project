
import React from 'react';

const AboutUs = () => {
  return (
    <section className="bg-white py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <div>
          <h2 className="text-4xl font-bold text-gray-800 mb-6">About Us</h2>
          <p className="text-gray-600 text-lg mb-4">
            We are on a mission to revolutionize job readiness with cutting-edge, AI-driven interview preparation.
            Our platform mimics real-world hiring scenarios so you can walk into interviews confident and prepared.
          </p>
          <ul className="mt-6 space-y-3 text-gray-700">
            <li>✔️ Trusted by thousands of candidates</li>
            <li>✔️ Built by hiring experts & engineers</li>
            <li>✔️ Continuously updated for latest trends</li>
          </ul>
        </div>

        {/* Image */}
        <div>
          <img
            src="https://plus.unsplash.com/premium_photo-1684769160411-ab16f414d1bc?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW50ZXJ2aWV3fGVufDB8fDB8fHww"
            alt="About us"
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutUs;