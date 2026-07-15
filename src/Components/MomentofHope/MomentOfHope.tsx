"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectCoverflow } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";


const images = [
  "https://i.ibb.co.com/Vp3Jh5hx/photo-1624395149011-470cf6f6ec02.avif",
  "https://i.ibb.co.com/Hjpmfnw/photo-1585123388867-3bfe6dd4bdbf.avif",
  "https://i.ibb.co.com/671rfnsw/photo-1530685932526-48ec92998eaa.avif",
  "https://i.ibb.co.com/LdwWTjVv/photo-1496055401924-5e7fdc885742.avif",
  "https://i.ibb.co.com/8gYRHFD3/photo-1706752095478-4d759dc68846.avif",
  "https://i.ibb.co.com/B2PCzF7Z/photo-1777150895644-2ca253ee1c93.avif",
  "https://i.ibb.co.com/RpkGCPpB/photo-1706712637075-f47fb47548f2.avif",
  "https://i.ibb.co.com/m5LbZmvQ/photo-1706640254398-3b04782e8c76.avif",
  "https://i.ibb.co.com/V06mQfLP/photo-1698897052041-e90d83c44d95.avif",
];

export default function Momentsofhope() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-[70%] mx-auto px-4">
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
       
          <div className="text-center mb-12">
            

            <h2 className="text-2xl lg:text-3xl font-extrabold mt-4 text-slate-900 dark:text-white tracking-tight">
              Community Gallery
            </h2>

            <p className="text-slate-500 text-xs lg:text-base mt-3 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
             Real stories of community impact. Explore snapshots from our citizen-led activities and local campaigns.
            </p>
          </div>

          
          <Swiper
            modules={[Navigation, Autoplay, EffectCoverflow]}
            effect="coverflow"
            navigation
            centeredSlides
            grabCursor
            loop
            watchSlidesProgress
            slidesPerView="auto"
            autoplay={{
              delay: 2800,
              disableOnInteraction: false,
            }}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 140,
              modifier: 2,
              scale: 0.82,
              slideShadows: false,
            }}
            className="gallerySwiper w-full py-6"
          >
            {images.map((img, i) => (
              <SwiperSlide
                key={i}
                style={{
                  width: "340px",
                }}
                className="transition-all duration-300"
              >
               
                <div className="rounded-[28px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-lg hover:shadow-xl transition-shadow duration-300 p-2.5">
                  <div className="rounded-[20px] overflow-hidden relative group">
                    <Image
                      src={img}
                      alt={`Community impact moment ${i + 1}`}
                      width={500}
                      height={600}
                      priority={i < 3}
                      className="h-[420px] w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

        </motion.div>
      </div>
    </section>
  );
}