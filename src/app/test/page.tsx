"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function ProductPage() {
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

    setLoading(true);
    try {
      const response = await axios.post("/api/stripe/checkout", {
        productId,
        userId: selectedUser.id,
        quantity,
      });
      console.log("Checkout session created, redirecting to:", response.data.url);
      router.push(response.data.url);
    } catch (error) {
      console.error("Error initiating purchase:", error.response?.data || error.message);
      alert("Failed to initiate purchase. Please check console logs for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleColorChange = (productId, color) => {
    setSelectedVariant((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        color,
        size: null, // Reset size when a new color is selected
      },
    }));
  };

  const handleSizeChange = (productId, size) => {
    setSelectedVariant((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        size,
      },
    }));
  };

  const handleUserChange = (e) => {
    const selectedId = parseInt(e.target.value);
    setSelectedUser(users.find((user) => user.id === selectedId) || null);
  };

  return (
    <div className="flex h-full w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="flex items-center justify-center flex-col">
            <div className="mb-4">
              <h1 className="text-lg font-bold">Selecione um Usuário</h1>
              <select
                onChange={handleUserChange}
                className="border rounded p-2"
                value={selectedUser?.id || ""}
              >
                <option value="">Selecione um usuário</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} - {user.email}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <h1 className="text-lg font-bold">Produtos Disponíveis</h1>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <Card key={product.id}>
                    <CardHeader>
                      <CardTitle className="text-xl">{product.name}</CardTitle>
                      <CardDescription>{product.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Image
                        src={`/path/to/product/images/${product.id}.png`}
                        alt={product.name}
                        width={300}
                        height={200}
                        className="rounded-lg"
                      />
                      <p className="mt-2 text-sm">Preço: R${product.price.toFixed(2)}</p>
                      <p className="text-sm">Estoque: {product.stock}</p>

                      <div className="mt-4">
                        <Label className="block mb-2">Escolha a cor:</Label>
                        <ToggleGroup
                          type="single"
                          value={selectedVariant[product.id]?.color}
                          onValueChange={(value) => handleColorChange(product.id, value)}
                          className="flex flex-wrap gap-2 justify-start"
                        >
                          {Array.from(new Set(product.variants.map(variant => variant.color))).map(color => (
                            <ToggleGroupItem key={color} value={color}>
                              {color}
                            </ToggleGroupItem>
                          ))}
                        </ToggleGroup>

                        {selectedVariant[product.id]?.color && (
                          <>
                            <Label className="block mb-2 mt-4">Escolha o tamanho:</Label>
                            <ToggleGroup
                              type="single"
                              value={selectedVariant[product.id]?.size}
                              onValueChange={(value) => handleSizeChange(product.id, value)}
                              className="flex flex-wrap gap-2 justify-start"
                            >
                              {product.variants
                                .filter(variant => variant.color === selectedVariant[product.id]?.color)
                                .map(variant => (
                                  <ToggleGroupItem key={variant.sku} value={variant.size}>
                                    {variant.size}
                                  </ToggleGroupItem>
                                ))}
                            </ToggleGroup>
                          </>
                        )}
                        <div className="flex items-center mt-4">
                          <Input
                            type="number"
                            value={Math.min(quantity, product.stock)}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            min="1"
                            max={product.stock}
                            className="mr-2 w-20"
                            disabled={product.stock <= 0}
                          />
                          <Button
                            onClick={() => handlePurchase(product.id)}
                            disabled={
                              loading ||
                              product.stock <= 0 ||
                              !selectedVariant[product.id]?.color ||
                              !selectedVariant[product.id]?.size
                            }
                            className={`w-full ${product.stock > 0 ? 'bg-blue-500 text-white hover:bg-blue-700' : 'bg-gray-400 text-white cursor-not-allowed'}`}
                          >
                            {product.stock > 0 ? "Comprar" : "Indisponível"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
