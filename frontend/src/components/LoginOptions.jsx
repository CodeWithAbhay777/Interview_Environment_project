

import React from 'react';

const LoginOptions = () => {
  const roles = [
    {
      title: "Organization Login",
      desc: "Access admin dashboard, manage users, jobs, instructors.",
    },
    {
      title: "User Login",
      desc: "Apply for jobs, join interviews, view reports.",
    },
    {
      title: "Interviewer Login",
      desc: "See scheduled interviews, join sessions, submit evaluations.",
    },
  ];

  return (
    <section className="bg-white py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-10">Login Option Cards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {roles.map((role, index) => (
            <div
              key={index}
              className="bg-violet-50 border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold text-gray-700 mb-2">{role.title}</h3>
              <p className="text-gray-600">{role.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LoginOptions;