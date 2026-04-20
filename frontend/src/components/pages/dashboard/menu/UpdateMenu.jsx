import { useQuery, useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { ApiFetch, BASE_URL } from "../../../../hooks/fetchapi/ApiFetch";
import userAuthStore from "../../../../store/userAuthstore";

function UpdateMenu() {
  const { token } = userAuthStore();

  const today = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(today);
  const [version, setVersion] = useState("");
  const [menus, setMenus] = useState([]);

  // ─── Fetch ───
  const { isLoading } = useQuery({
    queryKey: ["menus-update", selectedDate, version],
    queryFn: async () => {
      const res = await ApiFetch({
        url: `http://127.0.0.1:8000/api/show/?date=${selectedDate}&version=${version}`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenus(res);
      return res;
    },
    enabled: !!token && !!selectedDate,
  });

  // ─── Update Mutation (FormData) ───
  const updateMutation = useMutation({
    mutationFn: async (menu) => {
      try {
        const formData = new FormData();

        formData.append("name", menu.name);
        formData.append("date", menu.date);
        formData.append("version", menu.version);

        // 🔥 Important: send as JSON string
        formData.append("categories", JSON.stringify(menu.categories));

        // Attach images
        menu.categories.forEach((cat, ci) => {
          cat.items.forEach((item, ii) => {
            if (item.newImageFile) {
              formData.append(`image_${ci}_${ii}`, item.newImageFile);
            }
          });
        });

        const res = await ApiFetch({
          url: `http://127.0.0.1:8000/api/menu-update/${menu.id}/`,
          method: "PUT",
          data: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        return res;
      } catch (err) {
        // 🔥 CRITICAL for debugging
        console.log("UPDATE ERROR:", err.response?.data);
        throw err;
      }
    },
  });

  // ─── Delete Menu ───
  const deleteMutation = useMutation({
    mutationFn: (menuId) =>
      ApiFetch({
        url: `http://127.0.0.1:8000/api/menu-delete/${menuId}/`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }),
    onSuccess: (_, id) => {
      setMenus((prev) => prev.filter((m) => m.id !== id));
    },
  });

  // ─── Handlers ───
  const handleItemChange = (menuId, catId, itemId, field, value) => {
    setMenus((prev) =>
      prev.map((menu) =>
        menu.id === menuId
          ? {
              ...menu,
              categories: menu.categories.map((cat) =>
                cat.id === catId
                  ? {
                      ...cat,
                      items: cat.items.map((item) =>
                        item.id === itemId ? { ...item, [field]: value } : item,
                      ),
                    }
                  : cat,
              ),
            }
          : menu,
      ),
    );
  };

  const handleImageChange = (menuId, catId, itemId, file) => {
    setMenus((prev) =>
      prev.map((menu) =>
        menu.id === menuId
          ? {
              ...menu,
              categories: menu.categories.map((cat) =>
                cat.id === catId
                  ? {
                      ...cat,
                      items: cat.items.map((item) =>
                        item.id === itemId
                          ? {
                              ...item,
                              newImageFile: file,
                              preview: URL.createObjectURL(file),
                            }
                          : item,
                      ),
                    }
                  : cat,
              ),
            }
          : menu,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6f2] to-[#eee6d6] p-6">
      {/* Filters */}
      <div className="max-w-6xl mx-auto flex gap-4 mb-8">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 rounded-lg border"
        />

        <input
          placeholder="Version"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          className="px-3 py-2 rounded-lg border"
        />
      </div>

      {isLoading && <p className="text-center">Loading...</p>}

      <div className="max-w-6xl mx-auto space-y-8">
        {menus.map((menu) => (
          <div
            key={menu.id}
            className="bg-white rounded-2xl shadow-lg p-6 border"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {menu.name} ({menu.version})
              </h2>

              <button
                onClick={() => deleteMutation.mutate(menu.id)}
                className="text-red-500 text-sm hover:underline"
              >
                Delete Menu
              </button>
            </div>

            {menu.categories.map((cat) => (
              <div key={cat.id} className="mb-6">
                <h3 className="font-medium mb-3 border-l-4 pl-2">{cat.name}</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  {cat.items.map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-xl p-4 hover:shadow-md transition"
                    >
                      {/* Image */}
                      <img
                        src={
                          item.preview
                            ? item.preview
                            : `${BASE_URL}${item.image}`
                        }
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />

                      <input
                        type="file"
                        onChange={(e) =>
                          handleImageChange(
                            menu.id,
                            cat.id,
                            item.id,
                            e.target.files[0],
                          )
                        }
                        className="mb-2 text-sm"
                      />

                      {/* Name */}
                      <input
                        value={item.name}
                        onChange={(e) =>
                          handleItemChange(
                            menu.id,
                            cat.id,
                            item.id,
                            "name",
                            e.target.value,
                          )
                        }
                        className="border px-2 py-1 w-full mb-2"
                      />

                      {/* Prices */}
                      {item.prices.map((p) => (
                        <div key={p.id} className="flex gap-2 mb-1">
                          <span className="text-sm">{p.quantity}</span>
                          <input
                            value={p.price}
                            onChange={(e) =>
                              handleItemChange(
                                menu.id,
                                cat.id,
                                item.id,
                                "prices",
                                item.prices.map((price) =>
                                  price.id === p.id
                                    ? { ...price, price: e.target.value }
                                    : price,
                                ),
                              )
                            }
                            className="border px-2 py-1 w-24"
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Save */}
            <button
              onClick={() => updateMutation.mutate(menu)}
              className="mt-4 px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Save Changes
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UpdateMenu;
