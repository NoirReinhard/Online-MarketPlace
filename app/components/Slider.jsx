"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/autoplay";
import { Autoplay, EffectCreative } from "swiper/modules";
import Image from "next/image";

const slides = [
  {
    id: 1,
    image: "/assets/StrawberryPie.jpg",
    title: "Fresh & Juicy Fruits",
    text: "Taste the freshness in every bite.",
  },
  {
    id: 2,
    image: "/assets/Spices.jpeg",
    title: "Organic Goodness",
    text: "Nature’s best, delivered to you.",
  },
];

export default function ShutterSlider() {
  return (
    <div className="w-full max-w-screen-md mx-auto py-7 mb-4">
      <Swiper
        effect={"creative"}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        grabCursor={true}
        loop={true}
        creativeEffect={{
          prev: {
            shadow: true,
            translate: ["-10%", 0, -1],
          },
          next: {
            translate: ["50%", 0, 0],
          },
        }}
        modules={[Autoplay, EffectCreative]}
        className="w-full h-[350px] rounded-xl"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative">
            <Image
              src={slide.image}
              alt={slide.title}
              layout="fill"
              objectFit="cover"
              className="w-full h-full rounded-xl"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-xl flex flex-col justify-center items-center text-center">
              <h2 className="text-3xl font-bold text-white">{slide.title}</h2>
              <p className="text-md text-gray-300 mt-2">{slide.text}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
