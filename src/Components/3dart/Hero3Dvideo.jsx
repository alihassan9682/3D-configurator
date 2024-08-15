/** @format */

import React from "react";
import { useNavigate } from "react-router-dom";
import ComingSoon from "../comingSoon";
import VD from "../../assets/vd.mp4";

const Hero = () => {
  const navigate = useNavigate();

  const setCurrentHero = (hero) => {
    navigate(`/${hero.toLowerCase()}`);
  };

  return (
    <div className="w-full">
      <div className="relative w-full h-screen overflow-hidden">
      <video
        autoPlay
        loop
        muted
        className="absolute top-1/2 left-1/2 w-full h-full object-cover transform -translate-x-1/2 -translate-y-1/2 z-[-1]"
      >
        <source src={VD} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl text-center z-10">
        <div className="logo flex flex-col items-center text-center mb-4 animate-float tracking-tighter">
          <div className="logo text-5xl sm:text-7xl md:text-8xl lg:text-9xl mb-4 animate-float tracking-tighter">
            <div className="text-cyan-600">BlenSpark</div>
            <div className="text-white">3D</div>
          </div>
          <div className="flex justify-center mt-2">
            <p className="overflow-hidden whitespace-nowrap border-r-4 border-r-gray-700 pr-5 text-lg sm:text-xl md:text-2xl lg:text-3xl text-white animate-typing">
              DESIGN.DEVELOP.DELIVER...
            </p>
          </div>
        </div>
        <div className="flex sm:flex-row justify-center gap-4 mt-8 sm:mt-12 md:mt-16 lg:mt-20">
          <button
            onClick={() => setCurrentHero("home")}
            className="relative flex justify-center items-center transform hover:scale-110 hover:bg-cyan-700 bg-cyan-600 text-white py-2 px-4 w-32 sm:px-8 lg:px-10 rounded-lg transition duration-300 font-semibold text-base sm:text-xl lg:text-2xl"
          >
            <span>Home</span>
          </button>
          <div className="border-b sm:border-b-0 sm:border-l border-gray-400 mt-4 sm:mt-0"></div>
          <button
            onClick={() => setCurrentHero("tech")}
            className="relative flex justify-center hover:scale-110 items-center whitespace-nowrap hover:bg-gray-800 bg-gray-700 text-white py-2 px-4 w-32 sm:px-8 lg:px-10 rounded-lg transition duration-300 font-semibold text-base sm:text-xl lg:text-2xl"
          >
            <span>Tech</span>
          </button>
        </div>
      </div>

      <style>{`
        .logo {
          font-weight: 900;
          letter-spacing: -0.1em;
        }
        @keyframes typing {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }
        @keyframes blink {
          0%,
          100% {
            border-color: transparent;
          }
          50% {
            border-color: black;
          }
        }
        .animate-typing {
          animation: typing 8s steps(40, end) infinite, break 20s linear;
        }
        @keyframes break {
          from,
          to {
            visibility: hidden;
          }
          50% {
            visibility: visible;
          }
        }
      `}</style>
      </div>
      <ComingSoon/>
    </div>
  );
};

export default Hero;
