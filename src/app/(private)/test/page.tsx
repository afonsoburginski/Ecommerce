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

  const getSelectedVariantStock = (productId) => {
    const variant = selectedVariant[productId];
    if (!variant || !variant.color || !variant.size) return 0;

    const selectedVariantProduct = products
      .find((product) => product.id === productId)
      .variants.find(
        (v) => v.color === variant.color && v.size === variant.size
      );

    return selectedVariantProduct ? selectedVariantProduct.stock : 0;
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
                      {product.images.length > 0 ? (
                        <Image
                          src={product.images[0]} // Usando a primeira imagem do array
                          alt={product.name}
                          width={300}
                          height={200}
                          className="rounded-lg"
                        />
                      ) : (
                        <Image
                          src="/placeholder.svg" // Exibe um placeholder se não houver imagem
                          alt="Placeholder"
                          width={300}
                          height={200}
                          className="rounded-lg"
                        />
                      )}
                      <p className="mt-2 text-sm">Preço: R${product.price.toFixed(2)}</p>

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

                        <p className="mt-2 text-sm">Estoque: {getSelectedVariantStock(product.id)}</p>

                        <div className="flex items-center mt-4">
                          <Input
                            type="number"
                            value={Math.min(quantity, getSelectedVariantStock(product.id))}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            min="1"
                            max={getSelectedVariantStock(product.id)}
                            className="mr-2 w-20"
                            disabled={getSelectedVariantStock(product.id) <= 0}
                          />
                          <Button
                            onClick={() => handlePurchase(product.id)}
                            disabled={
                              loading ||
                              getSelectedVariantStock(product.id) <= 0 ||
                              !selectedVariant[product.id]?.color ||
                              !selectedVariant[product.id]?.size
                            }
                            className={`w-full ${getSelectedVariantStock(product.id) > 0 ? 'bg-blue-500 text-white hover:bg-blue-700' : 'bg-gray-400 text-white cursor-not-allowed'}`}
                          >
                            {getSelectedVariantStock(product.id) > 0 ? "Comprar" : "Indisponível"}
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
