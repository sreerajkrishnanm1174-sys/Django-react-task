import { useQuery, useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { ApiFetch } from "../../../../hooks/fetchapi/ApiFetch";
import SectionDivider from "../../../ui/menu ui/SectionDivider";
import Field from "../../../ui/menu ui/Field";
import SearchCreateDropdown from "../../../ui/menu ui/SearchCreateDropdown";
import userAuthStore from "../../../../store/userAuthstore";

// ── Helper: empty price row ─────────────────────────────────────
const newPrice = () => ({ id: Date.now() + Math.random(), quantity: "", price: "" });

// ── Helper: empty item ──────────────────────────────────────────
const newItem = () => ({
  id: Date.now() + Math.random(),
  name: "",
  isNew: false,
  is_veg: false,
  is_available: true,
  prices: [newPrice()],
});

// ── PriceRows: renders quantity/price pairs for one item ────────
function PriceRows({ prices, onAdd, onRemove, onChange }) {
  return (
    <div className="col-span-full">
      {prices.map((p, pi) => (
        <div
          key={p.id}
          className="grid gap-0"
          style={{ gridTemplateColumns: "1fr 110px 110px 32px" }}
        >
          <input
            className="border-t border-r border-gray-200 px-3 py-1.5 text-xs text-black bg-transparent outline-none placeholder-gray-400 focus:bg-[#fffbe8]"
            placeholder='e.g. Half, Full, 500g'
            value={p.quantity}
            onChange={(e) => onChange(pi, "quantity", e.target.value)}
          />
          <input
            type="number"
            className="border-t border-r border-gray-200 px-3 py-1.5 text-xs text-black text-right bg-transparent outline-none placeholder-gray-400 focus:bg-[#fffbe8]"
            placeholder="₹ 0"
            value={p.price}
            onChange={(e) => onChange(pi, "price", e.target.value)}
          />
          {/* spacer to align with Veg/Non-veg column */}
          <div className="border-t border-r border-gray-200" />
          <button
            type="button"
            onClick={() => onRemove(pi)}
            className={`border-t border-gray-200 flex items-center justify-center text-base transition-colors ${
              prices.length > 1
                ? "text-gray-400 hover:text-red-600"
                : "text-gray-200 cursor-default"
            }`}
          >
            ×
          </button>
        </div>
      ))}

      {/* Add price row */}
      <div
        className="grid border-t border-gray-200"
        style={{ gridTemplateColumns: "1fr 110px 110px 32px" }}
      >
        <div className="col-span-4 px-3 py-1 bg-[#f7f0e0]">
          <button
            type="button"
            onClick={onAdd}
            className="text-[11px] text-[#b8955a] font-medium hover:underline"
          >
            + Add quantity / price
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main: AddMenu ───────────────────────────────────────────────
function AddMenu() {
  const today = new Date().toISOString().split("T")[0];
  const { token } = userAuthStore();

  const [menu, setMenu] = useState({
    name: "",
    date: today,
    version: 1,
    is_active: true,
  });

  const [categories, setCategories] = useState([
    { id: Date.now(), selectedCat: null, display_order: 0, items: [] },
  ]);

  // ── Fetch existing categories ──
  const { data: existingCategories = [], isLoading: catsLoading } = useQuery({
    queryKey: ["all-categories"],
    queryFn: () =>
      ApiFetch({
        url: "http://127.0.0.1:8000/api/categories/",
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
  });

  // ── Category helpers ──
  const addCategory = () =>
    setCategories((prev) => [
      ...prev,
      { id: Date.now(), selectedCat: null, display_order: prev.length, items: [] },
    ]);

  const removeCategory = (ci) =>
    setCategories((prev) => prev.filter((_, i) => i !== ci));

  const selectCategory = (ci, cat) => {
    setCategories((prev) => {
      const updated = [...prev];
      updated[ci].selectedCat = cat;
      updated[ci].items =
        cat.isNew || !cat.items?.length
          ? [newItem()]
          : cat.items.map((src) => ({
              id: Date.now() + Math.random(),
              name: typeof src === "string" ? src : src.name,
              isNew: false,
              is_veg: src.is_veg ?? false,
              is_available: true,
              // Map existing prices array or fall back to single price field
              prices:
                src.prices?.length
                  ? src.prices.map((p) => ({
                      id: Date.now() + Math.random(),
                      quantity: p.quantity ?? "",
                      price: p.price ?? "",
                    }))
                  : [{ id: Date.now() + Math.random(), quantity: "", price: src.price ?? "" }],
            }));
      return updated;
    });
  };

  const updateCategoryOrder = (ci, val) =>
    setCategories((prev) => {
      const updated = [...prev];
      updated[ci].display_order = val;
      return updated;
    });

  // ── Item helpers ──
  const addItem = (ci) =>
    setCategories((prev) => {
      const updated = [...prev];
      updated[ci].items.push(newItem());
      return [...updated];
    });

  const removeItem = (ci, ii) => {
    if (categories[ci].items.length <= 1) return;
    setCategories((prev) => {
      const updated = [...prev];
      updated[ci].items.splice(ii, 1);
      return [...updated];
    });
  };

  const updateItem = (ci, ii, key, val) =>
    setCategories((prev) => {
      const updated = [...prev];
      updated[ci].items[ii][key] = val;
      return [...updated];
    });

  // ── Price helpers (per item) ──
  const addPrice = (ci, ii) =>
    setCategories((prev) => {
      const updated = [...prev];
      updated[ci].items[ii].prices.push(newPrice());
      return [...updated];
    });

  const removePrice = (ci, ii, pi) => {
    if (categories[ci].items[ii].prices.length <= 1) return;
    setCategories((prev) => {
      const updated = [...prev];
      updated[ci].items[ii].prices.splice(pi, 1);
      return [...updated];
    });
  };

  const updatePrice = (ci, ii, pi, key, val) =>
    setCategories((prev) => {
      const updated = [...prev];
      updated[ci].items[ii].prices[pi][key] = val;
      return [...updated];
    });

  // ── Submit ──
  const mutation = useMutation({
    mutationFn: () =>
      ApiFetch({
        url: "http://127.0.0.1:8000/api/menu-create/",
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          
        },
        body: {
          name: menu.name,
          date: menu.date,
          version: menu.version,
          is_active: menu.is_active,
          categories: categories.map((c) => ({
            name: c.selectedCat?.name ?? "",
           
            is_new: c.selectedCat?.isNew ?? false,
            existing_id: c.selectedCat?.isNew ? null : (c.selectedCat?.id ?? null),
            items: c.items.map((item) => ({
              name: item.name,
              is_veg: item.is_veg,
              is_available: item.is_available,
              // Quantity-based prices array — maps to MenuItemPrice model
              prices: item.prices
                .filter((p) => p.quantity.trim() !== "" || p.price !== "")
                .map((p) => ({
                  quantity: p.quantity.trim(),
                  price: p.price,
                })),
            })),
          })),
        }
      }),
    onSuccess: () => {
      alert("Menu published successfully!");
      setMenu({ name: "", date: today, version: 1, is_active: true });
      setCategories([{ id: Date.now(), selectedCat: null, display_order: 0, items: [] }]);
    },
    onError: (err) => alert("Error: " + err.message),
  });

  const inp =
    "w-full px-3 py-2 bg-white border border-gray-400 rounded text-sm text-black placeholder-gray-400 outline-none focus:border-[#b8955a] focus:ring-2 focus:ring-[#b8955a]/15 transition-colors";

  return (
    <div
      className="min-h-screen bg-[#f5f0e8] py-10 px-4"
      style={{ fontFamily: "'Jost', sans-serif" }}
    >
      <div
        className="max-w-2xl mx-auto bg-[#fffdf7] border border-[#e0d5c0] rounded-sm px-12 py-10"
        style={{
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.07), inset 0 0 0 6px #fffdf7, inset 0 0 0 7px #e8dfc8",
        }}
      >
        {/* ── Page header ── */}
        <div className="text-center border-b border-[#d4c9a8] pb-6 mb-6 relative">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#b8955a] mb-2">
            Chef's Dashboard
          </p>
          <h1
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
            className="text-4xl font-semibold text-black"
          >
            Create New Menu
          </h1>
          <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#fffdf7] px-3 text-[#b8955a] text-xs">
            ✦
          </span>
        </div>

        {/* ── Menu details ── */}
        <SectionDivider label="Menu details" />

        <Field label="Menu name">
          <input
            className={inp}
            placeholder="e.g. Today's Special, Lunch Menu"
            value={menu.name}
            onChange={(e) => setMenu({ ...menu, name: e.target.value })}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <Field label="Date">
            <input
              type="date"
              className={inp}
              value={menu.date}
              onChange={(e) => setMenu({ ...menu, date: e.target.value })}
            />
          </Field>
          <Field label="Version">
            <input
              type="number"
              className={inp}
              min={1}
              value={menu.version}
              onChange={(e) => setMenu({ ...menu, version: Number(e.target.value) })}
            />
          </Field>
        </div>

        <label className="flex items-center gap-3 mb-4 p-3 border border-gray-400 rounded cursor-pointer bg-white hover:border-[#b8955a] transition-colors">
          <input
            type="checkbox"
            className="w-4 h-4 cursor-pointer accent-[#b8955a]"
            checked={menu.is_active}
            onChange={(e) => setMenu({ ...menu, is_active: e.target.checked })}
          />
          <span className="text-sm text-black font-medium">Mark as active menu</span>
        </label>

        {/* ── Categories & Items ── */}
        <SectionDivider label="Categories & items" />

        {catsLoading && (
          <p className="text-sm text-gray-500 italic mb-3">Loading existing categories...</p>
        )}

        {categories.map((cat, ci) => (
          <div
            key={cat.id}
            className="mb-4 border border-gray-400 rounded overflow-visible"
          >
            {/* Category header row */}
            <div className="bg-[#ede0c8] px-3 py-2 flex items-center gap-2 border-b border-gray-400">
              <div className="flex-1">
                <SearchCreateDropdown
                  value={cat.selectedCat}
                  options={existingCategories.results}
                  placeholder="Select or create a category"
                  onChange={(selected) => selectCategory(ci, selected)}
                />
              </div>
              <input
                type="number"
                min={0}
                placeholder="Order"
                value={cat.display_order}
                onChange={(e) => updateCategoryOrder(ci, +e.target.value)}
                className="w-14 border border-gray-400 rounded px-2 py-1 text-xs text-black font-medium bg-white outline-none focus:border-[#b8955a]"
              />
              {categories.length > 1 && (
                <button
                  onClick={() => removeCategory(ci)}
                  className="text-gray-500 hover:text-red-600 text-xl leading-none transition-colors"
                >
                  ×
                </button>
              )}
            </div>

            {/* Items */}
            {cat.selectedCat ? (
              <>
                {/* Table column headers */}
                <div
                  className="grid bg-[#e0d0b0] border-b border-gray-300"
                  style={{ gridTemplateColumns: "1fr 110px 110px 32px" }}
                >
                  {["Item name", "Quantity", "Price ₹", ""].map((h, i) => (
                    <div
                      key={i}
                      className="px-3 py-1.5 text-xs tracking-wider uppercase text-black font-semibold"
                      style={{ textAlign: i === 2 ? "right" : "left" }}
                    >
                      {h}
                    </div>
                  ))}
                </div>

                {/* Item rows */}
                {cat.items.map((item, ii) => (
                  <div
                    key={item.id}
                    className={`border-b border-gray-200 last:border-none ${
                      ii % 2 === 0 ? "bg-white" : "bg-[#faf5ee]"
                    }`}
                  >
                    {/* Item name row + veg toggle + remove */}
                    <div
                      className="grid"
                      style={{ gridTemplateColumns: "1fr 110px 110px 32px" }}
                    >
                      {/* Name */}
                      <div className="border-r border-gray-200 px-1 py-1">
                        <SearchCreateDropdown
                          value={item}
                          options={cat.selectedCat?.items || []}
                          placeholder="Select or create item"
                          onChange={(selected) => {
                            updateItem(ci, ii, "name", selected.name);
                            updateItem(ci, ii, "isNew", selected.isNew || false);
                            // Prefill prices if the selected item has existing prices
                            if (selected.prices?.length) {
                              updateItem(
                                ci,
                                ii,
                                "prices",
                                selected.prices.map((p) => ({
                                  id: Date.now() + Math.random(),
                                  quantity: p.quantity ?? "",
                                  price: p.price ?? "",
                                }))
                              );
                            }
                          }}
                        />
                      </div>

                      {/* Quantity label for first price row (shown inline) */}
                      <input
                        className="border-r border-gray-200 px-3 py-2 text-sm text-black bg-transparent outline-none placeholder-gray-400 focus:bg-[#fffbe8]"
                        placeholder='Half / Full…'
                        value={item.prices[0]?.quantity ?? ""}
                        onChange={(e) => updatePrice(ci, ii, 0, "quantity", e.target.value)}
                      />

                      {/* Price for first row */}
                      <input
                        type="number"
                        className="border-r border-gray-200 px-3 py-2 text-sm text-black text-right bg-transparent outline-none placeholder-gray-400 focus:bg-[#fffbe8]"
                        placeholder="0"
                        value={item.prices[0]?.price ?? ""}
                        onChange={(e) => updatePrice(ci, ii, 0, "price", e.target.value)}
                      />

                      {/* Remove item */}
                      <button
                        type="button"
                        onClick={() => removeItem(ci, ii)}
                        className={`flex items-center justify-center text-lg transition-colors ${
                          cat.items.length > 1
                            ? "text-gray-400 hover:text-red-600"
                            : "text-gray-200 cursor-default"
                        }`}
                      >
                        ×
                      </button>
                    </div>

                    {/* Additional price rows (index 1+) */}
                    {item.prices.slice(1).map((p, relIdx) => {
                      const pi = relIdx + 1;
                      return (
                        <div
                          key={p.id}
                          className="grid"
                          style={{ gridTemplateColumns: "1fr 110px 110px 32px" }}
                        >
                          {/* empty cell to align under "Item name" */}
                          <div className="border-r border-gray-200 px-3 py-1 text-xs text-gray-400 italic">
                            ↳ variant
                          </div>
                          <input
                            className="border-r border-gray-200 px-3 py-1.5 text-xs text-black bg-transparent outline-none placeholder-gray-400 focus:bg-[#fffbe8]"
                            placeholder='Quantity'
                            value={p.quantity}
                            onChange={(e) => updatePrice(ci, ii, pi, "quantity", e.target.value)}
                          />
                          <input
                            type="number"
                            className="border-r border-gray-200 px-3 py-1.5 text-xs text-black text-right bg-transparent outline-none placeholder-gray-400 focus:bg-[#fffbe8]"
                            placeholder="0"
                            value={p.price}
                            onChange={(e) => updatePrice(ci, ii, pi, "price", e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => removePrice(ci, ii, pi)}
                            className="flex items-center justify-center text-base text-gray-400 hover:text-red-600 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}

                    {/* Veg toggle + add-price in the same footer strip */}
                    <div
                      className="grid border-t border-gray-100"
                      style={{ gridTemplateColumns: "1fr 110px 110px 32px" }}
                    >
                      {/* Veg toggle */}
                      <button
                        type="button"
                        onClick={() => updateItem(ci, ii, "is_veg", !item.is_veg)}
                        className={`text-xs flex items-center px-3 py-1 font-semibold transition-colors ${
                          item.is_veg
                            ? "bg-[#d4f0df] text-[#0a4a22]"
                            : "bg-[#fde0e0] text-[#6a0a0a]"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full mr-1.5 flex-shrink-0 ${
                            item.is_veg ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        {item.is_veg ? "Veg" : "Non-veg"}
                      </button>

                      {/* Add variant price button */}
                      <div className="col-span-3 px-3 py-1 bg-[#f7f0e0] flex items-center">
                        <button
                          type="button"
                          onClick={() => addPrice(ci, ii)}
                          className="text-[11px] text-[#b8955a] font-medium hover:underline"
                        >
                          + Add quantity variant
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add item button */}
                <div className="px-3 py-2 bg-[#f0e8d0] border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => addItem(ci)}
                    className="text-xs text-black font-medium border border-gray-400 bg-white rounded px-3 py-1 hover:border-[#b8955a] hover:bg-[#fdf0e0] transition-colors"
                  >
                    + Add item
                  </button>
                </div>
              </>
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 italic bg-[#faf5ee]">
                Select a category above to add items
              </div>
            )}
          </div>
        ))}

        {/* Add category */}
        <button
          type="button"
          onClick={addCategory}
          className="w-full py-2.5 border border-dashed border-gray-400 rounded text-sm text-black font-medium bg-white hover:border-[#b8955a] hover:bg-[#fdf5e8] transition-colors mb-4"
        >
          + Add category
        </button>

        {/* Submit */}
        <button
          type="button"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
          className="w-full py-3 bg-[#2c2217] text-[#f5c97a] text-lg font-semibold tracking-widest rounded hover:bg-[#3d3020] active:scale-[0.99] transition-all disabled:opacity-60"
        >
          {mutation.isPending ? "Publishing..." : "Publish Menu"}
        </button>

        {mutation.isError && (
          <p className="mt-3 text-sm text-red-600 text-center font-medium">
            {mutation.error?.message ?? "Something went wrong. Please try again."}
          </p>
        )}
      </div>
    </div>
  );
}

export default AddMenu;