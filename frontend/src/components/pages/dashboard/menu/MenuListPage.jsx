import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ApiFetch } from "../../../../hooks/fetchapi/ApiFetch";
import userAuthStore from "../../../../store/userAuthstore";

function MenuListPage() {
  const token = userAuthStore((state) => state.token);
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["menu-items"],
    queryFn: () =>
      ApiFetch({
        url: "http://127.0.0.1:8000/api/show/",
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      }),
    enabled: !!token,
  });

  if (isLoading) return <p className="text-center text-amber-700 italic mt-10">Loading menu...</p>;
  if (isError) return <p className="text-center text-red-500 mt-10">{error.message}</p>;

  return (
    <div className="min-h-screen bg-[#f5f0e8] py-12 px-4 font-['Jost',sans-serif]">
      {data.map((menu) => (
        <div
          key={menu.id}
          className="max-w-2xl mx-auto bg-[#fffdf7] border border-[#e0d5c0] rounded-sm shadow-xl px-14 py-12"
          style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.08), inset 0 0 0 6px #fffdf7, inset 0 0 0 7px #e8dfc8" }}
        >
          {/* Header */}
          <div className="text-center border-b border-[#d4c9a8] pb-8 mb-8 relative">
            <p className="text-[10px] tracking-[0.35em] uppercase text-[#b8955a] mb-2">
              Fine Dining Experience
            </p>
            <h1 className="font-['Cormorant_Garamond',serif] text-5xl font-semibold text-[#2c2217]">
              {menu.name}
            </h1>
            <p className="font-['Cormorant_Garamond',serif] italic text-[#9e8a68] mt-2">
              Crafted with care, served with love
            </p>
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#fffdf7] px-3 text-[#b8955a] text-sm">
              ✦
            </span>
          </div>

          {/* Categories */}
          {menu.categories.map((category) => (
            <div key={category.id} className="mb-8">
              {/* Category heading */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-[#d4c9a8]" />
                <h3 className="font-['Cormorant_Garamond',serif] text-lg font-semibold tracking-[0.12em] uppercase text-[#2c2217] whitespace-nowrap">
                  {category.name}
                </h3>
                <div className="flex-1 h-px bg-[#d4c9a8]" />
              </div>

              {/* Items */}
              {category.items?.length > 0 ? (
                category.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-baseline gap-2 py-2 border-b border-dotted border-[#e8dfc8] last:border-none hover:bg-[#faf6ee] px-1 rounded transition-colors"
                  >
                    <span className="font-['Cormorant_Garamond',serif] text-[1.05rem] text-[#2c2217] shrink-0">
                      {item.name}
                    </span>
                    <span className="flex-1 border-b border-dotted border-[#c8b99a] mb-1 min-w-[20px]" />
                    <span className="font-['Cormorant_Garamond',serif] font-semibold text-[#2c2217] shrink-0">
                      <span className="text-sm font-normal text-[#9e8a68]">₹</span>
                      {item.price}
                    </span>
                  </div>
                ))
              ) : (
                <p className="font-['Cormorant_Garamond',serif] italic text-[#c8b99a]">
                  No items available
                </p>
              )}
            </div>
          ))}

          {/* Footer */}
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