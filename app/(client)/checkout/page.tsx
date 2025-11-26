"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { CustomButton, Input } from '@/components/ui';
import CartItem from '@/components/ui/cartItem';

export default function CheckoutPage() {
  const router = useRouter();

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [shippingMethod, setShippingMethod] = useState('');
  const [bureau, setBureau] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [error, setError] = useState('');

  // Cart items (in real app, this would come from context/state management)
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Denim baggy jeans',
      size: 'XL',
      color: 'Navy blue',
      price: 3500.0,
      originalPrice: 4500.0,
      quantity: 1,
      image: '',
    },
    {
      id: 2,
      name: 'Denim baggy jeans',
      size: 'XL',
      color: 'Navy blue',
      price: 3500.0,
      originalPrice: 4500.0,
      quantity: 1,
      image: '',
    },
    {
      id: 5,
      name: 'Denim baggy jeans',
      size: 'XL',
      color: 'Navy blue',
      price: 3500.0,
      originalPrice: 4500.0,
      quantity: 2,
      image: '',
    },
  ]);

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 10) return;
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingCost = shippingMethod.includes('domicile')
    ? 600
    : shippingMethod.includes('yalidine')
    ? 400
    : 0;
  const total = subtotal + shippingCost;

  const handleSubmit = () => {
    setError('');

    // Validation
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
      setError('الرجاء ملء جميع الحقول المطلوبة / Please fill all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('البريد الإلكتروني غير صالح / Invalid email address');
      return;
    }

    // Phone validation (Algerian format)
    const phoneRegex = /^(05|06|07)[0-9]{8}$/;
    if (!phoneRegex.test(phone.replace(/\\s/g, ''))) {
      setError('رقم الهاتف غير صالح / Invalid phone number');
      return;
    }

    const orderData = {
      firstName,
      lastName,
      phone,
      email,
      wilaya,
      city,
      address,
      shippingMethod,
      bureau,
      orderNotes,
      items: cartItems,
      total,
    };

    console.log('Order submitted:', orderData);
    alert('تم تأكيد الطلب بنجاح! / Order confirmed successfully!');

    // Clear form after successful submission
    setFirstName('');
    setLastName('');
    setPhone('');
    setEmail('');
    setWilaya('');
    setCity('');
    setAddress('');
    setShippingMethod('');
    setBureau('');
    setOrderNotes('');
    setError('');
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-neutral-900">Confirm Payment</h1>
        <CustomButton
          variant="outlined"
          text="Back to Cart"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => router.push('/cart')}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6 p-6 border border-neutral-200 rounded-lg bg-white shadow-sm">
          {/* Contact Info */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Contact Info
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                required
                placeholder="الاسم الأول / First Name"
                value={firstName}
                onChange={setFirstName}
                className="w-full"
              />
              <Input
                required
                placeholder="اللقب / Last Name"
                value={lastName}
                onChange={setLastName}
                className="w-full"
              />
            </div>

            <div className="space-y-4">
              <Input
                required
                placeholder="رقم الهاتف / Phone Number"
                value={phone}
                onChange={setPhone}
                type="tel"
                className="w-full"
              />
              <Input
                required
                placeholder="البريد الإلكتروني / Email Address"
                value={email}
                onChange={setEmail}
                type="email"
                className="w-full"
              />
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-4 pt-6 border-t border-neutral-200">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Shipping Address
            </h2>

            <div className="space-y-4">
              <Input
                variant="list"
                required
                placeholder="الولاية / Wilaya"
                options={['Algiers', 'Oran', 'Constantine']}
                value={wilaya}
                onChange={setWilaya}
                className="w-full"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  required
                  placeholder="المدينة / City"
                  value={city}
                  onChange={setCity}
                  className="w-full"
                />
                <Input
                  required
                  placeholder="العنوان / Address"
                  value={address}
                  onChange={setAddress}
                  className="w-full"
                />
              </div>

              <Input
                variant="list"
                required
                placeholder="طريقة الشحن / Shipping method"
                options={[
                  'التوصيل إلى المنزل / Livraison à domicile',
                  'التوصيل إلى مكتب ياليدين / Livraison au bureau Yalidine',
                ]}
                value={shippingMethod}
                onChange={setShippingMethod}
                className="w-full"
              />

              {shippingMethod.includes('yalidine') && (
                <Input
                  placeholder="رقم المكتب / Bureau Number"
                  value={bureau}
                  onChange={setBureau}
                  className="w-full"
                />
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-4 pt-6 border-t border-neutral-200">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Additional Info
            </h2>
            <textarea
              rows={4}
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              placeholder="ملاحظات الطلب (اختياري) / Order notes (optional)"
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-400 focus:border-neutral-400 resize-none transition-colors duration-200"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-medium text-center">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <CustomButton
            variant="filled"
            text="Confirm Purchase"
            className="w-full py-3 text-lg"
            onClick={handleSubmit}
          />
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1 space-y-6 p-6 border border-neutral-200 rounded-lg bg-white shadow-sm h-fit">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Order Summary
          </h2>

          {/* Cart Items */}
          <div className="space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-8 text-neutral-500">
                No items in cart
              </div>
            ) : (
              cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  removeItem={removeItem}
                  updateQuantity={updateQuantity}
                />
              ))
            )}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-3 pt-4 border-t border-neutral-200">
            <div className="flex justify-between">
              <span className="text-neutral-600">Subtotal</span>
              <span className="font-medium">{subtotal.toFixed(2)} DA</span>
            </div>

            <div className="flex justify-between">
              <span className="text-neutral-600">Shipping</span>
              <span className="font-medium">
                {shippingCost > 0 ? `${shippingCost.toFixed(2)} DA` : 'Free'}
              </span>
            </div>

            <div className="flex justify-between pt-3 border-t border-neutral-200">
              <span className="text-lg font-semibold text-neutral-900">Total</span>
              <span className="text-rose-400 text-2xl font-semibold">
                {total.toFixed(2)} DA
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
