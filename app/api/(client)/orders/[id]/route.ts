import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAuthenticatedUser } from '@/lib/auth/apiAuth';

// GET single order by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error: authError } = await getAuthenticatedUser(request);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login to view order details.' },
        { status: 401 }
      );
    }

    const { id: orderId } = await params;

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

    // Fetch order and verify it belongs to the user
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('customer_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Order not found or you do not have permission to view it' },
          { status: 404 }
        );
      }
      console.error('Error fetching order:', error);
      return NextResponse.json(
        { error: 'Failed to fetch order', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// PUT update order (limited to user's own orders)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error: authError } = await getAuthenticatedUser(request);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login to update order.' },
        { status: 401 }
      );
    }

    const { id: orderId } = await params;
    const body = await request.json();

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

    // First, verify the order belongs to the user
    const { data: existingOrder, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('customer_id', user.id)
      .single();

    if (fetchError || !existingOrder) {
      return NextResponse.json(
        { error: 'Order not found or you do not have permission to update it' },
        { status: 404 }
      );
    }

    // Users can only cancel their pending orders
    if (body.status && body.status !== 'Canceled') {
      return NextResponse.json(
        { error: 'Users can only cancel orders. Other status updates are restricted.' },
        { status: 403 }
      );
    }

    // Only allow cancellation if order is still pending or confirmed
    if (body.status === 'Canceled' && !['Pending', 'Confirmed'].includes(existingOrder.status)) {
      return NextResponse.json(
        { error: 'This order cannot be canceled at its current status' },
        { status: 400 }
      );
    }

    // Update the order
    const updateData: {
      status?: string;
      shipment_timeline?: Array<{ title: string; date: string }>;
    } = {};
    if (body.status) {
      updateData.status = body.status;
      updateData.shipment_timeline = [
        ...(existingOrder.shipment_timeline || []),
        {
          title: 'Order Canceled by Customer',
          date: new Date().toISOString().split('T')[0],
        },
      ];
    }

    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating order:', updateError);
      return NextResponse.json(
        { error: 'Failed to update order', details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: 'Order updated successfully',
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// DELETE order (cancel only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error: authError } = await getAuthenticatedUser(request);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login to delete order.' },
        { status: 401 }
      );
    }

    const { id: orderId } = await params;

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

    // First, verify the order belongs to the user
    const { data: existingOrder, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('customer_id', user.id)
      .single();

    if (fetchError || !existingOrder) {
      return NextResponse.json(
        { error: 'Order not found or you do not have permission to delete it' },
        { status: 404 }
      );
    }

    // Only allow deletion if order is pending
    if (existingOrder.status !== 'Pending') {
      return NextResponse.json(
        { error: 'Only pending orders can be deleted' },
        { status: 400 }
      );
    }

    // Delete the order
    const { error: deleteError } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (deleteError) {
      console.error('Error deleting order:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete order', details: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
