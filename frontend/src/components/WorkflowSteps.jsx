{/*import React from 'react';

const WorkflowSteps = () => {
  const steps = [
    "Sign in",
    "Apply for Job",
    "Join Scheduled Interview",
    "Answer Questions",
    "Get Evaluation Report",
  ];

  return (
    <section className="bg-gray-50 py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Step-by-Step Workflow</h2>
        <ol className="list-decimal list-inside text-left space-y-4 text-gray-700">
          {steps.map((step, index) => (
            <li key={index} className="text-lg">
              {step}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default WorkflowSteps;*/}

{/*import React from 'react';

const WorkflowSteps = () => {
  const steps = [
    "Sign in",
    "Apply for Job",
    "Join Scheduled Interview",
    "Answer Questions",
    "Get Evaluation Report",
  ];

  return (
    <section
      className="relative py-16 px-6 md:px-12 lg:px-24 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://www.ismartrecruit.com/upload/blog/main_image/Structured_Interviews.webp')`,
      }}
    >
      
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-12">Step-by-Step Workflow</h2>

        <div className="flex flex-col items-center relative">
          
          <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-violet-300 transform -translate-x-1/2 z-0"></div>

          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center relative z-10">
              
              <div className="w-10 h-10 rounded-full bg-white border-2 border-violet-500 flex items-center justify-center font-bold text-violet-600 text-sm shadow-md z-10">
                {index + 1}
              </div>

              
              <div className="bg-white border border-gray-200 shadow-md rounded-lg px-6 py-3 mt-2 mb-6 max-w-xs text-gray-700 text-sm">
                {step}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkflowSteps;*/}

{/*import React from 'react';

const WorkflowSteps = () => {
  const steps = [
    "Sign in",
    "Apply for Job",
    "Join Scheduled Interview",
    "Answer Questions",
    "Get Evaluation Report",
  ];

  return (
    <section className="bg-gray-50 py-16 px-4 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-12">Stage-wise Workflow</h2>

        <div className="relative flex justify-between items-center">
          
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 z-0"></div>

          {steps.map((step, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center w-1/5 min-w-[120px]"
              style={{ top: index % 2 === 0 ? "-40px" : "40px" }} // alternate position
            >
              
              <div
                className={`mb-2 text-sm text-gray-700 bg-white px-3 py-2 rounded shadow-md border border-gray-200 ${
                  index % 2 === 0 ? "mb-6" : "mt-6"
                }`}
              >
                {step}
              </div>

              
              <div className="w-10 h-10 rounded-full bg-white border-2 border-violet-500 flex items-center justify-center font-bold text-violet-600 text-sm shadow-md z-10">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkflowSteps;*/}


import React from 'react';

const WorkflowSteps = () => {
  const steps = [
    "Sign in",
    "Apply for Job",
    "Join Scheduled Interview",
    "Answer Questions",
    "Get Evaluation Report",
  ];

  return (
    <section
      className="bg-cover bg-center bg-no-repeat py-12 px-4"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=1350&q=80')`, // Replace with your image
      }}
    >
      <div className="max-w-3xl mx-auto relative bg-white/90 rounded-lg p-6 sm:p-10 shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
          Interview Process
        </h2>

        {/* Central vertical line — only spans the content */}
        <div className="absolute left-1/2 top-20 bottom-10 w-1 bg-violet-300 transform -translate-x-1/2 z-0" />

        <div className="flex flex-col space-y-12 relative z-10">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex w-full ${
                index % 2 === 0 ? "justify-start" : "justify-end"
              }`}
            >
              <div className="w-1/2 px-2">
                <div
                  className={`relative bg-white border-l-4 border-violet-500 shadow-md rounded-lg px-4 py-3 ${
                    index % 2 === 0 ? "ml-auto text-left" : "mr-auto text-right"
                  }`}
                >
                  {/* Step number circle */}
                  <div
                    className={`absolute top-1/2 w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center text-sm font-bold shadow transform -translate-y-1/2 ${
                      index % 2 === 0 ? "-right-5" : "-left-5"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <p className="text-gray-800 font-medium">{step}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkflowSteps;