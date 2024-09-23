"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Sun, Moon } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Cookie from "js-cookie";
import { useTheme } from "next-themes";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState("Guest");
  const [userImage, setUserImage] = useState(
    "https://avatars.githubusercontent.com/u/83406890?s=400&u=749bd94af4f15dc0ddbbb1dbc9c76dd9515d4af7&v=4"
  );

  // Ensure the component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);

    // Simulate fetching user data from a cookie or context
    const fetchUser = () => {
      const token = Cookie.get("token");
      if (token) {
        // Simulate fetching user information
        const user = {
          email: "guest@example.com",
          username: "guestuser",
          avatar_url:
            "https://avatars.githubusercontent.com/u/83406890?s=400&u=749bd94af4f15dc0ddbbb1dbc9c76dd9515d4af7&v=4",
        };

        setUsername(user.username);
        setUserImage(user.avatar_url);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    Cookie.remove("token");
    router.push("/login");
  };

  const pathnames = pathname.split("/").filter((x) => x);

  // Render theme changer only when component is mounted
  const renderThemeChanger = () => {
    if (!mounted) return null;

    return (
      <Button
        variant="outline"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </Button>
    );
  };

  return (
    <header className="flex h-12 items-center gap-4 border-0 bg-muted/40 px-6 sm:static sm:h-auto sm:bg-muted/40 sm:gap-4 sm:pt-3">
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          {pathnames.map((value, index) => {
            const breadcrumbLink = `/${pathnames
              .slice(0, index + 1)
              .join("/")}`;

            return (
              <BreadcrumbItem key={breadcrumbLink}>
                <BreadcrumbLink asChild>
                  <Link href={breadcrumbLink}>{value}</Link>
                </BreadcrumbLink>
                {index < pathnames.length - 1 && <BreadcrumbSeparator />}
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full h-8 rounded bg-background pl-8 md:w-[200px] lg:w-[320px]"
        />
      </div>
      {renderThemeChanger()}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <Avatar>
              <AvatarImage src={userImage} />
              <AvatarFallback>{username ? username[0] : "CN"}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            {username ? username : "My Account"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href="/analytics">Analytics</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/settings">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
