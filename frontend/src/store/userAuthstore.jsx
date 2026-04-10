import React from 'react'
import { create } from "zustand";
import { persist } from "zustand/middleware";

const userAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,

      setAuth: ({ user, token }) => {
        set({
          user,
          token,
          isLoggedIn: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isLoggedIn: false,
        });
      },
    }),
    {
      name: "auth-storage", // key in localStorage

      // ✅ Optional: persist only required fields
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);

export default userAuthStore;