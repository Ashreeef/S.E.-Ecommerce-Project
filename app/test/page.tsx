'use client';

import { useProducts } from '@/hooks/useProductsApi';

export default function MyComponent() {
  const { data, isLoading, isError } = useProducts();
  
  if (isLoading) {
    return <div className="p-8">Loading products...</div>;
  }
  
  if (isError) {
    return <div className="p-8 text-red-500">Error loading products</div>;
  }
  
  const products = data?.data || [];
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Products ({data?.count || 0})</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: any) => (
          <div key={product.id} className="border p-4 rounded">
            {product.images?.[0] && (
              <img 
                src={product.images[0]} 
                alt={product.name}
                className="w-full h-64 object-cover rounded mb-4"
              />
            )}
            <h2 className="font-semibold text-lg">{product.name}</h2>
            <p className="text-xl font-bold">${product.price}</p>
            {product.original_price && (
              <p className="text-sm text-gray-500 line-through">${product.original_price}</p>
            )}
            <p className="text-sm text-gray-600">Category: {product.category}</p>
            <p className="text-sm">⭐ {product.rating} ({product.review_count} reviews)</p>
          </div>
        ))}
      </div>
    </div>
  );
}