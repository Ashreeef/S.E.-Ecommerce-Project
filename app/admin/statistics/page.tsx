"use client";

import React, { useMemo } from 'react';
import Image from 'next/image';
import { useOrders } from '@/hooks/useOrders';
import { useProducts } from '@/hooks/useProducts';
import {
  BarChart3,
  Map as MapIcon,
  Package,
  TrendingUp,
  ShoppingBag,
  ArrowUpRight,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import '@/styles/admin-dashboard.css';
import '@/styles/statistics.css';

interface BestSeller {
  name: string;
  qty: number;
  revenue: number;
  image: string;
}

interface WilayaStat {
  name: string;
  count: number;
  total: number;
}

interface CategoryStat {
  name: string;
  qty: number;
}

interface StatsData {
  wilayaData: WilayaStat[];
  maxWilayaTotal: number;
  bestSellers: BestSeller[];
  categoryData: CategoryStat[];
  maxCatQty: number;
  totalRevenue: number;
  avgOrderValue: number;
  totalOrders: number;
}

export default function StatisticsPage() {
  const { orders, isLoading: ordersLoading, error: ordersError } = useOrders();
  const { products, isLoading: productsLoading, error: productsError } = useProducts();

  const isLoading = ordersLoading || productsLoading;
  const error = ordersError || productsError;

  // Process Stats
  const stats = useMemo<StatsData | null>(() => {
    if (!orders || orders.length === 0) return null;

    // 1. Geography: Sales by Wilaya
    const wilayaMap = new Map<string, { count: number, total: number }>();
    orders.forEach(order => {
      const w = order.wilaya || 'Unknown';
      const orderRevenue = (order.items || []).reduce((sum, item) =>
        sum + (Number(item.price) * (item.quantity || 0)), 0
      );

      const existing = wilayaMap.get(w) || { count: 0, total: 0 };
      wilayaMap.set(w, {
        count: existing.count + 1,
        total: existing.total + orderRevenue
      });
    });

    const wilayaData: WilayaStat[] = Array.from(wilayaMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.total - a.total);

    const maxWilayaTotal = Math.max(...wilayaData.map(w => w.total), 1);

    // 2. Best Sellers: Products by Quantity
    const productSalesMap = new Map<string, BestSeller>();
    orders.forEach(order => {
      (order.items || []).forEach(item => {
        const existing = productSalesMap.get(item.productId) || {
          name: item.name,
          qty: 0,
          revenue: 0,
          image: item.image
        };
        productSalesMap.set(item.productId, {
          ...existing,
          qty: existing.qty + (item.quantity || 0),
          revenue: existing.revenue + (Number(item.price) * (item.quantity || 0))
        });
      });
    });

    const bestSellers = Array.from(productSalesMap.values())
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    // 3. Category Distribution
    const categoryMap = new Map<string, number>();
    orders.forEach(order => {
      (order.items || []).forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        const cat = prod?.category || 'Uncategorized';
        categoryMap.set(cat, (categoryMap.get(cat) || 0) + (item.quantity || 0));
      });
    });

    const categoryData: CategoryStat[] = Array.from(categoryMap.entries())
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty);

    const maxCatQty = Math.max(...categoryData.map(c => c.qty), 1);

    // 4. Overarching Metrics
    const totalRevenue = orders.reduce((acc, order) => {
      return acc + (order.items || []).reduce((sum, item) =>
        sum + (Number(item.price) * (item.quantity || 0)), 0
      );
    }, 0);

    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    return {
      wilayaData,
      maxWilayaTotal,
      bestSellers,
      categoryData,
      maxCatQty,
      totalRevenue,
      avgOrderValue,
      totalOrders: orders.length
    };
  }, [orders, products]);

  if (isLoading) {
    return (
      <div className="stats-page">
        <div className="page-header mb-8">
          <h2 className="page-title">Statistics</h2>
          <p className="page-subtitle">Loading your business insights...</p>
        </div>
        <div className="stats-grid-main">
          {[1, 2, 3].map(i => <div key={i} className="stats-section h-32 skeleton-pulse"></div>)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="stats-section h-96 skeleton-pulse"></div>
          <div className="stats-section h-96 skeleton-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stats-page">
        <div className="page-header mb-8">
          <h2 className="page-title">Statistics Error</h2>
          <p className="page-subtitle text-rose-500 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </p>
        </div>
        <div className="stats-section py-20 text-center">
          <p className="text-neutral-500 mb-4">We encountered an issue while loading your data.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="stats-page">
        <div className="page-header mb-8">
          <h2 className="page-title">Statistics</h2>
          <p className="page-subtitle">Welcome! Stats will appear once you have orders.</p>
        </div>
        <div className="stats-section py-20 text-center text-neutral-500">
          <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>No sales data available yet.</p>
          <p className="text-xs mt-2">Make sure your backend is running and you have placed orders.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="stats-page">
      <div className="page-header mb-8 flex justify-between items-end">
        <div>
          <h2 className="page-title">Business Intelligence</h2>
          <p className="page-subtitle">Real-time performance metrics</p>
        </div>
        <div className="text-sm font-medium text-rose-600 bg-rose-50 px-3 py-1 rounded-full flex items-center gap-1">
          <TrendingUp className="w-4 h-4" /> Live
        </div>
      </div>

      {/* Main Metric Cards */}
      <div className="stats-grid-main">
        <div className="stats-section mini-card">
          <span className="mini-card-label">Overall Revenue</span>
          <div className="flex items-baseline gap-2">
            <span className="mini-card-value">{(stats.totalRevenue || 0).toLocaleString()} DA</span>
          </div>
          <div className="mt-2 text-xs text-emerald-600 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> Total generated excluding shipping
          </div>
        </div>

        <div className="stats-section mini-card">
          <span className="mini-card-label">Average Order Value</span>
          <span className="mini-card-value">{Math.round(stats.avgOrderValue || 0).toLocaleString()} DA</span>
          <div className="mt-2 text-xs text-neutral-500">
            Across {stats.totalOrders} successful orders
          </div>
        </div>

        <div className="stats-section mini-card">
          <span className="mini-card-label">Total Volume</span>
          <span className="mini-card-value">{(stats.totalOrders || 0).toLocaleString()}</span>
          <div className="mt-2 text-xs text-neutral-500">
            Total count of orders received
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Best Sellers */}
        <div className="stats-section">
          <h3 className="section-title">
            <Package className="w-5 h-5 text-rose-500" /> Best Sellers
          </h3>
          <div className="mt-4">
            {stats.bestSellers.length > 0 ? (
              stats.bestSellers.map((item: BestSeller, idx: number) => (
                <div key={`${item.name}-${idx}`} className="seller-item">
                  <span className="seller-rank">#{idx + 1}</span>
                  <div className="relative w-10 h-10 overflow-hidden rounded">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="seller-info">
                    <div className="seller-name">{item.name}</div>
                    <div className="seller-stats">{item.qty} units sold</div>
                  </div>
                  <div className="seller-revenue">{(item.revenue || 0).toLocaleString()} DA</div>
                </div>
              ))
            ) : (
              <p className="text-sm text-neutral-400 py-4">No data yet</p>
            )}
          </div>
        </div>

        {/* Sales by Wilaya */}
        <div className="stats-section">
          <h3 className="section-title">
            <MapIcon className="w-5 h-5 text-rose-500" /> Sales by Wilaya
          </h3>
          <div className="mt-6 space-y-6">
            {stats.wilayaData.length > 0 ? (
              stats.wilayaData.slice(0, 6).map((w: WilayaStat, idx: number) => (
                <div key={`${w.name}-${idx}`} className="dist-item">
                  <div className="dist-label-row">
                    <span className="font-medium text-slate-700">{w.name}</span>
                    <span className="text-slate-500">{(w.total || 0).toLocaleString()} DA</span>
                  </div>
                  <div className="dist-bar-bg">
                    <div
                      className="dist-bar-fill"
                      style={{ width: `${(w.total / stats.maxWilayaTotal) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-neutral-400 py-4">No data yet</p>
            )}
            {stats.wilayaData.length > 6 && (
              <button className="text-sm text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-1 mt-4">
                View all localized data <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="stats-section lg:col-span-2">
          <h3 className="section-title">
            <BarChart3 className="w-5 h-5 text-rose-500" /> Popular Collections
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-4">
            {stats.categoryData.length > 0 ? (
              stats.categoryData.map((cat: CategoryStat, idx: number) => (
                <div key={`${cat.name}-${idx}`} className="relative pt-2">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-600">{cat.name}</span>
                    <span className="text-xs text-slate-400">{cat.qty} items</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-800 rounded-full transition-all duration-1000"
                      style={{ width: `${(cat.qty / stats.maxCatQty) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-neutral-400 py-4 col-span-3">No data yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
