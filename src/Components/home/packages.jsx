import React, { useState } from 'react';
import phoneImage from '../../assets/Cards/mobile.png';
import phoneImage1 from '../../assets/Cards/DESIGN/5.png';
import design from '../../assets/Cards/DESIGN/2.png';
import develop from '../../assets/Cards/DESIGN/3.png';
import devliver from '../../assets/Cards/DESIGN/4.png';

const HeroSection = () => {
  const [img, setImage] = useState(phoneImage1);

  return (
    <div className="bg-gradient-to-b from-white to-[#359dad] py-12 md:py-32">
      <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48">
        <div className="flex flex-row sm:flex-row items-center justify-center">
          <div
            className="bg-[#359dad] text-white text-lg sm:text-2xl font-bold w-24 sm:w-44 h-24 sm:h-44 flex items-center justify-center shadow-2xl transform hover:scale-105 hover:cursor-pointer mb-4 sm:mb-0"
            onClick={() => setImage(design)}
          >
            DESIGN
          </div>
          <div
            className="bg-[#4a4a4a] text-white text-lg sm:text-2xl font-bold w-24 sm:w-44 h-24 sm:h-44 flex items-center justify-center shadow-2xl transform hover:scale-105 mx-2 sm:mx-4 px-2 sm:px-4 hover:cursor-pointer mb-4 sm:mb-0"
            onClick={() => setImage(develop)}
          >
            DEVELOP
          </div>
          <div className="relative mb-4 sm:mb-0" onClick={() => setImage(phoneImage1)}>
            <img src={img} alt="Phone1" className="w-36 sm:w-60 h-auto p-2 sm:p-5" />
            <div className="absolute inset-0 flex items-center justify-center">
              <img src={phoneImage} alt="Phone" className="w-full h-auto" />
            </div>
          </div>
          <div
            className="bg-[#7ED957] text-white text-lg sm:text-2xl font-bold w-24 sm:w-44 h-24 sm:h-44 flex items-center justify-center shadow-2xl transform hover:scale-105 mx-2 sm:mx-4 px-2 sm:px-4 hover:cursor-pointer"
            onClick={() => setImage(devliver)}
          >
            DELIVER
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
