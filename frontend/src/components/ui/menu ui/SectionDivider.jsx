import React from "react";

function SectionDivider({ label }) {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-[#d4c9a8]" />
      <span
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
        className="text-sm font-semibold tracking-[0.12em] uppercase text-black whitespace-nowrap"
      >
        {label}
      </span>
      <div className="flex-1 h-px bg-[#d4c9a8]" />
    </div>
  );
}

export default SectionDivider;
