"use client"

import { useState, useEffect } from "react"
import MovieCard from "./MovieCard"

export default function Recommendation() {

  const [movies, setMovies] = useState([])

  useEffect(() => {

    const recommendedMovies = [
      {
        id:1,
        title:"Dune 2",
        genre:"Sci-Fi",
        poster:"/images/dune.jpg"
      },
      {
        id:2,
        title:"Deadpool 3",
        genre:"Action",
        poster:"/images/deadpool.jpg"
      }
    ]

    setMovies(recommendedMovies)

  }, [])

  return (
    <div>

      <h1 className="text-2xl mb-4">
        Recommended Movies
      </h1>

      <div className="grid grid-cols-4 gap-4">

        {movies.map(movie => (
          <MovieCard
            key={movie.id}
            movie={movie}
          />
        ))}

      </div>

    </div>
  )
}