import React from 'react';
import { Input } from '@/components/ui';
import { DELIVERY_CITIES } from '@/lib/constants/delivery-cities';

interface ShippingAddressSectionProps {
  setWilaya: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  shippingMethod: string;
  setShippingMethod: (value: string) => void;
}

const SHIPPING_OPTIONS = [
  'التوصيل إلى المنزل / Livraison à domicile',
  'التوصيل إلى مكتب ياليدين / Livraison au bureau Yalidine',
];

export const ShippingAddressSection: React.FC<ShippingAddressSectionProps> = ({
  setWilaya,
  city,
  setCity,
  address,
  setAddress,
  shippingMethod,
  setShippingMethod,
}) => {
  return (
    <div className="space-y-4 pt-6 border-t border-neutral-200">
      <h2 className="text-xl font-semibold text-neutral-900">Shipping Address</h2>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            variant="list"
            required
            placeholder="الولاية / Wilaya"
            options={DELIVERY_CITIES.map(c => c.name)}
            value={city}
            onChange={(val) => {
              setCity(val);
              setWilaya(val);
              const cityData = DELIVERY_CITIES.find(c => c.name === val);
              // Auto reset shipping method if it was Yalidine but city doesn't support it
              if (cityData && cityData.desk_delivery === null && shippingMethod.toLowerCase().includes('yalidine')) {
                setShippingMethod(SHIPPING_OPTIONS[0]);
              }
            }}
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
          options={SHIPPING_OPTIONS.filter(opt => {
            const cityData = DELIVERY_CITIES.find(c => c.name === city);
            if (opt.toLowerCase().includes('yalidine') && cityData?.desk_delivery === null) {
              return false;
            }
            return true;
          })}
          value={shippingMethod}
          onChange={setShippingMethod}
          className="w-full"
        />
      </div>
    </div>
  );
};
