import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAuthenticatedUser } from '@/lib/auth/apiAuth';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
}

// GET all orders for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await getAuthenticatedUser(request);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login to view your orders.' },
        { status: 401 }
      );
    }

    // Get the auth token from request
    const token = request.headers.get('authorization')?.replace('Bearer ', '') || '';
    
    // Create Supabase client with user's auth token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    // Fetch orders for the authenticated user
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json(
        { error: 'Failed to fetch orders', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: orders,
      count: orders?.length || 0,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// POST create a new order
export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await getAuthenticatedUser(request);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login to create an order.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    const {
      firstName,
      lastName,
      phone,
      email,
      wilaya,
      city,
      address,
      shippingMethod,
      items,
      bureau,
      orderNotes,
    } = body;

    if (!firstName || !lastName || !phone || !email || !wilaya || !city || !address || !shippingMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    // Calculate amounts
    const totalAmount = items.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
    const shippingFee = shippingMethod === 'home' ? 600 : 400; // Example shipping fees
    const tax = Math.round(totalAmount * 0.1); // 10% tax
    const grandTotal = totalAmount + shippingFee + tax;

    // Create order data
    const orderData = {
      customer_id: user.id,
      customer_name: `${firstName} ${lastName}`,
      customer_phone: phone,
      customer_email: email,
      address: `${address}, ${city}, ${wilaya}`,
      wilaya,
      city,
      bureau: bureau || null,
      shipping_method: shippingMethod,
      order_notes: orderNotes || null,
      status: 'Pending',
      total_amount: totalAmount,
      shipping_fee: shippingFee,
      tax,
      grand_total: grandTotal,
      payment_method: 'Cash on Delivery', // Default, can be extended
      delivery_company: shippingMethod === 'home' ? 'Yalidine Express' : 'Ecourier',
      shipping_status: 'Awaiting Confirmation',
      number_of_products: items.length,
      products: items,
      shipment_timeline: [
        {
          title: 'Order Placed',
          date: new Date().toISOString().split('T')[0],
        },
      ],
    };

    // Get the auth token from request
    const token = request.headers.get('authorization')?.replace('Bearer ', '') || '';
    
    // Create Supabase client with user's auth token for RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    // Insert order into database
    const { data: newOrder, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      console.error('Order data being inserted:', JSON.stringify(orderData, null, 2));
      return NextResponse.json(
        { error: 'Failed to create order', details: error.message, hint: error.hint || 'Check server logs for more details' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        data: newOrder,
        message: 'Order created successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
