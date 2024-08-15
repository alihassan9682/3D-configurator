/** @format */

import React from "react";
import Masonry from "react-masonry-css";
import Slider from "react-slick";

// Helper function to get a random height for cards
const getRandomHeight = () => {
  return Math.floor(Math.random() * (400 - 100 + 1)) + 200; // Random height between 200 and 300
};

// CategoryCard component
const CategoryCard = ({ media, description, onOpenModal, isVideo }) => {
  const randomHeight = getRandomHeight();

  return (
    <div
      className="bg-white shadow-md rounded-lg p-4 m-2 transform transition duration-500 hover:scale-105"
      style={{ height: `${randomHeight}px` }}
      onClick={onOpenModal}
    >
      <div className="h-full flex flex-col justify-end">
        <div style={{ flex: 1, overflow: "hidden", borderRadius: "inherit" }}>
          {isVideo ? (
            <video
              src={media}
              autoPlay
              loop
              muted
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
                borderRadius: "inherit",
              }}
            />
          ) : (
            <img
              src={media}
              alt={description}
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
                borderRadius: "inherit",
              }}
            />
          )}
        </div>
        <div className="bg-white bg-opacity-75 p-2 rounded-lg mt-2">
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
};

// CategoryCollage component
const CategoryCollage = ({ categoryTitle, items, Icon, onOpenModal }) => {
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  return (
    <div className="p-8 px-10 w-full bg-slate-100 mb-20 hover:cursor-pointer">
      <div className="flex items-center mb-4 text-4xl text-gray-700 underline underline-offset-8">
        <Icon className="mr-2" />
        <h1 className="font-semibold">{categoryTitle}</h1>
      </div>
      <div className="block md:hidden">
        <Slider {...settings}>
          {items.map((item, index) => (
            <div key={index}>
              <CategoryCard
                media={item.media}
                description={item.description}
                onOpenModal={onOpenModal}
                isVideo={item.isVideo}
              />
            </div>
          ))}
        </Slider>
      </div>
      <div className="hidden md:block">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex -ml-2 w-auto"
          columnClassName="pl-2 bg-clip-padding"
        >
          {items.map((item, index) => (
            <CategoryCard
              key={index}
              media={item.media}
              description={item.description}
              onOpenModal={onOpenModal}
              isVideo={item.isVideo}
            />
          ))}
        </Masonry>
      </div>
    </div>
  );
};

export default CategoryCollage;
