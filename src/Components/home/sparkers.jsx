import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Ali from "../../assets/Hero/ali.jpg";
import Ahmad from "../../assets/Hero/ahmad.jpg";
import Zaman from "../../assets/Hero/zaman.jpg";
import Farrukh from "../../assets/Hero/farrukh.jpg";

const teamMembers = [
  {
    name: 'Ali Hassan',
    position: 'Web Developer',
    description: 'I sculpt the digital universe, creating online wonders that captivate and inspire.',
    img: Ali,
  },
  {
    name: 'Ahmad Nasir',
    position: 'Senior 3D Artist',
    description: 'I mold virtual realms, bringing imagination to life in the third dimension.',
    img: Ahmad,
  },
  {
    name: 'Ali Zaman',
    position: 'Animation Specialist',
    description: 'I infuse motion into dreams, bringing characters and stories to life with every frame.',
    img: Zaman,
  },
  {
    name: 'Farrukh Arshad',
    position: 'Senior Texturing Artist',
    description: 'I breathe life into the canvas of 3D worlds, adding depth and beauty with every stroke.',
    img: Farrukh,
  },
];

const TeamMemberCard = ({ name, position, description, img }) => (
  <div className="relative rounded-2xl overflow-hidden h-96 w-full md:w-80 lg:w-72 mx-auto p-4 flex justify-center">
    <img src={img} alt={name} className="absolute h-full w-full object-contain" />
    <div className="relative h-full flex flex-col justify-end w-full">
      <div className="bg-white bg-opacity-80 p-4 rounded-lg">
        <h3 className="text-xl font-bold text-[#4a4a4a] mb-2">{name}</h3>
        <h4 className="text-md font-semibold text-[#359dad] mb-4">{position}</h4>
        <p className="text-sm text-[#4a4a4a]">{description}</p>
      </div>
    </div>
  </div>
);

const MeetTheSparkers = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "15px", // Adjust the padding to match the desired look
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
          centerMode: false,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
        }
      }
    ]
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center py-12 px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-[#4a4a4a] text-center mb-4">Meet The Sparkers</h1>
      <p className="text-lg text-[#359dad] text-center mb-12 max-w-4xl">
        At BlenSpark, we specialize in cutting-edge 3D and IT solutions that transform your ideas into immersive realities. Our expert team is dedicated to designing, developing, and delivering bespoke services that cater to a diverse range of industries. Whether it's crafting stunning 3D visualizations, developing robust software, or providing comprehensive IT support.
      </p>
      <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {teamMembers.map((member, index) => (
          <TeamMemberCard key={index} name={member.name} position={member.position} description={member.description} img={member.img} />
        ))}
      </div>
      <div className="md:hidden w-full px-4"> {/* Add padding here */}
        <Slider {...settings}>
          {teamMembers.map((member, index) => (
            <div key={index} className="p-4">
              <TeamMemberCard name={member.name} position={member.position} description={member.description} img={member.img} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default MeetTheSparkers;
