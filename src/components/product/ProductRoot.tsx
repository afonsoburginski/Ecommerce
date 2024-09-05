"use client";

import { useRouter } from "next/navigation";
import { useProductForm } from "@/hooks/useProductForm";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, ChevronLeft } from "lucide-react";
import ColorSelect from "../ColorSelect";

export default function ProductRoot() {
  const router = useRouter();
  const {
    details,
    productStatus,
    mainImage,
    thumbImages,
    isError,
    handleImageSelect,
    handleDetailsChange,
    setProductStatus,
    handleSave,
    variants = [],
    handleVariantChange,
    handleAddVariant,
    handleRemoveVariant,
  } = useProductForm();

  return (
    <>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => router.push("/products")}>
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="flex-1 text-xl font-semibold">New Product</h1>
        <div className="hidden md:flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push("/products")}>Discard</Button>
          <Button variant="default" size="sm" onClick={handleSave}>
            Save Product
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3">
        <div className="grid gap-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>Enter the product details below.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-[3fr_1fr] gap-6">
                <div className="space-y-6">
                  <div className="flex gap-3 items-center">
                    <div className="flex-1">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={details.name}
                        onChange={(e) => handleDetailsChange("name", e.target.value)}
                      />
                    </div>
                    <div className="w-40">
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        value={details.price}
                        onChange={(e) => handleDetailsChange("price", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={details.description}
                      onChange={(e) => handleDetailsChange("description", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select onValueChange={(value) => handleDetailsChange("categoryId", value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {details.categories?.length > 0 ? (
                          details.categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem disabled>No categories available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <Select onValueChange={(value) => handleDetailsChange("tagId", value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a tag" />
                      </SelectTrigger>
                      <SelectContent>
                        {details.tags?.length > 0 ? (
                          details.tags.map((tag) => (
                            <SelectItem key={tag.id} value={tag.id}>
                              {tag.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem disabled>No tags available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Variants</CardTitle>
              <CardDescription>Manage variants, stock, sizes, and colors.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(variants) && variants.length > 0 ? (
                    variants.map((variant, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Input
                            type="text"
                            value={variant.sku}
                            onChange={(e) => handleVariantChange(index, "sku", e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={variant.stock}
                            onChange={(e) => handleVariantChange(index, "stock", Number(e.target.value))}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="text"
                            value={variant.size}
                            onChange={(e) => handleVariantChange(index, "size", e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <ColorSelect
                            value={variant.color}
                            onChange={(value) => handleVariantChange(index, "color", value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Button variant="destructive" onClick={() => handleRemoveVariant(index)}>
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5}>No variants available</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" onClick={handleAddVariant}>
                <PlusCircle className="h-4 w-4" /> Add Variant
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="status">Status</Label>
                  <Select onValueChange={setProductStatus}>
                    <SelectTrigger id="status" aria-label="Select status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>Upload and manage product images.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="relative">
                  <input
                    type="file"
                    id="mainUpload"
                    accept="image/*"
                    onChange={(e) => handleImageSelect(e.target.files[0], "main")}
                    className="hidden"
                  />
                  <label htmlFor="mainUpload">
                    <Image
                      alt="Product image"
                      className="aspect-square rounded-md object-cover cursor-pointer"
                      height="370"
                      src={mainImage ? URL.createObjectURL(mainImage) : "/placeholder.png"}
                      width="370"
                    />
                  </label>
                </div>
                <div className="flex flex-col gap-2">
                  {thumbImages.map((thumb, index) => (
                    <div key={index} className="relative">
                      <input
                        type="file"
                        id={`thumbUpload${index}`}
                        accept="image/*"
                        onChange={(e) => handleImageSelect(e.target.files[0], index)}
                        className="hidden"
                      />
                      <label htmlFor={`thumbUpload${index}`}>
                        <Image
                          alt="Thumbnail"
                          className="aspect-square rounded-md object-cover cursor-pointer"
                          height="118"
                          src={thumb ? URL.createObjectURL(thumb) : "/placeholder.png"}
                          width="118"
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
