import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { saveSingleFile, deleteSingleFile, validateFile } from '@/lib/fileUpload';

// GET - Single project with all related data
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const project = await queryOne(
      `SELECT 
        p.*,
        d.name as developer_name,
        d.description as developer_desc,
        d.logo_path as developer_logo
       FROM project_details p
       LEFT JOIN developers d ON p.developer_id = d.developer_id
       WHERE p.project_id = ?`,
      [id]
    );

    if (!project) {
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404 }
      );
    }

    // Get nearby locations (includes place_link)
    const nearby = await query(
      'SELECT * FROM project_nearby WHERE project_id = ?',
      [id]
    );

    // Get files
    const files = await query(
      'SELECT * FROM project_files WHERE project_id = ?',
      [id]
    );

    // Get FAQs
    const faqs = await query(
      'SELECT * FROM project_faq WHERE project_id = ?',
      [id]
    );

    // Get SEO
    const seo = await queryOne(
      'SELECT * FROM project_seo WHERE project_id = ?',
      [id]
    );

    // Parse JSON fields
    const parsedProject = {
      ...project,
      configurations: project.configurations ? JSON.parse(project.configurations) : [],
      highlights: project.highlights ? JSON.parse(project.highlights) : [],
      amenities: project.amenities ? JSON.parse(project.amenities) : [],
      nearby_locations: nearby,
      files: {
        gallery: files.filter((f) => f.file_type === 'gallery'),
        floorplan: files.filter((f) => f.file_type === 'floorplan'),
        brochure: files.find((f) => f.file_type === 'brochure'),
        video: files.find((f) => f.file_type === 'video'),
      },
      faqs: faqs,
      seo: seo || {},
    };

    // Generate URL
    const developerSlug = project.developer_name
      ? project.developer_name.toLowerCase().replace(/\s+/g, '-')
      : 'unknown';
    const projectSlug = project.project_name
      ? project.project_name.toLowerCase().replace(/\s+/g, '-')
      : 'project';
    const citySlug = project.city
      ? project.city.toLowerCase().replace(/\s+/g, '-')
      : 'dubai';

    parsedProject.url = `/${citySlug}/${developerSlug}/${projectSlug}-${project.project_id}`;

    return NextResponse.json({
      success: true,
      data: parsedProject,
    });
  } catch (error) {
    console.error('Get project error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// PUT - Update project
export async function PUT(request, { params }) {
  try {
    const { id } = await params;

    const existingProject = await queryOne(
      'SELECT * FROM project_details WHERE project_id = ?',
      [id]
    );

    if (!existingProject) {
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const dataStr = formData.get('data');
    const data = JSON.parse(dataStr);

    const {
      sub_headline,
      country,
      locality,
      project_code,
      usage_type,
      project_type,
      project_status,
      total_towers,
      total_units,
      furnishing_status,
      handover_date,
      featured,
      location_link,
      configurations,
      booking_amount,
      payment_plan,
      roi,
      about,
      highlights,
      faqs,
      amenities,
      nearby_locations,
      email_1,
      email_2,
      phone_1,
      phone_2,
      deleted_gallery_ids,
      deleted_floorplan_ids,
    } = data;

    // Validation
    if (!usage_type || !project_status) {
      return NextResponse.json(
        { success: false, message: 'Required fields missing' },
        { status: 400 }
      );
    }

    // Update project
    await query(
      `UPDATE project_details SET
        sub_headline = ?,
        country = ?,
        locality = ?,
        project_code = ?,
        usage_type = ?,
        project_type = ?,
        project_status = ?,
        total_towers = ?,
        total_units = ?,
        furnishing_status = ?,
        handover_date = ?,
        featured = ?,
        location_link = ?,
        configurations = ?,
        booking_amount = ?,
        payment_plan = ?,
        roi = ?,
        about = ?,
        highlights = ?,
        amenities = ?,
        email_1 = ?,
        email_2 = ?,
        phone_1 = ?,
        phone_2 = ?,
        updated_at = NOW()
       WHERE project_id = ?`,
      [
        sub_headline || null,
        country || 'UAE',
        locality || null,
        project_code || null,
        usage_type,
        project_type || null,
        project_status,
        total_towers || null,
        total_units || null,
        furnishing_status || null,
        handover_date || null,
        featured || false,
        location_link || null,
        configurations ? JSON.stringify(configurations) : null,
        booking_amount || null,
        payment_plan || null,
        roi || null,
        about || null,
        highlights ? JSON.stringify(highlights) : null,
        amenities ? JSON.stringify(amenities) : null,
        email_1 || null,
        email_2 || null,
        phone_1 || null,
        phone_2 || null,
        id,
      ]
    );

    // Handle project logo
    const projectLogo = formData.get('project_logo');
    if (projectLogo && projectLogo instanceof File && projectLogo.size > 0) {
      const validation = validateFile(projectLogo, 'projectlogo');
      if (validation.valid) {
        if (existingProject.project_logo) {
          deleteSingleFile(existingProject.project_logo);
        }
        const logoPath = await saveSingleFile(projectLogo, 'projectlogo', id);
        await query('UPDATE project_details SET project_logo = ? WHERE project_id = ?', [logoPath, id]);
      }
    }

    // Delete specified gallery files
    if (deleted_gallery_ids && deleted_gallery_ids.length > 0) {
      for (const fileId of deleted_gallery_ids) {
        const file = await queryOne('SELECT * FROM project_files WHERE file_id = ?', [fileId]);
        if (file) {
          deleteSingleFile(file.file_path);
          await query('DELETE FROM project_files WHERE file_id = ?', [fileId]);
        }
      }
    }

    // Delete specified floorplan files
    if (deleted_floorplan_ids && deleted_floorplan_ids.length > 0) {
      for (const fileId of deleted_floorplan_ids) {
        const file = await queryOne('SELECT * FROM project_files WHERE file_id = ?', [fileId]);
        if (file) {
          deleteSingleFile(file.file_path);
          await query('DELETE FROM project_files WHERE file_id = ?', [fileId]);
        }
      }
    }

    // Handle gallery images (add new ones)
    const galleryCount = parseInt(formData.get('gallery_count') || '0');
    for (let i = 0; i < galleryCount; i++) {
      const file = formData.get(`gallery_${i}`);
      if (file && file instanceof File && file.size > 0) {
        const validation = validateFile(file, 'gallery');
        if (validation.valid) {
          const filePath = await saveSingleFile(file, 'gallery', id);
          await query(
            'INSERT INTO project_files (project_id, file_name, file_type, file_path) VALUES (?, ?, ?, ?)',
            [id, file.name, 'gallery', filePath]
          );
        }
      }
    }

    // Handle floor plans (add new ones)
    const floorplanCount = parseInt(formData.get('floorplan_count') || '0');
    for (let i = 0; i < floorplanCount; i++) {
      const file = formData.get(`floorplan_${i}`);
      if (file && file instanceof File && file.size > 0) {
        const validation = validateFile(file, 'floorplan');
        if (validation.valid) {
          const filePath = await saveSingleFile(file, 'floorplan', id);
          await query(
            'INSERT INTO project_files (project_id, file_name, file_type, file_path) VALUES (?, ?, ?, ?)',
            [id, file.name, 'floorplan', filePath]
          );
        }
      }
    }

    // Handle brochure
    const brochure = formData.get('brochure');
    if (brochure && brochure instanceof File && brochure.size > 0) {
      const validation = validateFile(brochure, 'brochure');
      if (validation.valid) {
        const oldBrochure = await queryOne(
          "SELECT * FROM project_files WHERE project_id = ? AND file_type = 'brochure'",
          [id]
        );
        if (oldBrochure) {
          deleteSingleFile(oldBrochure.file_path);
          await query('DELETE FROM project_files WHERE file_id = ?', [oldBrochure.file_id]);
        }

        const filePath = await saveSingleFile(brochure, 'brochure', id);
        await query(
          'INSERT INTO project_files (project_id, file_name, file_type, file_path) VALUES (?, ?, ?, ?)',
          [id, brochure.name, 'brochure', filePath]
        );
      }
    }

    // Update nearby locations with place_link
    await query('DELETE FROM project_nearby WHERE project_id = ?', [id]);
    if (nearby_locations && nearby_locations.length > 0) {
      for (const location of nearby_locations) {
        if (location.place_name) {
          await query(
            `INSERT INTO project_nearby (project_id, place_name, distance_value, distance_unit, category, place_link)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [id, location.place_name, location.distance_value, location.distance_unit, location.category, location.place_link || null]
          );
        }
      }
    }

    // Update FAQs
    await query('DELETE FROM project_faq WHERE project_id = ?', [id]);
    if (faqs && faqs.length > 0) {
      for (const faq of faqs) {
        if (faq.question && faq.answer) {
          await query(
            'INSERT INTO project_faq (project_id, question, answer) VALUES (?, ?, ?)',
            [id, faq.question, faq.answer]
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Project updated successfully',
    });

  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update project: ' + error.message },
      { status: 500 }
    );
  }
}