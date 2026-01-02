import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { supabaseServer } from '@/lib/supabaseServer';
import { withAuth } from '@/lib/auth/apiAuth';

export async function GET() {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: products,
      count: products?.length || 0,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Protect this route - only authenticated users can create products
  return withAuth(request, async () => {
    try {
      const formData = await request.formData();
    
    // Extract fields from FormData
    const name = formData.get('name') as string;
    const category = formData.get('category') as string;
    const type = category || 'Clothing'; // Use category as type for now
    const price = parseFloat(formData.get('price') as string);
    const originalPriceStr = formData.get('originalPrice');
    const originalPrice = originalPriceStr ? parseFloat(originalPriceStr as string) : null;
    const isAvailable = formData.get('isAvailable') === 'true';
    const rating = formData.get('rating') ? parseFloat(formData.get('rating') as string) : 0;
    const reviewCount = formData.get('reviewCount') ? parseInt(formData.get('reviewCount') as string) : 0;
    
    // New fields
    const descriptionStr = formData.get('description');
    const description = (descriptionStr && descriptionStr !== '') ? descriptionStr as string : null;
    const stock = formData.get('stock') ? parseInt(formData.get('stock') as string) : 0;
    const discount = formData.get('discount') ? parseFloat(formData.get('discount') as string) : 0;
    const discountTypeStr = formData.get('discountType');
    const discountType = (discountTypeStr && discountTypeStr !== '') ? discountTypeStr as string : 'percentage';
    const genderStr = formData.get('gender');
    const gender = (genderStr && genderStr !== '') ? genderStr as string : null;
    const fitStr = formData.get('fit');
    const fit = (fitStr && fitStr !== '') ? fitStr as string : null;
    const modelDetailsStr = formData.get('modelDetails');
    const modelDetails = (modelDetailsStr && modelDetailsStr !== '') ? modelDetailsStr as string : null;
    
    // Handle arrays
    const availableSizes = formData.get('availableSizes') as string;
    const sizesArray = availableSizes ? availableSizes.split(',').map(s => s.trim()) : [];
    
    const color = formData.get('color') as string;
    const colorsArray = color ? color.split(',').map(c => c.trim()) : [];
    
    // Handle images - for now, use imageUrls from form
    const imageUrlsString = formData.get('existingImageUrls') as string;
    const imagesArray = imageUrlsString ? JSON.parse(imageUrlsString) : [];

    // Validate required fields
    if (!name || !category || !price) {
      return NextResponse.json(
        { error: 'Missing required fields: name, category, and price are required' },
        { status: 400 }
      );
    }

    // Create product object
    const productData = {
      name,
      category,
      type,
      price,
      original_price: originalPrice,
      is_available: isAvailable,
      rating,
      review_count: reviewCount,
      images: imagesArray,
      available_sizes: sizesArray,
      available_colors: colorsArray,
      description,
      stock,
      discount,
      discount_type: discountType,
      gender,
      fit,
      model_details: modelDetails,
    };

    // Insert into database using service role (bypasses RLS)
    const { data: newProduct, error } = await supabaseServer
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      return NextResponse.json(
        { error: 'Failed to create product', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: newProduct,
      message: 'Product created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
  });
}
