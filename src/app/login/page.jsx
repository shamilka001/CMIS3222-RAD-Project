

// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { jwtDecode } from "jwt-decode";

// export default function LoginPage() {
//   const router = useRouter();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     setError("");
//     setLoading(true);

//     try {
//       const response = await fetch("http://localhost:5000/user/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         setError(data.message || "Invalid email or password");
//         return;
//       }

//       // Save token
//       localStorage.setItem("token", data.token);

//       // Decode token
//       const decoded = jwtDecode(data.token);

//       console.log("Decoded Token:", decoded);

//       /*
//       Example:
//       {
//         id: "...",
//         email: "admin1@gmail.com",
//         role: "STAFF",
//         iat: ...
//       }
//       */

//       localStorage.setItem("user", JSON.stringify(decoded));

//       // Notify navbar
//       window.dispatchEvent(new Event("auth-change"));

//       // Redirect based on role
//       if (decoded.role === "STAFF") {
//         router.push("/admin");
//       } else {
//         router.push("/profile");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Connection to server failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
//       <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full bg-blue-900/10 blur-[150px] -z-10" />

//       <div className="w-full max-w-md">
//         <div className="bg-white/5 p-10 rounded-[40px] border border-white/10 backdrop-blur-xl shadow-2xl">
//           <div className="text-center mb-10">
//             <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2">
//               Welcome <span className="text-cyan-500">Back</span>
//             </h1>

//             <p className="text-white/40 text-xs uppercase tracking-widest font-bold">
//               Log in to manage your movie bookings
//             </p>
//           </div>

//           <form onSubmit={handleLogin} className="space-y-6">
//             {error && (
//               <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-4 rounded-2xl text-center">
//                 {error}
//               </div>
//             )}

//             <div className="space-y-1">
//               <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">
//                 Email Address
//               </label>

//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//                 className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-500 text-white"
//                 placeholder="user@example.com"
//               />
//             </div>

//             <div className="space-y-1">
//               <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">
//                 Password
//               </label>

//               <input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//                 className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-500 text-white"
//                 placeholder="••••••••"
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-cyan-500 hover:bg-white text-black font-black py-5 rounded-2xl transition-all uppercase tracking-widest text-xs"
//             >
//               {loading ? "Logging In..." : "Log In"}
//             </button>
//           </form>

//           <div className="mt-8 text-center">
//             <p className="text-xs text-white/30 uppercase tracking-widest font-bold">
//               Don't have an account?{" "}
//               <Link
//                 href="/register"
//                 className="text-cyan-500 hover:text-white transition-colors"
//               >
//                 Sign Up
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Check on component mount if a token already exists but is expired
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          // Token is already expired, clear it silently on load
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.dispatchEvent(new Event("auth-change"));
        }
      } catch (err) {
        console.error("Error checking initial token validity:", err);
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid email or password");
        return;
      }

      // Save token
      localStorage.setItem("token", data.token);

      // Decode token
      const decoded = jwtDecode(data.token);
      console.log("Decoded Token:", decoded);

      localStorage.setItem("user", JSON.stringify(decoded));

      // --- AUTOMATIC CLEANUP SYSTEM ---
      // decoded.exp is in seconds, Date.now() is in milliseconds
      const expirationTime = decoded.exp * 1000; 
      const timeRemaining = expirationTime - Date.now();

      if (timeRemaining > 0) {
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.dispatchEvent(new Event("auth-change")); // Notify navbar
          alert("Your session has expired. Please log in again.");
          window.location.href = "/login"; // Force redirect
        }, timeRemaining);
      }
      // ---------------------------------

      // Notify navbar
      window.dispatchEvent(new Event("auth-change"));

      // Redirect based on role
      if (decoded.role === "STAFF") {
        router.push("/admin");
      } else {
        router.push("/profile");
      }
    } catch (err) {
      console.error(err);
      setError("Connection to server failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full bg-blue-900/10 blur-[150px] -z-10" />

      <div className="w-full max-w-md">
        <div className="bg-white/5 p-10 rounded-[40px] border border-white/10 backdrop-blur-xl shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2">
              Welcome <span className="text-cyan-500">Back</span>
            </h1>

            <p className="text-white/40 text-xs uppercase tracking-widest font-bold">
              Log in to manage your movie bookings
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-4 rounded-2xl text-center">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-500 text-white"
                placeholder="user@example.com"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-500 text-white"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-white text-black font-black py-5 rounded-2xl transition-all uppercase tracking-widest text-xs"
            >
              {loading ? "Logging In..." : "Log In"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-white/30 uppercase tracking-widest font-bold">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-cyan-500 hover:text-white transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}