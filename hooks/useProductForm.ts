"use client";

import { useState, useCallback } from 'react';
import { Product } from '@/lib/types/product';

// Form data interface that extends Product with form-specific fields
export interface ProductFormData extends Omit<Product, 'images' | 'availableSizes' | 'availableColors' | 'id' | 'rating' | 'sales' | 'date' | 'status'> {
  images: File[];
  imageUrls: string[];
  availableSizes: string; // comma-separated for form
}

export interface UseProductFormReturn {
  formData: ProductFormData;
  updateField: <K extends keyof ProductFormData>(field: K, value: ProductFormData[K]) => void;
  updateImages: (files: File[]) => void;
  removeImage: (index: number) => void;
  submitForm: (isDraft?: boolean, isEdit?: boolean, productId?: string) => Promise<{ success: boolean; error?: string }>;
  resetForm: () => void;
  initializeForm: (data: Partial<ProductFormData>) => void;
  isLoading: boolean;
  errors: Partial<Record<keyof ProductFormData, string>>;
}

const initialFormData: ProductFormData = {
  name: '',
  price: 0,
  originalPrice: undefined,
  image: '',
  images: [],
  imageUrls: [],
  category: '',
  availableSizes: '',
  description: '',
  isAvailable: true,
  color: '',
  gender: 'UNISEX',
  stock: 0,
  discount: 0,
  discountType: '',
  fit: '',
  modelDetails: '',
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
      images: prev.images.filter((_: File, i: number) => i !== index),
      imageUrls: prev.imageUrls.filter((_: string, i: number) => i !== index),
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
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    if (formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }
    if ((formData.discount || 0) < 0 || (formData.discount || 0) > 100) {
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
      
      // Map form data to API structure
      submitData.append('name', formData.name);
      submitData.append('description', formData.description || '');
      submitData.append('category', formData.category);
      submitData.append('price', formData.price.toString());
      submitData.append('stock', formData.stock.toString());
      submitData.append('discount', (formData.discount || 0).toString());
      submitData.append('discountType', formData.discountType || 'percentage');
      submitData.append('color', formData.color || '');
      submitData.append('gender', formData.gender);
      submitData.append('fit', formData.fit || '');
      submitData.append('modelDetails', formData.modelDetails || '');
      
      // Only append originalPrice if it has a value
      if (formData.originalPrice && formData.originalPrice > 0) {
        submitData.append('originalPrice', formData.originalPrice.toString());
      }
      
      submitData.append('image', formData.image || '');
      
      // Map availableSizes to API format
      submitData.append('availableSizes', formData.availableSizes);
      
      // Map isAvailable boolean
      submitData.append('isAvailable', formData.isAvailable.toString());
      
      // Add rating and review count (defaults)
      submitData.append('rating', '0');
      submitData.append('reviewCount', '0');

      // Handle images - use imageUrls for now
      if (formData.imageUrls && formData.imageUrls.length > 0) {
        submitData.append('existingImageUrls', JSON.stringify(formData.imageUrls));
      } else if (formData.image) {
        // Fallback to single image
        submitData.append('existingImageUrls', JSON.stringify([formData.image]));
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
      return { success: false, error: error instanceof Error ? error.message : 'An error occurred' };
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm]);

  const initializeForm = useCallback((data: Partial<ProductFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
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