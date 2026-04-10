import React from "react";

function AddItemPage() {
  const [item, setItem] = React.useState({ name: "", category: "", price: "" });

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add Item</h2>

      <div className="space-y-3">
        <input
          placeholder="Item name"
          value={item.name}
          onChange={(e) => setItem({ ...item, name: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg"
        />

        <input
          placeholder="Category"
          value={item.category}
          onChange={(e) => setItem({ ...item, category: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg"
        />

        <input
          type="number"
          placeholder="Price"
          value={item.price}
          onChange={(e) => setItem({ ...item, price: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg"
        />

        <button className="w-full bg-orange-500 text-white py-2 rounded-lg">
          Add Item
        </button>
      </div>
    </div>
  );
}

export default AddItemPage;
