import React from 'react';
import { Input } from '@/components/ui';

interface ContactInfoSectionProps {
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
}

export const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  phone,
  setPhone,
  email,
  setEmail,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-neutral-900">Contact Info</h2>

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
  );
};
