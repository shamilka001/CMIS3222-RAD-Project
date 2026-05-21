"use client"

import { useState, useEffect } from "react"
import Sidebar from "../../components/Sidebar"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Settings, Plus, Trash2, Edit2, Shield, X, Search } from "lucide-react"

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
    { label: "Total Bookings", value: "1,284", growth: "+12%" },
    { label: "Active Movies", value: movies.length > 0 ? movies.length.toString() : "24", growth: "Stable" },
    { label: "Revenue", value: "$12,450", growth: "+8%" },
    { label: "New Users", value: "142", growth: "+18%" }
  ]

  // Fetch all movies from backend on mount
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
  }, []);

  // Fetch all users/staff from backend on mount and tab switch
  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await fetch("http://localhost:5000/user", { cache: "no-store" });
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

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    }
  }, [activeTab]);

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
      const res = await fetch('http://localhost:5000/user/register', {
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
      const res = await fetch(`http://localhost:5000/user/${selectedStaff.user_id}`, {
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
      const res = await fetch(`http://localhost:5000/user/${userId}`, {
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
              {activeTab === 'overview' ? 'System Overview' : activeTab === 'movies' ? 'Movie Catalog & Reviews' : activeTab === 'users' ? 'User Directory' : activeTab}
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
                  {[1, 2, 3, 4].map((i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                      <td className="py-6 px-4 font-bold text-white/80">User_0{i}@gmail.com</td>
                      <td className="py-6 px-4 text-white/60">Dune: Part Two</td>
                      <td className="py-6 px-4 font-mono text-cyan-500">A1, A2</td>
                      <td className="py-6 px-4">
                        <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-[10px] font-black uppercase">Confirmed</span>
                      </td>
                    </tr>
                  ))}
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