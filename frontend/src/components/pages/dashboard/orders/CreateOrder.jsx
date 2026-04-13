import React, { useState, useMemo } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { ApiFetch } from "../../../../hooks/fetchapi/ApiFetch";
import userAuthStore from "../../../../store/userAuthstore";
import Field from "../../../ui/menu ui/Field";
import SelectField from "../../../ui/order ui/SelectField";
import VegDot from "../../../ui/order ui/VegDot";
import SectionDivider from "../../../ui/menu ui/SectionDivider";






export default function CreateOrder() {
  const { token } = userAuthStore();
  const [quantities, setQuantities] = useState({});

  const { data: tablesData } = useQuery({
    queryKey: ["tables"],
    queryFn: () =>
      ApiFetch({
        url: "http://127.0.0.1:8000/api/tables/",
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
    enabled: !!token,
  });

  const { data: menusData } = useQuery({
    queryKey: ["menus-list"],
    queryFn: () =>
      ApiFetch({
        url: "http://127.0.0.1:8000/api/show/",
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
    enabled: !!token,
  });

  const tables = tablesData?.results ?? tablesData ?? [];
  const menus  = menusData?.results  ?? menusData  ?? [];

  const form = useForm({
    defaultValues: { table: "", menu: "" },
    onSubmit: async ({ value }) => {
      const orderItems = Object.entries(quantities)
        .filter(([, qty]) => qty > 0)
        .map(([key, qty]) => {
          const [, priceId] = key.split("_");
          return { menu_item_price: Number(priceId), quantity: qty };
        });

      if (!value.table || !value.menu || orderItems.length === 0) {
        alert("Please select a table, menu and at least one item.");
        return;
      }

      console.log("Order payload:", {
        table: value.table,
        menu: value.menu,
        items: orderItems,
      });
      // TODO: ApiFetch POST to /api/orders/
    },
  });

  const selectedMenuId = useStore(form.store, (s) => s.values.menu);
  const selectedMenu = useMemo(
    () => menus.find((m) => String(m.id) === String(selectedMenuId)),
    [menus, selectedMenuId]
  );

  const orderLines = useMemo(() => {
    if (!selectedMenu) return [];
    const lines = [];
    selectedMenu.categories?.forEach((cat) => {
      cat.items?.forEach((item) => {
        item.prices?.forEach((p) => {
          const key = `${item.id}_${p.id}`;
          const qty = quantities[key] || 0;
          if (qty > 0)
            lines.push({
              key,
              name: item.name,
              quantity: p.quantity,
              qty,
              price: Number(p.price),
              sub: qty * Number(p.price),
            });
        });
      });
    });
    return lines;
  }, [quantities, selectedMenu]);

  const total = orderLines.reduce((s, l) => s + l.sub, 0);

  const setQty = (key, val) => {
    const qty = Math.max(0, parseInt(val) || 0);
    setQuantities((prev) => ({ ...prev, [key]: qty }));
  };

  return (
    <div
      className="min-h-screen bg-[#f5f0e8] py-8 px-4"
      style={{ fontFamily: "'Jost', sans-serif" }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1
            className="text-3xl font-semibold text-[#2c2217]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Create Order
          </h1>
          <p className="text-xs text-[#9e8a68] mt-1 tracking-wide">
            Select table, menu and add items to the order
          </p>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
          className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5"
        >
          {/* ── Left ── */}
          <div className="space-y-4">

            {/* Order details */}
            <div className="bg-[#fffdf7] border border-[#e0d5c0] rounded-xl px-6 py-5">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#b8955a] font-medium mb-4">
                Order details
              </p>

              <form.Field name="table">
                {(field) => (
                  <Field label="Table">
                    <SelectField
                      value={field.state.value}
                      onChange={field.handleChange}
                      placeholder="Select a table"
                    >
                      {tables.map((t) => (
                        <option key={t.id} value={t.id}>
                          Table {t.number}
                          {t.name ? ` — ${t.name}` : ""}
                          {t.capacity ? ` (${t.capacity} pax)` : ""}
                        </option>
                      ))}
                    </SelectField>
                  </Field>
                )}
              </form.Field>

              <form.Field name="menu">
                {(field) => (
                  <Field label="Menu">
                    <SelectField
                      value={field.state.value}
                      onChange={(val) => {
                        field.handleChange(val);
                        setQuantities({});
                      }}
                      placeholder="Select a menu"
                    >
                      {menus.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} —{" "}
                          {new Date(m.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </option>
                      ))}
                    </SelectField>
                  </Field>
                )}
              </form.Field>
            </div>

            {/* Menu items */}
            <div className="bg-[#fffdf7] border border-[#e0d5c0] rounded-xl px-6 py-5">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#b8955a] font-medium mb-2">
                Menu items
              </p>

              {!selectedMenu ? (
                <p
                  className="text-center text-[#c8b99a] italic py-6"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Select a menu above to view items
                </p>
              ) : (
                selectedMenu.categories?.map((cat) => (
                  <div key={cat.id}>
                    <div className="text-[11px] font-semibold tracking-widest uppercase text-[#9e8a68] py-2 border-b border-[#e8dfc8] mb-1">
                      {cat.name}
                    </div>
                    {cat.items?.map((item) =>
                      item.prices?.map((p) => {
                        const key = `${item.id}_${p.id}`;
                        return (
                          <div
                            key={key}
                            className="grid items-center gap-3 py-2 border-b border-dotted border-[#e8dfc8] last:border-none"
                            style={{ gridTemplateColumns: "1fr 80px 56px" }}
                          >
                            <div>
                              <div className="flex items-center">
                                <VegDot isVeg={item.is_veg} />
                                <span
                                  className="text-[#2c2217]"
                                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "15px" }}
                                >
                                  {item.name}
                                </span>
                              </div>
                              <div className="text-[11px] text-[#9e8a68] pl-[18px]">
                                {p.quantity}
                              </div>
                            </div>
                            <div className="text-right text-[13px] text-[#9e8a68]">
                              ₹{p.price}
                            </div>
                            <input
                              type="number"
                              min={0}
                              value={quantities[key] || ""}
                              placeholder="0"
                              onChange={(e) => setQty(key, e.target.value)}
                              className="w-full text-center px-2 py-1.5 border border-[#d4c9a8] rounded-lg text-[13px] text-[#2c2217] bg-white outline-none focus:border-[#b8955a] focus:ring-2 focus:ring-[#b8955a]/15 transition-colors"
                            />
                          </div>
                        );
                      })
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ── Right: summary ── */}
          <div className="lg:sticky lg:top-20 self-start">
            <div className="bg-[#fffdf7] border border-[#e0d5c0] rounded-xl px-5 py-5">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#b8955a] font-medium mb-4">
                Order summary
              </p>

              <form.Subscribe selector={(s) => s.values}>
                {(values) => {
                  const tbl = tables.find((t) => String(t.id) === String(values.table));
                  const mnu = menus.find((m)  => String(m.id) === String(values.menu));
                  return (
                    <div className="space-y-2 mb-1">
                      <div>
                        <div className="text-[11px] text-[#9e8a68] mb-0.5">Table</div>
                        <div className="text-[13px] text-[#2c2217]">
                          {tbl
                            ? `Table ${tbl.number}${tbl.name ? ` — ${tbl.name}` : ""}`
                            : <span className="text-[#c8b99a] italic">Not selected</span>}
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] text-[#9e8a68] mb-0.5">Menu</div>
                        <div className="text-[13px] text-[#2c2217]">
                          {mnu
                            ? mnu.name
                            : <span className="text-[#c8b99a] italic">Not selected</span>}
                        </div>
                      </div>
                    </div>
                  );
                }}
              </form.Subscribe>

              <SectionDivider label="Items" />

              {orderLines.length === 0 ? (
                <p
                  className="text-center text-[#c8b99a] italic text-[13px] py-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  No items added
                </p>
              ) : (
                <div className="space-y-1 mb-3">
                  {orderLines.map((l) => (
                    <div key={l.key} className="flex justify-between items-baseline text-[13px] py-1">
                      <span className="text-[#2c2217]">
                        {l.name}{" "}
                        <span className="text-[#c8b99a] text-[11px]">
                          {l.quantity} × {l.qty}
                        </span>
                      </span>
                      <span className="text-[#2c2217] font-medium">₹{l.sub}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-baseline pt-2 mt-1 border-t border-[#d4c9a8]">
                    <span className="text-[15px] font-medium text-[#2c2217]">Total</span>
                    <span className="text-[15px] font-medium text-[#2c2217]">₹{total}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 mt-2 bg-[#2c2217] text-[#f5c97a] rounded-lg tracking-widest hover:bg-[#3d3020] active:scale-[0.99] transition-all"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "16px" }}
              >
                Place Order
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}