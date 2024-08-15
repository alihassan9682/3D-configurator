/** @format */

import React from "react";
import {
  FaEnvelope,
  FaBehance,
  FaLinkedin,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";

const ContactForm = () => {
  return (
    <div className="w-full bg-[#359dad] shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-8 sm:gap-12 md:gap-24 lg:gap-32 text-center mt-6">
          <div className="flex flex-col transform hover:scale-110 items-center">
            <a
              href="mailto:info@blenspark.com"
              className="text-sm sm:text-lg text-white hover:underline"
            >
              <FaEnvelope size={72} className="text-white mb-4" />
            </a>
          </div>
          <div className="flex flex-col transform hover:scale-110 items-center">
            <a
              href="https://wa.me/+3134856122"
              className="text-sm sm:text-lg text-white hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp size={72} className="text-white mb-4" />
            </a>
          </div>
          <div className="flex flex-col transform hover:scale-110 items-center">
            <a
              href="https://www.behance.net/Blensparkproducts"
              className="text-sm sm:text-lg text-white hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaBehance size={72} className="text-white mb-4" />
            </a>
          </div>
          <div className="flex flex-col transform hover:scale-110 items-center">
            <a
              href="https://www.linkedin.com/company/blenspark/"
              className="text-sm sm:text-lg text-white hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin size={72} className="text-white mb-4" />
            </a>
          </div>
          <div className="flex flex-col transform hover:scale-110 items-center">
            <a
              href="https://www.instagram.com/blenspark"
              className="text-sm sm:text-lg text-white hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram size={72} className="text-white mb-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
