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
