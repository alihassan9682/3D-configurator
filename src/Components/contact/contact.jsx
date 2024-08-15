/** @format */

import React from "react";
import CalendlyEmbed from "./calendly";
import ContactForm from "./contactForm";

const App = () => {
  return (
    <div className="flex flex-col bg-gray-100 py-8">
      <h1 className="text-5xl font-bold mb-8 text-center text-[#4a4a4a] mt-6">
        Let's BlenSpark assist you!
      </h1>
      <div className="flex justify-center mb-8">
        <ContactForm />
      </div>
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center my-8 w-full max-w-2xl">
          <span className="border-b border-gray-300 w-1/5 lg:w-1/2"></span>
          <span className="text-gray-500 mx-4">or</span>
          <span className="border-b border-gray-300 w-1/5 lg:w-1/2"></span>
        </div>
        <h2 className="text-4xl font-bold mb-4 text-center text-[#4a4a4a]">
          Schedule a Meeting
        </h2>
        <div className="w-full  overflow-x-hidden">
          <CalendlyEmbed />
        </div>
      </div>
    </div>
  );
};

export default App;
