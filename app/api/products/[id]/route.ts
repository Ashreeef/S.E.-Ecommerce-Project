import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch a single product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;

    // TODO: Fetch product from database
    // Example:
    // const db = await getDatabase();
    // const product = await db.products.findById(productId);
    
    // Mock product data for now
    const mockProduct = {
      id: productId,
      title: 'denim baggy jeans',
      price: 2625.00, // after 25% discount
      originalPrice: 3500.00,
      image: '/assets/product.png',
      images: ['/assets/product.png', '/assets/product.png', '/assets/product.png'],
      category: 'Jeans',
      size: ['35', '36', '37', '38', '39', '40', '41', '42'],
      description: 'Relaxed-fit jeans made from durable cotton denim with a roomy silhouette for all-day comfort. Designed with a mid-rise waist, classic five-pocket styling, and a deep indigo wash for versatile everyday wear.',
      availability: true,
      rating: 4.5,
      modelDetails: 'Height: 5\'6" / 167 cm\nWaist: Sits at the natural waist without being too tight.\nThighs & hips: Very relaxed, plenty of room\nLeg opening: Wide, falls loosely around the shoes.\nLength: Slight stacking/pooling at the hem, suggesting they\'re cut long on this height.\nOverall silhouette: Loose and straight, giving a flowy and oversized look.',
      status: 'Available',
      color: 'dark-blue',
      gender: 'UNISEX',
      fit: 'Baggy',
      stock: 100,
      discount: 25,
      discountType: 'Back to school',
    };

    return NextResponse.json({ product: mockProduct });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT - Update a product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    const formData = await request.formData();
    
    // Extract form data
    const productData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      modelDetails: formData.get('modelDetails') as string,
      status: formData.get('status') as string,
      size: formData.get('size') as string,
      color: formData.get('color') as string,
      gender: formData.get('gender') as string,
      category: formData.get('category') as string,
      fit: formData.get('fit') as string,
      basePrice: parseFloat(formData.get('basePrice') as string),
      stock: parseInt(formData.get('stock') as string),
      discount: parseFloat(formData.get('discount') as string),
      discountType: formData.get('discountType') as string,
    };

    // Get existing image URLs if provided
    const existingImageUrlsStr = formData.get('existingImageUrls') as string;
    let existingImageUrls: string[] = [];
    if (existingImageUrlsStr) {
      try {
        existingImageUrls = JSON.parse(existingImageUrlsStr);
      } catch {
        // If parsing fails, use empty array
      }
    }

    // Validate required fields
    if (!productData.name || !productData.description || !productData.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Handle new image uploads
    const imageFiles: File[] = [];
    const imageCount = parseInt(formData.get('imageCount') as string) || 0;
    
    for (let i = 0; i < imageCount; i++) {
      const file = formData.get(`image_${i}`) as File;
      if (file) {
        imageFiles.push(file);
        // TODO: Upload to cloud storage and get URL
      }
    }

    // Calculate final price
    const discountAmount = (productData.basePrice * productData.discount) / 100;
    const finalPrice = productData.basePrice - discountAmount;

    // Create updated product object
    const updatedProduct = {
      id: productId,
      ...productData,
      price: finalPrice,
      originalPrice: productData.discount > 0 ? productData.basePrice : undefined,
      availability: productData.status === 'Available',
      image: existingImageUrls[0] || '/assets/product.png',
      images: existingImageUrls, // TODO: Merge with newly uploaded images
      title: productData.name,
      size: productData.size.split(',').map(s => s.trim()),
    };

    // TODO: Update product in database
    // Example:
    // const db = await getDatabase();
    // const product = await db.products.update(productId, updatedProduct);

    return NextResponse.json(
      { 
        success: true, 
        product: updatedProduct,
        message: 'Product updated successfully' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;

    // TODO: Delete product from database
    // Example:
    // const db = await getDatabase();
    // await db.products.delete(productId);

    return NextResponse.json(
      { 
        success: true,
        message: 'Product deleted successfully' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
