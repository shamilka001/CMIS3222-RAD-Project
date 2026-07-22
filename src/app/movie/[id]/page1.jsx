"use client";

import React, { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import CinemaBooking from "@/components/booking/CinemaBooking";
import { Footer } from "@/components/Footer";

function MovieDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const movieId = params.id;
  const isCinematicMode = searchParams.get("mode") === "cinematic";

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  // Showtime state
  const [showtimes, setShowtimes] = useState([]);

  // Review states
  const [reviews, setReviews] = useState([]);
  const [fetchingReviews, setFetchingReviews] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [newRating, setNewRating] = useState(5);
  const [newDescription, setNewDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  const fetchReviews = async () => {
    if (!movieId) return;
    try {
      setFetchingReviews(true);
      const res = await fetch(`http://localhost:5000/review/${movieId}`, {
        cache: "no-store",
      });
      const responseData = await res.json();
      if (responseData && responseData.data) {
        setReviews(responseData.data);
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setFetchingReviews(false);
    }
  };

  useEffect(() => {
    async function getMovieDetail() {
      try {
        const [res, showtimesRes] = await Promise.all([
          fetch(`http://localhost:5000/film/${movieId}`, { cache: "no-store" }),
          fetch("http://localhost:5000/showtime/", { cache: "no-store" }),
        ]);

        const responseData = await res.json();
        const showtimesData = await showtimesRes.json();

        if (responseData && responseData.data) {
          const film = responseData.data;

          setMovie({
            id: film.film_id,
            title: film.film_name || "Untitled Movie",
            genre: film.genre || "Drama",
            description: film.description || "No description available.",
            poster: film.poster_image || "/images/posters/fallback.jpg",
            portrait: film.poster_image || "/images/posters/fallback.jpg",
            rating: "8.5",
            runtime: `${film.duration} min`,
            trailerLink: film.trailer_link || null, // Straight from DB
          });

          // Match showtimes against the current film ID
          const fetchedShowtimes = showtimesData?.data || [];
          const matchingShowtimes = fetchedShowtimes
            .filter((st) => st.film_id === film.film_id)
            .map((st) => {
              const cleanDateString = st.show_date.split("T")[0];
              const cleanTimeString = st.start_time.substring(0, 5);
              const showtimeExpiryDate = new Date(
                `${cleanDateString}T${cleanTimeString}:00`,
              );
              const isPast = showtimeExpiryDate < new Date();

              return {
                showtimeId: st.showtime_id,
                startTime: cleanTimeString,
                endTime: st.end_time.substring(0, 5),
                screenName: st.screen_name,
                isPast: isPast,
                date: new Date(st.show_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                }),
              };
            });

          setShowtimes(matchingShowtimes);
        } else {
          throw new Error("Film item absent in backend");
        }
      } catch (err) {
        console.warn(
          "⚠️ Backend record fetch unresolvable, processing fallback mock array:",
          err,
        );
        setMovie({
          id: movieId,
          title: "John Wick",
          genre: "Action, Thriller",
          description:
            "An ex-hit-man comes out of retirement to track down the gangsters that killed his dog and took everything.",
          poster: "/images/posters/wick.jpg",
          portrait: "/images/posters/wickportrait.jpg",
          trailerLink: null,
        });
      } finally {
        setLoading(false);
      }
    }

    if (movieId) {
      getMovieDetail();
      fetchReviews();
    }

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUser(payload);
      } catch (e) {
        console.error("Failed to parse token payload", e);
      }
    }
  }, [movieId]);

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length
        ).toFixed(1)
      : null;

  const handlePostReview = async (e) => {
    e.preventDefault();
    setReviewError("");
    setReviewSuccess("");

    if (!newDescription.trim()) {
      setReviewError("Please type in a description for your review.");
      return;
    }

    if (!currentUser || !currentUser.id) {
      setReviewError("Session not recognized. Please log in again.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("http://localhost:5000/review/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser.id,
          filmId: movieId,
          description: newDescription,
          rating: newRating,
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned invalid non-JSON output.");
      }

      const resData = await response.json();

      if (response.ok) {
        setReviewSuccess("Review submitted successfully!");
        setNewDescription("");
        setNewRating(5);
        fetchReviews();
      } else {
        setReviewError(resData.message || "Failed to submit review.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setReviewError("Could not connect to backend server.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoToCinematic = (showtimeId) => {
    if (showtimeId) {
      router.push(`/movie/${movieId}?mode=cinematic&showtimeId=${showtimeId}`);
    } else {
      router.push(`/movie/${movieId}?mode=cinematic`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0b10] flex items-center justify-center text-zinc-500 font-black tracking-widest uppercase animate-pulse">
        Sourcing Film Files...
      </div>
    );
  }

  if (!movie) return null;

  if (isCinematicMode) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black">
        <CinemaBooking
          movie={movie}
          onBack={() => router.push(`/movie/${movieId}`)}
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-[#0a0b10] text-white overflow-y-auto">
      <div className="fixed top-0 right-0 w-full lg:w-[70%] h-full z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0b10] via-[#0a0b10]/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b10] via-transparent to-transparent z-10" />
        <img
          src={movie.portrait}
          alt={movie.title}
          className="w-full h-full object-cover object-top"
          onError={(e) => {
            e.currentTarget.src =
              movie.poster ||
              "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80";
          }}
        />
      </div>

      <div className="relative z-20 flex flex-col pt-32 px-8 md:px-20">
        <div className="min-h-[70vh] flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-6 mb-8 text-gray-400 font-medium"
          >
            <span>Today</span>
            <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
            <span className="uppercase text-sm tracking-widest text-cyan-500 font-bold">
              {movie.genre}
            </span>
            {(avgRating || movie.rating) && (
              <>
                <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                <span className="text-sm font-bold text-amber-400">
                  ★{" "}
                  {avgRating
                    ? `${avgRating} (${reviews.length} ${reviews.length === 1 ? "review" : "reviews"})`
                    : movie.rating}
                </span>
              </>
            )}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-6xl md:text-[8rem] font-black uppercase tracking-tighter mb-4 leading-[0.9]"
          >
            {movie.title.includes(" ") ? (
              <>
                {movie.title.split(" ")[0]} <br />{" "}
                {movie.title.split(" ").slice(1).join(" ")}
              </>
            ) : (
              movie.title
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl text-gray-400 mb-10 max-w-xl bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/5"
          >
            {movie.description}
          </motion.p>

          <div className="mb-10 max-w-xl">
            {showtimes && showtimes.length > 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3 backdrop-blur-md">
                <p className="text-[10px] uppercase tracking-widest font-bold text-cyan-400">
                  Select a Showtime to Reserve Seats
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {showtimes.map((st) => (
                    <button
                      key={st.showtimeId}
                      disabled={st.isPast}
                      onClick={() => handleGoToCinematic(st.showtimeId)}
                      className={`flex flex-col border rounded-lg px-3 py-2 text-center min-w-[75px] transition-all relative overflow-hidden ${
                        st.isPast
                          ? "bg-zinc-950/40 border-zinc-800/50 opacity-25 line-through cursor-not-allowed pointer-events-none select-none"
                          : "bg-black/40 border-white/5 hover:border-cyan-500/50 hover:bg-cyan-950/20 active:scale-95 cursor-pointer"
                      }`}
                    >
                      <span
                        className={`text-[9px] font-medium ${st.isPast ? "text-zinc-600" : "text-white/40"}`}
                      >
                        {st.date}
                      </span>
                      <span
                        className={`text-xs font-black mt-0.5 ${st.isPast ? "text-zinc-500" : "text-white"}`}
                      >
                        {st.startTime}
                      </span>
                      <span
                        className={`text-[8px] font-bold uppercase tracking-tight mt-0.5 truncate max-w-[70px] ${st.isPast ? "text-zinc-600" : "text-cyan-500/80"}`}
                      >
                        {st.screenName}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-left font-bold tracking-wider text-red-400/90 bg-red-500/5 border border-red-500/10 p-4 rounded-2xl backdrop-blur-md text-xs uppercase">
                ❌ No showtimes currently scheduled for this film.
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-20">
            {movie.trailerLink ? (
              <a
                href={movie.trailerLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-10 py-5 rounded-full border border-cyan-500/30 bg-cyan-950/20 text-cyan-400 font-bold hover:bg-cyan-500 hover:text-black transition-all shadow-lg shadow-cyan-500/10 active:scale-95 cursor-pointer"
              >
                ▶ Watch on YouTube
                <svg className="w-4 h-4 ml-1 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ) : (
              <button 
                disabled
                className="px-10 py-5 rounded-full border border-white/5 text-zinc-600 font-bold cursor-not-allowed opacity-50"
              >
                No Trailer Available
              </button>
            )}
          </div>
        </div>

        {/* REVIEWS SECTION */}
        <section className="mt-20 mb-32 max-w-4xl">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-10 italic">
            User <span className="text-cyan-500">Reviews</span>
          </h2>

          {!currentUser ? (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] mb-12 text-center">
              <div className="text-3xl mb-4">💬</div>
              <h3 className="text-lg font-black uppercase italic mb-2">
                Want to share your thoughts?
              </h3>
              <p className="text-xs text-zinc-400 uppercase tracking-widest mb-6">
                Log in to write a review and rate this movie
              </p>
              <Link
                href="/login"
                className="inline-block bg-cyan-500 text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all shadow-lg shadow-cyan-500/40"
              >
                Log In to Review
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handlePostReview}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] mb-12"
            >
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-6">
                Write a review
              </h3>

              {reviewError && (
                <div className="mb-4 text-xs font-bold text-red-500 uppercase tracking-wider bg-red-500/10 border border-red-500/20 p-4 rounded-2xl">
                  {reviewError}
                </div>
              )}
              {reviewSuccess && (
                <div className="mb-4 text-xs font-bold text-green-500 uppercase tracking-wider bg-green-500/10 border border-green-500/20 p-4 rounded-2xl">
                  {reviewSuccess}
                </div>
              )}

              <div className="flex gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    disabled={submitting}
                    className={`text-2xl transition-colors ${
                      star <= newRating
                        ? "text-amber-400"
                        : "text-zinc-700 hover:text-amber-400"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                placeholder="Share your thoughts about the film..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                disabled={submitting}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 outline-none focus:border-cyan-500 transition-all min-h-[120px] mb-6 text-white placeholder:text-zinc-500"
              />
              <button
                type="submit"
                disabled={submitting}
                className="bg-white text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-cyan-500 transition-all disabled:opacity-50"
              >
                {submitting ? "Posting..." : "Post Review"}
              </button>
            </form>
          )}

          <div className="space-y-6">
            {fetchingReviews ? (
              <div className="text-center py-10 text-zinc-500 font-bold uppercase tracking-widest animate-pulse">
                Fetching audience opinions...
              </div>
            ) : reviews.length === 0 ? (
              <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 text-center text-zinc-500">
                <p className="text-xs font-black uppercase tracking-widest mb-1">
                  No reviews yet
                </p>
                <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-600">
                  Be the first to share your thoughts on this film!
                </p>
              </div>
            ) : (
              reviews.map((review) => {
                const displayName =
                  review.first_name || review.last_name
                    ? `${review.first_name || ""} ${review.last_name || ""}`.trim()
                    : review.email || "Anonymous User";
                const dateText = review.created_at
                  ? new Date(review.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Recent Review";

                return (
                  <div
                    key={review.review_id}
                    className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.03] hover:border-white/10 transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-black uppercase text-sm tracking-tight">
                          {displayName}
                        </p>
                        <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mt-1">
                          {dateText}
                        </p>
                      </div>
                      <div className="flex text-amber-400 text-xs">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </div>
                    </div>
                    <p className="text-zinc-400 leading-relaxed text-sm whitespace-pre-wrap">
                      {review.description}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>

      <Footer />

      <Link
        href="/"
        className="absolute top-10 left-10 z-50 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-5 h-5"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Home
      </Link>
    </div>
  );
}

export default function MovieDetailPage() {
  return (
    <Suspense fallback={<div className="bg-black min-h-screen" />}>
      <MovieDetailContent />
    </Suspense>
  );
}