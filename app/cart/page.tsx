"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import CartItem from "@/components/ui/cartItem";

import { ArrowLeft, ArrowRight, Ticket } from "lucide-react";

function cartPage() {
  const [cartItems, setCartItems] = React.useState([
    {
      id: 1,
      name: "Denim baggy jeans",
      size: "XL",
      color: "Navy blue",
      price: 3500.0,
      originalPrice: 4500.0,
      quantity: 1,
      image: "",
    },
    {
      id: 2,
      name: "Denim baggy jeans",
      size: "XL",
      color: "Navy blue",
      price: 3500.0,
      originalPrice: 4500.0,
      quantity: 1,
      image: "",
    },
    {
      id: 5,
      name: "Denim baggy jeans",
      size: "XL",
      color: "Navy blue",
      price: 3500.0,
      originalPrice: 4500.0,
      quantity: 2,
      image: "",
    },
  ]);

  const total = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const [couponCode, setCouponCode] = React.useState("");
  //const ShippingFee = 500;
  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <div>
          <button className="flex items-center space-x-2 border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-50">
            <ArrowLeft size={18} />
            <span className="sm:text-sm">Continue Shopping</span>   //!!!
          </button>
        </div>
      </div>
      {/*products list*/}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-2 p-4 border border-gray-200 rounded-lg">
          {cartItems.length === 0 && " No items in the cart yet. "}
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              removeItem={removeItem}
              updateQuantity={updateQuantity}
            />
          ))}
        </div>
        {/*cart summary*/}
        <div className="lg:col-span-2">
          <div className="border border-gray-200 rounded-lg p-6 sticky top-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
              <span className="text-xl text-gray-900">
                {cartItems.length} item(s)
              </span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-500">Total amount : </span>
              <span className="text-[#FFC5C8] text-2xl">{total} DZD</span>
            </div>
            {/* <div className="mb-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Shipping fee:</span>
                <span className="text-gray-600"> -</span>
              </div>
              <div className="mt-2 text-s text-gray-500">
                <span>Enter your address to view shipping options </span>
                <button className="text-[#FFC5C8] hover:underline hover:cursor-pointer ml-1">
                  Calculate shipping
                </button>
              </div>
            </div>
            <hr className="my-4 border-gray-200" />
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-500">Grand Total : </span>
              <span className="text-[#FFC5C8] text-2xl">
                {total + ShippingFee} DZD
              </span>
            </div>*/}
            <hr className="my-4 border-gray-200 w-full" />
            <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
            <div className="my-5 flex items-center justify-between gap-2">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Coupons"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full border border-gray-200 rounded-full px-4 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-gray-300"
                />
                <span className="absolute inset-y-0 right-4 flex items-center text-gray-400">
                  <Ticket size={18} />
                </span>
              </div>
              <Button className="rounded-full px-6 py-2 hover:cursor-pointer">
                Apply   //!!!
              </Button>
            </div>
          </div>
          <button className="w-full my-6 bg-black text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 hover:cursor-pointer">
            <span>Proceed to checkout</span> //!!!
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default cartPage;
