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
    const { project_id, project_name, lead_name, lead_phone, lead_email, lead_source, comments } = body;

    if (!project_id || !lead_name || !lead_phone) {
      return NextResponse.json(
        { success: false, message: 'Project, name, and phone are required' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO project_leads (project_id, project_name, lead_name, lead_phone, lead_email, lead_source, comments)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [project_id, project_name, lead_name, lead_phone, lead_email || null, lead_source || null, comments || null]
    );

    return NextResponse.json({
      success: true,
      message: 'Lead created successfully',
      data: { lead_id: result.insertId },
    });
  } catch (error) {
    console.error('Create lead error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create lead' },
      { status: 500 }
    );
  }
}