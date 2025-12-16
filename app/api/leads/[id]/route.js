import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';

// GET - Single lead
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const lead = await queryOne(
      'SELECT * FROM project_leads WHERE lead_id = ?',
      [id]
    );

    if (!lead) {
      return NextResponse.json(
        { success: false, message: 'Lead not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: lead,
    });
  } catch (error) {
    console.error('Get lead error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch lead' },
      { status: 500 }
    );
  }
}

// PUT - Update lead
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { comments } = body;

    const result = await query(
      'UPDATE project_leads SET comments = ? WHERE lead_id = ?',
      [comments, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: 'Lead not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Lead updated successfully',
    });
  } catch (error) {
    console.error('Update lead error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update lead' },
      { status: 500 }
    );
  }
}

// DELETE - Delete lead
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const result = await query(
      'DELETE FROM project_leads WHERE lead_id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: 'Lead not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Lead deleted successfully',
    });
  } catch (error) {
    console.error('Delete lead error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete lead' },
      { status: 500 }
    );
  }
}