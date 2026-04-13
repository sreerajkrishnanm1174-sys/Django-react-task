import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { ApiFetch } from "../../../../hooks/fetchapi/ApiFetch";
import userAuthStore from "../../../../store/userAuthstore";

function MenuListPage() {
  const { token } = userAuthStore();
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["menu-items", selectedDate],
    queryFn: () =>
      ApiFetch({
        url: `http://127.0.0.1:8000/api/show/?date=${selectedDate}`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
    enabled: !!token && !!selectedDate,
  });

  return (
    <div
      className="min-h-screen bg-[#f5f0e8] py-12 px-4"
      style={{ fontFamily: "'Jost', sans-serif" }}
    >
      {/* ── Date picker ── */}
      <div className="max-w-2xl mx-auto mb-6 flex items-center gap-3">
        <label className="text-xs tracking-[0.2em] uppercase text-[#b8955a] font-medium whitespace-nowrap">
          Menu date
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="flex-1 px-3 py-2 bg-white border border-[#d4c9a8] rounded text-sm text-[#2c2217] outline-none focus:border-[#b8955a] focus:ring-2 focus:ring-[#b8955a]/15 transition-colors"
        />
      </div>

      {/* ── States ── */}
      {isLoading && (
        <p className="text-center text-amber-700 italic mt-10">Loading menu...</p>
      )}
      {isError && (
        <p className="text-center text-red-500 mt-10">{error.message}</p>
      )}

      {/* ── Menu cards ── */}
      {!isLoading && !isError && data?.length === 0 && (
        <p className="text-center text-[#9e8a68] italic mt-10 font-['Cormorant_Garamond',serif] text-lg">
          No menus found for this date.
        </p>
      )}

      {data?.map((menu) => (
        <div
          key={menu.id}
          className="max-w-2xl mx-auto mb-10 bg-[#fffdf7] border border-[#e0d5c0] rounded-sm px-14 py-12"
          style={{
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.08), inset 0 0 0 6px #fffdf7, inset 0 0 0 7px #e8dfc8",
          }}
        >
          {/* ── Header ── */}
          <div className="text-center border-b border-[#d4c9a8] pb-8 mb-8 relative">
            <p className="text-[10px] tracking-[0.35em] uppercase text-[#b8955a] mb-2">
              Fine Dining Experience
            </p>
            <h1
              className="text-5xl font-semibold text-[#2c2217]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {menu.name}
            </h1>
            <p
              className="italic text-[#9e8a68] mt-2"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {new Date(menu.date).toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#fffdf7] px-3 text-[#b8955a] text-sm">
              ✦
            </span>
          </div>

          {/* ── Categories ── */}
          {menu.categories.map((category) => (
            <div key={category.id} className="mb-8">
              {/* Category heading */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-[#d4c9a8]" />
                <h3
                  className="text-lg font-semibold tracking-[0.12em] uppercase text-[#2c2217] whitespace-nowrap"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {category.name}
                </h3>
                <div className="flex-1 h-px bg-[#d4c9a8]" />
              </div>

              {/* Items */}
              {category.items?.length > 0 ? (
                category.items.map((item) => (
                  <div
                    key={item.id}
                    className="py-2.5 border-b border-dotted border-[#e8dfc8] last:border-none hover:bg-[#faf6ee] px-1 rounded transition-colors"
                  >
                    {/* Item name + veg dot */}
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`w-2.5 h-2.5 rounded-sm border-2 flex-shrink-0 ${
                          item.is_veg
                            ? "border-green-600 bg-green-500"
                            : "border-red-600 bg-red-500"
                        }`}
                      />
                      <span
                        className="text-[1.05rem] text-[#2c2217]"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        {item.name}
                      </span>
                    </div>

                    {/* Price variants */}
                    {item.prices?.length > 0 ? (
                      <div className="flex flex-wrap gap-x-4 gap-y-1 pl-5">
                        {item.prices.map((p) => (
                          <div
                            key={p.id}
                            className="flex items-baseline gap-1"
                          >
                            {/* Show quantity label only if it's not a single
                                unnamed price */}
                            {item.prices.length > 1 || p.quantity ? (
                              <span className="text-xs text-[#9e8a68] tracking-wide">
                                {p.quantity}
                              </span>
                            ) : null}
                            <span
                              className="font-semibold text-[#2c2217]"
                              style={{ fontFamily: "'Cormorant Garamond', serif" }}
                            >
                              <span className="text-sm font-normal text-[#9e8a68]">
                                ₹
                              </span>
                              {p.price}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p
                        className="pl-5 italic text-[#c8b99a] text-sm"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        Price not set
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p
                  className="italic text-[#c8b99a]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  No items available
                </p>
              )}
            </div>
          ))}

          {/* ── Footer ── */}
          <div className="text-center border-t border-[#d4c9a8] pt-6 mt-8 relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#fffdf7] px-3 text-[#b8955a] text-sm">
              ✦
            </span>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#c8b99a]">
              Thank you for dining with us
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MenuListPage;