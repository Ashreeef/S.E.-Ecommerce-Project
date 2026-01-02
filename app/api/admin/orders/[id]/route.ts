import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { withAuth } from '@/lib/auth/apiAuth';

// Create admin Supabase client with service role
const getAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
};

// GET single order (admin)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async () => {
    try {
      const { id: orderId } = await params;
      const supabaseAdmin = getAdminClient();

      const { data: order, error } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return NextResponse.json(
            { error: 'Order not found' },
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
  });
}

// PUT update order (admin - can update any field)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async () => {
    try {
      const { id: orderId } = await params;
      const body = await request.json();
      const supabaseAdmin = getAdminClient();

      // Get existing order
      const { data: existingOrder, error: fetchError } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (fetchError || !existingOrder) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }

      // Build update data
      const updateData: {
        status?: string;
        shipment_timeline?: Array<{ title: string; date: string; location?: string }>;
        date_delivered?: string;
        shipping_status?: string;
        delivery_company?: string;
        payment_method?: string;
        estimated_delivery?: string;
      } = {};
      
      if (body.status) {
        updateData.status = body.status;
        
        // Update shipment timeline
        const newTimelineEntry = {
          title: `Order ${body.status}`,
          date: new Date().toISOString().split('T')[0],
          location: body.location || undefined,
        };

        updateData.shipment_timeline = [
          ...(existingOrder.shipment_timeline || []),
          newTimelineEntry,
        ];

        // Update dates based on status
        if (body.status === 'Delivered') {
          updateData.date_delivered = new Date().toISOString().split('T')[0];
          updateData.shipping_status = 'Completed';
        }
      }

      if (body.shipping_status) {
        updateData.shipping_status = body.shipping_status;
      }

      if (body.delivery_company) {
        updateData.delivery_company = body.delivery_company;
      }

      if (body.payment_method) {
        updateData.payment_method = body.payment_method;
      }

      if (body.estimated_delivery) {
        updateData.estimated_delivery = body.estimated_delivery;
      }

      // Update the order
      const { data: updatedOrder, error: updateError } = await supabaseAdmin
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
  });
}

// DELETE order (admin - permanent delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async () => {
    try {
      const { id: orderId } = await params;
      const supabaseAdmin = getAdminClient();

      // Delete the order
      const { error: deleteError } = await supabaseAdmin
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
  });
}
