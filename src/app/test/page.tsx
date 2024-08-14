// app/test/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Test() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handlePurchase = async (productId) => {
    if (!selectedUser) {
      alert("Please select a user first.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/stripe/checkout", {
        productId,
        userId: selectedUser.id,
      });
      router.push(response.data.url);
    } catch (error) {
      console.error("Error initiating purchase:", error);
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="flex items-center justify-center flex-col">
            <div className="mb-4">
              <h1>Selecione um Usuário</h1>
              <select onChange={(e) => setSelectedUser(users.find(user => user.id === parseInt(e.target.value)))}>
                <option value="">Selecione um usuário</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} - {user.email}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <h1>Produtos Disponíveis</h1>
              <ul>
                {products.map((product) => (
                  <li key={product.id} className="mb-4">
                    {product.name} - ${product.price}
                    <button
                      onClick={() => handlePurchase(product.id)}
                      disabled={loading}
                      className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                    >
                      Comprar
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
