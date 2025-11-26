"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { CustomButton } from '@/components/ui';
import { ContactInfoSection } from '@/components/ContactInfoSection';
import { ShippingAddressSection } from '@/components/ShippingAddressSection';
import { AdditionalInfoSection } from '@/components/AdditionalInfoSection';
import { OrderSummary } from '@/components/OrderSummary';
import { useCheckoutForm } from '@/hooks/useCheckoutForm';
import { useCart } from '@/hooks/useCart';

export default function CheckoutPage() {
  const router = useRouter();
  const { formData, updateField, error, submitForm } = useCheckoutForm();
  const {
    cartItems,
    removeItem,
    updateQuantity,
    subtotal,
    calculateShippingCost,
    calculateTotal,
  } = useCart();

  const shippingCost = calculateShippingCost(formData.shippingMethod);
  const total = calculateTotal(formData.shippingMethod);

  const handleSubmit = () => {
    submitForm(cartItems, total);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
          Confirm Payment
        </h1>
        <CustomButton
          variant="outlined"
          text="Back to Cart"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => router.push('/cart')}
        />
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
        {/* Form Section */}
        <section className="lg:col-span-3">
          <div className="flex flex-col gap-6 p-4 sm:p-6 border border-neutral-200 rounded-lg bg-white shadow-sm">
            <ContactInfoSection
              firstName={formData.firstName}
              setFirstName={(value) => updateField('firstName', value)}
              lastName={formData.lastName}
              setLastName={(value) => updateField('lastName', value)}
              phone={formData.phone}
              setPhone={(value) => updateField('phone', value)}
              email={formData.email}
              setEmail={(value) => updateField('email', value)}
            />

            <ShippingAddressSection
              wilaya={formData.wilaya}
              setWilaya={(value) => updateField('wilaya', value)}
              city={formData.city}
              setCity={(value) => updateField('city', value)}
              address={formData.address}
              setAddress={(value) => updateField('address', value)}
              shippingMethod={formData.shippingMethod}
              setShippingMethod={(value) => updateField('shippingMethod', value)}
              bureau={formData.bureau}
              setBureau={(value) => updateField('bureau', value)}
            />

            <AdditionalInfoSection
              orderNotes={formData.orderNotes}
              setOrderNotes={(value) => updateField('orderNotes', value)}
            />

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm font-medium text-center">
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <CustomButton
              variant="filled"
              text="Confirm Purchase"
              className="w-full py-3 text-base sm:text-lg font-semibold"
              onClick={handleSubmit}
            />
          </div>
        </section>

        {/* Order Summary */}
        <aside className="lg:col-span-2">
          <OrderSummary
            cartItems={cartItems}
            removeItem={removeItem}
            updateQuantity={updateQuantity}
            subtotal={subtotal}
            shippingCost={shippingCost}
            total={total}
          />
        </aside>
      </div>
    </div>
  );
}
