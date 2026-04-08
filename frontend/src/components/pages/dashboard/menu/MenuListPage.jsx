import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ApiFetch } from "../../../../hooks/fetchapi/ApiFetch";

function MenuListPage() {
  const {
    data: items,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["menu-items"],
    queryFn: () =>
      ApiFetch({
        url: "http://127.0.0.1:8000/api/show/",
        method: "GET",
      }),
  });

  if (isLoading) return <p>Loading...</p>;

  if (isError) return <p>{error.message}</p>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Menu List</h2>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-3 border rounded-lg flex justify-between"
          >
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">{item.category}</p>
            </div>
            <span className="text-orange-500">₹{item.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MenuListPage;
