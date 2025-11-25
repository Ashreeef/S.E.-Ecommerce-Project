import * as React from "react";
import { Trash2 } from "lucide-react";
export default function CartItem({ item, removeItem, updateQuantity }: any) {
  return (
    <div className="bg-white  p-4 sm:p-6 flex  flex-col sm:flex-row  space-y-4 sm:space-y-0 sm:space-x-4 border-b border-gray-200 last:border-b-0">
      <div className="flex w-full sm:w-auto space-x-4">
        <div className="w-32 h-40 sm:w-32 sm:h-40 bg-gray-200  flex items-center justify-center overflow-hidden flex-shrink-0 ">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400 text-xs">Product img</span>
          )}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between ">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 ">
              {item.name}
            </h3>
            <div className="mt-1">
              <span className="text-s sm:text-xs text-gray-600">
                Size :{" "}
                <span className="font-medium text-gray-500">{item.size}</span>
              </span>
            </div>
            <div className="mt-1">
              <span className="text-s sm:text-xs text-gray-600">
                Color :{" "}
                <span className="font-medium text-gray-500">{item.color}</span>
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              removeItem(item.id);
            }}
            className="cursor-pointer text-[#FFC5C8] hover:scale-110"
          >
            <Trash2 size={25} />
          </button>
        </div>
        <div className="flex items-center justify-between mt-4 gap-4">
          <div className="mt-6  items-stretch justify-between">
            <span className="text-xl font-bold text-gray-900">
              {item.price} DZD
            </span>
          </div>
          <div className=" mt-4 items-center border border-gray-300 ">
            <button
              onClick={() => {
                updateQuantity(item.id, item.quantity - 1);
              }}
              disabled={item.quantity <= 1}
              className="px-3 py-2 hover:bg-gray-100 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              -
            </button>
            <span className="px-4 py-2 text-center">{item.quantity}</span>
            <button
              onClick={() => {
                updateQuantity(item.id, item.quantity + 1);
              }}
              disabled={item.quantity >= 10}
              className="px-3 py-2 hover:bg-gray-100 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
