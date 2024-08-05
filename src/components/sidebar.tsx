'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'; // Update to correct import path for your project
import {
  Tornado,
  Home,
  Package,
  Users2,
  Settings,
  CreditCard,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const linkClass = (href: string) => {
    return `flex items-center justify-center transition-colors hover:text-foreground ${
      pathname === href ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
    } ${collapsed ? 'h-9 w-9' : 'h-10 w-full px-3 py-2'}`;
  };

  return (
    <aside className={`fixed flex flex-col h-full border-r bg-background transition-all duration-300 ${collapsed ? 'w-14' : 'w-56'}`}>
      <nav className="flex flex-col items-center gap-4 px-2 py-4">
        <Link
          href="/"
          className={`group flex items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground transition-all ${
            collapsed ? 'h-9 w-9' : 'h-10 w-full px-3 py-2'
          }`}
        >
          <Tornado className={`transition-all ${collapsed ? 'w-5 h-5' : 'w-4 h-4'}`} />
          {!collapsed && <span>Admin Panel</span>}
        </Link>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/" className={linkClass('/')}>
              <Home className="h-5 w-5" />
              {!collapsed && <span className="ml-3">Dashboard</span>}
            </Link>
          </TooltipTrigger>
          {collapsed && <TooltipContent side="right">Dashboard</TooltipContent>}
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/products" className={linkClass('/products')}>
              <Package className="h-5 w-5" />
              {!collapsed && <span className="ml-3">Products</span>}
            </Link>
          </TooltipTrigger>
          {collapsed && <TooltipContent side="right">Products</TooltipContent>}
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/customers" className={linkClass('/customers')}>
              <Users2 className="h-5 w-5" />
              {!collapsed && <span className="ml-3">Customers</span>}
            </Link>
          </TooltipTrigger>
          {collapsed && <TooltipContent side="right">Customers</TooltipContent>}
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/payments" className={linkClass('/payments')}>
              <CreditCard className="h-5 w-5" />
              {!collapsed && <span className="ml-3">Payments</span>}
            </Link>
          </TooltipTrigger>
          {collapsed && <TooltipContent side="right">Payments</TooltipContent>}
        </Tooltip>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/settings" className={linkClass('/settings')}>
              <Settings className="h-5 w-5" />
              {!collapsed && <span className="ml-3">Settings</span>}
            </Link>
          </TooltipTrigger>
          {collapsed && <TooltipContent side="right">Settings</TooltipContent>}
        </Tooltip>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center p-2 mt-4 mb-2 rounded-lg hover:bg-secondary"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </nav>
    </aside>
  );
}
