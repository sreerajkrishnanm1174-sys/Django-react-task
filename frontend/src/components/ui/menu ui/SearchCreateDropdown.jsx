import React, { useEffect, useRef, useState } from 'react'

function SearchCreateDropdown({
  value,
  onChange,
  options = [],
  placeholder = "Select or create",
  getLabel = (opt) => opt.name,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = options.filter((opt) =>
    getLabel(opt).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => {
          setOpen(!open);
          setSearch("");
        }}
        className={`w-full px-3 py-2 bg-white border rounded text-left text-sm flex justify-between items-center
        ${open ? "border-[#b8955a] ring-2 ring-[#b8955a]/15" : "border-gray-400"}`}
      >
        {value ? (
          <span className="flex items-center gap-2 text-black font-medium">
            {getLabel(value)}
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold
              ${
                value.isNew
                  ? "bg-[#fdf0e0] text-[#7a4010] border-[#d4a050]"
                  : "bg-[#e8f4f0] text-[#1a5c38] border-[#6dba8a]"
              }`}
            >
              {value.isNew ? "New" : "Existing"}
            </span>
          </span>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}

        <span
          className={`text-gray-600 text-xs ${
            open ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white border border-[#b8955a] rounded shadow-xl z-50 overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-gray-200">
            <input
              autoFocus
              className="w-full px-3 py-2 bg-[#f5f0e8] border border-gray-300 rounded text-sm"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* List */}
          <div className="max-h-48 overflow-y-auto">
            {filtered.length > 0 ? (
              filtered.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => {
                    onChange({ ...opt, isNew: false });
                    setOpen(false);
                  }}
                  className="px-4 py-2 text-sm cursor-pointer hover:bg-[#f5f0e8]"
                >
                  {getLabel(opt)}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No results
              </div>
            )}
          </div>

          {/* Create new */}
          {search && (
            <div
              onClick={() => {
                onChange({
                  id: null,
                  name: search,
                  isNew: true,
                });
                setOpen(false);
              }}
              className="px-4 py-2 text-sm text-[#7a4010] cursor-pointer border-t hover:bg-[#f5f0e8]"
            >
              + Create "{search}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchCreateDropdown