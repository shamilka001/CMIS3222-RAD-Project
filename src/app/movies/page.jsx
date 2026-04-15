import MovieList from "../../components/MovieList"

export default function MoviesPage() {

  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">
        Now Showing
      </h1>

      <MovieList />

    </div>
  )
}