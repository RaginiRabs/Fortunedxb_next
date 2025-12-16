import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - List all offers
export async function GET() {
  try {
    const offers = await query(`
      SELECT 
        o.*,
        p.project_name
      FROM project_offers o
      LEFT JOIN project_details p ON o.project_id = p.project_id
      ORDER BY o.created_at DESC
    `);

    return NextResponse.json({
      success: true,
      data: offers,
    });
  } catch (error) {
    console.error('Get offers error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch offers' },
      { status: 500 }
    );
  }
}

// POST - Create new offer
export async function POST(request) {
  try {
    const body = await request.json();
    const { project_id, title, description, expiry_date } = body;

    if (!project_id || !title) {
      return NextResponse.json(
        { success: false, message: 'Project and title are required' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO project_offers (project_id, title, description, expiry_date)
       VALUES (?, ?, ?, ?)`,
      [project_id, title, description || null, expiry_date || null]
    );

    return NextResponse.json({
      success: true,
      message: 'Offer created successfully',
      data: { offer_id: result.insertId },
    });
  } catch (error) {
    console.error('Create offer error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create offer' },
      { status: 500 }
    );
  }
}