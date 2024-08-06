// components/ProductForm.tsx
'use client';

import { useState, useEffect } from "react";
import { ChevronLeft, PlusCircle, Upload } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface Category {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

interface ProductFormProps {
  product?: Product | null;
  categories: Category[];
  tags: Tag[];
  statuses: string[];
  onSave: (productData: any) => Promise<void>;
}

export default function ProductForm({ product, categories, tags, statuses, onSave }: ProductFormProps) {
  const [productImages, setProductImages] = useState<string[]>(product?.images || []);
  const [productName, setProductName] = useState<string>(product?.name || "");
  const [productDescription, setProductDescription] = useState<string>(product?.description || "");
  const [productPrice, setProductPrice] = useState<number>(product?.price || 0);
  const [productStock, setProductStock] = useState<number>(product?.stock || 0);
  const [productSKU, setProductSKU] = useState<string>(product?.sku || "");
  const [productStatus, setProductStatus] = useState<string>(product?.status || "DRAFT");
  const [productCategory, setProductCategory] = useState<number | null>(product?.categoryId || null);
  const [productTags, setProductTags] = useState<number[]>(product?.tags.map(tag => tag.id) || []);

  useEffect(() => {
    if (!product) {
      setProductImages(["/placeholder.png", "/placeholder.png", "/placeholder.png"]);
    }
  }, [product]);

  const handleSaveProduct = async () => {
    const productData = {
      name: productName,
      description: productDescription,
      price: productPrice,
      stock: productStock,
      sku: productSKU,
      status: productStatus.toUpperCase(),
      categories: productCategory ? [productCategory] : [],
      tags: productTags,
    };

    await onSave(productData);
  };

  return (
    <div className="flex h-full w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="mx-auto grid flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                {product ? product.name : "New Product"}
              </h1>
              <Badge variant="outline" className="ml-auto sm:ml-0">
                {product ? product.status : "In stock"}
              </Badge>
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button variant="outline" size="sm">
                  Discard
                </Button>
                <Button size="sm" onClick={handleSaveProduct}>
                  Save Product
                </Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                    <CardDescription>
                      {product ? "Edit the product details below." : "Enter the product details below."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          type="text"
                          className="w-full"
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={productDescription}
                          onChange={(e) =>
                            setProductDescription(e.target.value)
                          }
                          className="min-h-32"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Stock</CardTitle>
                    <CardDescription>
                      Manage stock and pricing information.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">SKU</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead className="w-[100px]">Size</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-semibold">
                            <Input
                              id="sku"
                              type="text"
                              className="w-full"
                              value={productSKU}
                              onChange={(e) => setProductSKU(e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Label htmlFor="stock-1" className="sr-only">
                              Stock
                            </Label>
                            <Input
                              id="stock-1"
                              type="number"
                              value={productStock}
                              onChange={(e) =>
                                setProductStock(Number(e.target.value))
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Label htmlFor="price-1" className="sr-only">
                              Price
                            </Label>
                            <Input
                              id="price-1"
                              type="number"
                              value={productPrice}
                              onChange={(e) =>
                                setProductPrice(Number(e.target.value))
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <ToggleGroup
                              type="single"
                              defaultValue="s"
                              variant="outline"
                            >
                              <ToggleGroupItem value="s">S</ToggleGroupItem>
                              <ToggleGroupItem value="m">M</ToggleGroupItem>
                              <ToggleGroupItem value="l">L</ToggleGroupItem>
                            </ToggleGroup>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter className="justify-center border-t p-4">
                    <Button size="sm" variant="ghost" className="gap-1">
                      <PlusCircle className="h-3.5 w-3.5" />
                      Add Variant
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Product Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 sm:grid-cols-3">
                      <div className="grid gap-3">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          onValueChange={(value) =>
                            setProductCategory(Number(value))
                          }
                          value={productCategory?.toString() || ""}
                        >
                          <SelectTrigger
                            id="category"
                            aria-label="Select category"
                          >
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.length > 0 && categories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.id.toString()}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="tags">Tags</Label>
                        <Select
                          onValueChange={(value) =>
                            setProductTags((prev) => [...prev, Number(value)])
                          }
                          multiple
                        >
                          <SelectTrigger id="tags" aria-label="Select tags">
                            <SelectValue placeholder="Select tags" />
                          </SelectTrigger>
                          <SelectContent>
                            {tags.length > 0 && tags.map((tag) => (
                              <SelectItem
                                key={tag.id}
                                value={tag.id.toString()}
                              >
                                {tag.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          onValueChange={(value) => setProductStatus(value.toUpperCase())} // Convert to uppercase
                          value={productStatus}
                        >
                          <SelectTrigger id="status" aria-label="Select status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {statuses.length > 0 && statuses.map((status, index) => (
                              <SelectItem
                                key={index}
                                value={status.toUpperCase()} // Ensure the value is in uppercase
                              >
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="overflow-hidden">
                  <CardHeader>
                    <CardTitle>Product Images</CardTitle>
                    <CardDescription>
                      Lipsum dolor sit amet, consectetur adipiscing elit
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      <Image
                        alt="Product image"
                        className="aspect-square w-full rounded-md object-cover"
                        height={300}
                        src="/placeholder.png"
                        width={300}
                        layout="responsive"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        {productImages.map((src, index) => (
                          <button key={index}>
                            <Image
                              alt={`Product image ${index + 1}`}
                              className="aspect-square w-full rounded-md object-cover"
                              height={84}
                              src={src}
                              width={84}
                              layout="responsive"
                            />
                          </button>
                        ))}
                        <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                          <Upload className="h-4 w-4 text-muted-foreground" />
                          <span className="sr-only">Upload</span>
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 md:hidden">
              <Button variant="outline" size="sm">
                Discard
              </Button>
              <Button size="sm" onClick={handleSaveProduct}>
                Save Product
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
