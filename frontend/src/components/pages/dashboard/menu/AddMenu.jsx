import { useQuery, useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { ApiFetch } from "../../../../hooks/fetchapi/ApiFetch";
import SectionDivider from "../../../ui/menu ui/SectionDivider";
import Field from "../../../ui/menu ui/Field";
import SearchCreateDropdown from "../../../ui/menu ui/SearchCreateDropdown";
import userAuthStore from "../../../../store/userAuthstore";
import addMenuSchema from "../../../../schema/AddMenuSchema";

// ── Helpers ─────────────────────────────────────────────────────
const newPrice = () => ({ id: Date.now() + Math.random(), quantity: "", price: "" });
const newItem  = () => ({
  id: Date.now() + Math.random(),
  name: "", isNew: false, is_veg: false, is_available: true, image: null,
  prices: [newPrice()],
});

const flattenErrors = (zodError) => {
  const map = {};
  for (const issue of zodError.issues) map[issue.path.join(".")] = issue.message;
  return map;
};

// ── Column template — single source of truth ─────────────────────
// name | image | quantity | price | remove
const COL = "minmax(140px,1fr) 100px 120px 110px 36px";

// ── Sub-components ───────────────────────────────────────────────
function ErrorMsg({ message }) {
  if (!message) return null;
  return (
    <p className="mt-1 flex items-center gap-1 text-[11px] text-red-500">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="flex-shrink-0">
        <circle cx="5" cy="5" r="4.5" stroke="#f87171" />
        <path d="M5 3v2.5M5 7h.01" stroke="#f87171" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      {message}
    </p>
  );
}

function FormField({ label, error, children }) {
  return (
    <div className="mb-5">
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-gray-500">{label}</label>
      {children}
      <ErrorMsg message={error} />
    </div>
  );
}

const inputCls = (err) =>
  `w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 bg-white outline-none transition-all placeholder:text-gray-400
  ${err
    ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100"
    : "border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
  }`;

function TableHead() {
  const cols = [
    { label: "Item name",  align: "left"   },
    { label: "Image",      align: "center" },
    { label: "Quantity",   align: "center" },
    { label: "Price ₹",   align: "right"  },
    { label: "",           align: "center" },
  ];
  return (
    <div className="grid border-b border-gray-200 bg-gray-50" style={{ gridTemplateColumns: COL }}>
      {cols.map((c, i) => (
        <div
          key={i}
          style={{ textAlign: c.align }}
          className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-500"
        >
          {c.label}
        </div>
      ))}
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────
export default function AddMenu() {
  const today = new Date().toISOString().split("T")[0];
  const { token } = userAuthStore();

  const [menu, setMenu] = useState({ name: "", date: today, version: 1, is_active: true });
  const [categories, setCategories] = useState([
    { id: Date.now(), selectedCat: null, display_order: 0, items: [] },
  ]);
  const [errors, setErrors] = useState({});

  const buildValidationPayload = () => ({
    name: menu.name,
    date: menu.date,
    version: menu.version,
    categories: categories.map((c) => ({
      name: c.selectedCat?.name ?? "",
      items: c.items.map((item) => ({
        name: item.name,
        is_available: item.is_available,
        prices: item.prices
          .filter((p) => p.quantity.trim() !== "" || p.price !== "")
          .map((p) => ({ quantity: p.quantity.trim(), price: p.price })),
      })),
    })),
  });

  const { data: existingCategories = [], isLoading: catsLoading } = useQuery({
    queryKey: ["all-categories"],
    queryFn: () => ApiFetch({ url: "http://127.0.0.1:8000/api/categories/", method: "GET", headers: { Authorization: `Bearer ${token}` } }),
  });

  const addCategory    = () => setCategories((p) => [...p, { id: Date.now(), selectedCat: null, display_order: p.length, items: [] }]);
  const removeCategory = (ci) => setCategories((p) => p.filter((_, i) => i !== ci));
  const selectCategory = (ci, cat) =>
    setCategories((prev) => {
      const u = [...prev];
      u[ci].selectedCat = cat;
      u[ci].items = cat.isNew || !cat.items?.length
        ? [newItem()]
        : cat.items.map((src) => ({
            id: Date.now() + Math.random(),
            name: typeof src === "string" ? src : src.name,
            isNew: false, is_veg: src.is_veg ?? false, is_available: true, image: src.image || null,
            prices: src.prices?.length
              ? src.prices.map((p) => ({ id: Date.now() + Math.random(), quantity: p.quantity ?? "", price: p.price ?? "" }))
              : [{ id: Date.now() + Math.random(), quantity: "", price: src.price ?? "" }],
          }));
      return u;
    });
  const updateCategoryOrder = (ci, val) => setCategories((p) => { const u=[...p]; u[ci].display_order=val; return u; });

  const addItem    = (ci) => setCategories((p) => { const u=[...p]; u[ci].items.push(newItem()); return [...u]; });
  const removeItem = (ci, ii) => { if (categories[ci].items.length<=1) return; setCategories((p) => { const u=[...p]; u[ci].items.splice(ii,1); return [...u]; }); };
  const updateItem = (ci, ii, k, v) => setCategories((p) => { const u=[...p]; u[ci].items[ii][k]=v; return [...u]; });

  const addPrice    = (ci,ii) => setCategories((p)=>{ const u=[...p]; u[ci].items[ii].prices.push(newPrice()); return [...u]; });
  const removePrice = (ci,ii,pi) => { if(categories[ci].items[ii].prices.length<=1) return; setCategories((p)=>{ const u=[...p]; u[ci].items[ii].prices.splice(pi,1); return [...u]; }); };
  const updatePrice = (ci,ii,pi,k,v) => setCategories((p)=>{ const u=[...p]; u[ci].items[ii].prices[pi][k]=v; return [...u]; });

  const mutation = useMutation({
    mutationFn: (fd) => ApiFetch({ url: "http://127.0.0.1:8000/api/menu-create/", method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd }),
    onSuccess: () => {
      alert("Menu published successfully!");
      setMenu({ name: "", date: today, version: 1, is_active: true });
      setCategories([{ id: Date.now(), selectedCat: null, display_order: 0, items: [] }]);
      setErrors({});
    },
    onError: (err) => alert("Error: " + err.message),
  });

  const handleSubmit = () => {
    const result = addMenuSchema.safeParse(buildValidationPayload());
    if (!result.success) {
      const errs = flattenErrors(result.error);
      setErrors(errs);
      setTimeout(() => document.querySelector("[data-error='true']")?.scrollIntoView({ behavior:"smooth", block:"center" }), 50);
      return;
    }
    setErrors({});
    const payload = {
      name: menu.name, date: menu.date, version: menu.version, is_active: menu.is_active,
      categories: categories.map((c, ci) => ({
        name: c.selectedCat?.name ?? "",
        is_new: c.selectedCat?.isNew ?? false,
        existing_id: c.selectedCat?.id || null,
        display_order: c.display_order,
        items: c.items.map((item, ii) => ({
          name: item.name, is_veg: item.is_veg, is_available: item.is_available,
          prices: item.prices.filter((p)=>p.quantity.trim()!==""||p.price!=="").map((p)=>({ quantity:p.quantity.trim(), price:p.price })),
          image_key: item.image instanceof File ? `image_${ci}_${ii}` : null,
        })),
      })),
    };
    const fd = new FormData();
    fd.append("data", JSON.stringify(payload));
    categories.forEach((cat, ci) => cat.items.forEach((item, ii) => { if (item.image instanceof File) fd.append(`image_${ci}_${ii}`, item.image); }));
    mutation.mutate(fd);
  };

  const totalItems = categories.reduce((s, c) => s + c.items.filter((i) => i.name).length, 0);
  const errorCount = Object.keys(errors).length;

  return (
    <div className="min-h-screen bg-gray-50 font-['Jost',sans-serif]">

      {/* ── Sticky top bar ── */}
      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div>
            <h1 className="text-[15px] font-bold text-gray-900">Create New Menu</h1>
            <p className="text-xs text-gray-500">{menu.name || "Untitled"} · {menu.date}</p>
          </div>
          <div className="flex items-center gap-2">
            {errorCount > 0 && (
              <span className="hidden rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-600 sm:inline">
                {errorCount} error{errorCount > 1 ? "s" : ""}
              </span>
            )}
            <button
              type="button" onClick={handleSubmit} disabled={mutation.isPending}
              className="flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-amber-700 active:scale-[0.98] disabled:opacity-60"
            >
              {mutation.isPending ? (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity=".3"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              {mutation.isPending ? "Publishing…" : "Publish"}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {errors["categories"] && (
          <div data-error="true" className="mb-5 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0">
              <circle cx="7" cy="7" r="6.5" stroke="#f87171" strokeWidth="1.2"/>
              <path d="M7 4.5v3M7 9h.01" stroke="#f87171" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            {errors["categories"]}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_260px]">

          {/* ── Left column ── */}
          <div className="space-y-5 min-w-0">

            {/* Menu details */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 bg-gray-50 px-5 py-3">
                <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Menu details</h2>
              </div>
              <div className="px-5 py-5">
                <FormField label="Menu name" error={errors["name"]}>
                  <input className={inputCls(!!errors["name"])} placeholder="e.g. Today's Special, Lunch Menu" value={menu.name} onChange={(e) => setMenu({ ...menu, name: e.target.value })} />
                </FormField>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="col-span-2 sm:col-span-2">
                    <FormField label="Date" error={errors["date"]}>
                      <input type="date" className={inputCls(!!errors["date"])} value={menu.date} onChange={(e) => setMenu({ ...menu, date: e.target.value })} />
                    </FormField>
                  </div>
                  <div>
                    <FormField label="Version" error={errors["version"]}>
                      <input type="number" min={1} className={inputCls(!!errors["version"])} value={menu.version} onChange={(e) => setMenu({ ...menu, version: Number(e.target.value) })} />
                    </FormField>
                  </div>
                  <div className="flex items-end pb-5">
                    <label className="flex w-full cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 transition-colors hover:border-amber-300 hover:bg-amber-50">
                      <input type="checkbox" className="h-4 w-4 cursor-pointer accent-amber-600" checked={menu.is_active} onChange={(e) => setMenu({ ...menu, is_active: e.target.checked })} />
                      <span className="text-xs font-medium">Active</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Categories & items</h2>
                {catsLoading && <span className="text-xs italic text-gray-400">Loading…</span>}
              </div>

              <div className="space-y-4">
                {categories.map((cat, ci) => {
                  const catNameErr  = errors[`categories.${ci}.name`];
                  const catItemsErr = errors[`categories.${ci}.items`];
                  const hasCatErr   = !!(catNameErr || catItemsErr);

                  return (
                    <div
                      key={cat.id}
                      data-error={hasCatErr ? "true" : undefined}
                      className={`overflow-auto min-h-[300px] rounded-xl border bg-white shadow-sm ${hasCatErr ? "border-red-300" : "border-gray-200"}`}
                    >
                      {/* Category header */}
                      <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-3">
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-700">
                          {ci + 1}
                        </div>
                        <div className="flex-1 min-w-[160px]">
                          <SearchCreateDropdown
                            value={cat.selectedCat}
                            options={existingCategories.results}
                            placeholder="Select or create a category…"
                            onChange={(selected) => selectCategory(ci, selected)}
                          />
                          {catNameErr && <ErrorMsg message={catNameErr} />}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Order</span>
                          <input
                            type="number" min={0} value={cat.display_order}
                            onChange={(e) => updateCategoryOrder(ci, +e.target.value)}
                            className="w-14 rounded-md border border-gray-200 bg-white px-2 py-1.5 text-center text-xs text-gray-700 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100"
                          />
                        </div>
                        {categories.length > 1 && (
                          <button onClick={() => removeCategory(ci)} className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                          </button>
                        )}
                      </div>

                      {catItemsErr && (
                        <div className="border-b border-red-100 bg-red-50 px-4 py-2 text-xs text-red-600">{catItemsErr}</div>
                      )}

                      {cat.selectedCat ? (
                        <div className="min-h-fit">
                          <div style={{ minWidth: 540 }}>
                            <TableHead />

                            {cat.items.map((item, ii) => {
                              const itemNameErr   = errors[`categories.${ci}.items.${ii}.name`];
                              const itemPricesErr = errors[`categories.${ci}.items.${ii}.prices`];
                              const p0QErr = errors[`categories.${ci}.items.${ii}.prices.0.quantity`];
                              const p0PErr = errors[`categories.${ci}.items.${ii}.prices.0.price`];

                              return (
                                <div key={item.id} className={`border-b border-gray-100 last:border-none ${ii % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>

                                  {/* Main item row */}
                                  <div className="grid items-center" style={{ gridTemplateColumns: COL }}>

                                    {/* Name */}
                                    <div className="border-r border-gray-100 px-3 py-2.5">
                                      <SearchCreateDropdown
                                        value={item}
                                        options={cat.selectedCat?.items || []}
                                        placeholder="Item name…"
                                        onChange={(selected) => {
                                          updateItem(ci, ii, "name", selected.name);
                                          updateItem(ci, ii, "isNew", selected.isNew || false);
                                          if (selected.prices?.length)
                                            updateItem(ci, ii, "prices", selected.prices.map((p) => ({ id: Date.now() + Math.random(), quantity: p.quantity ?? "", price: p.price ?? "" })));
                                        }}
                                      />
                                      {itemNameErr && <ErrorMsg message={itemNameErr} />}
                                    </div>

                                    {/* Image */}
                                    <div className="flex flex-col items-center justify-center gap-1 border-r border-gray-100 px-2 py-2 text-center">
                                      {item.image && (
                                        <img
                                          src={item.image instanceof File ? URL.createObjectURL(item.image) : item.image}
                                          alt="" className="h-8 w-8 rounded-md object-cover ring-1 ring-gray-200"
                                        />
                                      )}
                                      <label className="flex cursor-pointer items-center gap-1 rounded border border-dashed border-gray-300 px-2 py-0.5 text-[10px] text-gray-500 transition-colors hover:border-amber-400 hover:text-amber-600">
                                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M4 1v6M1 4h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                        {item.image ? "Change" : "Upload"}
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files[0]) updateItem(ci, ii, "image", e.target.files[0]); }} />
                                      </label>
                                      {item.image && (
                                        <button type="button" onClick={() => updateItem(ci, ii, "image", null)} className="text-[10px] text-red-400 hover:text-red-600 transition-colors">Remove</button>
                                      )}
                                    </div>

                                    {/* Quantity */}
                                    <div className="border-r border-gray-100 px-2 py-2.5">
                                      <input
                                        className={`w-full rounded-md border px-2 py-1.5 text-center text-xs outline-none transition-all placeholder:text-gray-400
                                          ${p0QErr ? "border-red-300 bg-red-50" : "border-gray-200 bg-transparent focus:border-amber-400 focus:ring-1 focus:ring-amber-100"}`}
                                        placeholder="Half / Full…"
                                        value={item.prices[0]?.quantity ?? ""}
                                        onChange={(e) => updatePrice(ci, ii, 0, "quantity", e.target.value)}
                                      />
                                    </div>

                                    {/* Price */}
                                    <div className="border-r border-gray-100 px-2 py-2.5">
                                      <div className="relative">
                                        <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">₹</span>
                                        <input
                                          type="number"
                                          className={`w-full rounded-md border py-1.5 pl-5 pr-2 text-right text-xs outline-none transition-all placeholder:text-gray-400
                                            ${p0PErr ? "border-red-300 bg-red-50" : "border-gray-200 bg-transparent focus:border-amber-400 focus:ring-1 focus:ring-amber-100"}`}
                                          placeholder="0"
                                          value={item.prices[0]?.price ?? ""}
                                          onChange={(e) => updatePrice(ci, ii, 0, "price", e.target.value)}
                                        />
                                      </div>
                                    </div>

                                    {/* Remove */}
                                    <div className="flex items-center justify-center">
                                      <button type="button" onClick={() => removeItem(ci, ii)}
                                        className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${cat.items.length > 1 ? "text-gray-400 hover:bg-red-50 hover:text-red-500" : "cursor-default text-gray-200"}`}>
                                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1 1l9 9M10 1L1 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                      </button>
                                    </div>
                                  </div>

                                  {/* First row price errors */}
                                  {(p0QErr || p0PErr) && (
                                    <div className="grid px-2 pb-1" style={{ gridTemplateColumns: COL }}>
                                      <div /><div />
                                      <div className="px-2"><ErrorMsg message={p0QErr} /></div>
                                      <div className="px-2"><ErrorMsg message={p0PErr} /></div>
                                      <div />
                                    </div>
                                  )}

                                  {/* Variant rows */}
                                  {item.prices.slice(1).map((p, relIdx) => {
                                    const pi   = relIdx + 1;
                                    const qErr = errors[`categories.${ci}.items.${ii}.prices.${pi}.quantity`];
                                    const pErr = errors[`categories.${ci}.items.${ii}.prices.${pi}.price`];
                                    return (
                                      <div key={p.id} className="bg-amber-50/30">
                                        <div className="grid items-center" style={{ gridTemplateColumns: COL }}>
                                          <div className="border-r border-gray-100 px-4 py-1.5 text-[11px] italic text-gray-400">↳ variant {pi + 1}</div>
                                          <div className="border-r border-gray-100" />
                                          <div className="border-r border-gray-100 px-2 py-1.5">
                                            <input
                                              className={`w-full rounded-md border px-2 py-1 text-center text-xs outline-none transition-all placeholder:text-gray-400 ${qErr ? "border-red-300 bg-red-50" : "border-gray-200 bg-white focus:border-amber-400 focus:ring-1 focus:ring-amber-100"}`}
                                              placeholder="Quantity" value={p.quantity}
                                              onChange={(e) => updatePrice(ci, ii, pi, "quantity", e.target.value)}
                                            />
                                          </div>
                                          <div className="border-r border-gray-100 px-2 py-1.5">
                                            <div className="relative">
                                              <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">₹</span>
                                              <input
                                                type="number"
                                                className={`w-full rounded-md border py-1 pl-5 pr-2 text-right text-xs outline-none transition-all placeholder:text-gray-400 ${pErr ? "border-red-300 bg-red-50" : "border-gray-200 bg-white focus:border-amber-400 focus:ring-1 focus:ring-amber-100"}`}
                                                placeholder="0" value={p.price}
                                                onChange={(e) => updatePrice(ci, ii, pi, "price", e.target.value)}
                                              />
                                            </div>
                                          </div>
                                          <div className="flex items-center justify-center">
                                            <button type="button" onClick={() => removePrice(ci, ii, pi)} className="flex h-6 w-6 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500">
                                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                            </button>
                                          </div>
                                        </div>
                                        {(qErr || pErr) && (
                                          <div className="grid px-2 pb-1" style={{ gridTemplateColumns: COL }}>
                                            <div /><div />
                                            <div className="px-2"><ErrorMsg message={qErr} /></div>
                                            <div className="px-2"><ErrorMsg message={pErr} /></div>
                                            <div />
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}

                                  {/* Item footer */}
                                  <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/70 px-3 py-1.5">
                                    <button type="button" onClick={() => updateItem(ci, ii, "is_veg", !item.is_veg)}
                                      className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-colors ${item.is_veg ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100" : "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"}`}>
                                      <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${item.is_veg ? "bg-green-500" : "bg-red-500"}`} />
                                      {item.is_veg ? "Veg" : "Non-veg"}
                                    </button>
                                    <button type="button" onClick={() => addPrice(ci, ii)}
                                      className="flex items-center gap-1 text-[11px] font-medium text-amber-600 transition-colors hover:text-amber-700">
                                      <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M4.5 1v7M1 4.5h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                      Add variant
                                    </button>
                                  </div>
                                  {itemPricesErr && <div className="px-3 pb-1.5"><ErrorMsg message={itemPricesErr} /></div>}
                                </div>
                              );
                            })}

                            {/* Add item */}
                            <div className="border-t border-gray-100 bg-gray-50 px-4 py-2.5">
                              <button type="button" onClick={() => addItem(ci)}
                                className="flex items-center gap-1.5 text-xs font-medium text-gray-500 transition-colors hover:text-amber-600">
                                <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 1v9M1 5.5h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                                Add item
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-4 py-5 text-sm text-gray-400">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                          Select a category above to add items
                        </div>
                      )}
                    </div>
                  );
                })}

                <button type="button" onClick={addCategory}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-white py-3 text-sm font-medium text-gray-400 transition-colors hover:border-amber-300 hover:bg-amber-50/50 hover:text-amber-600">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  Add category
                </button>
              </div>
            </div>
          </div>

          {/* ── Right sidebar ── */}
          <aside className="min-w-0">
            <div className="sticky top-[61px] space-y-4">

              {/* Summary */}
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-100 bg-gray-50 px-4 py-3">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Summary</h3>
                </div>
                <div className="divide-y divide-gray-100 px-4">
                  {[
                    { label: "Status", value: (
                      <span className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${menu.is_active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${menu.is_active ? "bg-green-500" : "bg-gray-400"}`} />
                        {menu.is_active ? "Active" : "Draft"}
                      </span>
                    )},
                    { label: "Date",       value: menu.date || "—" },
                    { label: "Version",    value: `v${menu.version}` },
                    { label: "Categories", value: categories.filter((c) => c.selectedCat).length },
                    { label: "Items",      value: totalItems },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-2.5 text-sm">
                      <span className="text-gray-500">{label}</span>
                      <span className="font-medium text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Errors list */}
              {errorCount > 0 && (
                <div className="overflow-hidden rounded-xl border border-red-200 bg-red-50">
                  <div className="border-b border-red-100 px-4 py-2.5">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-red-600">
                      {errorCount} issue{errorCount > 1 ? "s" : ""} to fix
                    </p>
                  </div>
                  <ul className="divide-y divide-red-100 px-4">
                    {Object.values(errors).slice(0, 6).map((msg, i) => (
                      <li key={i} className="flex items-start gap-2 py-2 text-xs text-red-600">
                        <span className="mt-0.5 flex-shrink-0 text-red-400">•</span>{msg}
                      </li>
                    ))}
                    {errorCount > 6 && (
                      <li className="py-2 text-xs text-red-400">+{errorCount - 6} more…</li>
                    )}
                  </ul>
                </div>
              )}

              {mutation.isError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
                  {mutation.error?.message ?? "Something went wrong."}
                </div>
              )}

              <button type="button" onClick={handleSubmit} disabled={mutation.isPending}
                className="w-full rounded-lg bg-amber-600 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-amber-700 active:scale-[0.98] disabled:opacity-60">
                {mutation.isPending ? "Publishing…" : "Publish Menu"}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}