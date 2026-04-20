import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { ApiFetch, BASE_URL } from "../../../../hooks/fetchapi/ApiFetch";
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
  console.log("Fetched menu data:", data);

 return (
  <div className="min-h-screen bg-gradient-to-br from-[#f8f6f2] to-[#efe9dd] py-10 px-4">
    {/* Header */}
    <div className="max-w-5xl mx-auto mb-8 flex items-center justify-between flex-wrap gap-4">
      <h1 className="text-2xl font-semibold text-[#2c2217]">
        Menu Overview
      </h1>

      <div className="flex items-center gap-3">
        <label className="text-xs uppercase tracking-wider text-[#8b7a5a]">
          Select Date
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 rounded-lg border border-[#d6ccb5] bg-white shadow-sm focus:ring-2 focus:ring-[#c5a46d] outline-none"
        />
      </div>
    </div>

    {/* States */}
    {isLoading && (
      <p className="text-center text-[#8b7a5a] mt-10">Loading menu...</p>
    )}

    {isError && (
      <p className="text-center text-red-500 mt-10">{error.message}</p>
    )}

    {!isLoading && !isError && data?.length === 0 && (
      <p className="text-center text-[#9e8a68] mt-10">
        No menus available for this date.
      </p>
    )}

    {/* Menu Cards */}
    <div className="max-w-5xl mx-auto space-y-8">
      {data?.map((menu) => (
        <div
          key={menu.id}
          className="bg-white/70 backdrop-blur-md border border-[#e5dccb] rounded-2xl p-8 shadow-lg"
        >
          {/* Menu Header */}
          <div className="mb-6">
            <h2 className="text-3xl font-semibold text-[#2c2217]">
              {menu.name}
            </h2>
            <p className="text-sm text-[#8b7a5a] mt-1">
              {new Date(menu.date).toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Categories */}
          <div className="space-y-8">
            {menu.categories.map((category) => (
              <div key={category.id}>
                <h3 className="text-lg font-semibold text-[#3a2e1f] mb-4 border-l-4 border-[#c5a46d] pl-3">
                  {category.name}
                </h3>

                {/* Items Grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {category.items?.length > 0 ? (
                    category.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4 rounded-xl bg-white border border-[#eee4d3] hover:shadow-md transition"
                      >
                        {/* Image */}
                        <img
                          src={`${BASE_URL}${item.image}`}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />

                        {/* Details */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`w-3 h-3 rounded-full ${
                                item.is_veg
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            />
                            <h4 className="font-medium text-[#2c2217]">
                              {item.name}
                            </h4>
                          </div>

                          {/* Prices */}
                          <div className="flex flex-wrap gap-2 mt-2">
                            {item.prices?.length > 0 ? (
                              item.prices.map((p) => (
                                <div
                                  key={p.id}
                                  className="px-2 py-1 bg-[#f5efe4] rounded-md text-sm"
                                >
                                  {p.quantity && (
                                    <span className="text-[#8b7a5a] mr-1">
                                      {p.quantity}
                                    </span>
                                  )}
                                  <span className="font-semibold">
                                    ₹{p.price}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <span className="text-sm text-[#b0a28a]">
                                No price
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-[#b0a28a]">
                      No items available
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);}

export default MenuListPage;