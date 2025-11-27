"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Order } from '@/lib/types/orders';
import { StatusBadge } from '@/components/ui/status-badge';
import { CustomButton } from '@/components/ui/custom-button';
import { useOrder } from '@/hooks/useOrders';
import { Download } from 'lucide-react';
import '@/styles/order-details.css';

interface OrderFormProps {
  order: Order;
}

export default function OrderForm({ order }: OrderFormProps) {
  const router = useRouter();
  const { updateStatus, isLoading: orderLoading } = useOrder(order.id);
  const [selectedStatus, setSelectedStatus] = useState<Order['status']>(order.status);

  const handleSave = async () => {
    if (!order.id) return;
    const res = await updateStatus(order.id, selectedStatus);
    if (res && (res as any).success) {
      alert('Order status saved');
      try { router.refresh(); } catch (e) { }
    } else {
      alert('Failed to save order status');
    }
  };

  return (
    <div className="page-container product-form-container">
      {/* Breadcrumb */}
      <div className="order-form-breadcrumb">
        <Link href="/admin" className="text-gray-600 hover:underline">Dashboard</Link>
        <span className="order-form-breadcrumb-separator">/</span>
        <Link href="/admin/orders" className="text-gray-600 ">Orders</Link>
        <span className="order-form-breadcrumb-separator">/ </span>
        <span className="order-form-breadcrumb-active">{order.id}</span>
      </div>

      {/* Header with Order ID and Export */}
      <div className="order-page-header">
        <div>
          <h2 className="page-title">Orders</h2>
          <div className="order-header-meta">
            <span className="order-header-date">{order.datePurchased}</span>
          </div>
        </div>
        <div className="order-header-actions">
          <div className="order-header-id">
            <div className="order-header-id-label">Order ID -</div>
            <div className="order-header-id-value">#{order.id}</div>
          </div>
          <div className="order-header-controls">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as Order['status'])}
              className="order-status-select"
            >
              <option>Delivered</option>
              <option>Confirmed</option>
              <option>Returned</option>
              <option>Canceled</option>
              <option>Pending</option>
              <option>Sent</option>
            </select>
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
          {order.paymentProofImage && (
            <div className="payment-card">
              <img src={order.paymentProofImage} alt="payment proof" className="payment-image" />
            </div>
          )}

          <div className="shipment-timeline">
            <h3>Shipment timeline</h3>
            <ul>
              {order.shipmentTimeline.map((t, i) => (
                <li key={i} className="timeline-entry">
                  <div className="timeline-dot" />
                  <div className="timeline-body">
                    <div className="timeline-title">{t.title}</div>
                    <div className="timeline-date">{t.date}</div>
                    {t.location && <div className="timeline-location">{t.location}</div>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="order-details-right">
          <section className="order-card order-overview">
            <div className="order-card-header">
              <div>
                <h4 className="order-id">Order ID - #{order.id}</h4>
                <div className="order-meta">{order.datePurchased}</div>
              </div>
              <div className="order-status">
                <StatusBadge state={order.status.toLowerCase() as any} />
              </div>
            </div>

            <div className="order-card-body two-columns">
              <div>
                <h5>Order details</h5>
                <div className="detail-row"><span>Customer name</span><span>{order.customerName}</span></div>
                <div className="detail-row"><span>Customer Phone number</span><span>{order.customerPhone}</span></div>
                <div className="detail-row"><span>Customer Email</span><span>{order.customerEmail}</span></div>
                <div className="detail-row"><span>Shipping address</span><span>{order.address}</span></div>
              </div>

              <div>
                <div className="detail-row"><span>Shipping status</span><span>{order.shippingStatus || order.status}</span></div>
                <div className="detail-row"><span>Date purchased</span><span>{order.datePurchased}</span></div>
                <div className="detail-row"><span>Date delivered</span><span>{order.dateDelivered || '-'}</span></div>
                <div className="detail-row"><span>Estimated delivery period</span><span>{order.estimatedDelivery || '-'}</span></div>
                <div className="detail-row"><span>Number of Products</span><span>{String(order.numberOfProducts).padStart(2, '0')}</span></div>
                <div className="detail-row"><span>Total Amount</span><span>{order.grandTotal.toFixed(2)} DZD</span></div>
                <div className="detail-row"><span>Delivery company</span><span>{order.deliveryCompany}</span></div>
              </div>
            </div>
          </section>

          <section className="order-card items-card">
            <div className="items-header">
              <h5>Items details ({order.numberOfProducts} items)</h5>
            </div>
            <div className="items-list">
              {order.products.map((p, i) => (
                <div className="item-row" key={i}>
                  <div className="item-left">
                    <div className="item-name">{p.product.name}</div>
                    <div className="item-id">{p.product.id}</div>
                  </div>
                  <div className="item-right">
                    <div className="item-price">{p.price.toFixed(2)} DZD</div>
                    <div className="item-qty">{p.quantity} pcs</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="order-card payment-card-summary">
            <h5>Payment Details</h5>
            <div className="detail-row"><span>Total amount</span><span>{order.totalAmount.toFixed(2)} DZD</span></div>
            <div className="detail-row"><span>Shipping fee</span><span>{order.shippingFee.toFixed(2)} DZD</span></div>
            <div className="detail-row"><span>Tax</span><span>{order.tax.toFixed(2)} DZD</span></div>
            <div className="detail-row"><span>Discount</span><span>{(order.discount || 0).toFixed(2)} DZD</span></div>
            <div className="detail-row grand-total"><span>Grand Total</span><span>{order.grandTotal.toFixed(2)} DZD</span></div>
          </section>
        </main>
      </div>
    </div>
  );
}
