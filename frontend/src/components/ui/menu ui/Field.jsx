import React from 'react'

function Field({ label, children }) {
  return (
     <div className="mb-4">
      <label className="block text-xs tracking-widest uppercase text-black font-semibold mb-1">
        {label}
      </label>
      {children}
    </div>
  )
}

export default Field