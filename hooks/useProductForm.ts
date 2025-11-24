"use client";

import { useState, useCallback } from 'react';
import { ProductFormData } from '@/lib/types/product';

export interface UseProductFormReturn {
  formData: ProductFormData;
  updateField: <K extends keyof ProductFormData>(field: K, value: ProductFormData[K]) => void;
  updateImages: (files: File[]) => void;
  removeImage: (index: number) => void;
  submitForm: (isDraft?: boolean, isEdit?: boolean, productId?: string) => Promise<{ success: boolean; error?: string }>;
  resetForm: () => void;
  initializeForm: (data: ProductFormData) => void;
  isLoading: boolean;
  errors: Partial<Record<keyof ProductFormData, string>>;
}

const initialFormData: ProductFormData = {
  name: '',
  description: '',
  modelDetails: '',
  status: 'Available',
  size: '',
  color: '',
  gender: 'UNISEX',
  category: '',
  fit: '',
  basePrice: 0,
  stock: 0,
  discount: 0,
  discountType: '',
  images: [],
  imageUrls: [],
};

export function useProductForm(): UseProductFormReturn {
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});

  const updateField = useCallback(<K extends keyof ProductFormData>(
    field: K,
    value: ProductFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const updateImages = useCallback((files: File[]) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files].slice(0, 5), // Max 5 images
    }));
  }, []);

  const removeImage = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (formData.basePrice <= 0) {
      newErrors.basePrice = 'Base price must be greater than 0';
    }
    if (formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }
    if (formData.discount < 0 || formData.discount > 100) {
      newErrors.discount = 'Discount must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const submitForm = useCallback(async (isDraft = false, isEdit = false, productId?: string): Promise<{ success: boolean; error?: string }> => {
    if (!isDraft && !validateForm()) {
      return { success: false, error: 'Please fix the form errors' };
    }

    setIsLoading(true);
    try {
      const submitData = new FormData();
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'images') {
          // Handle images separately
          submitData.append('imageCount', value.length.toString());
          (value as File[]).forEach((file, index) => {
            submitData.append(`image_${index}`, file);
          });
        } else if (key !== 'imageUrls') {
          submitData.append(key, String(value));
        }
      });

      // Add existing image URLs
      if (formData.imageUrls && formData.imageUrls.length > 0) {
        submitData.append('existingImageUrls', JSON.stringify(formData.imageUrls));
      }

      // Add draft status if saving as draft
      if (isDraft) {
        submitData.append('status', 'Draft');
      }

      const url = isEdit && productId 
        ? `/api/products/${productId}`
        : '/api/products';
      
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: submitData,
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error || `Failed to ${isEdit ? 'update' : 'save'} product` };
      }

      // Reset form on success (only for new products)
      if (!isDraft && !isEdit) {
        setFormData(initialFormData);
      }

      return { success: true };
    } catch (error) {
      console.error('Error submitting form:', error);
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm]);

  const initializeForm = useCallback((data: ProductFormData) => {
    setFormData(data);
    setErrors({});
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
  }, []);

  return {
    formData,
    updateField,
    updateImages,
    removeImage,
    submitForm,
    resetForm,
    initializeForm,
    isLoading,
    errors,
  };
}

