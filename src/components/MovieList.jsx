"use client"
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function MovieCarousel() {
  const movies = [
    { id: 1, title: "Michael", poster: "/images/kungfu.jpg" },
    { id: 2, title: "Project Hail Mary", poster: "/images/dune.png" },
    { id: 3, title: "Super Mario", poster: "/images/deadpool.jpg" },
  ];

  return (
    <div className="w-full py-12 bg-zinc-950">
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        initialSlide={1}
        coverflowEffect={{
          rotate: 30,      // Angle of the side cards
          stretch: 0,       // Space between cards
          depth: 200,       // 3D depth (farther back)
          modifier: 1,      // Effect multiplier
          slideShadows: true, // Adds realistic lighting
        }}
        modules={[EffectCoverflow, Pagination, Navigation]}
        className="max-w-4xl"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id} className="w-[300px]">
             {/* The card itself */}
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <img 
                src={movie.poster} 
                className="w-full h-[450px] object-cover" 
                alt={movie.title} 
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}