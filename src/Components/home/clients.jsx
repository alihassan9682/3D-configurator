/** @format */

import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import IM from '../../assets/info.png';
import Info from '../../assets/info.png';
import Jobs from '../../assets/jobs portal.png';

const FeatureCard = ({ img, title, description }) => (
  <div className="bg-white text-black p-4 md:p-6 rounded-tr-[90px] rounded-bl-[90px] shadow-lg w-60 md:w-72 flex flex-col items-center justify-center mx-auto">
    <img src={img} alt={title} className="mb-4 w-24 h-24 object-contain" />
    <h3 className="text-lg md:text-xl font-bold mt-2 mb-2 text-center">{title}</h3>
    <p className="text-center text-sm md:text-base">{description}</p>
  </div>
);

const Clients = () => {
  const features = [
    {
      img: IM,
      title: 'Hydrogen Bottle',
      description: 'All your desktop or laptop needs made available',
    },
    {
      img: Info,
      title: 'InfoGrapher',
      description: "The Data extraction google extension",
    },
    {
      img: Jobs,
      title: 'Smart JobsBoard',
      description: 'The place where you get jobs from all the platforms',
    },
    {
      img: IM,
      title: 'PHONES & ACCESSORIES',
      description: 'High class, high quality phones at affordable prices',
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '0px',
    responsive: [
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: '40px',
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerMode: false,
        },
      },
    ],
  };

  return (
    <div className="w-full bg-[#359dad] flex flex-col items-center py-12 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
        We've helped our clients complete 3,000+ projects
      </h1>
      <p className="text-white text-center mb-12">
        Over the last 14 years, we've been driven by our passion for helping global clients achieve their goals.
      </p>
      <div className="hidden md:flex justify-center flex-wrap gap-6 w-full max-w-screen-lg px-6 mx-auto">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            img={feature.img}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
      <div className="md:hidden w-full px-6">
        <Slider {...settings}>
          {features.map((feature, index) => (
            <div key={index} className="flex justify-center">
              <FeatureCard
                img={feature.img}
                title={feature.title}
                description={feature.description}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Clients;
