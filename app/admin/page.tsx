"use client";

import { useOrders } from '@/hooks/useOrders';
import { useProducts } from '@/hooks/useProducts';
import '@/styles/admin-dashboard.css';

export default function AdminDashboard() {
  const { orders, isLoading: ordersLoading } = useOrders();
  const { products, isLoading: productsLoading } = useProducts();

  const isLoading = ordersLoading || productsLoading;

  // Calculate stats
  const totalOrders = orders.length;

  const totalRevenue = orders.reduce((acc, order) => {
    const orderItemsRevenue = (order.items || []).reduce((sum, item) => {
      return sum + (Number(item.price) * (item.quantity || 0));
    }, 0);
    return acc + orderItemsRevenue;
  }, 0);

  const totalProducts = products.length;

  const uniqueCustomers = new Set(
    orders.map(order => order.customer_email || order.customer_phone).filter(Boolean)
  ).size;

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Dashboard</h2>
          <p className="dashboard-subtitle">Loading statistics...</p>
        </div>
        <div className="stats-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="stat-card animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
              <div className="h-8 bg-gray-300 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Dashboard</h2>
        <p className="dashboard-subtitle">Welcome to your admin dashboard</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3 className="stat-label">Total Orders</h3>
          <p className="stat-value">{totalOrders.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3 className="stat-label">Total Revenue</h3>
          <p className="stat-value">{totalRevenue.toLocaleString()} DA</p>
        </div>
        <div className="stat-card">
          <h3 className="stat-label">Products</h3>
          <p className="stat-value">{totalProducts.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3 className="stat-label">Customers</h3>
          <p className="stat-value">{uniqueCustomers.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
