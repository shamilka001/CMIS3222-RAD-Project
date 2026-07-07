export async function apiRequest(url, options = {}) {
  // Pull your token from wherever you store it (localStorage/cookies)
  const token = localStorage.getItem("token"); 
  
  options.headers = {
    ...options.headers,
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(url, options);

  // Catch the expired or missing token status code globally
  if (response.status === 401) {
    localStorage.removeItem("token"); // Clear out the invalid token
    alert("Your session has expired. Please login again.");
    window.location.href = "/login";   // Kick back to login screen
    return null;
  }

  return response.json();
}