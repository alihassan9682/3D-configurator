import React from "react";
import { useNavigate } from "react-router-dom";
import { Link, Element, scroller } from "react-scroll";

// Import logos
import imgSrc from "../../assets/logos/1.png";
import imgSrc1 from "../../assets/logos/2.png";
import imgSrc2 from "../../assets/logos/3.png";
import imgSrc3 from "../../assets/logos/4.png";
import imgSrc4 from "../../assets/logos/5.png";
import imgSrc5 from "../../assets/logos/6.png";
import imgSrc6 from "../../assets/logos/7.png";
import imgSrc7 from "../../assets/logos/8.png";
import imgSrc8 from "../../assets/logos/9.png";
import imgSrc9 from "../../assets/logos/10.png";
import imgSrc10 from "../../assets/logos/11.png";
import imgSrc11 from "../../assets/logos/12.png";
import imgSrc12 from "../../assets/logos/13.png";
import imgSrc13 from "../../assets/logos/14.png";
import imgSrc14 from "../../assets/logos/15.png";
import imgSrc15 from "../../assets/logos/16.png";
import imgSrc16 from "../../assets/logos/17.png";
import imgSrc17 from "../../assets/logos/18.png";
import imgSrc18 from "../../assets/logos/19.png";
import imgSrc19 from "../../assets/logos/20.png";
import imgSrc20 from "../../assets/logos/21.png";

import Services from "./Services";
import Packages from "./packages";
import Projects from "./porjectsDelivered";
import Clients from "./clients";
import AboutUs from "./aboutUs";
import MeetTheSparkers from "./sparkers";

const Hero = () => {
  const navigate = useNavigate();

  const setCurrentHero = (hero) => {
    navigate(`/${hero.toLowerCase()}`);
  };

  const logos = [
    [imgSrc, "h-20"], [imgSrc1, "h-20"], [imgSrc2, "h-16"], [imgSrc3, "h-20"], [imgSrc4, "h-20"], [imgSrc5, "h-14"],
    [imgSrc6, "h-24"], [imgSrc7, "h-10"], [imgSrc8, "h-16"], [imgSrc9, "h-24"], [imgSrc10, "h-24"], [imgSrc11, "h-10"],
    [imgSrc12, "h-10"], [imgSrc13, "h-24"], [imgSrc14, "h-16"], [imgSrc15, "h-6"], [imgSrc16, "h-16"], [imgSrc17, "h-10"],
    [imgSrc18, "h-10"], [imgSrc19, "h-10"], [imgSrc20, "h-16"]
  ];

  const scrollToSection = (section) => {
    scroller.scrollTo(section, {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart'
    });
  };

  return (
    <div>
      <div className="relative h-screen overflow-hidden">
        <video
          autoPlay
          loop
          muted
          className="absolute inset-0 z-0 w-full h-full object-cover bg-white opacity-90"
        >
          <source src="https://res.cloudinary.com/duzgdiwwb/video/upload/v1721814164/8_jwglav.mp4" type="video/mp4" />
        </video>

        <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 sm:p-16 md:p-24 lg:p-32 text-center">
          <div className="logo flex flex-col items-center text-center tracking-tighter mb-8">
            <div className="flex flex-row justify-center items-baseline mb-4 text-7xl sm:text-8xl md:text-9xl lg:text-11xl tracking-[-0.12em] font-extrabold">
              <p className="text-3d !text-[#359dad]">
                Blen
              </p>
              <p className="text-3d !text-[#4a4a4a]">
                Spark
              </p>
            </div>
            <div className="flex justify-center mt-2">
              <p className="text-3d overflow-hidden whitespace-nowrap font-extralight border-r-4 border-r-[#4a4a4a] pr-5 text-sm sm:text-xl md:text-xl lg:text-xl text-[#4a4a4a] animate-typing tracking-[0.2em]">
                DESIGN. DEVELOP. DELIVER..
              </p>
            </div>
          </div>
          <div className="flex flex-row justify-center gap-4 mt-8 sm:mt-12 md:mt-16 lg:mt-20">
            <button
              onClick={() => setCurrentHero("contact")}
              className="bg-[#4a4a4a] text-white py-3 px-6 rounded-full transition duration-300 hover:opacity-80"
            >
              Schedule a Call
            </button>
            <button
              onClick={() => scrollToSection("clients")}
              className="bg-[#359dad] text-white py-3 px-6 rounded-full transition duration-300 hover:opacity-80"
            >
              See Our Work
            </button>
          </div>
          <div className="absolute flex bottom-32">
            <div className="w-full relative">
              <div className="absolute inset-0 bg-white opacity-50 "></div>
              <div className="relative z-10 -mt-5 logos-container">
                <div className="logos-wrapper animate-slide items-center">
                  {logos.concat(logos).map((src, index) => (
                    <img key={index} src={src[0]} alt={`Logo ${index + 1}`} className={`${src[1]} mx-10 -mb-6`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .logo {
            font-weight: 900;
            letter-spacing: -0.1em;
          }
          .text-3d {
            position: relative;
            display: inline-block;
            color: #ffffff;
            text-shadow: 1px 1px 2px #000000, 1px 1px 1px #000000, 1px 1px 1px #000000;
            transform: perspective(500px) rotateX(0deg) rotateY(-15deg) rotateZ(0deg);
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
          .logos-container {
            overflow: hidden;
            white-space: nowrap;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .logos-wrapper {
            display: flex;
            flex-wrap: nowrap;
          }
          .animate-slide {
            animation: slide 60s linear infinite;
          }
          @keyframes slide {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}</style>
      </div>

      <Element name="services">
        <Services />
      </Element>
      <Element name="packages">
        <Packages />
      </Element>
      <Element name="clients" className="-mt-1">
        <Clients />
      </Element>
      <Element name="projects">
        <Projects />
      </Element>
      <Element name="aboutUs">
        <AboutUs />
      </Element>
      <Element name="meetTheSparkers">
        <MeetTheSparkers />
      </Element>
    </div>
  );
};

export default Hero;
