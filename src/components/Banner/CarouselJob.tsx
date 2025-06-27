"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const images = [
  "/img/slide-1.png",
  "/img/slide-3.png",
  "/img/slide-2.png",
  "/img/slide-4.png",
];

export default function CarouselJob() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 2000);

    return () => clearInterval(interval);
  }, [current]);

  return (
    <div className="relative w-full mt-2">
      <section className="w-full">
        <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg">
          {images.map((src, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === current ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </section>

      <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 space-x-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              current === index ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
