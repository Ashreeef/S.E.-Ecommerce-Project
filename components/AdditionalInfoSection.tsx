import React from 'react';

interface AdditionalInfoSectionProps {
  orderNotes: string;
  setOrderNotes: (value: string) => void;
}

export const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({
  orderNotes,
  setOrderNotes,
}) => {
  return (
    <div className="space-y-4 pt-6 border-t border-neutral-200">
      <h2 className="text-xl font-semibold text-neutral-900">Additional Info</h2>
      <textarea
        rows={4}
        value={orderNotes}
        onChange={(e) => setOrderNotes(e.target.value)}
        placeholder="ملاحظات الطلب (اختياري) / Order notes (optional)"
        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-neutral-400 resize-none transition-all duration-200"
      />
    </div>
  );
};
