import * as React from "react";
import { Trash2 } from "lucide-react";
import Image from "next/image";

interface CartItemData {
  id: string | number;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  size: string;
  color: string;
  quantity: number;
}

interface CartItemProps {
  item: CartItemData;
  removeItem: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
}

export default function CartItem({ item, removeItem, updateQuantity }: CartItemProps) {
  return (
    <div className="bg-white p-4 sm:p-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 border-b border-neutral-200 last:border-b-0">
      {/* Product Image */}
      <div className="flex w-full sm:w-auto">
        <div className="w-32 h-40 bg-neutral-100 flex items-center justify-center overflow-hidden flex-shrink-0 rounded-md">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              width={128}
              height={160}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-neutral-400 text-xs">Product img</span>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-neutral-900">
              {item.name}
            </h3>
            <div className="mt-1 space-y-1">
              <p className="text-sm text-neutral-600">
                Size: <span className="font-medium text-neutral-900">{item.size}</span>
              </p>
              <p className="text-sm text-neutral-600">
                Color: <span className="font-medium text-neutral-900">{item.color}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => removeItem(item.id)}
            className="text-rose-400 hover:text-rose-500 transition-colors"
            aria-label="Remove item"
          >
            <Trash2 size={20} />
          </button>
        </div>

        {/* Price and Quantity */}
        <div className="flex items-center justify-between mt-4 gap-4">
          <span className="text-xl font-bold text-neutral-900">
            {item.price.toFixed(2)} DZD
          </span>
          <div className="flex items-center border border-neutral-300 rounded-md">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="px-3 py-2 hover:bg-neutral-50 text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="px-4 py-2 text-center min-w-[3rem] font-medium">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              disabled={item.quantity >= 10}
              className="px-3 py-2 hover:bg-neutral-50 text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
