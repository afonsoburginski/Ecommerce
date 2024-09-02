"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ProductStatus({
  statuses = [],
  productData = {},
  setProductData,
}: {
  statuses: string[];
  productData: Product;
  setProductData: (data: Product) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="status">Status</Label>
            <Select
              onValueChange={(value) => setProductData({ ...productData, status: value.toUpperCase() })}
              value={productData.status || ""}
            >
              <SelectTrigger id="status" aria-label="Select status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.length > 0 ? (
                  statuses.map((status, index) => (
                    <SelectItem key={index} value={status.toUpperCase()}>
                      {status}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled>No statuses available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
