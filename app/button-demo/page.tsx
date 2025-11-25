"use client";

import { CustomButton } from '@/components/ui';
import { ShoppingCart, Heart, ArrowRight, Download, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function ButtonDemoPage() {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-neutral-800">
            Custom Button Component
          </h1>
          <p className="text-neutral-600">
            Showcase of all button variants and states
          </p>
        </div>

        {/* Filled Variant */}
        <section className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
          <h2 className="text-2xl font-semibold text-neutral-800">
            Filled Variant
          </h2>
          <div className="flex flex-wrap gap-4">
            <CustomButton
              variant="filled"
              text="Default Button"
              onClick={() => console.log('Clicked')}
            />
            <CustomButton
              variant="filled"
              text="Add to Cart"
              leftIcon={<ShoppingCart />}
              onClick={() => console.log('Add to cart')}
            />
            <CustomButton
              variant="filled"
              text="Continue"
              rightIcon={<ArrowRight />}
              onClick={() => console.log('Continue')}
            />
            <CustomButton
              variant="filled"
              text="Download"
              leftIcon={<Download />}
              rightIcon={<ArrowRight />}
              onClick={() => console.log('Download')}
            />
            <CustomButton
              variant="filled"
              text="Loading..."
              loading={loading}
              onClick={handleClick}
            />
            <CustomButton
              variant="filled"
              text="Disabled"
              disabled={true}
            />
          </div>
        </section>

        {/* Outlined Variant */}
        <section className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
          <h2 className="text-2xl font-semibold text-neutral-800">
            Outlined Variant
          </h2>
          <div className="flex flex-wrap gap-4">
            <CustomButton
              variant="outlined"
              text="Cancel"
              onClick={() => console.log('Cancel')}
            />
            <CustomButton
              variant="outlined"
              text="Save Draft"
              leftIcon={<Heart />}
              onClick={() => console.log('Save')}
            />
            <CustomButton
              variant="outlined"
              text="Learn More"
              rightIcon={<ArrowRight />}
              onClick={() => console.log('Learn more')}
            />
            <CustomButton
              variant="outlined"
              text="Loading..."
              loading={loading}
              onClick={handleClick}
            />
            <CustomButton
              variant="outlined"
              text="Disabled"
              disabled={true}
            />
          </div>
        </section>

        {/* Link Variant */}
        <section className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
          <h2 className="text-2xl font-semibold text-neutral-800">
            Link Variant
          </h2>
          <div className="flex flex-wrap gap-4">
            <CustomButton
              variant="link"
              text="Delete"
              onClick={() => console.log('Delete')}
            />
            <CustomButton
              variant="link"
              text="Remove Item"
              leftIcon={<Trash2 />}
              onClick={() => console.log('Remove')}
            />
            <CustomButton
              variant="link"
              text="View Details"
              rightIcon={<ArrowRight />}
              onClick={() => console.log('View')}
            />
            <CustomButton
              variant="link"
              text="Loading..."
              loading={loading}
              onClick={handleClick}
            />
            <CustomButton
              variant="link"
              text="Disabled"
              disabled={true}
            />
          </div>
        </section>

        {/* Interactive Demo */}
        <section className="bg-gradient-to-r from-primary-300 to-primary-200 rounded-2xl p-8 shadow-lg space-y-6">
          <h2 className="text-2xl font-semibold text-neutral-800">
            Interactive Demo
          </h2>
          <p className="text-neutral-600">
            Click the button below to see the loading state in action
          </p>
          <div className="flex gap-4">
            <CustomButton
              variant="filled"
              text={loading ? "Processing..." : "Click Me!"}
              loading={loading}
              onClick={handleClick}
            />
            <CustomButton
              variant="outlined"
              text={loading ? "Processing..." : "Try This Too"}
              loading={loading}
              onClick={handleClick}
            />
          </div>
        </section>

        {/* Responsive Preview */}
        <section className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
          <h2 className="text-2xl font-semibold text-neutral-800">
            Responsive Design
          </h2>
          <p className="text-neutral-600">
            Resize your browser to see responsive padding and text sizes
          </p>
          <div className="space-y-4">
            <CustomButton
              variant="filled"
              text="Full Width Example"
              className="w-full"
              rightIcon={<ArrowRight />}
              onClick={() => console.log('Full width')}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <CustomButton
                variant="filled"
                text="Button 1"
                onClick={() => console.log('1')}
              />
              <CustomButton
                variant="outlined"
                text="Button 2"
                onClick={() => console.log('2')}
              />
              <CustomButton
                variant="link"
                text="Button 3"
                onClick={() => console.log('3')}
              />
            </div>
          </div>
        </section>

        {/* Usage Code */}
        <section className="bg-neutral-900 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Usage Example
          </h2>
          <pre className="text-green-400 text-sm overflow-x-auto">
            <code>{`import { CustomButton } from '@/components/ui';
import { ShoppingCart } from 'lucide-react';

<CustomButton 
  variant="filled" 
  text="Add to Cart"
  leftIcon={<ShoppingCart />}
  onClick={() => handleAddToCart()}
/>`}</code>
          </pre>
        </section>
      </div>
    </div>
  );
}
