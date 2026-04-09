import React from 'react'
import { create } from "zustand";

const userAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("access") || null, // ✅ restore on reload

  isLoggedIn: !!localStorage.getItem("access"), // ✅ restore on reload 

  setAuth: ({ user, token }) => { // ✅ FIXED
    localStorage.setItem("access", token);
    set({ user, token, isLoggedIn: true });
  },

  logout: () => {
    localStorage.removeItem("access");
    set({ user: null, token: null, isLoggedIn: false });
  },
}));

export default userAuthStore;