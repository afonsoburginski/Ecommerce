"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingCart, Search, Sun, Moon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { ShopCart } from "@/components/shopCart"; // Import the ShopCart component
import Image from "next/image";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const renderThemeChanger = () => {
    if (!mounted) return null;

    return (
      <Button
        variant="outline"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
    );
  };

  return (
    <header className="flex h-12 mx-auto max-w-[1320px] items-center gap-4 border-0 bg-muted/40 px-6 sm:static sm:h-auto sm:bg-transparent sm:gap-2 sm:py-2">
      <div className="flex items-center gap-2">
        <Link href="/" className="group flex items-center gap-2">
          <h2 className="text-xl font-black text-primary">Mundo Encantado</h2>
        </Link>
      </div>
      <div className="flex-1 flex justify-center">
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Pesquisar..."
            className="w-full h-8 rounded bg-background pl-8"
          />
        </div>
      </div>
      {renderThemeChanger()}
      <ShopCart />
    </header>
  );
}
