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

  const submitForm = (cartItems: CartItem[], total: number) => {
    const validation = validateForm();

    if (!validation.isValid) {
      setError(validation.error);
      return false;
    }

    const orderData = {
      ...formData,
      items: cartItems,
      total,
    };

    console.log('Order submitted:', orderData);
    alert('تم تأكيد الطلب بنجاح! / Order confirmed successfully!');

    resetForm();
    return true;
  };

  return {
    formData,
    updateField,
    error,
    setError,
    submitForm,
  };
};
