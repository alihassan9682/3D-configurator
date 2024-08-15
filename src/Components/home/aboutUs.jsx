/** @format */

import React from 'react';
import logo from '../../assets/logos/bs logo-01.png'; 

const AboutUs = () => {
  return (
    <div className="w-full bg-gradient-to-b lg:bg-gradient-to-r from-[#359dad] to-white flex items-center justify-center px-4 py-4">
      <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center text-center lg:text-left">
        <div className="lg:w-2/3 px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-8">About Us</h1>
          <p className="text-md md:text-md text-white mb-8">
            At BlenSpark, we specialize in cutting-edge 3D and IT solutions that transform your ideas into immersive realities. Our expert team is dedicated to designing, developing, and delivering bespoke services that cater to a diverse range of industries. Whether it's crafting stunning 3D visualizations, developing robust software, or providing comprehensive IT support, BlenSpark is your partner in innovation. Our commitment to excellence and passion for technology ensures that we bring your vision to life with precision and creativity. Discover the future of possibilities with BlenSpark. Design. Develop. Deliver.
          </p>
        </div>
        <div className="lg:w-1/3 px-4 flex justify-center lg:justify-end mt-8 lg:mt-0">
          <img src={logo} alt="BlenSpark Logo" className="w-2/3 lg:w-full" />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
