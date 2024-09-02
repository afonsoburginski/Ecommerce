"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Product from "@/components/Product";

export default function ProductRoot() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState({});
  const [quantity, setQuantity] = useState(1);
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
  
    const variant = selectedVariant[productId];
  
    if (!variant || !variant.color || !variant.size) {
      alert("Please select a variant before purchasing.");
      return;
    }
  
    const selectedVariantProduct = products
      .find((product) => product.id === productId)
      .variants.find((v) => v.color === variant.color && v.size === variant.size);
  
    if (!selectedVariantProduct) {
      alert("The selected variant does not exist.");
      return;
    }
  
    setLoading(true);
    try {
      const response = await axios.post("/api/stripe/checkout", {
        productId,
        userId: selectedUser.id,
        variantId: selectedVariantProduct.id,
        quantity,
      });
      router.push(response.data.url);
    } catch (error) {
      console.error("Error initiating purchase:", error.response?.data || error.message);
      alert("Failed to initiate purchase. Please check console logs for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-muted/40">
      <Product.Header 
        users={users} 
        selectedUser={selectedUser} 
        handleUserChange={(e) => {
          const selectedId = parseInt(e.target.value);
          setSelectedUser(users.find((user) => user.id === selectedId) || null);
        }} 
      />
      <Product.Grid
        products={products}
        selectedVariant={selectedVariant}
        setSelectedVariant={setSelectedVariant}
        quantity={quantity}
        setQuantity={setQuantity}
        handlePurchase={handlePurchase}
        loading={loading}
        getSelectedVariantStock={(productId) => {
          const variant = selectedVariant[productId];
          if (!variant || !variant.color || !variant.size) return 0;

          const selectedVariantProduct = products
            .find((product) => product.id === productId)
            .variants.find(
              (v) => v.color === variant.color && v.size === variant.size
            );

          return selectedVariantProduct ? selectedVariantProduct.stock : 0;
        }}
      />
    </div>
  );
}
