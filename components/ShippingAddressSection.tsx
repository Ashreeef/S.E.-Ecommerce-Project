import React from 'react';
import { Input } from '@/components/ui';

interface ShippingAddressSectionProps {
  wilaya: string;
  setWilaya: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  shippingMethod: string;
  setShippingMethod: (value: string) => void;
  bureau: string;
  setBureau: (value: string) => void;
}

const WILAYA_OPTIONS = ['Algiers', 'Oran', 'Constantine'];

const SHIPPING_OPTIONS = [
  'التوصيل إلى المنزل / Livraison à domicile',
  'التوصيل إلى مكتب ياليدين / Livraison au bureau Yalidine',
];

export const ShippingAddressSection: React.FC<ShippingAddressSectionProps> = ({
  wilaya,
  setWilaya,
  city,
  setCity,
  address,
  setAddress,
  shippingMethod,
  setShippingMethod,
  bureau,
  setBureau,
}) => {
  return (
    <div className="space-y-4 pt-6 border-t border-neutral-200">
      <h2 className="text-xl font-semibold text-neutral-900">Shipping Address</h2>

      <div className="space-y-4">
        <Input
          variant="list"
          required
          placeholder="الولاية / Wilaya"
          options={WILAYA_OPTIONS}
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
          options={SHIPPING_OPTIONS}
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
  );
};
