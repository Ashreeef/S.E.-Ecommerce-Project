'use client';

import { useEffect, useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';
import '@/styles/delete-modal.css';
import useDeleteProduct from '@/hooks/useDeleteProduct';
import useDeleteOrder from '@/hooks/useDeleteOrder';
import { useRouter } from 'next/navigation';

type ResourceType = 'product' | 'order';

interface DeleteProductModalProps {
  isOpen: boolean;
  resourceId: string;
  resourceType?: ResourceType;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function DeleteProductModal({
  isOpen,
  resourceId,
  resourceType = 'product',
  onClose,
  onSuccess,
}: DeleteProductModalProps) {
  const router = useRouter();
  const [localLoading, setLocalLoading] = useState(false);
  const { isLoading: delProdLoading, deleteProduct } = useDeleteProduct();
  const { isLoading: delOrderLoading, deleteOrder } = useDeleteOrder();

  const isDeleting = localLoading || delProdLoading || delOrderLoading;

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  async function handleConfirm() {
    setLocalLoading(true);
    try {
      let ok = false;
      if (resourceType === 'product') {
        ok = await deleteProduct(resourceId);
      } else {
        ok = await deleteOrder(resourceId);
      }

      if (ok) {
        // refresh server-side data if any
        try {
          router.refresh();
        } catch (e) {
          // ignore
        }
        onSuccess?.();
        onClose();
      } else {
        alert('Failed to delete the item');
      }
    } catch (err) {
      console.error('Delete error', err);
      alert('An error occurred while deleting');
    } finally {
      setLocalLoading(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="delete-modal-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="delete-modal-container" role="dialog" aria-modal="true" aria-labelledby="delete-modal-title">
        <div className="delete-modal-content">
          {/* Close button */}
          <button
            onClick={onClose}
            className="delete-modal-close"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon */}
          <div className="delete-modal-icon">
            <Trash2 className="w-16 h-16" />
          </div>

          {/* Title */}
          <h2 id="delete-modal-title" className="delete-modal-title">
            Delete {resourceType} {resourceId}
          </h2>

          {/* Message */}
          <p className="delete-modal-message">
            Are you sure you want to delete this {resourceType}?
          </p>

          {/* Actions */}
          <div className="delete-modal-actions">
            <CustomButton
              variant="outlined"
              text="Return"
              onClick={onClose}
              disabled={isDeleting}
              className="delete-modal-button-return"
            />
            <CustomButton
              text={isDeleting ? 'Deleting...' : 'Delete'}
              leftIcon={<Trash2 className="w-4 h-4" />}
              onClick={handleConfirm}
              disabled={isDeleting}
              loading={isDeleting}
              className="delete-modal-button-delete"
            />
          </div>
        </div>
      </div>
    </>
  );
}

