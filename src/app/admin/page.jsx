"use client"

import { useState, useEffect } from "react"
import Sidebar from "../../components/Sidebar"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Settings, Plus, Trash2, Edit2, Shield, X, Search, Ticket, Calendar, TrendingUp, CheckCircle2, Clock, AlertTriangle, UserCheck, UserX } from "lucide-react"
import { authFetch } from "../../lib/api"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  
  // Movies & Reviews States
  const [movies, setMovies] = useState([])
  const [loadingMovies, setLoadingMovies] = useState(false)
  const [expandedMovieId, setExpandedMovieId] = useState(null)
  const [movieReviews, setMovieReviews] = useState({})
  const [loadingReviews, setLoadingReviews] = useState({})

  // User Management States
  const [allUsers, setAllUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [usersSubTab, setUsersSubTab] = useState('guests') // 'guests' or 'staff'
  const [searchQuery, setSearchQuery] = useState('')

  // Bookings & Showtimes States
  const [allBookings, setAllBookings] = useState([])
  const [showtimes, setShowtimes] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(false)
  const [bookingsSearchQuery, setBookingsSearchQuery] = useState('')

  // Staff Form & Modal States
  const [showStaffModal, setShowStaffModal] = useState(null) // 'create', 'edit', or null
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [staffForm, setStaffForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: 'STAFF',
    status: 'ACTIVE'
  })
  const [staffFormError, setStaffFormError] = useState('')
  const [staffFormSubmitting, setStaffFormSubmitting] = useState(false)

  const stats = [
    { label: "Total Bookings", value: allBookings.length > 0 ? allBookings.length.toString() : "0", growth: allBookings.length > 0 ? "Live" : "Stable" },
    { label: "Active Movies", value: movies.length > 0 ? movies.length.toString() : "0", growth: "Stable" },
    { label: "Revenue", value: allBookings.length > 0 ? `$${(allBookings.reduce((sum, b) => sum + (b.total_seats * 12), 0)).toLocaleString()}` : "$0", growth: "Live" },
    { label: "Total Users", value: allUsers.length > 0 ? allUsers.length.toString() : "0", growth: "Live" }
  ]

  const activeGuestsCount = allUsers.filter(u => u.role !== 'STAFF' && u.status === 'ACTIVE').length;
  const suspendedGuestsCount = allUsers.filter(u => u.role !== 'STAFF' && u.status === 'SUSPENDED').length;
  const activeStaffCount = allUsers.filter(u => u.role === 'STAFF' && u.status === 'ACTIVE').length;
  const suspendedStaffCount = allUsers.filter(u => u.role === 'STAFF' && u.status === 'SUSPENDED').length;

  const usersChartData = [
    { label: "Active Guests", count: activeGuestsCount, gradient: "from-cyan-500 to-blue-600", icon: UserCheck, color: "text-cyan-500" },
    { label: "Suspended Guests", count: suspendedGuestsCount, gradient: "from-amber-500 to-red-600", icon: UserX, color: "text-amber-500" },
    { label: "Active Staff", count: activeStaffCount, gradient: "from-emerald-500 to-teal-600", icon: Shield, color: "text-emerald-500" },
    { label: "Suspended Staff", count: suspendedStaffCount, gradient: "from-purple-500 to-pink-600", icon: AlertTriangle, color: "text-purple-400" }
  ];

  const maxUsersVal = Math.max(...usersChartData.map(d => d.count), 1);

  const loadBookingsAndShowtimes = async () => {
    try {
      setLoadingBookings(true);
      const [bookingsRes, showtimesRes] = await Promise.all([
        authFetch("http://localhost:5000/booking", { cache: "no-store" }),
        fetch("http://localhost:5000/showtime", { cache: "no-store" })
      ]);
      const bookingsJson = await bookingsRes.json();
      const showtimesJson = await showtimesRes.json();
      if (bookingsJson && bookingsJson.data) {
        setAllBookings(bookingsJson.data);
      }
      if (showtimesJson && showtimesJson.data) {
        setShowtimes(showtimesJson.data);
      }
    } catch (err) {
      console.error("Failed to load bookings and showtimes in admin:", err);
    } finally {
      setLoadingBookings(false);
    }
  };

  // Fetch all users/staff from backend
  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await authFetch("http://localhost:5000/user", { cache: "no-store" });
      const responseData = await res.json();
      if (responseData && responseData.data) {
        setAllUsers(responseData.data);
      }
    } catch (err) {
      console.error("Failed to load users in admin:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Initial mount load
  useEffect(() => {
    async function loadMovies() {
      try {
        setLoadingMovies(true);
        const res = await fetch("http://localhost:5000/film/get-all-film", { cache: "no-store" });
        const responseData = await res.json();
        if (responseData && responseData.data) {
          setMovies(responseData.data);
        }
      } catch (err) {
        console.error("Failed to load movies in admin:", err);
      } finally {
        setLoadingMovies(false);
      }
    }
    loadMovies();
    loadUsers();
    loadBookingsAndShowtimes();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    }
    if (activeTab === 'bookings') {
      loadBookingsAndShowtimes();
    }
  }, [activeTab]);

  const getMovieForBooking = (booking) => {
    const showtime = showtimes.find(s => s.showtime_id === booking.showtime_id);
    return showtime ? showtime.film_name : "Unknown Film";
  };

  const handleExpandMovie = async (filmId) => {
    if (expandedMovieId === filmId) {
      setExpandedMovieId(null);
      return;
    }
    setExpandedMovieId(filmId);
    
    // Only fetch if reviews are not already in state cache
    if (!movieReviews[filmId]) {
      try {
        setLoadingReviews(prev => ({ ...prev, [filmId]: true }));
        const res = await fetch(`http://localhost:5000/review/${filmId}`, { cache: "no-store" });
        const responseData = await res.json();
        if (responseData && responseData.data) {
          setMovieReviews(prev => ({ ...prev, [filmId]: responseData.data }));
        }
      } catch (err) {
        console.error(`Failed to fetch reviews for film ${filmId}:`, err);
      } finally {
        setLoadingReviews(prev => ({ ...prev, [filmId]: false }));
      }
    }
  };

  // Staff CRUD Handlers
  const handleCreateStaff = async (e) => {
    e.preventDefault();
    setStaffFormSubmitting(true);
    setStaffFormError('');
    
    if (!staffForm.firstName || !staffForm.lastName || !staffForm.email || !staffForm.phoneNumber || !staffForm.password) {
      setStaffFormError('All fields are required to register staff.');
      setStaffFormSubmitting(false);
      return;
    }

    try {
      const res = await authFetch('http://localhost:5000/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: staffForm.firstName,
          lastName: staffForm.lastName,
          email: staffForm.email,
          phoneNumber: staffForm.phoneNumber,
          password: staffForm.password,
          role: 'STAFF',
          status: 'ACTIVE'
        })
      });
      const responseData = await res.json();
      if (res.ok) {
        setShowStaffModal(null);
        loadUsers();
      } else {
        setStaffFormError(responseData.message || 'Registration failed. Check details.');
      }
    } catch (err) {
      setStaffFormError('Connection to auth server failed.');
    } finally {
      setStaffFormSubmitting(false);
    }
  };

  const handleUpdateStaff = async (e) => {
    e.preventDefault();
    setStaffFormSubmitting(true);
    setStaffFormError('');

    if (!staffForm.firstName || !staffForm.lastName || !staffForm.phoneNumber) {
      setStaffFormError('First Name, Last Name, and Phone Number are required.');
      setStaffFormSubmitting(false);
      return;
    }

    try {
      const res = await authFetch(`http://localhost:5000/user/${selectedStaff.user_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: staffForm.firstName,
          lastName: staffForm.lastName,
          phoneNumber: staffForm.phoneNumber,
          role: 'STAFF',
          status: staffForm.status
        })
      });
      const responseData = await res.json();
      if (res.ok) {
        setShowStaffModal(null);
        loadUsers();
      } else {
        setStaffFormError(responseData.message || 'Failed to update user.');
      }
    } catch (err) {
      setStaffFormError('Connection to auth server failed.');
    } finally {
      setStaffFormSubmitting(false);
    }
  };

  const handleDeleteStaff = async (userId, email) => {
    if (!confirm(`Are you absolutely sure you want to remove staff member: ${email}? This action cannot be undone.`)) {
      return;
    }
    try {
      const res = await authFetch(`http://localhost:5000/user/${userId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        loadUsers();
      } else {
        alert('Failed to delete staff member.');
      }
    } catch (err) {
      console.error('Failed to delete staff:', err);
      alert('Connection error. Failed to delete staff.');
    }
  };

  const openCreateModal = () => {
    setStaffForm({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      role: 'STAFF',
      status: 'ACTIVE'
    });
    setStaffFormError('');
    setSelectedStaff(null);
    setShowStaffModal('create');
  };

  const openEditModal = (staff) => {
    setSelectedStaff(staff);
    setStaffForm({
      firstName: staff.first_name || '',
      lastName: staff.last_name || '',
      email: staff.email || '',
      phoneNumber: staff.phone_number || '',
      password: '',
      role: 'STAFF',
      status: staff.status || 'ACTIVE'
    });
    setStaffFormError('');
    setShowStaffModal('edit');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex p-4 gap-8">
      {/* BACKGROUND DECOR */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[150px] -z-10" />
      
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 pt-8 pr-8 overflow-y-auto max-h-[95vh] custom-scrollbar">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">
              {activeTab === 'overview' 
                ? 'System Overview' 
                : activeTab === 'movies' 
                ? 'Movie Catalog & Reviews' 
                : activeTab === 'users' 
                ? 'User Directory' 
                : activeTab === 'bookings'
                ? 'Cinema Bookings'
                : activeTab}
            </h1>
            <p className="text-white/40 text-sm uppercase tracking-[0.2em]">Dashboard / {activeTab}</p>
          </div>
          <div className="flex gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-cyan-500">
              AD
            </div>
          </div>
        </header>

        {/* OVERVIEW TAB CONTENT */}
        {activeTab === 'overview' && (
          <>
            {/* QUICK STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={stat.label}
                  className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-md"
                >
                  <p className="text-[10px] uppercase tracking-widest text-white/30 font-black mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-black">{stat.value}</h3>
                  <span className="text-[10px] text-cyan-500 font-bold">{stat.growth} this month</span>
                </motion.div>
              ))}
            </div>

            {/* ACTIVITY TABLE */}
            <div className="bg-white/[0.02] border border-white/10 rounded-[3rem] p-10">
              <h3 className="text-xl font-black uppercase italic mb-8">Recent Bookings</h3>
              <table className="w-full text-left">
                <thead>
                  <tr className="text-white/20 text-[10px] uppercase tracking-[0.3em] border-b border-white/5">
                    <th className="pb-6 px-4">User</th>
                    <th className="pb-6 px-4">Movie</th>
                    <th className="pb-6 px-4">Seats</th>
                    <th className="pb-6 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {allBookings.length > 0 ? (
                    allBookings.slice(0, 5).map((booking) => {
                      const movieName = getMovieForBooking(booking);
                      const userDisplayName = booking.first_name || booking.last_name
                        ? `${booking.first_name || ''} ${booking.last_name || ''}`.trim()
                        : booking.email || "Guest";
                      return (
                        <tr key={booking.booking_id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                          <td className="py-6 px-4 font-bold text-white/80">{userDisplayName}</td>
                          <td className="py-6 px-4 text-white/60">{movieName}</td>
                          <td className="py-6 px-4 font-mono text-cyan-500">{booking.seats ? booking.seats.join(', ') : 'N/A'}</td>
                          <td className="py-6 px-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                              booking.status === 'CONFIRMED' || booking.status === 'ACTIVE'
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                : booking.status === 'PENDING'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                              {booking.status || 'PENDING'}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-zinc-500 font-bold uppercase tracking-widest">
                        No recent bookings found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* MOVIES TAB CONTENT */}
        {activeTab === 'movies' && (
          <div className="space-y-8">
            <div className="bg-white/[0.02] border border-white/10 rounded-[3rem] p-10 backdrop-blur-md">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-black uppercase italic">All Cinema Movies</h3>
                  <p className="text-white/40 text-xs uppercase tracking-widest mt-1">Manage film catalog and view active guest reviews</p>
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl">
                  {movies.length} Total Films
                </div>
              </div>

              {loadingMovies ? (
                <div className="text-center py-20 text-zinc-500 font-bold uppercase tracking-[0.3em] animate-pulse">
                  Querying Movie Database...
                </div>
              ) : movies.length === 0 ? (
                <div className="text-center py-20 text-zinc-500 font-bold uppercase tracking-widest bg-white/[0.01] border border-white/5 rounded-2xl">
                  No movies found in the database.
                </div>
              ) : (
                <div className="space-y-6">
                  {movies.map((movie) => {
                    const isExpanded = expandedMovieId === movie.film_id;
                    const reviewsForMovie = movieReviews[movie.film_id] || [];
                    const isLoadingRev = loadingReviews[movie.film_id];

                    // Calculate average rating if reviews are loaded
                    const avgScore = reviewsForMovie.length > 0
                      ? (reviewsForMovie.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewsForMovie.length).toFixed(1)
                      : null;

                    return (
                      <div 
                        key={movie.film_id} 
                        className="bg-white/[0.01] border border-white/5 hover:border-white/10 rounded-[2rem] p-6 transition-all"
                      >
                        {/* Movie Header / Basic Info */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="flex items-center gap-6">
                            {/* Poster Thumbnail */}
                            <div className="w-16 h-20 rounded-xl overflow-hidden bg-zinc-900 border border-white/10 flex-shrink-0">
                              <img 
                                src={movie.poster_image || "/images/posters/fallback.jpg"} 
                                alt={movie.film_name} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=300&q=80";
                                }}
                              />
                            </div>
                            <div>
                              <h4 className="text-lg font-black uppercase italic tracking-tight">{movie.film_name || "Untitled Film"}</h4>
                              <div className="flex flex-wrap items-center gap-3 text-[10px] text-white/40 uppercase font-bold tracking-widest mt-1">
                                <span>{movie.genre || "Genre N/A"}</span>
                                <span className="w-1 h-1 bg-cyan-500 rounded-full" />
                                <span>{movie.duration ? `${movie.duration} Min` : "Duration N/A"}</span>
                                {avgScore && (
                                  <>
                                    <span className="w-1 h-1 bg-cyan-500 rounded-full" />
                                    <span className="text-amber-400">★ {avgScore} / 5</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 self-end md:self-auto">
                            <button
                              onClick={() => handleExpandMovie(movie.film_id)}
                              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                isExpanded 
                                  ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20" 
                                  : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                              }`}
                            >
                              {isExpanded ? "Hide Reviews" : "View Reviews"} 
                              {reviewsForMovie.length > 0 && ` (${reviewsForMovie.length})`}
                            </button>
                          </div>
                        </div>

                        {/* Collapsible Reviews Area */}
                        {isExpanded && (
                          <div className="mt-6 pt-6 border-t border-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
                            {isLoadingRev ? (
                              <div className="text-center py-6 text-zinc-500 text-[10px] font-bold uppercase tracking-widest animate-pulse">
                                Fetching reviews...
                              </div>
                            ) : reviewsForMovie.length === 0 ? (
                              <div className="py-6 text-center text-zinc-500 text-xs font-medium bg-white/[0.005] border border-dashed border-white/5 rounded-xl">
                                No guest reviews found for this movie.
                              </div>
                            ) : (
                              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                {reviewsForMovie.map((rev) => {
                                  const name = rev.first_name || rev.last_name
                                    ? `${rev.first_name || ""} ${rev.last_name || ""}`.trim()
                                    : rev.email || "Anonymous";
                                  return (
                                    <div 
                                      key={rev.review_id}
                                      className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col md:flex-row md:items-start justify-between gap-4"
                                    >
                                      <div className="space-y-2 flex-1">
                                        <div className="flex items-center gap-3">
                                          <span className="text-xs font-black uppercase tracking-tight text-white/80">{name}</span>
                                          {rev.email && (
                                            <span className="text-[9px] text-white/30 lowercase font-mono">({rev.email})</span>
                                          )}
                                        </div>
                                        <p className="text-xs text-white/60 leading-relaxed whitespace-pre-wrap">{rev.description}</p>
                                      </div>
                                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                        <div className="flex text-amber-400 text-xs">
                                          {"★".repeat(rev.rating || 0)}
                                          {"☆".repeat(5 - (rev.rating || 0))}
                                        </div>
                                        {rev.created_at && (
                                          <span className="text-[8px] text-white/20 uppercase tracking-widest font-bold">
                                            {new Date(rev.created_at).toLocaleDateString()}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* USERS TAB CONTENT */}
        {activeTab === 'users' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* USER METRICS BAR CHART */}
            <div className="bg-white/[0.02] border border-white/10 rounded-[3rem] p-8 flex flex-col lg:flex-row gap-8 backdrop-blur-md">
              {/* Vertical Bar Chart */}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-black uppercase italic tracking-tight">System Account Metrics</h3>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Guest vs Staff active status distribution</p>
                  </div>
                </div>

                <div className="h-48 flex items-end gap-6 px-4 border-b border-white/10 pb-2 relative">
                  {/* Grid Lines */}
                  <div className="absolute inset-x-0 top-0 h-px bg-white/5" />
                  <div className="absolute inset-x-0 top-[25%] h-px bg-white/5" />
                  <div className="absolute inset-x-0 top-[50%] h-px bg-white/5" />
                  <div className="absolute inset-x-0 top-[75%] h-px bg-white/5" />

                  {usersChartData.map((data, index) => {
                    const percentage = (data.count / maxUsersVal) * 100;
                    return (
                      <div key={data.label} className="flex-1 flex flex-col items-center h-full justify-end relative group">
                        {/* Bar */}
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${percentage}%` }}
                          transition={{ type: "spring", stiffness: 60, delay: index * 0.1 }}
                          className={`w-12 sm:w-16 bg-gradient-to-t ${data.gradient} rounded-t-xl relative flex items-start justify-center cursor-pointer`}
                        >
                          {/* Tooltip on hover */}
                          <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-black border border-white/20 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-lg transition-opacity pointer-events-none shadow-xl z-20 whitespace-nowrap">
                            {data.count} accounts
                          </div>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>

                {/* X Axis Labels */}
                <div className="flex gap-6 px-4 mt-3 text-center">
                  {usersChartData.map((data) => (
                    <div key={data.label} className="flex-1 text-[9px] uppercase tracking-wider font-black text-white/40">
                      {data.label.split(' ')[0]} <span className="block text-[8px] text-white/20 font-bold">{data.label.split(' ')[1]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Summary Panel */}
              <div className="w-full lg:w-80 bg-white/[0.01] border border-white/5 rounded-[2rem] p-6 flex flex-col justify-between">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500 mb-4">Database Summary</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-xs text-white/50 font-bold uppercase tracking-wider">Total Guests</span>
                      <span className="text-sm font-black text-white">{activeGuestsCount + suspendedGuestsCount}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-xs text-white/50 font-bold uppercase tracking-wider">Total Staff</span>
                      <span className="text-sm font-black text-white">{activeStaffCount + suspendedStaffCount}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-xs text-white/50 font-bold uppercase tracking-wider">Active Status Rate</span>
                      <span className="text-sm font-black text-green-400">
                        {allUsers.length > 0 
                          ? `${Math.round(((activeGuestsCount + activeStaffCount) / allUsers.length) * 100)}%` 
                          : "0%"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500">
                    <TrendingUp size={16} />
                  </div>
                  <span className="text-[9px] uppercase tracking-widest font-black text-white/40 leading-normal">
                    {allUsers.length} total registered profiles monitored
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/10 rounded-[3rem] p-10 backdrop-blur-md">
              
              {/* HEADER AREA */}
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8">
                <div>
                  <h3 className="text-xl font-black uppercase italic">User & Staff Directory</h3>
                  <p className="text-white/40 text-xs uppercase tracking-widest mt-1">Manage cinema users and administrative staff roles</p>
                </div>
                
                {/* SUB TABS & ACTIONS */}
                <div className="flex flex-wrap items-center gap-4">
                  {/* SEARCH BAR */}
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                    <input 
                      type="text"
                      placeholder={`Search ${usersSubTab}...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-xs w-60 focus:outline-none focus:border-cyan-500 transition-all placeholder:text-white/20"
                    />
                  </div>

                  {/* SUB-TABS */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-1 flex">
                    <button
                      onClick={() => { setUsersSubTab('guests'); setSearchQuery(''); }}
                      className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                        usersSubTab === 'guests'
                          ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      Guests ({allUsers.filter(u => u.role !== 'STAFF').length})
                    </button>
                    <button
                      onClick={() => { setUsersSubTab('staff'); setSearchQuery(''); }}
                      className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                        usersSubTab === 'staff'
                          ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      Staff ({allUsers.filter(u => u.role === 'STAFF').length})
                    </button>
                  </div>

                  {/* ADD STAFF BUTTON */}
                  {usersSubTab === 'staff' && (
                    <button
                      onClick={openCreateModal}
                      className="bg-cyan-500 hover:bg-cyan-400 text-black px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-cyan-500/10 cursor-pointer"
                    >
                      <Plus size={14} />
                      Add Staff
                    </button>
                  )}
                </div>
              </div>

              {/* LISTINGS PANEL */}
              {loadingUsers ? (
                <div className="text-center py-20 text-zinc-500 font-bold uppercase tracking-[0.3em] animate-pulse">
                  Querying User Database...
                </div>
              ) : (
                (() => {
                  const filteredList = allUsers
                    .filter(u => usersSubTab === 'staff' ? u.role === 'STAFF' : u.role !== 'STAFF')
                    .filter(u => {
                      if (!searchQuery) return true;
                      const q = searchQuery.toLowerCase();
                      const fullName = `${u.first_name || ''} ${u.last_name || ''}`.toLowerCase();
                      return (
                        u.email?.toLowerCase().includes(q) ||
                        fullName.includes(q) ||
                        u.phone_number?.includes(q)
                      );
                    });

                  if (filteredList.length === 0) {
                    return (
                      <div className="text-center py-20 text-zinc-500 font-bold uppercase tracking-widest bg-white/[0.01] border border-white/5 rounded-2xl">
                        No {usersSubTab} matching the filters.
                      </div>
                    );
                  }

                  return (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-white/20 text-[10px] uppercase tracking-[0.3em] border-b border-white/5">
                            <th className="pb-6 px-4">Profile</th>
                            <th className="pb-6 px-4">Email</th>
                            <th className="pb-6 px-4">Phone Number</th>
                            <th className="pb-6 px-4">Status</th>
                            {usersSubTab === 'staff' && <th className="pb-6 px-4 text-right">Actions</th>}
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          {filteredList.map((user) => {
                            const name = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'No Name';
                            const status = user.status || 'ACTIVE';
                            const isActive = status === 'ACTIVE';

                            return (
                              <tr key={user.user_id} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors group">
                                <td className="py-6 px-4">
                                  <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 flex items-center justify-center font-black uppercase text-sm">
                                      {name.charAt(0)}
                                    </div>
                                    <div>
                                      <span className="font-bold text-white/85 block">{name}</span>
                                      <span className="text-[9px] text-white/30 uppercase font-black tracking-wider block mt-0.5">{user.role || 'USER'}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-6 px-4 text-white/60 font-mono text-xs">{user.email}</td>
                                <td className="py-6 px-4 text-white/60 font-mono text-xs">{user.phone_number || 'N/A'}</td>
                                <td className="py-6 px-4">
                                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                                    isActive 
                                      ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                  }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-amber-400'}`} />
                                    {status}
                                  </span>
                                </td>
                                {usersSubTab === 'staff' && (
                                  <td className="py-6 px-4 text-right">
                                    <div className="flex items-center justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                                      <button 
                                        onClick={() => openEditModal(user)}
                                        className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500 hover:text-cyan-500 flex items-center justify-center transition-all cursor-pointer"
                                        title="Edit Staff Member"
                                      >
                                        <Edit2 size={12} />
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteStaff(user.user_id, user.email)}
                                        className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 hover:border-red-500 hover:text-red-500 flex items-center justify-center transition-all cursor-pointer"
                                        title="Remove Staff Member"
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    </div>
                                  </td>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                })()
              )}

            </div>
          </div>
        )}

        {/* BOOKINGS TAB CONTENT */}
        {activeTab === 'bookings' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* BOOKINGS METRICS */}
            {(() => {
              const totalBookingsCount = allBookings.length;
              const pendingBookingsCount = allBookings.filter(b => b.status === 'PENDING').length;
              const confirmedBookingsCount = allBookings.filter(b => b.status === 'CONFIRMED' || b.status === 'ACTIVE').length;
              const otherBookingsCount = totalBookingsCount - pendingBookingsCount - confirmedBookingsCount;

              const filteredBookings = allBookings.filter(b => {
                if (!bookingsSearchQuery) return true;
                const query = bookingsSearchQuery.toLowerCase();
                const movieName = getMovieForBooking(b).toLowerCase();
                const customerName = `${b.first_name || ''} ${b.last_name || ''}`.toLowerCase();
                const email = (b.email || '').toLowerCase();
                const seats = (b.seats || []).join(', ').toLowerCase();
                const status = (b.status || '').toLowerCase();
                
                return movieName.includes(query) || 
                       customerName.includes(query) || 
                       email.includes(query) || 
                       seats.includes(query) || 
                       status.includes(query);
              });

              return (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-md">
                      <p className="text-[10px] uppercase tracking-widest text-white/30 font-black mb-1">Total Bookings</p>
                      <h3 className="text-3xl font-black text-white">{totalBookingsCount}</h3>
                      <span className="text-[10px] text-cyan-500 font-bold">All processed orders</span>
                    </div>
                    <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-md">
                      <p className="text-[10px] uppercase tracking-widest text-white/30 font-black mb-1">Confirmed</p>
                      <h3 className="text-3xl font-black text-green-400">{confirmedBookingsCount}</h3>
                      <span className="text-[10px] text-zinc-500 font-bold">Ready for show</span>
                    </div>
                    <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-md">
                      <p className="text-[10px] uppercase tracking-widest text-white/30 font-black mb-1">Pending Approval</p>
                      <h3 className="text-3xl font-black text-amber-400">{pendingBookingsCount}</h3>
                      <span className="text-[10px] text-zinc-500 font-bold">Needs confirmation</span>
                    </div>
                    <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-md">
                      <p className="text-[10px] uppercase tracking-widest text-white/30 font-black mb-1">Cancelled / Other</p>
                      <h3 className="text-3xl font-black text-red-400">{otherBookingsCount}</h3>
                      <span className="text-[10px] text-zinc-500 font-bold">Void or failed</span>
                    </div>
                  </div>

                  {/* BOOKINGS LIST */}
                  <div className="bg-white/[0.02] border border-white/10 rounded-[3rem] p-10 backdrop-blur-md">
                    {/* HEADER AREA */}
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8">
                      <div>
                        <h3 className="text-xl font-black uppercase italic">Cinema Bookings</h3>
                        <p className="text-white/40 text-xs uppercase tracking-widest mt-1">Monitor bookings, active seats, and customer contact info</p>
                      </div>
                      
                      {/* SEARCH BAR */}
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                        <input 
                          type="text"
                          placeholder="Search bookings..."
                          value={bookingsSearchQuery}
                          onChange={(e) => setBookingsSearchQuery(e.target.value)}
                          className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-xs w-80 focus:outline-none focus:border-cyan-500 transition-all placeholder:text-white/20"
                        />
                      </div>
                    </div>

                    {/* LISTINGS PANEL */}
                    {loadingBookings ? (
                      <div className="text-center py-20 text-zinc-500 font-bold uppercase tracking-[0.3em] animate-pulse">
                        Querying Bookings Database...
                      </div>
                    ) : filteredBookings.length === 0 ? (
                      <div className="text-center py-20 text-zinc-500 font-bold uppercase tracking-widest bg-white/[0.01] border border-white/5 rounded-2xl">
                        No bookings matching the filters.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="text-white/20 text-[10px] uppercase tracking-[0.3em] border-b border-white/5">
                              <th className="pb-6 px-4">Customer</th>
                              <th className="pb-6 px-4">Movie Details</th>
                              <th className="pb-6 px-4">Showtime</th>
                              <th className="pb-6 px-4">Seats</th>
                              <th className="pb-6 px-4">Status</th>
                            </tr>
                          </thead>
                          <tbody className="text-sm">
                            {filteredBookings.map((booking) => {
                              const movieTitle = getMovieForBooking(booking);
                              const customerName = booking.first_name || booking.last_name
                                ? `${booking.first_name || ''} ${booking.last_name || ''}`.trim()
                                : "No Name";
                              const showtimeInfo = showtimes.find(s => s.showtime_id === booking.showtime_id);
                              
                              let dateString = "N/A";
                              if (showtimeInfo && showtimeInfo.show_date) {
                                dateString = new Date(showtimeInfo.show_date).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric"
                                });
                              }
                              
                              const timeString = showtimeInfo 
                                ? `${showtimeInfo.start_time?.slice(0, 5)} - ${showtimeInfo.end_time?.slice(0, 5)}`
                                : `${booking.start_time?.slice(0, 5)} - ${booking.end_time?.slice(0, 5)}`;
                                
                              return (
                                <tr key={booking.booking_id} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors group">
                                  {/* Customer Column */}
                                  <td className="py-6 px-4">
                                    <div className="flex items-center gap-4">
                                      <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 flex items-center justify-center font-black uppercase text-sm">
                                        {customerName.charAt(0)}
                                      </div>
                                      <div>
                                        <span className="font-bold text-white/85 block">{customerName}</span>
                                        <span className="text-[9px] text-white/30 lowercase font-mono block mt-0.5">{booking.email}</span>
                                      </div>
                                    </div>
                                  </td>
                                  {/* Movie Details Column */}
                                  <td className="py-6 px-4">
                                    <div>
                                      <span className="font-bold text-white/80 block uppercase italic tracking-tight">{movieTitle}</span>
                                      <span className="text-[9px] text-white/30 uppercase font-black tracking-wider block mt-0.5">
                                        {showtimeInfo?.screen_name || "Standard Screen"}
                                      </span>
                                    </div>
                                  </td>
                                  {/* Showtime Column */}
                                  <td className="py-6 px-4">
                                    <div>
                                      <span className="font-bold text-white/80 block">{dateString}</span>
                                      <span className="text-[9px] text-cyan-500/80 font-mono block mt-0.5">{timeString}</span>
                                    </div>
                                  </td>
                                  {/* Seats Column */}
                                  <td className="py-6 px-4">
                                    <div className="flex flex-wrap gap-1.5 max-w-[150px]">
                                      {booking.seats && booking.seats.map((seat) => (
                                        <span key={seat} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[10px] text-cyan-400 font-bold">
                                          {seat}
                                        </span>
                                      ))}
                                      {!booking.seats && <span className="text-white/30 text-xs font-medium">—</span>}
                                    </div>
                                  </td>
                                  {/* Status Column */}
                                  <td className="py-6 px-4">
                                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                                      booking.status === 'CONFIRMED' || booking.status === 'ACTIVE'
                                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                        : booking.status === 'PENDING'
                                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                                    }`}>
                                      <span className={`w-1.5 h-1.5 rounded-full ${
                                        booking.status === 'CONFIRMED' || booking.status === 'ACTIVE'
                                          ? 'bg-green-400 animate-pulse'
                                          : booking.status === 'PENDING'
                                          ? 'bg-amber-400 animate-pulse'
                                          : 'bg-red-400'
                                      }`} />
                                      {booking.status || 'PENDING'}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* SETTINGS TAB CONTENT */}
        {activeTab === 'settings' && (
          <div className="bg-white/[0.02] border border-white/10 rounded-[3rem] p-10 text-center py-20 backdrop-blur-md">
            <Settings className="mx-auto text-cyan-500 mb-6" size={48} />
            <h3 className="text-xl font-black uppercase italic mb-2">System Settings</h3>
            <p className="text-white/40 text-xs uppercase tracking-widest max-w-md mx-auto">Global configurations, pricing matrix, cinema scheduling rules, and payment gateways.</p>
          </div>
        )}
      </main>

      {/* STAFF CRUD MODAL */}
      <AnimatePresence>
        {showStaffModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#0c0c0c] border border-white/10 rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl relative"
            >
              {/* CLOSE BUTTON */}
              <button
                onClick={() => setShowStaffModal(null)}
                className="absolute right-6 top-6 h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all cursor-pointer"
              >
                <X size={14} />
              </button>

              {/* HEADER */}
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 flex items-center justify-center">
                  <Shield size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase italic tracking-tight">
                    {showStaffModal === 'create' ? 'Add Staff Member' : 'Edit Staff Details'}
                  </h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                    {showStaffModal === 'create' ? 'Register new administrative login' : 'Modify staff privileges and information'}
                  </p>
                </div>
              </div>

              {/* FORM */}
              <form onSubmit={showStaffModal === 'create' ? handleCreateStaff : handleUpdateStaff} className="space-y-4">
                {staffFormError && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-bold">
                    {staffFormError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">First Name</label>
                    <input
                      type="text"
                      required
                      value={staffForm.firstName}
                      onChange={(e) => setStaffForm({ ...staffForm, firstName: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-cyan-500 transition-all text-white placeholder:text-white/20"
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Last Name</label>
                    <input
                      type="text"
                      required
                      value={staffForm.lastName}
                      onChange={(e) => setStaffForm({ ...staffForm, lastName: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-cyan-500 transition-all text-white placeholder:text-white/20"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Email Address</label>
                  <input
                    type="email"
                    required
                    disabled={showStaffModal === 'edit'}
                    value={staffForm.email}
                    onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                    className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-cyan-500 transition-all text-white placeholder:text-white/20 ${
                      showStaffModal === 'edit' ? 'opacity-40 cursor-not-allowed border-white/5' : ''
                    }`}
                    placeholder="employee@maxlite.com"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={staffForm.phoneNumber}
                    onChange={(e) => setStaffForm({ ...staffForm, phoneNumber: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-cyan-500 transition-all text-white placeholder:text-white/20"
                    placeholder="+94771234567"
                  />
                </div>

                {showStaffModal === 'create' && (
                  <div className="space-y-1">
                    <label className="block text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Password</label>
                    <input
                      type="password"
                      required
                      value={staffForm.password}
                      onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-cyan-500 transition-all text-white placeholder:text-white/20"
                      placeholder="••••••••"
                    />
                  </div>
                )}

                {showStaffModal === 'edit' && (
                  <div className="space-y-1">
                    <label className="block text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Account Status</label>
                    <select
                      value={staffForm.status}
                      onChange={(e) => setStaffForm({ ...staffForm, status: e.target.value })}
                      className="w-full bg-[#0c0c0c] border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-cyan-500 transition-all text-white uppercase font-bold tracking-wider"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="SUSPENDED">SUSPENDED</option>
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={staffFormSubmitting}
                  className="w-full bg-cyan-500 hover:bg-white text-black font-black py-4 rounded-xl transition-all active:scale-[0.98] mt-6 shadow-lg shadow-cyan-500/10 uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {staffFormSubmitting ? 'Processing...' : showStaffModal === 'create' ? 'Register Staff' : 'Save Changes'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}