import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';

// GET - Single offer
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const offer = await queryOne(
      `SELECT o.*, p.project_name
       FROM project_offers o
       LEFT JOIN project_details p ON o.project_id = p.project_id
       WHERE o.offer_id = ?`,
      [id]
    );

    if (!offer) {
      return NextResponse.json(
        { success: false, message: 'Offer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: offer,
    });
  } catch (error) {
    console.error('Get offer error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch offer' },
      { status: 500 }
    );
  }
}

// PUT - Update offer
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { project_id, title, description, expiry_date } = body;

    const result = await query(
      `UPDATE project_offers 
       SET project_id = ?, title = ?, description = ?, expiry_date = ?
       WHERE offer_id = ?`,
      [project_id, title, description || null, expiry_date || null, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: 'Offer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Offer updated successfully',
    });
  } catch (error) {
    console.error('Update offer error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update offer' },
      { status: 500 }
    );
  }
}

// DELETE - Delete offer
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const result = await query(
      'DELETE FROM project_offers WHERE offer_id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: 'Offer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Offer deleted successfully',
    });
  } catch (error) {
    console.error('Delete offer error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete offer' },
      { status: 500 }
    );
  }
}