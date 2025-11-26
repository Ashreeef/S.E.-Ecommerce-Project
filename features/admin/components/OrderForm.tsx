"use client";

import React from 'react';
import { Order } from '@/lib/types/orders';
import { StatusBadge } from '@/components/ui/status-badge';
import '@/styles/order-details.css';

interface OrderFormProps {
  order: Order;
}

export default function OrderForm({ order }: OrderFormProps) {
  return (
    <div className="order-details-root">
      <div className="order-details-left">
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
                <div className="timeline-title">{t.title}</div>
                <div className="timeline-date">{t.date}</div>
                {t.location && <div className="timeline-location">{t.location}</div>}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="order-details-right">
        <div className="order-card order-overview">
          <div className="order-card-header">
            <div>
              <h4>Order ID - {order.id}</h4>
              <div className="order-meta">{order.status} • {order.datePurchased}</div>
            </div>
            <div>
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
        </div>

        <div className="order-card items-card">
          <h5>Items details ({order.numberOfProducts} items)</h5>
          <div className="items-list">
            {order.products.map((p, i) => (
              <div className="item-row" key={i}>
                <div className="item-name">{p.product.name}<div className="item-id">{order.id}</div></div>
                <div className="item-price">{p.price.toFixed(2)} DZD</div>
                <div className="item-qty">{p.quantity} pieces</div>
              </div>
            ))}
          </div>
        </div>

        <div className="order-card payment-card-summary">
          <h5>Payment Details</h5>
          <div className="detail-row"><span>Total amount</span><span>{order.totalAmount.toFixed(2)} DZD</span></div>
          <div className="detail-row"><span>Shipping fee</span><span>{order.shippingFee.toFixed(2)} DZD</span></div>
          <div className="detail-row"><span>Tax</span><span>{order.tax.toFixed(2)} DZD</span></div>
          <div className="detail-row"><span>Discount</span><span>{(order.discount || 0).toFixed(2)} DZD</span></div>
          <div className="detail-row grand-total"><span>Grand Total</span><span>{order.grandTotal.toFixed(2)} DZD</span></div>
        </div>
      </div>
    </div>
  );
}
