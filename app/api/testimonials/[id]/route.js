import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { saveSingleFile, validateFile, deleteSingleFile } from '@/lib/fileUpload';

// GET - Get single testimonial
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const testimonial = await queryOne(
      `SELECT 
        t.*,
        p.project_name
      FROM testimonials t
      LEFT JOIN project_details p ON t.project_id = p.project_id
      WHERE t.testimonial_id = ?`,
      [id]
    );

    if (!testimonial) {
      return NextResponse.json(
        { success: false, message: 'Testimonial not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    console.error('Get testimonial error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch testimonial' },
      { status: 500 }
    );
  }
}

// PUT - Update testimonial
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const formData = await request.formData();

    // Check if testimonial exists
    const existing = await queryOne('SELECT * FROM testimonials WHERE testimonial_id = ?', [id]);
    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Testimonial not found' },
        { status: 404 }
      );
    }

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

    // Update testimonial
    await query(
      `UPDATE testimonials SET 
        client_name = ?,
        client_designation = ?,
        client_location = ?,
        rating = ?,
        review_text = ?,
        project_id = ?,
        is_featured = ?,
        is_active = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE testimonial_id = ?`,
      [
        client_name.trim(),
        client_designation?.trim() || null,
        client_location?.trim() || 'Dubai, UAE',
        ratingValue,
        review_text.trim(),
        project_id || null,
        is_featured === 'true' || is_featured === true || is_featured === '1' ? 1 : 0,
        is_active === 'false' || is_active === '0' ? 0 : 1,
        id,
      ]
    );

    let imagePath = existing.client_image;

    // Handle new image upload
    if (client_image && client_image instanceof File && client_image.size > 0) {
      const validation = validateFile(client_image, 'testimonial');
      if (validation.valid) {
        // Delete old image if exists
        if (existing.client_image) {
          try {
            deleteSingleFile(existing.client_image);
          } catch (err) {
            console.error('Error deleting old image:', err);
          }
        }
        // Save new image
        imagePath = await saveSingleFile(client_image, 'testimonial', id);
        await query('UPDATE testimonials SET client_image = ? WHERE testimonial_id = ?', [imagePath, id]);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Testimonial updated successfully',
      data: { testimonial_id: id, client_image: imagePath },
    });
  } catch (error) {
    console.error('Update testimonial error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update testimonial' },
      { status: 500 }
    );
  }
}

// DELETE - Delete testimonial
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    // Check if testimonial exists
    const existing = await queryOne('SELECT * FROM testimonials WHERE testimonial_id = ?', [id]);
    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'Testimonial not found' },
        { status: 404 }
      );
    }

    // Delete image if exists
    if (existing.client_image) {
      try {
        deleteSingleFile(existing.client_image);
      } catch (err) {
        console.error('Error deleting image:', err);
      }
    }

    // Delete testimonial
    await query('DELETE FROM testimonials WHERE testimonial_id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'Testimonial deleted successfully',
    });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete testimonial' },
      { status: 500 }
    );
  }
}