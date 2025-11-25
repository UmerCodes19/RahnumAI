// utils/api.js
export const api = {
  signUp: async (role, userData) => {
    console.log("Signing up user:", role, userData);
    return new Promise((resolve) => {
      setTimeout(() => {
        const stored = JSON.parse(localStorage.getItem("users") || "{}");
        stored[role] = [...(stored[role] || []), userData];
        localStorage.setItem("users", JSON.stringify(stored));
        resolve({ success: true });
      }, 500);
    });
  },

  login: async (role, identifier, password) => {
    console.log("Logging in user:", role, identifier);
    return new Promise((resolve) => {
      setTimeout(() => {
        const stored = JSON.parse(localStorage.getItem("users") || "{}");
        const user = (stored[role] || []).find(u =>
          (u.email === identifier || u.username === identifier || u.enroll === identifier) &&
          u.pass === password
        );
        
        if (user) {
          resolve({ 
            success: true, 
            user: {
              id: Date.now(),
              role: role,
              name: user.name || identifier,
              email: user.email || identifier,
              ...user
            }
          });
        } else {
          resolve({ success: false });
        }
      }, 500);
    });
  }
};