"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Order } from '@/lib/types/orders';
import { StatusBadge } from '@/components/ui/status-badge';
import { CustomButton } from '@/components/ui/custom-button';
import { Input } from '@/components/ui';
import { useOrder } from '@/hooks/useOrders';
import { useToast } from '@/context/ToastContext';
import { Download } from 'lucide-react';
import '@/styles/order-details.css';

interface OrderFormProps {
  order: Order;
}

export default function OrderForm({ order }: OrderFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const { updateStatus, isLoading: orderLoading } = useOrder(order.id);
  const [selectedStatus, setSelectedStatus] = useState<Order['status']>(order.status);

  const handleSave = async () => {
    if (!order.id) return;
    const res = await updateStatus(selectedStatus);
    if (res && (res as any).success) {
      showToast('Order status saved', 'success');
      try { router.refresh(); } catch (e) { }
    } else {
      showToast('Failed to save order status', 'error');
    }
  };

  const formattedDate = new Date(order.created_at).toLocaleString();

  return (
    <div className="page-container product-form-container">
      {/* Breadcrumb */}
      <div className="order-form-breadcrumb">
        <Link href="/admin" className="text-gray-600 hover:underline">Dashboard</Link>
        <span className="order-form-breadcrumb-separator">/</span>
        <Link href="/admin/orders" className="text-gray-600 ">Orders</Link>
        <span className="order-form-breadcrumb-separator">/ </span>
        <span className="order-form-breadcrumb-active">{order.order_number || order.id}</span>
      </div>

      {/* Header with Order ID and Export */}
      <div className="order-page-header">
        <div>
          <h2 className="page-title">Orders</h2>
          <div className="order-header-meta">
            <span className="order-header-date">{formattedDate}</span>
          </div>
        </div>
        <div className="order-header-actions">
          <div className="order-header-controls">
            <Input
              variant="list"
              options={['Delivered', 'Confirmed', 'Returned', 'Canceled', 'Pending', 'Sent']}
              value={selectedStatus}
              onChange={(value) => setSelectedStatus(value as Order['status'])}
            />
            <CustomButton
              text="Save"
              onClick={handleSave}
              loading={orderLoading}
              disabled={orderLoading}
            />
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="order-details-root">
        <aside className="order-details-left">
          <div className="shipment-timeline">
            <h3>Order Notes</h3>
            <div className="p-4 bg-neutral-50 rounded-lg text-sm text-neutral-600 min-h-[100px]">
              {order.order_notes || "No notes for this order."}
            </div>
          </div>
        </aside>

        <main className="order-details-right">
          <section className="order-card order-overview">
            <div className="order-card-header">
              <div>
                <h4 className="order-id">Order - {order.order_number || order.id}</h4>
                <div className="order-meta text-xs text-neutral-400">{formattedDate}</div>
              </div>
              <div className="order-status">
                <StatusBadge state={order.status?.toLowerCase() as any} />
              </div>
            </div>

            <div className="order-card-body two-columns">
              <div>
                <h5>Customer details</h5>
                <div className="detail-row"><span>First Name</span><span>{order.customer_first_name}</span></div>
                <div className="detail-row"><span>Last Name</span><span>{order.customer_last_name}</span></div>
                <div className="detail-row"><span>Phone number</span><span>{order.customer_phone}</span></div>
                <div className="detail-row"><span>Email</span><span>{order.customer_email}</span></div>
              </div>

              <div>
                <h5>Shipping details</h5>
                <div className="detail-row"><span>Wilaya</span><span className="font-semibold text-rose-500">{order.wilaya}</span></div>
                <div className="detail-row"><span>City</span><span>{order.city}</span></div>
                <div className="detail-row"><span>Address</span><span>{order.address}</span></div>
                <div className="detail-row"><span>Shipping Method</span><span>{order.shipping_method}</span></div>
              </div>
            </div>
          </section>

          <section className="order-card items-card">
            <div className="items-header">
              <h5>Items details ({order.items?.length || 0} items)</h5>
            </div>
            <div className="items-list">
              {(order.items || []).map((item, i) => (
                <div className="item-row flex items-center gap-4 py-4 border-b border-neutral-100 last:border-0" key={i}>
                  <div className="h-20 w-16 bg-neutral-100 rounded overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-400">No Image</div>
                    )}
                  </div>
                  <div className="item-left flex-grow">
                    <div className="item-name font-medium text-neutral-900">{item.name}</div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-neutral-500">
                      <div className="flex items-center gap-1.5">
                        <span>Color:</span>
                        <div className="flex items-center gap-1">
                          {/* We don't have hex here, but we can show the name */}
                          <div className="w-3 h-3 rounded-full border border-neutral-200 bg-neutral-200" />
                          <span>{item.color}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span>Size:</span>
                        <span className="font-medium text-neutral-700">{item.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="item-right text-right">
                    <div className="item-price font-semibold text-neutral-900">{(item.price || 0).toFixed(2)} DA</div>
                    <div className="item-qty text-sm text-neutral-500">{item.quantity} pcs</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="order-card payment-card-summary">
            <h5>Payment Details</h5>
            <div className="detail-row"><span>Total amount</span><span>{(order.subtotal || 0).toFixed(2)} DA</span></div>
            <div className="detail-row"><span>Shipping fee</span><span>{(order.shipping_fee || 0).toFixed(2)} DA</span></div>
            <div className="detail-row text-neutral-400"><span>Tax</span><span>0.00 DA</span></div>
            <div className="detail-row text-neutral-400"><span>Discount</span><span>0.00 DA</span></div>
            <div className="detail-row grand-total !pt-4 !mt-4 border-t border-neutral-100">
              <span className="text-lg font-bold">Grand Total</span>
              <span className="text-xl font-bold text-rose-500">{(order.total || 0).toFixed(2)} DA</span>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
