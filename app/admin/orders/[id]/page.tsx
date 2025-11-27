"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import OrderForm from '@/features/admin/components/OrderForm';
import { CustomButton } from '@/components/ui/custom-button';
import { Order, OrderStatus } from '@/lib/types/orders';
import { useOrder } from '@/hooks/useOrders';
import '@/styles/order-details.css';
export default function OrderDetailsPage() {
	const params = useParams();
	const orderId = params?.id as string | undefined;
	const { order, isLoading, updateStatus } = useOrder(orderId);
	const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>('');
	const STATUS_OPTIONS: OrderStatus[] = [
		'Delivered',
		'Confirmed',
		'Returned',
		'Canceled',
		'Pending',
		'Sent',
	];

	useEffect(() => {
		if (order) setSelectedStatus(order.status);
	}, [order]);

	if (isLoading) return <div>Loading...</div>;
	if (!order) return <div>Order not found</div>;

	const onSave = async () => {
		if (!order || !selectedStatus) return;
		await updateStatus(order.id, selectedStatus);
	};

	return (
		<div className="page-container">

			<OrderForm order={order} />
		</div>
	);
}
