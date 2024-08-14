'use client';
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


const totalRevenue = 5320;
const usersToday = 1320;
const totalSales = 24500;
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

export function CardGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-4 lg:grid-cols-4">
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
  );
}
