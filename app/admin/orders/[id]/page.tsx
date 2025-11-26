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
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
				<h2>Orders &nbsp; &gt; &nbsp; {order.id}</h2>
				<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
					<select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value as OrderStatus)}>
						{STATUS_OPTIONS.map(s => (
							<option key={s} value={s}>{s}</option>
						))}
					</select>
					<CustomButton text="Save" onClick={onSave} />
				</div>
			</div>

			<OrderForm order={order} />
		</div>
	);
}
