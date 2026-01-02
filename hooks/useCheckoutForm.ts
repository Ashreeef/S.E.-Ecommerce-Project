"use client";

import { useState } from 'react';
import { FormData, ValidationResult } from '@/types/checkout';
import { ApiCartItem } from './useCart';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

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
    setOrderNumber(null);
  };

  const submitForm = async (cartItems: ApiCartItem[], total: number) => {
    const validation = validateForm();

    if (!validation.isValid) {
      setError(validation.error);
      return false;
    }

    if (cartItems.length === 0) {
      setError('السلة فارغة / Cart is empty');
      return false;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Get session ID from localStorage
      const sessionId = typeof window !== 'undefined'
        ? localStorage.getItem('cart_session_id') || ''
        : '';

      const response = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': sessionId
        },
        credentials: 'include',
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          email: formData.email,
          wilaya: formData.wilaya,
          city: formData.city,
          address: formData.address,
          shippingMethod: formData.shippingMethod,
          bureau: formData.bureau,
          orderNotes: formData.orderNotes
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setOrderNumber(data.orderNumber);
        alert(`تم تأكيد الطلب بنجاح! رقم الطلب: ${data.orderNumber} / Order confirmed! Order #: ${data.orderNumber}`);
        resetForm();
        return true;
      } else {
        setError(data.error || 'فشل في إنشاء الطلب / Failed to create order');
        return false;
      }
    } catch (err) {
      console.error('Order submission error:', err);
      setError('خطأ في الشبكة / Network error');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    updateField,
    error,
    setError,
    submitForm,
    isSubmitting,
    orderNumber,
    resetForm
  };
};
