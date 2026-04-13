import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import userAuthStore from "../../../store/userAuthstore";



// Replace with useQuery to your notifications endpoint
const NOTIFICATIONS = [
  { id: 1, text: "New order #1042 — Table 4", time: "2 min ago", read: false },
  { id: 2, text: "Butter Chicken marked unavailable", time: "15 min ago", read: false },
  { id: 3, text: "Lunch menu published successfully", time: "1 hr ago", read: true },
];

export default function Topbar({nav_links}) {
  const navigate = useNavigate();
  const { user, logout } = userAuthStore();

  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;
  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "CK";

  return (
    <header
      className="sticky top-0 z-40 flex h-14 items-center border-b border-gray-200 bg-white px-5"
      style={{ fontFamily: "'Jost', sans-serif" }}
    >
      {/* Logo */}
      <a href="/dashboard" className="flex items-center gap-2.5 flex-shrink-0 no-underline">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2c2217]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2C5.8 2 4 3.8 4 6c0 1.5.8 2.8 2 3.5V11h4V9.5c1.2-.7 2-2 2-3.5 0-2.2-1.8-4-4-4z" fill="#f5c97a" />
            <rect x="5.5" y="11.5" width="5" height="1.5" rx="0.75" fill="#b8955a" />
            <rect x="6.5" y="13.5" width="3" height="1" rx="0.5" fill="#b8955a" />
          </svg>
        </div>
        <span className="text-[15px] font-medium text-gray-900 tracking-tight">
          Infolks <span className="text-[#b8955a]">Kitchen</span>
        </span>
      </a>

      <div className="mx-5 h-6 w-px bg-gray-200 flex-shrink-0" />

      {/* Nav */}
      <nav className="flex flex-1 items-center gap-0.5">
        {nav_links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] transition-colors no-underline
              ${isActive
                ? "bg-gray-100 font-medium text-gray-900"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`
            }
          >
            {icon}{label}
          </NavLink>
        ))}
      </nav>

      {/* Right */}
      <div className="flex items-center gap-2 flex-shrink-0">

        {/* Notifications */}
        {/* <DropdownMenu
          width="260px"
          trigger={
            <button className="relative flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-800">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a5.5 5.5 0 00-5.5 5.5v2.3L1 10.5V11h14v-.5l-1.5-1.7V6.5A5.5 5.5 0 008 1zm0 13.5a1.5 1.5 0 01-1.5-1.5h3A1.5 1.5 0 018 14.5z" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute right-[5px] top-[5px] h-[7px] w-[7px] rounded-full border-[1.5px] border-white bg-red-500" />
              )}
            </button>
          }
        >
          <DropdownLabel>Notifications</DropdownLabel>
          <DropdownSeparator />
          {NOTIFICATIONS.map((n) => (
            <div key={n.id} className="flex items-start gap-2 px-3 py-2 mx-1 rounded-lg hover:bg-gray-50 cursor-pointer">
              <span className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${n.read ? "bg-gray-300" : "bg-blue-500"}`} />
              <div>
                <p className="text-[12px] leading-snug text-gray-800">{n.text}</p>
                <p className="mt-0.5 text-[11px] text-gray-400">{n.time}</p>
              </div>
            </div>
          ))}
        </DropdownMenu> */}

        {/* User menu */}
        {/* <DropdownMenu
          trigger={
            <button className="flex items-center gap-2 rounded-lg border border-gray-200 py-1 pl-1 pr-2.5 transition-colors hover:bg-gray-50">
              <div className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[#2c2217] text-[11px] font-medium text-[#f5c97a]">
                {initials}
              </div>
              <div className="text-left">
                <p className="text-[13px] font-medium leading-tight text-gray-900">{user?.name ?? "Chef Kumar"}</p>
                <p className="text-[11px] leading-tight text-gray-400">{user?.role ?? "Admin"}</p>
              </div>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-gray-400 ml-0.5">
                <path d="M2 4l4 4 4-4" />
              </svg>
            </button>
          }
        >
          <DropdownItem label="Profile" onClick={() => navigate("/profile")}
            icon={<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a3.5 3.5 0 100 7A3.5 3.5 0 008 1zM2 13.5C2 11.6 4.7 10 8 10s6 1.6 6 3.5V14H2v-.5z" /></svg>}
          />
          <DropdownItem label="Settings" onClick={() => navigate("/settings")}
            icon={<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 2a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 9.5c-2.5 0-4-.9-4-1.5C4 9.7 5.7 9 8 9s4 .7 4 1.5c0 .6-1.5 1.5-4 1.5z" /></svg>}
          />
          <DropdownSeparator />
          <DropdownItem label="Sign out" danger onClick={() => { logout(); navigate("/login"); }}
            icon={<svg viewBox="0 0 16 16" fill="currentColor"><path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3v-1.5H4V3.5h2V2zm4.7 4.3l-1-1-1.1 1.1 1.2 1.1H5v1.5h4.8L8.6 10l1.1 1 2.7-2.4-1.7-2.3z" /></svg>}
          />
        </DropdownMenu> */}
      </div>
    </header>
  );
}