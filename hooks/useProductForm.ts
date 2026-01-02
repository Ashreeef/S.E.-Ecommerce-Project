"use client";

import { useState, useCallback } from 'react';
import { Product } from '@/lib/types/product';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Form data interface that extends Product with form-specific fields
export interface ProductFormData extends Omit<Product, 'images' | 'availableSizes' | 'id' | 'rating' | 'sales' | 'date' | 'status'> {
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
  availableColors: [],
  description: '',
  isAvailable: true,
  color: '',
  stock: 0,
  discount: 0,
  discountType: '',
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

    // Size validation: Either 'Standard' or a list, but not both
    const sizes = formData.availableSizes.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    if (sizes.length === 0) {
      newErrors.availableSizes = 'At least one size or "Standard" is required';
    } else if (sizes.includes('standard') && sizes.length > 1) {
      newErrors.availableSizes = '"Standard" cannot be mixed with other sizes';
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

  const uploadImage = async (file: File, token: string) => {
    const uploadData = new FormData();
    uploadData.append('image', file);

    const response = await fetch(`${API_BASE}/api/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: uploadData
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.url;
  };

  const submitForm = useCallback(async (isDraft = false, isEdit = false, productId?: string): Promise<{ success: boolean; error?: string }> => {
    if (!isDraft && !validateForm()) {
      return { success: false, error: 'Please fix the form errors' };
    }

    const token = localStorage.getItem('admin_token');
    if (!token) {
      return { success: false, error: 'No admin token found. Please login again.' };
    }

    setIsLoading(true);
    try {
      // 1. Upload new images if any
      const newImageUrls = [...formData.imageUrls];
      for (const file of formData.images) {
        if (file instanceof File) {
          const url = await uploadImage(file, token);
          newImageUrls.push(url);
        }
      }

      // 2. Prepare product data
      const productPayload = {
        name: formData.name,
        price: formData.price,
        originalPrice: formData.originalPrice,
        description: formData.description,
        category: formData.category,
        image: newImageUrls[0] || formData.image, // Main image
        images: newImageUrls.map((url, i) => ({ id: `img-${i}`, url, alt: formData.name })),
        stock: formData.stock,
        color: formData.color,
        availableColors: formData.availableColors,
        isAvailable: formData.isAvailable,
        status: formData.isAvailable ? 'Available' : 'Out-of-stock',
        modelDetails: formData.modelDetails,
        discount: formData.discount,
        discountType: formData.discountType,
        availableSizes: formData.availableSizes.split(',').map(s => s.trim()).filter(Boolean)
      };

      const url = isEdit && productId
        ? `${API_BASE}/api/products/${productId}`
        : `${API_BASE}/api/products`;

      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productPayload),
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
      return { success: false, error: 'Failed to submit' };
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