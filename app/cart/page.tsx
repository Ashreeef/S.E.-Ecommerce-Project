"use client";
import * as React from "react";

import CartItem from "@/components/ui/cartItem";
import {
  NavBar,
  Footer,
  CustomButton,
  Input,
  StatusBadge,
  NumberInput,
  ProductCard,
  NavigationButton,
  NavigationButtons,
} from "@/components/ui";
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
    if (newQuantity > 10) return;
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <NavBar
        onSearch={(query) => console.log("Search:", query)}
        onWishlist={() => console.log("Wishlist")}
        onCart={() => console.log("Cart")}
      />
      <div className="mt-7">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>

          <CustomButton
            variant="outlined"
            text="Continue Shopping"
            leftIcon={<ArrowLeft />}
            onClick={() => {}}
          />
        </div>
        {/*products list*/}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-2 p-4 border border-gray-200 rounded-lg">
            {cartItems.length === 0 && " No items in the cart yet. "}
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} removeItem={removeItem} />
            ))}
          </div>
          {/*cart summary*/}
          <div className="lg:col-span-2">
            <div className="border border-gray-200 rounded-lg p-6 ">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Order Summary
                </h2>
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
                <CustomButton
                  variant="filled"
                  text="Apply"
                  onClick={() => {}}
                />
              </div>
            </div>
            <CustomButton
              variant="filled"
              text="Proceed to chekout"
              className="w-full mt-4"
              rightIcon={<ArrowRight />}
              onClick={() => {}}
            />
          </div>
        </div>
      </div>
      <Footer className="mt-8" />
    </div>
  );
}

export default cartPage;
