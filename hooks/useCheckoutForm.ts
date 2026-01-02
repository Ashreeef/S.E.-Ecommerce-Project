import { useState } from 'react';
import { CartItem, FormData, ValidationResult } from '@/types/checkout';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(05|06|07)[0-9]{8}$/;

export const useCheckoutForm = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    wilaya: '',
    city: '',
    address: '',
    shippingMethod: '',
    bureau: '',
    orderNotes: '',
  });

  const [error, setError] = useState('');

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): ValidationResult => {
    const {
      firstName,
      lastName,
      phone,
      email,
      wilaya,
      city,
      address,
      shippingMethod,
    } = formData;

    // Check required fields
    if (
      !firstName ||
      !lastName ||
      !phone ||
      !email ||
      !wilaya ||
      !city ||
      !address ||
      !shippingMethod
    ) {
      return {
        isValid: false,
        error: 'الرجاء ملء جميع الحقول المطلوبة / Please fill all required fields',
      };
    }

    // Email validation
    if (!EMAIL_REGEX.test(email)) {
      return {
        isValid: false,
        error: 'البريد الإلكتروني غير صالح / Invalid email address',
      };
    }

    // Phone validation (Algerian format)
    if (!PHONE_REGEX.test(phone.replace(/\s/g, ''))) {
      return {
        isValid: false,
        error: 'رقم الهاتف غير صالح / Invalid phone number',
      };
    }

    return { isValid: true, error: '' };
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      wilaya: '',
      city: '',
      address: '',
      shippingMethod: '',
      bureau: '',
      orderNotes: '',
    });
    setError('');
  };

  const submitForm = async (cartItems: CartItem[], total: number) => {
    const validation = validateForm();

    if (!validation.isValid) {
      setError(validation.error);
      return { success: false, error: validation.error };
    }

    // Prepare order items
    const items = cartItems.map(item => ({
      product_id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      color: item.color,
      size: item.size,
      image: item.image,
    }));

    const orderData = {
      ...formData,
      items,
      total,
    };

    try {
      // Get auth token from Supabase
      const { supabase } = await import('@/lib/supabaseClient');
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || '';

      if (!token) {
        throw new Error('Please login to place an order');
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create order');
      }

      console.log('Order submitted:', result.data);
      resetForm();
      return { success: true, data: result.data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit order';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return {
    formData,
    updateField,
    error,
    setError,
    submitForm,
  };
};
