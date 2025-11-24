'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/status-badge';
import DeleteProductModal from '@/features/admin/components/DeleteProductModal';
import { Plus, ArrowUpDown, Filter, Download, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import '@/styles/admin-dashboard.css';
import '@/styles/products-list.css';

// Mock product data - in production, this would come from an API
interface ProductRow {
  id: string;
  name: string;
  productId: string;
  gender: string;
  type: string;
  qty: number;
  sales: number;
  price: number;
  date: string;
  status: 'available' | 'out-of-stock';
}

const mockProducts: ProductRow[] = [
  {
    id: '1',
    name: 'Product Name',
    productId: '#CRE00221',
    gender: 'Women',
    type: 'T-shirt',
    qty: 200,
    sales: 234,
    price: 2300.00,
    date: '12-08-2025',
    status: 'out-of-stock',
  },
  {
    id: '2',
    name: 'Product Name',
    productId: '#CRE00222',
    gender: 'Men',
    type: 'Jeans',
    qty: 150,
    sales: 120,
    price: 3500.00,
    date: '11-08-2025',
    status: 'available',
  },
  {
    id: '3',
    name: 'Product Name',
    productId: '#CRE00223',
    gender: 'Unisex',
    type: 'Jacket',
    qty: 80,
    sales: 45,
    price: 5500.00,
    date: '10-08-2025',
    status: 'available',
  },
  {
    id: '4',
    name: 'Product Name',
    productId: '#CRE00224',
    gender: 'Women',
    type: 'Dress',
    qty: 0,
    sales: 0,
    price: 2800.00,
    date: '09-08-2025',
    status: 'out-of-stock',
  },
];

export default function ProductsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const productsPerPage = 10;
  const totalPages = Math.ceil(mockProducts.length / productsPerPage);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(mockProducts.map(p => p.id));
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

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    try {
      // TODO: Call API to delete product
      const response = await fetch(`/api/products/${productToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove product from list (in production, refetch from API)
        // For now, just close modal and show success
        setDeleteModalOpen(false);
        setProductToDelete(null);
        // You might want to refresh the products list here
        alert('Product deleted successfully');
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('An error occurred while deleting the product');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseModal = () => {
    if (!isDeleting) {
      setDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.productId.toLowerCase().includes(searchQuery.toLowerCase())
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
          <Button variant="outline" size="sm" className="products-toolbar-button">
            <ArrowUpDown className="w-4 h-4" />
            Sort
          </Button>
          <Button variant="outline" size="sm" className="products-toolbar-button">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="products-toolbar-button">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Link href="/admin/products/new">
            <Button className="products-new-button">
              <Plus className="w-4 h-4" />
              New product
            </Button>
          </Link>
        </div>
      </div>

      {/* Products Table */}
      <div className="products-table-container">
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
              <th className="products-table-header">Type</th>
              <th className="products-table-header">QTY</th>
              <th className="products-table-header">Sales</th>
              <th className="products-table-header">Price</th>
              <th className="products-table-header">Date</th>
              <th className="products-table-header">Status</th>
              <th className="products-table-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan={10} className="products-table-empty">
                  No products found
                </td>
              </tr>
            ) : (
              paginatedProducts.map((product) => (
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
                      <span className="products-id">{product.productId}</span>
                    </div>
                  </td>
                  <td className="products-table-cell">{product.gender}</td>
                  <td className="products-table-cell">{product.type}</td>
                  <td className="products-table-cell">{product.qty}</td>
                  <td className="products-table-cell">{product.sales}</td>
                  <td className="products-table-cell">{product.price.toFixed(2)} DZD</td>
                  <td className="products-table-cell">{product.date}</td>
                  <td className="products-table-cell">
                    <StatusBadge state={product.status} />
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
          productId={productToDelete}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}
