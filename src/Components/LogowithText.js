/** @format */

import React from "react";
import VD from "../assets/vd1.mp4";

const BackgroundVideo = () => {
  return (
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
        Your Overlay Text Here
      </div>
    </div>
  );
};

export default BackgroundVideo;
