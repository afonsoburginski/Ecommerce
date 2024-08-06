'use client'
import Link from "next/link"
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Users,
} from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Chart from "@/components/BarChart"
import DataTable from "@/components/dataTable/DataTable"

const customers = [
  {
    username: "Liam Johnson",
    email: "liam@example.com",
    status: "Approved",
    data: "2023-06-23",
  },
  {
    username: "Olivia Smith",
    email: "olivia@example.com",
    status: "Declined",
    data: "2023-06-24",
  },
  {
    username: "Noah Williams",
    email: "noah@example.com",
    status: "Approved",
    data: "2023-06-25",
  },
  {
    username: "Emma Brown",
    email: "emma@example.com",
    status: "Approved",
    data: "2023-06-26",
  },
  {
    username: "Liam Johnson",
    email: "liam@example.com",
    status: "Approved",
    data: "2023-06-27",
  },
];

const totalRevenue = 5320; // Novo valor para Total Revenue
const usersToday = 1320; // Novo valor para Users Today
const totalSales = 24500; // Novo valor para Total Sales
const activeNow = 573;

const cardData = [
  {
    title: "Total Revenue",
    icon: DollarSign,
    value: `$${totalRevenue.toLocaleString()}`,
    percentage: "+12.3 from last month",
  },
  {
    title: "Users Today",
    icon: Users,
    value: usersToday.toLocaleString(),
  },
  {
    title: "Total Sales",
    icon: CreditCard,
    value: `$${totalSales.toLocaleString()}`,
  },
  {
    title: "Active Now",
    icon: Activity,
    value: activeNow.toLocaleString(),
    percentage: "+201 since last hour",
  },
];

export default function Dashboard() {
  return (
    <div className="flex h-full w-full flex-col bg-muted/40">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {cardData.map((data, index) => (
            <Card key={index} x-chunk={`dashboard-01-chunk-${index}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {data.title}
                </CardTitle>
                <data.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.value}</div>
                {data.percentage && (
                  <p className="text-xs text-muted-foreground">
                    {data.percentage}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
              <Chart />
          <Card x-chunk="dashboard-01-chunk-5">
            <CardHeader>
              <CardTitle>Most recent subscribers</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8">
              {customers.map((customer, index) => (
                <div key={index} className="flex items-center gap-4">
                  <Avatar className="hidden h-9 w-9 sm:flex">
                    <AvatarImage src="https://ui.shadcn.com/avatars/02.png" alt="Avatar" />
                    <AvatarFallback>{customer.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">
                      {customer.username}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {customer.email}
                    </p>
                  </div>
                  <div className="ml-4 text-sm">{customer.data}</div>
                  <Badge variant={customer.status === "Approved" ? "default" : "destructive"}>
                    {customer.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="xl:col-span-3" x-chunk="dashboard-01-chunk-4">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Transactions</CardTitle>
                <CardDescription>
                  Recent transactions from your store.
                </CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="#">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
          <DataTable />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
