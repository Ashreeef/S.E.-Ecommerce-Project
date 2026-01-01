'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CustomButton } from '@/components/ui/custom-button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/status-badge';
import DeleteProductModal from '@/features/admin/components/DeleteProductModal';
import { Plus, ArrowUpDown, Filter, Download, Pencil, Trash2, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import '@/styles/admin-dashboard.css';
import '@/styles/products-list.css';
import { useProducts, useDeleteProduct, Product as ApiProduct } from '@/hooks/useProductsApi';

export default function ProductsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const productsPerPage = 10;
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  // Fetch products from API
  const { data, isLoading, isError } = useProducts();
  const products = data?.data || [];
  
  const totalPages = Math.ceil(products.length / productsPerPage);

  const toggleRow = (id: string) => {
    setExpandedRows(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products.map((p: ApiProduct) => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  const handleEdit = (productId: string) => {
    router.push(`/admin/products/${productId}/edit`);
  };

  const handleDelete = (productId: string) => {
    setProductToDelete(productId);
    setDeleteModalOpen(true);
  };


  const handleCloseModal = () => {
    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const filteredProducts = products.filter((product: ApiProduct) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div className="page-container products-list-container">
      {/* Breadcrumb */}
      <div className="products-breadcrumb">
        <span>Dashboard</span>
        <span className="products-breadcrumb-separator">/</span>
        <span>Products</span>
      </div>

      {/* Page Header */}
      <div className="page-header">
        <h2 className="page-title">Products</h2>
      </div>

      {/* Loading & Error States */}
      {isLoading && (
        <div className="text-center py-8">
          <p>Loading products...</p>
        </div>
      )}

      {isError && (
        <div className="text-center py-8 text-red-600">
          <p>Error loading products. Please try again.</p>
        </div>
      )}

      {!isLoading && !isError && (
        <>
      {/* Toolbar */}
      <div className="products-toolbar">
        <div className="products-toolbar-left">
          <Input
            placeholder="Search for a product"
            value={searchQuery}
            onChange={(value) => setSearchQuery(value)}
            className="products-search-input"
          />
        </div>
        <div className="products-toolbar-right">
          <CustomButton
            variant="outlined"
            text="Sort"
            leftIcon={<ArrowUpDown className="w-4 h-4" />}
            className="products-toolbar-button"
          />
          <CustomButton
            variant="outlined"
            text="Filter"
            leftIcon={<Filter className="w-4 h-4" />}
            className="products-toolbar-button"
          />
          <CustomButton
            variant="outlined"
            text="Export"
            leftIcon={<Download className="w-4 h-4" />}
            className="products-toolbar-button"
          />
          <Link href="/admin/products/new">
            <CustomButton
              text="New product"
              leftIcon={<Plus className="w-4 h-4" />}
              className="products-new-button"
            />
          </Link>
        </div>
      </div>

      {/* Mobile list (small screens) */}
      <div className="products-mobile-list sm:hidden">
        {paginatedProducts.length === 0 ? (
          <div className="products-table-empty">No products found</div>
        ) : (
          paginatedProducts.map((product: ApiProduct) => (
            <div key={product.id} className="mobile-product-card border rounded mb-3 p-3 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-xs text-neutral-400">{product.id}</div>
                </div>
                <button
                  onClick={() => toggleRow(product.id)}
                  aria-expanded={expandedRows.includes(product.id)}
                  className="mobile-expand-button"
                >
                  {expandedRows.includes(product.id) ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {expandedRows.includes(product.id) && (
                <div className="mobile-product-details mt-3 text-sm text-neutral-600">
                  <div className="grid grid-cols-2 gap-2">
                    <div><strong>Gender</strong>: {product.gender || 'N/A'}</div>
                    <div><strong>Category</strong>: {product.category}</div>
                    <div><strong>QTY</strong>: {product.stock}</div>
                    <div><strong>Price</strong>: {product.price.toFixed(2)} DZD</div>
                    <div><strong>Date</strong>: {new Date(product.created_at).toLocaleDateString()}</div>
                    <div className="col-span-2">
                      <StatusBadge state={product.is_available ? 'available' : 'out-of-stock'} />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => handleEdit(product.id)} className="products-action-button"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(product.id)} className="products-action-button products-action-button-delete"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Desktop table (small screens hidden) */}
      <div className="products-table-container hidden sm:block">
        <table className="products-table">
          <thead>
            <tr>
              <th className="products-table-checkbox">
                <input
                  type="checkbox"
                  checked={selectedProducts.length === paginatedProducts.length && paginatedProducts.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="products-checkbox"
                />
              </th>
              <th className="products-table-header">Product Name and ID</th>
              <th className="products-table-header">Gender</th>
              <th className="products-table-header">Category</th>
              <th className="products-table-header">QTY</th>
              <th className="products-table-header">Price</th>
              <th className="products-table-header">Date</th>
              <th className="products-table-header">Status</th>
              <th className="products-table-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan={9} className="products-table-empty">
                  No products found
                </td>
              </tr>
            ) : (
              paginatedProducts.map((product: ApiProduct) => (
                <tr key={product.id} className="products-table-row">
                  <td className="products-table-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                      className="products-checkbox"
                    />
                  </td>
                  <td className="products-table-cell">
                    <div className="products-name-cell">
                      <span className="products-name">{product.name}</span>
                      <span className="products-id">{product.id}</span>
                    </div>
                  </td>
                  <td className="products-table-cell">{product.gender || 'N/A'}</td>
                  <td className="products-table-cell">{product.category}</td>
                  <td className="products-table-cell">{product.stock}</td>
                  <td className="products-table-cell">{product.price.toFixed(2)} DZD</td>
                  <td className="products-table-cell">{new Date(product.created_at).toLocaleDateString()}</td>
                  <td className="products-table-cell">
                    <StatusBadge state={product.is_available ? 'available' : 'out-of-stock'} />
                  </td>
                  <td className="products-table-cell products-actions-cell">
                    <button
                      onClick={() => handleEdit(product.id)}
                      className="products-action-button"
                      aria-label="Edit product"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="products-action-button products-action-button-delete"
                      aria-label="Delete product"
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
      <div className="products-pagination">
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="products-pagination-button"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="products-pagination-numbers">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`products-pagination-number ${
                  currentPage === pageNum ? 'products-pagination-number-active' : ''
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          {totalPages > 5 && (
            <>
              <span className="products-pagination-ellipsis">.....</span>
              <button
                onClick={() => setCurrentPage(totalPages)}
                className={`products-pagination-number ${
                  currentPage === totalPages ? 'products-pagination-number-active' : ''
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
          className="products-pagination-button"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <DeleteProductModal
          isOpen={deleteModalOpen}
          resourceId={productToDelete}
          resourceType="product"
          onClose={handleCloseModal}
          onSuccess={() => {
            setDeleteModalOpen(false);
            setProductToDelete(null);
          }}
        />
      )}
      </>
      )}
    </div>
  );
}
