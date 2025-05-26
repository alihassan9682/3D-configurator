import { useState, useEffect, useRef } from "react";
import MoveAlongGroundImg from "../../assets/move-along-ground-gesture.png";
import RotationImg from "../../assets/rotation-gesture.png";
import UpDownImg from "../../assets/up-down-gesture.png";
import { IoClose } from "react-icons/io5";
import { hideARGestureGuideKey } from "./constants";

// The minimum distance required to trigger a swipe
const minSwipeDistance = 50;

const images = [
  {
    id: 1,
    // image inside src/assests
    src: MoveAlongGroundImg,
    alt: "Move Alogn Ground",
    caption: "Drag to move on floor.",
  },
  {
    id: 2,
    src: RotationImg,
    alt: "Rotation",
    caption: "Twist fingers to turn model.",
  },
  {
    id: 3,
    src: UpDownImg,
    alt: "Up & Down",
    caption: "Two fingers lift up/down",
  },
];

const ImageCarousel = ({
  autoRotate = true,
  rotateInterval = 5000,
  onClose,
  showARView,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [doNotShowAgain, setDoNotShowAgain] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const carouselRef = useRef(null);

  // Handle auto rotation
  useEffect(() => {
    if (!autoRotate) return;

    const interval = setInterval(() => {
      goToNext();
    }, rotateInterval);

    return () => clearInterval(interval);
  }, [currentIndex, autoRotate, rotateInterval]);

  const onTouchStart = (e) => {
    setTouchEnd(null); // Reset touchEnd
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    }

    if (isRightSwipe) {
      goToPrevious();
    }
  };

  const goToPrevious = () => {
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastImage = currentIndex === images.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  const handleProceedOrSkip = () => {
    if (doNotShowAgain) {
      localStorage.setItem(hideARGestureGuideKey, true);
    }
    showARView();
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 animate__animated animate__fadeIn">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[24rem] md:w-[26rem] animate__animated animate__zoomIn">
        <div className="mb-4 relative">
          <h2 className="relative text-gray-600 text-left font-semibold">
            Gesture Guide for AR
          </h2>
          <IoClose
            onClick={onClose}
            className="absolute -top-2 -right-2 cursor-pointer h-8 w-8 hover:bg-gray-200 rounded-md p-1"
          />
        </div>
        <div
          ref={carouselRef}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-lg shadow-xl"
        >
          {/* Carousel container */}
          <div className="relative h-64 md:h-96">
            {images.map((image, index) => (
              <div
                key={image.id || index}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === currentIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={image.src}
                  alt={image.alt || `Carousel image ${index + 1}`}
                  className="object-contain w-full h-full"
                />
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-slate-900 bg-gradient-to-t from-[#d9eaff] to-transparent">
                    <p className="text-xl font-semibold">{image.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Navigation arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
            aria-label="Previous image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
            aria-label="Next image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Indicator dots */}
          <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-2">
            {images.map((image, index) => (
              <button
                key={image.id || index}
                onClick={() => goToImage(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex
                    ? "bg-white"
                    : "bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-2">
            <input
              checked={doNotShowAgain}
              onChange={(e) => setDoNotShowAgain(e.target.checked)}
              type="checkbox"
              id="gesture-model-do-not-show"
              className="h-4 w-4"
            />
            <label
              className="text-gray-700 text-sm font-medium"
              htmlFor="gesture-model-do-not-show"
            >
              Do not show again
            </label>
          </div>
          <button
            onClick={handleProceedOrSkip}
            className="px-4 py-1 text-white bg-blue-500 rounded hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
          >
            {currentIndex === images.length - 1 ? "Proceed" : "Skip"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCarousel;
