"use client";

import { useState, useEffect, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CustomButton } from '@/components/ui/custom-button';
import { StatusBadge } from '@/components/ui/status-badge';
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  Phone, 
  Mail,
  Truck,
  DollarSign,
  FileText
} from 'lucide-react';

interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  image?: string;
}

interface TimelineEntry {
  title: string;
  date: string;
  location?: string;
}

interface Order {
  id: string;
  status: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  address: string;
  wilaya: string;
  city: string;
  shipping_method: string;
  order_notes?: string;
  total_amount: number;
  shipping_fee: number;
  tax: number;
  discount?: number;
  grand_total: number;
  payment_method: string;
  delivery_company?: string;
  shipping_status?: string;
  products: OrderItem[];
  number_of_products: number;
  shipment_timeline: TimelineEntry[];
  date_purchased: string;
  date_delivered?: string;
  estimated_delivery?: string;
  created_at: string;
}

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get auth token from Supabase
      const { supabase } = await import('@/lib/supabaseClient');
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || '';

      if (!token) {
        throw new Error('Please login to view order details');
      }

      const response = await fetch(`/api/orders/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }

      const result = await response.json();
      setOrder(result.data);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError(err instanceof Error ? err.message : 'Failed to load order');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

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
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <Package className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Order Not Found</h2>
          <p className="text-neutral-600 mb-6">{error || 'Unable to load order details'}</p>
          <CustomButton
            variant="filled"
            text="Back to Orders"
            onClick={() => router.push('/orders')}
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
          text="Back to Orders"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => router.push('/orders')}
          className="mb-4"
        />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Order Details</h1>
            <p className="text-neutral-600 mt-1">
              Order ID: {order.id.substring(0, 12).toUpperCase()}
            </p>
          </div>
          <StatusBadge state={mapStatusToBadge(order.status)} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipment Timeline */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Shipment Timeline
            </h2>
            <div className="space-y-4">
              {order.shipment_timeline.map((entry, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${
                      idx === 0 ? 'bg-neutral-900' : 'bg-neutral-300'
                    }`} />
                    {idx < order.shipment_timeline.length - 1 && (
                      <div className="w-0.5 h-12 bg-neutral-200" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-semibold text-neutral-900">{entry.title}</p>
                    <p className="text-sm text-neutral-600">{formatDate(entry.date)}</p>
                    {entry.location && (
                      <p className="text-sm text-neutral-500 mt-1">{entry.location}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Items ({order.number_of_products})
            </h2>
            <div className="space-y-4">
              {order.products.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg"
                >
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-900">{item.name}</h3>
                    <p className="text-sm text-neutral-600 mt-1">
                      {item.color && <span>Color: {item.color}</span>}
                      {item.size && <span className="ml-3">Size: {item.size}</span>}
                      <span className="ml-3">Qty: {item.quantity}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-neutral-900">
                      {item.price.toLocaleString()} DZD
                    </p>
                    <p className="text-sm text-neutral-600">
                      Total: {(item.price * item.quantity).toLocaleString()} DZD
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Order Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span>{order.total_amount.toLocaleString()} DZD</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span>{order.shipping_fee.toLocaleString()} DZD</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Tax</span>
                <span>{order.tax.toLocaleString()} DZD</span>
              </div>
              {order.discount && order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{order.discount.toLocaleString()} DZD</span>
                </div>
              )}
              <div className="pt-3 border-t border-neutral-200 flex justify-between text-lg font-bold text-neutral-900">
                <span>Total</span>
                <span>{order.grand_total.toLocaleString()} DZD</span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Customer Info</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 text-neutral-500" />
                <span className="text-neutral-700">{order.customer_email}</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 text-neutral-500" />
                <span className="text-neutral-700">{order.customer_phone}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-neutral-500 flex-shrink-0" />
                <span className="text-neutral-700">{order.address}</span>
              </div>
              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 mt-0.5 text-neutral-500" />
                <span className="text-neutral-700">
                  {order.shipping_method === 'home' ? 'Home Delivery' : 'Bureau Delivery'}
                </span>
              </div>
              {order.order_notes && (
                <div className="flex items-start gap-2 pt-2 border-t border-neutral-200">
                  <FileText className="w-4 h-4 mt-0.5 text-neutral-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-neutral-700">Notes:</p>
                    <p className="text-neutral-600">{order.order_notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Delivery Info</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-neutral-600">Payment Method:</span>
                <p className="font-semibold text-neutral-900">{order.payment_method}</p>
              </div>
              {order.delivery_company && (
                <div>
                  <span className="text-neutral-600">Delivery Company:</span>
                  <p className="font-semibold text-neutral-900">{order.delivery_company}</p>
                </div>
              )}
              {order.estimated_delivery && (
                <div>
                  <span className="text-neutral-600">Estimated Delivery:</span>
                  <p className="font-semibold text-neutral-900">
                    {formatDate(order.estimated_delivery)}
                  </p>
                </div>
              )}
              <div>
                <span className="text-neutral-600">Order Date:</span>
                <p className="font-semibold text-neutral-900">
                  {formatDate(order.created_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
