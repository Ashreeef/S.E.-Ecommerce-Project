'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CustomButton } from '@/components/ui/custom-button';
import { Input } from '@/components/ui/input';
import { ArrowUpDown, Filter, Download, Pencil, Trash2, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import '@/styles/admin-dashboard.css';
import '@/styles/customers-list.css';
import { customers, Customer } from '@/lib/types/customers';

// Use customers imported from `lib/types/customers.ts` as the mock list
const mockCustomers: Customer[] = customers;

export default function CustomersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10;
  const totalPages = Math.ceil(mockCustomers.length / customersPerPage);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const toggleRow = (id: string) => {
    setExpandedRows(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCustomers(mockCustomers.map(o => o.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (customerId: string, checked: boolean) => {
    if (checked) {
      setSelectedCustomers([...selectedCustomers, customerId]);
    } else {
      setSelectedCustomers(selectedCustomers.filter(id => id !== customerId));
    }
  };

  const handleEdit = (customerId: string) => {
    // Navigate to customer edit page
    router.push(`/admin/customers/${customerId}/edit`);
  };

  const handleDelete = (customerId: string) => {
    alert(`Delete customer ${customerId}`);
    // TODO: Implement delete logic
  };

  const filteredCustomers = mockCustomers.filter(customer =>
    customer.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * customersPerPage,
    currentPage * customersPerPage
  );

  return (
    <div className="page-container customers-list-container">
      {/* Breadcrumb */}
      <div className="customers-breadcrumb">
        <span>Dashboard</span>
        <span className="customers-breadcrumb-separator">/</span>
        <span>Customers</span>
      </div>

      {/* Page Header */}
      <div className="page-header">
        <h2 className="page-title">Customers</h2>
      </div>

      {/* Toolbar */}
      <div className="customers-toolbar">
        <div className="customers-toolbar-left">
          <Input
            placeholder="Search for a product" // Changed placeholder to match image
            value={searchQuery}
            onChange={(value) => setSearchQuery(value)}
            className="customers-search-input"
          />
        </div>
        <div className="customers-toolbar-right">
          <CustomButton
            variant="outlined"
            text="Sort"
            leftIcon={<ArrowUpDown className="w-4 h-4" />}
            className="customers-toolbar-button"
          />
          <CustomButton
            variant="outlined"
            text="Filter"
            leftIcon={<Filter className="w-4 h-4" />}
            className="customers-toolbar-button"
          />
          <CustomButton
            variant="outlined"
            text="Export"
            leftIcon={<Download className="w-4 h-4" />}
            className="customers-toolbar-button"
          />
          {/* New Customer button not in image, so removed */}
        </div>
      </div>

      {/* Mobile list (small screens) */}
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
                    <div><strong>Total Spent</strong>: {customer.totalSpent.toFixed(2)} DZD</div>
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

      {/* Desktop table (small screens hidden) */}
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
                <td colSpan={8} className="customers-table-empty">
                  No customers found
                </td>
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
                  <td className="customers-table-cell customers-total-spent">{customer.totalSpent.toFixed(2)} DZD</td>
                  <td className="customers-table-cell customers-actions-cell">
                    <button
                      onClick={() => handleEdit(customer.id)}
                      className="customers-action-button"
                      aria-label="Edit customer"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(customer.id)}
                      className="customers-action-button customers-action-button-delete"
                      aria-label="Delete customer"
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
      <div className="customers-pagination">
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="customers-pagination-button"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="customers-pagination-numbers">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`customers-pagination-number ${
                  currentPage === pageNum ? 'customers-pagination-number-active' : ''
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          {totalPages > 5 && (
            <>
              <span className="customers-pagination-ellipsis">.....</span>
              <button
                onClick={() => setCurrentPage(totalPages)}
                className={`customers-pagination-number ${
                  currentPage === totalPages ? 'customers-pagination-number-active' : ''
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
          className="customers-pagination-button"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

