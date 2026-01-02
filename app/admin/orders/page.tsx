'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CustomButton } from '@/components/ui/custom-button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/status-badge';
import { ArrowUpDown, Filter, Download, Pencil, Trash2, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import '@/styles/admin-dashboard.css';
import '@/styles/orders-list.css';
import { Order } from '@/lib/types/orders';
import DeleteProductModal from '@/features/admin/components/DeleteProductModal';
import { useOrders } from '@/hooks/useOrders';

export default function OrdersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const ordersPerPage = 10;
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const { orders, isLoading, error, refresh } = useOrders();

  // Check login
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
    }
  }, [router]);

  const toggleRow = (id: string) => {
    setExpandedRows(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(orders.map(o => o.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    }
  };

  const handleEdit = (orderId: string) => {
    const safeId = encodeURIComponent(orderId);
    router.push(`/admin/orders/${safeId}`);
  };

  const handleDelete = (orderId: string) => {
    setProductToDelete(orderId);
    setDeleteModalOpen(true);
  };

  const filteredOrders = orders.filter(order => {
    const name = order.customerName || '';
    const id = order.id || '';
    const query = searchQuery.toLowerCase();
    return name.toLowerCase().includes(query) || id.toLowerCase().includes(query);
  });

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

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

  if (isLoading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-neutral-500 font-medium">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    const isAuthError = error.toLowerCase().includes('auth') || error.toLowerCase().includes('expired');
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-lg text-red-500 font-medium whitespace-pre-wrap max-w-md text-center">
          {error}
        </div>
        {isAuthError ? (
          <CustomButton
            variant="filled"
            text="Go to Login"
            onClick={() => router.push('/admin/login')}
          />
        ) : (
          <CustomButton
            variant="filled"
            text="Try Again"
            onClick={() => refresh()}
          />
        )}
      </div>
    );
  }

  return (
    <div className="page-container orders-list-container">
      {/* Breadcrumb */}
      <div className="orders-breadcrumb">
        <span>Dashboard</span>
        <span className="orders-breadcrumb-separator">/</span>
        <span>Orders</span>
      </div>

      {/* Page Header */}
      <div className="page-header">
        <h2 className="page-title">Orders ({filteredOrders.length})</h2>
      </div>

      {/* Toolbar */}
      <div className="orders-toolbar">
        <div className="orders-toolbar-left">
          <Input
            placeholder="Search for an order"
            value={searchQuery}
            onChange={(value) => setSearchQuery(value)}
            className="orders-search-input"
          />
        </div>
        <div className="orders-toolbar-right">
          <CustomButton
            variant="outlined"
            text="Sort"
            leftIcon={<ArrowUpDown className="w-4 h-4" />}
            className="orders-toolbar-button"
          />
          <CustomButton
            variant="outlined"
            text="Filter"
            leftIcon={<Filter className="w-4 h-4" />}
            className="orders-toolbar-button"
          />
          <CustomButton
            variant="outlined"
            text="Export"
            leftIcon={<Download className="w-4 h-4" />}
            className="orders-toolbar-button"
          />
        </div>
      </div>

      {/* Mobile list (small screens) */}
      <div className="orders-mobile-list sm:hidden">
        {paginatedOrders.length === 0 ? (
          <div className="orders-table-empty">No orders found</div>
        ) : (
          paginatedOrders.map((order) => (
            <div key={order.id} className="mobile-order-card border rounded mb-3 p-3 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{order.customerName}</div>
                  <div className="text-xs text-neutral-400">{order.id}</div>
                </div>
                <button
                  onClick={() => toggleRow(order.id)}
                  aria-expanded={expandedRows.includes(order.id)}
                  className="mobile-expand-button"
                >
                  {expandedRows.includes(order.id) ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {expandedRows.includes(order.id) && (
                <div className="mobile-order-details mt-3 text-sm text-neutral-600">
                  <div className="grid grid-cols-2 gap-2">
                    <div><strong>Date</strong>: {new Date(order.datePurchased).toLocaleDateString()}</div>
                    <div><strong>Total</strong>: {order.grandTotal.toFixed(2)} DZD</div>
                    <div><strong>Items</strong>: {order.numberOfProducts}</div>
                    <div><strong>Address</strong>: {order.address}</div>
                    <div className="col-span-2">
                      <StatusBadge state={mapStatusToBadge(order.status)} />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => handleEdit(order.id)} className="orders-action-button"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(order.id)} className="orders-action-button orders-action-button-delete"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Desktop table (small screens hidden) */}
      <div className="orders-table-container hidden sm:block">
        <table className="orders-table">
          <thead>
            <tr>
              <th className="orders-table-checkbox">
                <input
                  type="checkbox"
                  checked={selectedOrders.length === paginatedOrders.length && paginatedOrders.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="orders-checkbox"
                />
              </th>
              <th className="orders-table-header">Order ID</th>
              <th className="orders-table-header">User Name</th>
              <th className="orders-table-header">Date</th>
              <th className="orders-table-header">Total</th>
              <th className="orders-table-header">Items</th>
              <th className="orders-table-header">Address</th>
              <th className="orders-table-header">Status</th>
              <th className="orders-table-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.length === 0 ? (
              <tr>
                <td colSpan={9} className="orders-table-empty">
                  No orders found
                </td>
              </tr>
            ) : (
              paginatedOrders.map((order) => (
                <tr key={order.id} className="orders-table-row">
                  <td className="orders-table-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={(e) => handleSelectOrder(order.id, e.target.checked)}
                      className="orders-checkbox"
                    />
                  </td>
                  <td className="orders-table-cell">
                    <div className="orders-name-cell">
                      <span className="orders-id">{order.id}</span>
                    </div>
                  </td>
                  <td className="orders-table-cell">{order.customerName}</td>
                  <td className="orders-table-cell">{new Date(order.datePurchased).toLocaleDateString()}</td>
                  <td className="orders-table-cell">{(order.grandTotal || 0).toFixed(2)} DZD</td>
                  <td className="orders-table-cell">{order.numberOfProducts}</td>
                  <td className="orders-table-cell">{order.address}</td>
                  <td className="orders-table-cell">
                    <StatusBadge state={mapStatusToBadge(order.status)} />
                  </td>
                  <td className="orders-table-cell orders-actions-cell">
                    <button
                      onClick={() => handleEdit(order.id)}
                      className="orders-action-button"
                      aria-label="Edit order"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="orders-action-button orders-action-button-delete"
                      aria-label="Delete order"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="orders-pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="orders-pagination-button"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="orders-pagination-numbers">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`orders-pagination-number ${currentPage === pageNum ? 'orders-pagination-number-active' : ''
                    }`}
                >
                  {pageNum}
                </button>
              );
            })}
            {totalPages > 5 && (
              <>
                <span className="orders-pagination-ellipsis">.....</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`orders-pagination-number ${currentPage === totalPages ? 'orders-pagination-number-active' : ''
                    }`}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="orders-pagination-button"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <DeleteProductModal
          isOpen={deleteModalOpen}
          resourceId={productToDelete}
          resourceType="order"
          onClose={() => {
            setDeleteModalOpen(false);
            setProductToDelete(null);
          }}
          onSuccess={() => {
            setDeleteModalOpen(false);
            setProductToDelete(null);
            alert('Order deleted successfully (Not implemented in API yet)');
          }}
        />
      )}
    </div>
  );
}
