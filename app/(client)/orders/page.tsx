"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CustomButton } from '@/components/ui/custom-button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Package, Calendar, MapPin, DollarSign, ArrowLeft } from 'lucide-react';

interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  image?: string;
}

interface Order {
  id: string;
  status: string;
  customer_name: string;
  address: string;
  grand_total: number;
  number_of_products: number;
  created_at: string;
  estimated_delivery?: string;
  products: OrderItem[];
}

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get auth token from Supabase
      const { supabase } = await import('@/lib/supabaseClient');
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || '';

      if (!token) {
        throw new Error('Please login to view your orders');
      }

      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const result = await response.json();
      setOrders(result.data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const mapStatusToBadge = (status: string): 'delivered' | 'confirmed' | 'returned' | 'cancelled' | 'pending' | 'sent' => {
    const statusMap: Record<string, 'delivered' | 'confirmed' | 'returned' | 'cancelled' | 'pending' | 'sent'> = {
      'Delivered': 'delivered',
      'Confirmed': 'confirmed',
      'Returned': 'returned',
      'Canceled': 'cancelled',
      'Pending': 'pending',
      'Sent': 'sent',
    };
    return statusMap[status] || 'pending';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      // Get auth token from Supabase
      const { supabase } = await import('@/lib/supabaseClient');
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || '';

      if (!token) {
        throw new Error('Please login to cancel order');
      }

      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'Canceled' }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }

      alert('Order canceled successfully');
      fetchOrders(); // Refresh orders
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to cancel order');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <Package className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Error Loading Orders</h2>
          <p className="text-neutral-600 mb-6">{error}</p>
          <CustomButton
            variant="filled"
            text="Try Again"
            onClick={fetchOrders}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <CustomButton
          variant="outlined"
          text="Back to Home"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => router.push('/')}
          className="mb-4"
        />
        <h1 className="text-3xl font-bold text-neutral-900">My Orders</h1>
        <p className="text-neutral-600 mt-2">
          Track and manage your orders
        </p>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">No Orders Yet</h2>
          <p className="text-neutral-600 mb-6">
            Start shopping to see your orders here
          </p>
          <CustomButton
            variant="filled"
            text="Start Shopping"
            onClick={() => router.push('/products')}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-4 border-b border-neutral-200">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-neutral-900">
                      Order {order.id.substring(0, 8).toUpperCase()}
                    </h3>
                    <StatusBadge state={mapStatusToBadge(order.status)} />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-neutral-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(order.created_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      {order.number_of_products} {order.number_of_products === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 text-right">
                  <div className="flex items-center gap-1 text-2xl font-bold text-neutral-900">
                    <DollarSign className="w-5 h-5" />
                    {order.grand_total.toLocaleString()} DZD
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-semibold text-neutral-700 mb-2">Shipping Address</h4>
                  <p className="text-sm text-neutral-600 flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{order.address}</span>
                  </p>
                </div>
                {order.estimated_delivery && (
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-700 mb-2">Estimated Delivery</h4>
                    <p className="text-sm text-neutral-600">
                      {formatDate(order.estimated_delivery)}
                    </p>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-neutral-700 mb-3">Items</h4>
                <div className="space-y-2">
                  {order.products.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg"
                    >
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-neutral-900">{item.name}</p>
                        <p className="text-sm text-neutral-600">
                          {item.color && <span>Color: {item.color}</span>}
                          {item.size && <span className="ml-3">Size: {item.size}</span>}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-neutral-900">
                          {item.price.toLocaleString()} DZD
                        </p>
                        <p className="text-sm text-neutral-600">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <CustomButton
                  variant="outlined"
                  text="View Details"
                  onClick={() => router.push(`/orders/${order.id}`)}
                  className="flex-1"
                />
                {(order.status === 'Pending' || order.status === 'Confirmed') && (
                  <CustomButton
                    variant="outlined"
                    text="Cancel Order"
                    onClick={() => handleCancelOrder(order.id)}
                    className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
