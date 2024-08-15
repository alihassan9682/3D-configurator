/** @format */

import React from "react";
import CountUp from "react-countup";
import projectsBg from "../../assets/Cards/project.png";
import { FaMapLocationDot, FaLocationDot } from "react-icons/fa6";
import { SiVirustotal } from "react-icons/si";

const ProjectsSummary = () => {
  return (
    <div
      className="relative bg-cover bg-center py-12 px-4"
      style={{ backgroundImage: `url(${projectsBg})` }}
      id=''
    >
      {/* Overlay with low opacity */}
      <div className="absolute inset-0 bg-white opacity-60"></div>
      <div className="relative z-10 container mx-auto text-center">
        <h1 className="text-6xl font-extrabold mb-12 text-gray-600 drop-shadow-lg shadow-white mt-10">
          Projects Delivered
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-lg shadow-lg p-6 transform transition duration-500 hover:scale-105 hover:shadow-xl flex flex-col items-center">
            <div className="flex items-center mb-4">
              <SiVirustotal className="w-8 h-8 fill-cyan-600 mr-2" />
              <h2 className="text-2xl font-bold text-cyan-600">Total Projects</h2>
            </div>
            <div className="flex items-center">
              <p className="text-4xl font-bold text-gray-600">
                <CountUp end={564} duration={8} separator="," />
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 transform transition duration-500 hover:scale-105 hover:shadow-xl flex flex-col items-center">
            <div className="flex items-center mb-4">
              <FaMapLocationDot className="w-8 h-8 fill-cyan-600 mr-2" />
              <h2 className="text-2xl font-bold text-cyan-600">International Projects</h2>
            </div>
            <div className="flex items-center">
              <p className="text-4xl font-bold text-gray-600">
                <CountUp end={178} duration={8} separator="," />
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 transform transition duration-500 hover:scale-105 hover:shadow-xl flex flex-col items-center">
            <div className="flex items-center mb-4">
              <FaLocationDot className="w-8 h-8 fill-cyan-600 mr-2" />
              <h2 className="text-2xl font-bold text-cyan-600">Local Projects</h2>
            </div>
            <div className="flex items-center">
              <p className="text-4xl font-bold text-gray-600">
                <CountUp end={386} duration={8} separator="," />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsSummary;
