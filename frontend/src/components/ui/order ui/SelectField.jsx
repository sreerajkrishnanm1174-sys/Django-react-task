
function SelectField({ value, onChange, children, placeholder }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none px-3 py-2 border border-[#d4c9a8] rounded-lg text-[13px] bg-white text-[#2c2217] outline-none focus:border-[#b8955a] focus:ring-2 focus:ring-[#b8955a]/15 transition-colors"
      >
        <option value="">{placeholder}</option>
        {children}
      </select>
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M1 1l4 4 4-4" stroke="#9e8a68" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

export default SelectField;