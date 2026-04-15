export async function getMovies() {

  const response = await fetch("/api/movies")

  const data = await response.json()

  return data
}