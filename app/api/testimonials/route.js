import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { saveSingleFile, validateFile } from '@/lib/fileUpload';

// GET - List all testimonials (with optional filters)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const active = searchParams.get('active');
    const limit = searchParams.get('limit');

    let sql = `
      SELECT 
        t.*,
        p.project_name
      FROM testimonials t
      LEFT JOIN project_details p ON t.project_id = p.project_id
      WHERE 1=1
    `;

    const params = [];

    // Filter by featured
    if (featured === 'true' || featured === '1') {
      sql += ' AND t.is_featured = 1';
    }

    // Filter by active (default: only active)
    if (active !== 'false' && active !== '0') {
      sql += ' AND t.is_active = 1';
    }

    sql += ' ORDER BY t.is_featured DESC, t.created_at DESC';

    // Limit results
    if (limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(limit));
    }

    const testimonials = await query(sql, params);

    return NextResponse.json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    console.error('Get testimonials error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

// POST - Create new testimonial
export async function POST(request) {
  try {
    const formData = await request.formData();

    // Get all fields
    const client_name = formData.get('client_name');
    const client_designation = formData.get('client_designation');
    const client_location = formData.get('client_location');
    const client_image = formData.get('client_image');
    const rating = formData.get('rating');
    const review_text = formData.get('review_text');
    const project_id = formData.get('project_id');
    const is_featured = formData.get('is_featured');
    const is_active = formData.get('is_active');

    // Validation
    if (!client_name || !client_name.trim()) {
      return NextResponse.json(
        { success: false, message: 'Client name is required' },
        { status: 400 }
      );
    }

    if (!review_text || !review_text.trim()) {
      return NextResponse.json(
        { success: false, message: 'Review text is required' },
        { status: 400 }
      );
    }

    // Validate rating
    const ratingValue = parseInt(rating) || 5;
    if (ratingValue < 1 || ratingValue > 5) {
      return NextResponse.json(
        { success: false, message: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Validate image if provided
    if (client_image && client_image instanceof File && client_image.size > 0) {
      const validation = validateFile(client_image, 'testimonial');
      if (!validation.valid) {
        return NextResponse.json(
          { success: false, message: validation.error },
          { status: 400 }
        );
      }
    }

    // Insert testimonial
    const result = await query(
      `INSERT INTO testimonials (
        client_name, client_designation, client_location, rating, 
        review_text, project_id, is_featured, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        client_name.trim(),
        client_designation?.trim() || null,
        client_location?.trim() || 'Dubai, UAE',
        ratingValue,
        review_text.trim(),
        project_id || null,
        is_featured === 'true' || is_featured === true || is_featured === '1' ? 1 : 0,
        is_active === 'false' || is_active === '0' ? 0 : 1,
      ]
    );

    const testimonialId = result.insertId;
    let imagePath = null;

    // Save client image
    if (client_image && client_image instanceof File && client_image.size > 0) {
      try {
        imagePath = await saveSingleFile(client_image, 'testimonial', testimonialId);
        await query('UPDATE testimonials SET client_image = ? WHERE testimonial_id = ?', [imagePath, testimonialId]);
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Testimonial created successfully',
      data: { testimonial_id: testimonialId, client_image: imagePath },
    });
  } catch (error) {
    console.error('Create testimonial error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
}