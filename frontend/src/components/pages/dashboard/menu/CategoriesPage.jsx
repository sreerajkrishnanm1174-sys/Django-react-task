import React from "react";

function CategoriesPage() {
  const [categories, setCategories] = React.useState([]);
  const [newCategory, setNewCategory] = React.useState("");

  const addCategory = () => {
    if (!newCategory) return;
    setCategories([...categories, { id: Date.now(), name: newCategory }]);
    setNewCategory("");
  };
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Categories</h2>

      <div className="space-y-2 mb-4">
        {categories.map((cat) => (
          <div key={cat.id} className="p-2 bg-gray-100 rounded">
            {cat.name}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-lg"
          placeholder="New category"
        />
        <button
          onClick={addCategory}
          className="bg-orange-500 text-white px-4 rounded-lg"
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default CategoriesPage;
