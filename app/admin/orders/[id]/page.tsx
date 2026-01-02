"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import OrderForm from '@/features/admin/components/OrderForm';
import { useOrder } from '@/hooks/useOrders';
import '@/styles/order-details.css';
export default function OrderDetailsPage() {
	const params = useParams();
	const orderId = params?.id as string | undefined;
	const { order, isLoading } = useOrder(orderId);

	if (isLoading) return <div>Loading...</div>;
	if (!order) return <div>Order not found</div>;


	return (
		<div className="page-container">

			<OrderForm order={order} />
		</div>
	);
}
