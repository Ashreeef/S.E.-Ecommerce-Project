"use client";

import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import OrderForm from '@/features/admin/components/OrderForm';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAdminOrder } from '@/hooks/useAdminOrder';
import { Order } from '@/lib/types/orders';
import '@/styles/order-details.css';

type OrderStatus = 'Delivered' | 'Confirmed' | 'Returned' | 'Canceled' | 'Pending' | 'Sent';

interface ApiProduct {
	product_id: string;
	name: string;
	price: number;
	quantity: number;
}

export default function OrderDetailsPage() {
	const params = useParams();
	const orderId = params?.id as string | undefined;
	const { order: apiOrder, isLoading, error, updateStatus } = useAdminOrder(orderId);
	
	// Transform API data to match OrderForm expected structure
	const order = useMemo(() => {
		if (!apiOrder) return null;
		
		return {
			id: apiOrder.id,
			customerName: apiOrder.customer_name,
			customerPhone: apiOrder.customer_phone,
			customerEmail: apiOrder.customer_email,
			address: apiOrder.address,
			status: apiOrder.status as OrderStatus,
			datePurchased: new Date(apiOrder.created_at).toLocaleDateString('en-US', { 
				year: 'numeric', 
				month: 'short', 
				day: 'numeric' 
			}),
			dateDelivered: apiOrder.updated_at ? new Date(apiOrder.updated_at).toLocaleDateString('en-US', { 
				year: 'numeric', 
				month: 'short', 
				day: 'numeric' 
			}) : undefined,
			shippingStatus: apiOrder.shipping_status,
			estimatedDelivery: undefined,
			numberOfProducts: apiOrder.number_of_products,
			totalAmount: apiOrder.total_amount,
			shippingFee: apiOrder.shipping_fee,
			tax: apiOrder.tax,
			discount: 0,
			grandTotal: apiOrder.grand_total,
			deliveryCompany: apiOrder.delivery_company,
			paymentMethod: apiOrder.payment_method,
			products: apiOrder.products.map((p: ApiProduct) => ({
				product: {
					id: p.product_id,
					name: p.name,
				},
				price: p.price,
				quantity: p.quantity,
			})),
			shipmentTimeline: apiOrder.shipment_timeline || [],
			paymentProofImage: undefined,
		} as Order;
	}, [apiOrder]);

	if (isLoading) return <LoadingSpinner fullScreen text="Loading order..." />;
	if (error) return (
		<div className="page-container">
			<div className="text-center py-8">
				<p className="text-red-600 mb-4">{error}</p>
			</div>
		</div>
	);
	if (!order) return <div className="page-container"><div className="text-center py-8">Order not found</div></div>;

	return (
		<div className="page-container">
			<OrderForm order={order} onStatusUpdate={updateStatus} />
		</div>
	);
}
