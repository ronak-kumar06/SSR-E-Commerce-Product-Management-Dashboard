'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { IProduct } from '@/models/Product';

interface ProductChartsProps {
  products: IProduct[];
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];

export default function ProductCharts({ products }: ProductChartsProps) {
  const chartData = useMemo(() => {
    // Sales data
    const salesData = products
      .map((product) => ({
        name: product.name.length > 15 ? product.name.substring(0, 15) + '...' : product.name,
        sales: product.sales,
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10);

    // Stock data
    const stockData = products
      .map((product) => ({
        name: product.name.length > 15 ? product.name.substring(0, 15) + '...' : product.name,
        stock: product.stock,
      }))
      .sort((a, b) => b.stock - a.stock)
      .slice(0, 10);

    // Category distribution
    const categoryMap = new Map<string, number>();
    products.forEach((product) => {
      const count = categoryMap.get(product.category) || 0;
      categoryMap.set(product.category, count + 1);
    });

    const categoryData = Array.from(categoryMap.entries()).map(([name, value]) => ({
      name,
      value,
    }));

    // Total value by category
    const valueByCategory = new Map<string, number>();
    products.forEach((product) => {
      const total = valueByCategory.get(product.category) || 0;
      valueByCategory.set(product.category, total + product.price * product.stock);
    });

    const categoryValueData = Array.from(valueByCategory.entries()).map(([name, value]) => ({
      name,
      value: Math.round(value),
    }));

    return { salesData, stockData, categoryData, categoryValueData };
  }, [products]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Sales Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Top Products by Sales</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData.salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stock Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Top Products by Stock</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData.stockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="stock" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Distribution */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Products by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData.categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Category Value */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Inventory Value by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData.categoryValueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            <Legend />
            <Bar dataKey="value" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

