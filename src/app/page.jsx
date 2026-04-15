"use client"

import { useEffect, useState } from "react"
import MovieCard from "../components/MovieCard"

// 1. Import Swiper components and modules
import { Swiper, SwiperSlide } from "swiper/react"
import { EffectCoverflow, Navigation, Pagination, Parallax } from "swiper/modules"

// 2. Import Swiper styles
import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/navigation"
import "swiper/css/pagination"

export default function HomePage() {
  const [recommendedMovies, setRecommendedMovies] = useState([])
  const [movies, setMovies] = useState([])

  useEffect(() => {
    // ... your existing dummy data logic ...
    const recommended = [
      { id: 1, title: "Dune 2", genre: "Sci-Fi", poster: "/images/dune.png" },
      { id: 2, title: "Deadpool 3", genre: "Action", poster: "/images/deadpool.jpg" },
      { id: 3, title: "The Martian", genre: "Sci-Fi", poster: "/images/martian.jpg" },
      { id: 4, title: "Mario Bros", genre: "Animation", poster: "/images/mario.jpg" }
    ]
    setRecommendedMovies(recommended)
    setMovies(recommended) // Using same data for demo
  }, [])

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      
      
<section className="px-10 py-16">
  <div className="flex flex-col md:flex-row items-center justify-between gap-10">

    {/* LEFT SIDE - LOGO + TEXT */}
    <div className="flex items-center gap-6">
      
      {/* BIG LOGO */}
      <img
        src="/icons/logo.png"
        alt="CinemaHub"
        className="w-24 h-24 md:w-32 md:h-32 object-contain"
      />

      {/* TEXT */}
      <div>
        <h1 className="text-4xl md:text-5xl font-bold">
          MaxLight Cinemas
        </h1>
        <p className="text-lg opacity-70 mt-2">
          Book your seats and enjoy the best cinema experience.
        </p>
      </div>

    </div>

    {/* RIGHT SIDE - SEARCH BAR */}
    <div className="w-full md:w-[400px]">
      <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-3 shadow-lg">
        
        <input
          type="text"
          placeholder="Search movies..."
          className="bg-transparent outline-none text-white placeholder-white/60 flex-1"
        />

        <button className="ml-3 px-4 py-2 rounded-full bg-black border border-white/20 text-white text-sm hover:scale-105 transition">
          Search
        </button>

      </div>
    </div>

  </div>
</section>

      {/* RECOMMENDED MOVIES (With Swiper) */}
      <section className="mt-12">
       
        <div className="md:hidden">
  <Swiper
    modules={[EffectCoverflow, Parallax]}
    effect="coverflow"
    centeredSlides={true}
    slidesPerView={1.2}
    spaceBetween={-60}
    parallax={true}
    coverflowEffect={{
      rotate: 0,
      stretch: -80,
      depth: 120,
      modifier: 1,
      slideShadows: false,
    }}
    className="pb-12"
  >
    {recommendedMovies.map((movie) => (
      <SwiperSlide key={movie.id} className="w-[220px]">
        <MovieCard movie={movie} />
      </SwiperSlide>
    ))}
  </Swiper>
</div>
          {/* DESKTOP GRID */}

  <div className="hidden md:grid grid-cols-4 gap-6 px-10">
    {recommendedMovies.map((movie) => (
      <MovieCard key={movie.id} movie={movie} />
    ))}
  </div>
      </section>

      {/* NOW SHOWING (Standard Grid for contrast) */}
      <section className="px-10 mt-12">
        <h2 className="text-2xl font-bold mb-6">Now Showing</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
      
    </div>
  )
}