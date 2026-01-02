'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import '@/styles/admin-dashboard.css';
import '@/styles/customers-list.css';
import { Customer } from '@/lib/types/customers';
import { useOrders } from '@/hooks/useOrders';

import { useToast } from '@/context/ToastContext';

export default function CustomersPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { orders, isLoading } = useOrders();
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10;
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  // Aggregate orders into customer profiles
  const aggregatedCustomers = useMemo(() => {
    const customerMap = new Map<string, Customer>();

    // Sort orders by date descending to get the most recent data first
    const sortedOrders = [...orders].sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    sortedOrders.forEach(order => {
      const key = order.customer_email || order.customer_phone;
      if (!key) return;

      const existing = customerMap.get(key);

      const orderRevenue = (order.items || []).reduce((sum, item) =>
        sum + (Number(item.price) * (item.quantity || 0)), 0
      );
      const orderItemsCount = (order.items || []).reduce((sum, item) =>
        sum + (item.quantity || 0), 0
      );

      if (existing) {
        existing.productsCount += orderItemsCount;
        existing.totalSpent += orderRevenue;
      } else {
        customerMap.set(key, {
          id: key,
          userName: `${order.customer_first_name} ${order.customer_last_name}`,
          email: order.customer_email || 'No email',
          phone: order.customer_phone,
          wilaya: order.wilaya,
          productsCount: orderItemsCount,
          totalSpent: orderRevenue
        });
      }
    });

    return Array.from(customerMap.values());
  }, [orders]);

  const toggleRow = (id: string) => {
    setExpandedRows(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleEdit = (customerId: string) => {
    router.push(`/admin/customers/${customerId}/edit`);
  };

  const handleDelete = (customerId: string) => {
    showToast(`Delete logic for customer ${customerId} not implemented yet`, 'info');
    // TODO: Implement delete logic
  };

  const handleSelectCustomer = (customerId: string, checked: boolean) => {
    if (checked) {
      setSelectedCustomers([...selectedCustomers, customerId]);
    } else {
      setSelectedCustomers(selectedCustomers.filter(id => id !== customerId));
    }
  };

  const filteredCustomers = aggregatedCustomers;

  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * customersPerPage,
    currentPage * customersPerPage
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCustomers(paginatedCustomers.map(o => o.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  return (
    <div className="page-container customers-list-container">
      <div className="customers-breadcrumb">
        <span>Dashboard</span>
        <span className="customers-breadcrumb-separator">/</span>
        <span>Customers</span>
      </div>

      <div className="page-header">
        <h2 className="page-title">Customers</h2>
      </div>


      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-neutral-500 animate-pulse text-lg">Loading customers...</div>
        </div>
      ) : (
        <>
          <div className="customers-mobile-list sm:hidden">
            {paginatedCustomers.length === 0 ? (
              <div className="customers-table-empty">No customers found</div>
            ) : (
              paginatedCustomers.map((customer) => (
                <div key={customer.id} className="mobile-customer-card border rounded mb-3 p-3 bg-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{customer.userName}</div>
                      <div className="text-xs text-neutral-400">{customer.email}</div>
                    </div>
                    <button
                      onClick={() => toggleRow(customer.id)}
                      aria-expanded={expandedRows.includes(customer.id)}
                      className="mobile-expand-button"
                    >
                      {expandedRows.includes(customer.id) ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>

                  {expandedRows.includes(customer.id) && (
                    <div className="mobile-customer-details mt-3 text-sm text-neutral-600">
                      <div className="grid grid-cols-2 gap-2">
                        <div><strong>Phone</strong>: {customer.phone}</div>
                        <div><strong>Wilaya</strong>: {customer.wilaya}</div>
                        <div><strong>Products</strong>: {customer.productsCount}</div>
                        <div><strong>Total Spent</strong>: {customer.totalSpent.toLocaleString()} DZD</div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => handleEdit(customer.id)} className="customers-action-button"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(customer.id)} className="customers-action-button customers-action-button-delete"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="customers-table-container hidden sm:block">
            <table className="customers-table">
              <thead>
                <tr>
                  <th className="customers-table-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.length === paginatedCustomers.length && paginatedCustomers.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="customers-checkbox"
                    />
                  </th>
                  <th className="customers-table-header">User name</th>
                  <th className="customers-table-header">Email address</th>
                  <th className="customers-table-header">Phone number</th>
                  <th className="customers-table-header">Wilaya</th>
                  <th className="customers-table-header">Products</th>
                  <th className="customers-table-header">Total spent</th>
                  <th className="customers-table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="customers-table-empty">No customers found</td>
                  </tr>
                ) : (
                  paginatedCustomers.map((customer) => (
                    <tr key={customer.id} className="customers-table-row">
                      <td className="customers-table-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedCustomers.includes(customer.id)}
                          onChange={(e) => handleSelectCustomer(customer.id, e.target.checked)}
                          className="customers-checkbox"
                        />
                      </td>
                      <td className="customers-table-cell">{customer.userName}</td>
                      <td className="customers-table-cell">{customer.email}</td>
                      <td className="customers-table-cell">{customer.phone}</td>
                      <td className="customers-table-cell">{customer.wilaya}</td>
                      <td className="customers-table-cell">{customer.productsCount}</td>
                      <td className="customers-table-cell customers-total-spent">{customer.totalSpent.toLocaleString()} DZD</td>
                      <td className="customers-table-cell customers-actions-cell">
                        <button onClick={() => handleEdit(customer.id)} className="customers-action-button" aria-label="Edit"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(customer.id)} className="customers-action-button customers-action-button-delete" aria-label="Delete"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="customers-pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="customers-pagination-button"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="customers-pagination-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(0, 5)
                .map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`customers-pagination-number ${currentPage === pageNum ? 'customers-pagination-number-active' : ''}`}
                  >
                    {pageNum}
                  </button>
                ))
              }
              {totalPages > 5 && <span className="customers-pagination-ellipsis">.....</span>}
              {totalPages > 5 && (
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`customers-pagination-number ${currentPage === totalPages ? 'customers-pagination-number-active' : ''}`}
                >
                  {totalPages}
                </button>
              )}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="customers-pagination-button"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
