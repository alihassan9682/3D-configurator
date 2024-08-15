/** @format */

import React from "react";
import { TfiWorld } from "react-icons/tfi";
import { PiCodesandboxLogoThin } from "react-icons/pi";
import { AiOutlinePython } from "react-icons/ai";
import { GiShoppingCart } from "react-icons/gi";
import { FaRegBuilding } from "react-icons/fa";
import { PiPencilRuler } from "react-icons/pi";
import { TbAugmentedReality } from "react-icons/tb";



const Services = () => {
  return (
    <div className="container py-12 px-4">
      <h1 className="text-2xl sm:text-4xl md:text-4xl lg:text-6xl mt-6 font-bold text-center mb-8 text-[#359dad] px-8 md:px-8 lg:px-20">
        Experience innovation with BlenSpark
      </h1>
      <div className="flex flex-wrap justify-center gap-6 mt-2">
        <div className="service-card bg-white p-6 flex w-full md:w-1/3 transform transition duration-500 hover:scale-105 relative">
          <div className="w-1/4 flex justify-end items-start mr-3">
            <TfiWorld className="h-8 w-8 -mt-1 fill-[#359dad]" />
          </div>
          <div className="w-3/4 flex flex-col relative">
            <h2 className="text-xl font-bold text-[#4a4a4a] mb-4">3D Animations</h2>
            <p className="text-[#359dad] text-sm">
            Enhance your projects with captivating 3D animations.
            </p>
            <div className="flex-grow"></div>
            <div className="border-t border-gray-300 w-full mt-4"></div>
            <div className="line"></div>
          </div>
        </div>
        <div className="service-card bg-white p-6 flex w-full md:w-1/3 transform transition duration-500 hover:scale-105 relative">
          <div className="w-1/4 flex justify-end items-start mr-3">
            <PiCodesandboxLogoThin className="h-11 w-11 -mt-2 fill-[#359dad]" />
          </div>
          <div className="w-3/4 flex flex-col relative">
            <h2 className="text-xl font-bold text-[#4a4a4a] mb-4">
              Information and Technology
            </h2>
            <p className="text-[#359dad] text-sm">
              Unmatched quality and value in IT services.
            </p>
            <div className="flex-grow"></div>
            <div className="border-t border-gray-300 w-full mt-4"></div>
            <div className="line"></div>
          </div>
        </div>
        <div className="service-card bg-white p-6 flex w-full md:w-1/3 transform transition duration-500 hover:scale-105 relative">
          <div className="w-1/4 flex justify-end items-start mr-3">
            <AiOutlinePython className="h-11 w-11 -mt-2 fill-[#359dad]" />
          </div>
          <div className="w-3/4 flex flex-col relative">
            <h2 className="text-xl font-bold text-[#4a4a4a] mb-4">Data Management</h2>
            <p className="text-[#359dad] text-sm">
            Superior data management solutions tailored for you.
            </p>
            <div className="flex-grow"></div>
            <div className="border-t border-gray-300 w-full mt-4"></div>
            <div className="line"></div>
          </div>
        </div>
        <div className="service-card bg-white p-6 flex w-full md:w-1/3 transform transition duration-500 hover:scale-105 relative">
          <div className="w-1/4 flex justify-end items-start mr-3">
            <GiShoppingCart className="h-11 w-11 -mt-2 fill-[#359dad]" />
          </div>
          <div className="w-3/4 flex flex-col relative">
            <h2 className="text-xl font-bold text-[#4a4a4a] mb-4">
              E-Commerce Rendering
            </h2>
            <p className="text-[#359dad] text-sm">
            Advanced features to elevate your e-commerce platform.
            </p>
            <div className="flex-grow"></div>
            <div className="border-t border-gray-300 w-full mt-4"></div>
            <div className="line"></div>
          </div>
        </div>
        <div className="service-card bg-white p-6 flex w-full md:w-1/3 transform transition duration-500 hover:scale-105 relative">
          <div className="w-1/4 flex justify-end items-start mr-3">
            <FaRegBuilding className="h-8 w-8 -mt-1 fill-[#359dad]" />
          </div>
          <div className="w-3/4 flex flex-col relative">
            <h2 className="text-xl font-bold text-[#4a4a4a] mb-4">
              Enterprise Solutions
            </h2>
            <p className="text-[#359dad] text-sm ">
            Top-tier solutions for all your enterprise needs.
            </p>
            <div className="flex-grow"></div>
            <div className="border-t border-gray-300 w-full mt-4"></div>
            <div className="line"></div>
          </div>
        </div>
        <div className="service-card bg-white p-6 flex w-full md:w-1/3 transform transition duration-500 hover:scale-105 relative">
          <div className="w-1/4 flex justify-end items-start mr-3">
            <PiPencilRuler className="h-10 w-10 -mt-1 fill-[#359dad]" />
          </div>
          <div className="w-3/4 flex flex-col relative">
            <h2 className="text-xl font-bold text-[#4a4a4a] mb-4">
             3D Animations and Explainer Videos
            </h2>
            <p className="text-[#359dad] text-sm ">
            Engaging 3D animations and clear explainer videos.
            </p>
            <div className="flex-grow"></div>
            <div className="border-t border-gray-300 w-full mt-4"></div>
            <div className="line"></div>
          </div>
        </div>
        <div className="service-card bg-white p-6 flex w-full md:w-1/3 transform transition duration-500 hover:scale-105 relative">
          <div className="w-1/4 flex justify-end items-start mr-3">
            <TbAugmentedReality className="h-10 w-10 -mt-1 text-[#359dad]" />
          </div>
          <div className="w-3/4 flex flex-col relative">
            <h2 className="text-xl font-bold text-[#4a4a4a] mb-4">
              When Tech meets 3D World
            </h2>
            <p className="text-[#359dad] text-sm ">
            nnovative tech solutions merging with the 3D world.
            </p>
            <div className="flex-grow"></div>
            <div className="border-t  border-gray-300 w-full mt-4"></div>
            <div className="line"></div>
          </div>
        </div>
      </div>
      <style>{`
        .line {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          height: 2px;
          width: 0;
          background-color: #359dad;
          transition: width 0.3s ease;
        }
        .service-card:hover .line {
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default Services;

