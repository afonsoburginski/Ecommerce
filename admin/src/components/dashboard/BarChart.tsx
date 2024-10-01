"use client";

import React, { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

function generateDaysInMonth(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, day) => {
    const date = new Date(year, month, day + 1).toISOString().split("T")[0];
    return { date, total: 0 };
  });
  return days;
}

function mergeSalesWithDays(salesData, year, month) {
  const daysInMonth = generateDaysInMonth(year, month);
  return daysInMonth.map((day) => {
    const saleForDay = salesData.find((sale) => sale.date === day.date);
    return saleForDay ? saleForDay : { ...day, transactionsCount: 0 };
  });
}

export default function Chart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    async function fetchDailySales() {
      try {
        const response = await fetch("/api/orders/sales");
        const salesData = await response.json();
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();
        const fullData = mergeSalesWithDays(salesData, currentYear, currentMonth);
        setChartData(fullData);
      } catch (error) {
        console.error("Erro ao buscar dados de vendas diárias:", error);
      }
    }
    fetchDailySales();
  }, []);

  return (
    <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Vendas por dia</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartData} className="aspect-auto h-[250px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 5,
              right: 5,
              left: 5,
              bottom: 5,
            }}
            barSize={30}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("pt-BR", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const { date, total, transactionsCount } = payload[0].payload;
                  return (
                    <div className="custom-tooltip bg-white p-2 border border-gray-300 rounded shadow-lg">
                      <p>{`Data: ${new Date(date).toLocaleDateString("pt-BR", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}`}</p>
                      <p>{total === 0 ? "Sem vendas" : `Vendas: R$ ${total}`}</p>
                      <p>{`Transações: ${transactionsCount}`}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="transactionsCount"
              fill="var(--color-bar)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
