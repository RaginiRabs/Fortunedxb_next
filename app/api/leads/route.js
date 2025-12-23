import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - List all leads
export async function GET() {
  try {
    const leads = await query(`
      SELECT * FROM project_leads 
      ORDER BY lead_date DESC
    `);

    return NextResponse.json({
      success: true,
      data: leads,
    });
  } catch (error) {
    console.error('Get leads error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

// POST - Create new lead
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      project_id,
      project_name,
      lead_name,
      lead_phone,
      lead_phone_ccode,
      lead_email,
      lead_source,
      comments,
    } = body;

    // Validation
    if (!project_id || !project_name) {
      return NextResponse.json(
        { success: false, message: 'Project ID and name are required' },
        { status: 400 }
      );
    }

    if (!lead_name?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Name is required' },
        { status: 400 }
      );
    }

    if (!lead_phone?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Insert lead with phone country code
    const result = await query(
      `INSERT INTO project_leads 
        (project_id, project_name, lead_name, lead_phone, lead_phone_ccode, lead_email, lead_source, comments)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        project_id,
        project_name,
        lead_name.trim(),
        lead_phone.trim(),
        lead_phone_ccode || null,
        lead_email?.trim() || null,
        lead_source || null,
        comments?.trim() || null,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Lead submitted successfully',
      data: { lead_id: result.insertId },
    });
  } catch (error) {
    console.error('Create lead error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit lead' },
      { status: 500 }
    );
  }
}