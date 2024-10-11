/** @format */

import React, { useState, useRef, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDropdownOptionClick = (subItem) => {
    setSelectedItem(subItem);
    navigate(`/${subItem.toLowerCase()}`);
  };
  const BASE_URL = `${process.env.API_URL}/admin/api/2024-09`;
  const ACCESS_TOKEN = process.env.API_ACCESS_TOKEN;

   const fetchProducts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/products.json`, {
        method: 'GET',
        headers: {
          'X-Shopify-Access-Token': ACCESS_TOKEN,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data.products);
      return data.products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  };


  return (
    <div className="flex">
      {fetchProducts}
      <div className="hidden lg:flex fixed top-0 left-0 h-full w-20 bg-white text-white flex-col justify-evenly space-y-96 border-r">
        <div className="text-3xl font-extrabold rotate-180 hover:cursor-pointer">
          <div className="transform rotate-90 mt-12">
            <p className="text-[#359dad]">Blen</p>
          </div>
          <div className="transform rotate-90 mt-9">
            <p className="text-[#4a4a4a]">Spark</p>
          </div>
        </div>
        <div
          className="text-white whitespace-nowrap bg-[#359dad] hover:bg-cyan-700 rounded-full p-2 transform rotate-90 hover:scale-105 w-fit -ml-5 px-6 hover:cursor-pointer"
          onClick={() => navigate("/contact")}
        >
          <div className="transform rotate-180">Lets Talk</div>
        </div>
      </div>
      <div className="flex-1 lg:ml-16 bg-transparent text-white p-4 sm:px-8 md:px-16 lg:px-24 xl:px-28">
        <div className="flex justify-between items-center">
          <nav className="hidden sm:flex w-full justify-between my-2">
            <ul className="flex w-full justify-between text-[#359dad] text-lg sm:text-xl md:text-xl underline-offset-8 uppercase">
              {["Home", "Tech","3d-art", "3D World", "Contact"].map((item) => (
                <li
                  key={item}
                  className="flex items-center relative hover:cursor-pointer"
                >
                  <NavLink
                    to={`/${item.toLowerCase()}`}
                    activeClassName="text-[#4a4a4a] underline"
                    className={`hover:text-[#4a4a4a]  ${
                      selectedItem === item ? "text-[#4a4a4a] underline" : ""
                    }`}
                    onClick={() => setSelectedItem(item)}
                  >
                    {item}
                  </NavLink>
                  {item !== "Contact" && <span className="divider"></span>}
                </li>
              ))}
            </ul>
          </nav>
          <div className="sm:hidden">
            <FaBars
              className="text-3xl text-[#359dad] cursor-pointer"
              onClick={toggleMenu}
            />
          </div>
        </div>
        <div
          className={`fixed top-0 left-0 h-full w-2/3 bg-gray-700 text-white p-4 sm:hidden z-50 transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-end mb-4">
            <FaTimes
              className="text-3xl text-[#359dad] cursor-pointer"
              onClick={closeMenu}
            />
          </div>
          <nav>
            <ul className="flex flex-col space-y-4 text-lg uppercase">
              {["Home", "Tech","3d-art", "3D World", "Contact"].map((item) => (
                <li key={item}>
                  <NavLink
                    to={`/${item.toLowerCase()}`}
                    onClick={() => {
                      setSelectedItem(item);
                      closeMenu(); // Close the sidebar after selection
                    }}
                    activeClassName="text-cyan-400 underline"
                    className="hover:text-cyan-400"
                  >
                    {item}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Header;
