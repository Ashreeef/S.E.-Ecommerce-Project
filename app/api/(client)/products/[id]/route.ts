import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { supabaseServer } from '@/lib/supabaseServer';
import { withAuth } from '@/lib/auth/apiAuth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
      
      console.error('Error fetching product:', error);
      return NextResponse.json(
        { error: 'Failed to fetch product', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Protect this route - only authenticated users can delete
  return withAuth(request, async (user) => {
    try {
      const { id } = await params;

    // First check if product exists
    const { data: existingProduct, error: fetchError } = await supabaseServer
      .from('products')
      .select('id, images')
      .eq('id', id)
      .single();

    if (fetchError || !existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Delete product from database (using service role to bypass RLS)
    const { error: deleteError } = await supabaseServer
      .from('products')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting product:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete product', details: deleteError.message },
        { status: 500 }
      );
    }

    // Optional: Delete images from storage
    if (existingProduct.images && Array.isArray(existingProduct.images) && existingProduct.images.length > 0) {
      try {
        const filesToDelete = existingProduct.images
          .filter((url: string) => url.includes('/product-images/'))
          .map((url: string) => url.split('/product-images/').pop())
          .filter(Boolean) as string[];

        if (filesToDelete.length > 0) {
          await supabaseServer.storage
            .from('product-images')
            .remove(filesToDelete);
        }
      } catch (storageError) {
        // Log but don't fail the deletion if storage cleanup fails
        console.error('Error deleting images from storage:', storageError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Protect this route - only authenticated users can update
  return withAuth(request, async (user) => {
    try {
      const { id } = await params;
    const formData = await request.formData();

    // Check if product exists
    const { data: existingProduct, error: fetchError } = await supabaseServer
      .from('products')
      .select('id')
      .eq('id', id)
      .single();

    if (fetchError || !existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Extract and process form data
    const name = formData.get('name') as string;
    const category = formData.get('category') as string;
    const type = category || 'Clothing';
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
    
    // Handle images
    const imageUrlsString = formData.get('existingImageUrls') as string;
    const imagesArray = imageUrlsString ? JSON.parse(imageUrlsString) : [];

    // Validate required fields
    if (!name || !category || isNaN(price)) {
      return NextResponse.json(
        { error: 'Missing required fields: name, category, and price are required' },
        { status: 400 }
      );
    }

    // Update product object
    const updateData = {
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
      updated_at: new Date().toISOString(),
    };

    // Update in database using service role
    const { data: updatedProduct, error: updateError } = await supabaseServer
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating product:', updateError);
      return NextResponse.json(
        { error: 'Failed to update product', details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully',
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
  });
}
