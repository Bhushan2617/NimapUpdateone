import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";

const CategoryList = () => {
  const credentials = btoa(
    `${process.env.REACT_APP_API_USERNAME}:${process.env.REACT_APP_API_PASSWORD}`
  );
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const queryClient = useQueryClient();

  const {
    data: categories,
    isLoading,
    error,
  } = useQuery("categories", async () => {
    const response = await fetch("http://localhost:5000/api/categories", {
      headers: { Authorization: `Basic ${credentials}` },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error("Error fetching categories");
    }
    return data.data || [];
  });

  const createMutation = useMutation(
    async (category) => {
      const response = await fetch("http://localhost:5000/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${credentials}`,
        },
        body: JSON.stringify({ name: category }),
      });
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("categories");
        setNewCategory("");
      },
    }
  );

  const updateMutation = useMutation(
    async ({ id, name }) => {
      const response = await fetch(
        `http://localhost:5000/api/categories/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${credentials}`,
          },
          body: JSON.stringify({ name }),
        }
      );
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("categories");
        setEditingCategory(null);
      },
    }
  );

  const deleteMutation = useMutation(
    async (id) => {
      await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Basic ${credentials}` },
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("categories");
      },
    }
  );

  if (isLoading) return <div className="text-center">Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Category Management</h2>

      <div className="flex items-center space-x-2 mb-4">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New Category Name"
          className="border rounded px-3 py-2 w-full"
        />
        <button
          onClick={() => createMutation.mutate(newCategory)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {categories.length === 0 ? (
          <li>No categories available</li>
        ) : (
          categories.map((category) => (
            <li
              key={category.id}
              className="flex items-center justify-between border p-2 rounded"
            >
              {editingCategory?.id === category.id ? (
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      name: e.target.value,
                    })
                  }
                  className="border rounded px-2 py-1 w-full"
                />
              ) : (
                <span>{category.name}</span>
              )}

              {/* Edit & Delete Buttons */}
              <div className="flex space-x-2">
                {editingCategory?.id === category.id ? (
                  <>
                    <button
                      onClick={() => updateMutation.mutate(editingCategory)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingCategory(null)}
                      className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditingCategory(category)}
                      className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(category.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default CategoryList;
