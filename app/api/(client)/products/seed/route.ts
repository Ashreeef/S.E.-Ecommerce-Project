import { supabaseServer } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';

const seedProducts = [
  {
    name: 'Elegant Ensemble',
    category: 'Clothing',
    type: 'Clothing',
    price: 4500,
    original_price: 6000,
    is_available: true,
    rating: 4.9,
    review_count: 67,
    images: ['/assets/ensemble.JPG'],
    available_sizes: ['S', 'M', 'L'],
    available_colors: ['Red', 'Blue'],
    description: 'A stunning ensemble perfect for any occasion. Features elegant design and premium quality fabric.',
    stock: 25,
    discount: 25,
    discount_type: 'percentage',
    gender: 'WOMEN',
    fit: 'Regular',
    model_details: 'Model is 170cm and wears size M',
  },
  {
    name: 'Chic Summer Robe',
    category: 'Clothing',
    type: 'Clothing',
    price: 3200,
    original_price: null,
    is_available: true,
    rating: 4.8,
    review_count: 43,
    images: ['/assets/robe.JPG'],
    available_sizes: ['S', 'M', 'L'],
    available_colors: ['Yellow', 'White'],
    description: 'Lightweight and breathable summer robe perfect for warm weather. Comfortable and stylish.',
    stock: 30,
    discount: 0,
    discount_type: 'percentage',
    gender: 'WOMEN',
    fit: 'Loose',
    model_details: 'Model is 165cm and wears size S',
  },
  {
    name: 'Modern Jacket',
    category: 'Clothing',
    type: 'Clothing',
    price: 3800,
    original_price: 5000,
    is_available: true,
    rating: 4.7,
    review_count: 52,
    images: ['/assets/jacket.JPG'],
    available_sizes: ['M', 'L', 'XL'],
    available_colors: ['Black', 'Gray'],
    description: 'Modern jacket with contemporary design. Perfect for casual and semi-formal occasions.',
    stock: 20,
    discount: 24,
    discount_type: 'percentage',
    gender: 'UNISEX',
    fit: 'Regular',
    model_details: 'Model is 180cm and wears size L',
  },
  {
    name: 'Premium Hijeb',
    category: 'Clothing',
    type: 'Clothing',
    price: 2900,
    original_price: null,
    is_available: true,
    rating: 4.8,
    review_count: 38,
    images: ['/assets/hijeb.jpg'],
    available_sizes: ['S', 'M', 'L'],
    available_colors: ['White', 'Beige'],
    description: 'Premium quality hijeb made from soft, breathable fabric. Available in multiple colors.',
    stock: 50,
    discount: 0,
    discount_type: 'percentage',
    gender: 'WOMEN',
    fit: 'One Size',
    model_details: null,
  },
  {
    name: 'Denim baggy jeans',
    category: 'Clothing',
    type: 'Clothing',
    price: 3500,
    original_price: null,
    is_available: true,
    rating: 0,
    review_count: 0,
    images: ['/assets/denim-jeans.JPG'],
    available_sizes: ['S', 'M', 'L', 'XL'],
    available_colors: ['Blue', 'Black'],
    description: 'Classic baggy denim jeans with comfortable fit. Perfect for everyday wear.',
    stock: 35,
    discount: 0,
    discount_type: 'percentage',
    gender: 'UNISEX',
    fit: 'Baggy',
    model_details: 'Model is 175cm and wears size M',
  },
];

export async function seedDatabase() {
  try {
    console.log('Starting database seed...');
    
    // Insert products into the database using service role (bypasses RLS)
    const { data, error } = await supabaseServer
      .from('products')
      .insert(seedProducts)
      .select();

    if (error) {
      console.error('Error seeding database:', error);
      throw error;
    }

    console.log('Database seeded successfully!');
    console.log(`Inserted ${data?.length || 0} products`);
    return data;
  } catch (error) {
    console.error('Failed to seed database:', error);
    throw error;
  }
}

// API Route Handler
export async function POST() {
  try {
    const result = await seedDatabase();
    
    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      data: result,
    });
  } catch (error) {
    console.error('Seed API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to seed database',
        error: error instanceof Error ? error.message : String(error),
        details: error,
      },
      { status: 500 }
    );
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seed completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed failed:', error);
      process.exit(1);
    });
}
