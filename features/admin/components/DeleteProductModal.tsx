'use client';

import { useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import '@/styles/delete-modal.css';

interface DeleteProductModalProps {
  isOpen: boolean;
  productId: string;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function DeleteProductModal({
  isOpen,
  productId,
  onClose,
  onConfirm,
  isLoading = false,
}: DeleteProductModalProps) {
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
            Delete {productId}
          </h2>

          {/* Message */}
          <p className="delete-modal-message">
            Are you sure you wanna delete this product ?
          </p>

          {/* Actions */}
          <div className="delete-modal-actions">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="delete-modal-button-return"
            >
              Return
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="delete-modal-button-delete"
            >
              <Trash2 className="w-4 h-4" />
              {isLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

