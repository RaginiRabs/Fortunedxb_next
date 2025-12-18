import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { saveSingleFile, validateFile } from '@/lib/fileUpload';
import { generateProjectCode } from '@/lib/generateProjectCode';

// GET - List all projects
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const developer_id = searchParams.get('developer_id');

    let sql = `
      SELECT 
        p.*,
        d.name as developer_name
      FROM project_details p
      LEFT JOIN developers d ON p.developer_id = d.developer_id
    `;

    const params = [];

    if (developer_id) {
      sql += ' WHERE p.developer_id = ?';
      params.push(developer_id);
    }

    sql += ' ORDER BY p.created_at DESC';

    const projects = await query(sql, params);

    // Parse JSON fields
    const parsedProjects = projects.map((p) => ({
      ...p,
      configurations: p.configurations ? JSON.parse(p.configurations) : [],
      highlights: p.highlights ? JSON.parse(p.highlights) : [],
      amenities: p.amenities ? JSON.parse(p.amenities) : [],
    }));

    return NextResponse.json({
      success: true,
      data: parsedProjects,
    });
  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST - Create new project
export async function POST(request) {
  try {
    const formData = await request.formData();
    const dataStr = formData.get('data');
    const data = JSON.parse(dataStr);

    const {
      developer_id,
      project_name,
      sub_headline,
      city,
      country,
      locality,
      project_address,
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
      video_url,
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
      phone_1_ccode,
      phone_2,
      phone_2_ccode,
      seo_developer_name,
      seo_city,
      meta_title,
      meta_keywords,
      meta_description,
      rich_snippets,
    } = data;

    // Validation
    if (!developer_id || !project_name || !usage_type || !project_status || !city) {
      return NextResponse.json(
        { success: false, message: 'Required fields missing' },
        { status: 400 }
      );
    }

    // Get developer name
    const developer = await queryOne(
      'SELECT name FROM developers WHERE developer_id = ?',
      [developer_id]
    );

    if (!developer) {
      return NextResponse.json(
        { success: false, message: 'Invalid developer' },
        { status: 400 }
      );
    }

    // SEO Verification
    if (seo_city && seo_city !== city) {
      return NextResponse.json(
        { success: false, message: 'SEO city must match project city' },
        { status: 400 }
      );
    }

    if (seo_developer_name && seo_developer_name !== developer.name) {
      return NextResponse.json(
        { success: false, message: 'SEO developer name must match selected developer' },
        { status: 400 }
      );
    }

    // Generate project code if not provided
    let finalProjectCode = project_code;
    if (!finalProjectCode) {
      const year = new Date().getFullYear();
      const sequenceResult = await queryOne(
        `SELECT COUNT(*) as count FROM project_details 
         WHERE YEAR(created_at) = ? AND city = ?`,
        [year, city]
      );
      const sequence = (sequenceResult?.count || 0) + 1;
      finalProjectCode = generateProjectCode(city, developer.name, sequence, year);
    }

    // Prepare configurations for DB (initial - will update after unit plan uploads)
    let configurationsForDb = (configurations || []).map(config => ({
      type: config.type,
      is_range: config.is_range,
      units_available: config.units_available,
      area_min: config.area_min,
      area_max: config.area_max,
      area_unit: config.area_unit,
      price_min: config.price_min,
      price_max: config.price_max,
      currency: config.currency,
      unit_plan_ids: [],
    }));

    // Insert project
    const result = await query(
      `INSERT INTO project_details (
        developer_id, project_name, sub_headline, city, country, locality,
        project_address, project_code, usage_type, project_type, project_status,
        total_towers, total_units, furnishing_status, handover_date,
        featured, location_link, video_url, configurations, booking_amount,
        payment_plan, roi, about, highlights, amenities,
        email_1, email_2, phone_1, phone_1_ccode, phone_2, phone_2_ccode
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        developer_id,
        project_name,
        sub_headline || null,
        city,
        country || 'UAE',
        locality || null,
        project_address || null,
        finalProjectCode,
        usage_type,
        project_type || null,
        project_status,
        total_towers || null,
        total_units || null,
        furnishing_status || null,
        handover_date || null,
        featured || false,
        location_link || null,
        video_url || null,
        JSON.stringify(configurationsForDb),
        booking_amount || null,
        payment_plan || null,
        roi || null,
        about || null,
        highlights ? JSON.stringify(highlights) : null,
        amenities ? JSON.stringify(amenities) : null,
        email_1 || null,
        email_2 || null,
        phone_1 || null,
        phone_1_ccode || null,
        phone_2 || null,
        phone_2_ccode || null,
      ]
    );

    const projectId = result.insertId;

    // Handle project logo
    const projectLogo = formData.get('project_logo');
    if (projectLogo && projectLogo instanceof File && projectLogo.size > 0) {
      const validation = validateFile(projectLogo, 'projectlogo');
      if (validation.valid) {
        const logoPath = await saveSingleFile(projectLogo, 'projectlogo', projectId);
        await query('UPDATE project_details SET project_logo = ? WHERE project_id = ?', [logoPath, projectId]);
      }
    }

    // Handle gallery images
    const galleryCount = parseInt(formData.get('gallery_count') || '0');
    for (let i = 0; i < galleryCount; i++) {
      const file = formData.get(`gallery_${i}`);
      if (file && file instanceof File && file.size > 0) {
        const validation = validateFile(file, 'gallery');
        if (validation.valid) {
          const filePath = await saveSingleFile(file, 'gallery', projectId);
          await query(
            'INSERT INTO project_files (project_id, file_name, file_type, file_path) VALUES (?, ?, ?, ?)',
            [projectId, file.name, 'gallery', filePath]
          );
        }
      }
    }

    // Handle floor plans
    const floorplanCount = parseInt(formData.get('floorplan_count') || '0');
    for (let i = 0; i < floorplanCount; i++) {
      const file = formData.get(`floorplan_${i}`);
      if (file && file instanceof File && file.size > 0) {
        const validation = validateFile(file, 'floorplan');
        if (validation.valid) {
          const filePath = await saveSingleFile(file, 'floorplan', projectId);
          await query(
            'INSERT INTO project_files (project_id, file_name, file_type, file_path) VALUES (?, ?, ?, ?)',
            [projectId, file.name, 'floorplan', filePath]
          );
        }
      }
    }

    // Handle brochure
    const brochure = formData.get('brochure');
    if (brochure && brochure instanceof File && brochure.size > 0) {
      const validation = validateFile(brochure, 'brochure');
      if (validation.valid) {
        const filePath = await saveSingleFile(brochure, 'brochure', projectId);
        await query(
          'INSERT INTO project_files (project_id, file_name, file_type, file_path) VALUES (?, ?, ?, ?)',
          [projectId, brochure.name, 'brochure', filePath]
        );
      }
    }

    // Handle tax sheets
    const taxsheetCount = parseInt(formData.get('taxsheet_count') || '0');
    for (let i = 0; i < taxsheetCount; i++) {
      const file = formData.get(`taxsheet_${i}`);
      if (file && file instanceof File && file.size > 0) {
        const validation = validateFile(file, 'taxsheet');
        if (validation.valid) {
          const filePath = await saveSingleFile(file, 'taxsheet', projectId);
          await query(
            'INSERT INTO project_files (project_id, file_name, file_type, file_path) VALUES (?, ?, ?, ?)',
            [projectId, file.name, 'taxsheet', filePath]
          );
        }
      }
    }

    // Handle payment plans
    const paymentplanCount = parseInt(formData.get('paymentplan_count') || '0');
    for (let i = 0; i < paymentplanCount; i++) {
      const file = formData.get(`paymentplan_${i}`);
      if (file && file instanceof File && file.size > 0) {
        const validation = validateFile(file, 'paymentplan');
        if (validation.valid) {
          const filePath = await saveSingleFile(file, 'paymentplan', projectId);
          await query(
            'INSERT INTO project_files (project_id, file_name, file_type, file_path) VALUES (?, ?, ?, ?)',
            [projectId, file.name, 'paymentplan', filePath]
          );
        }
      }
    }

    // ============ HANDLE CONFIG-WISE UNIT PLANS ============
    const configUnitPlanMetaStr = formData.get('config_unitplan_meta');
    const configUnitPlanMeta = configUnitPlanMetaStr ? JSON.parse(configUnitPlanMetaStr) : [];

    let configurationsUpdated = false;

    for (const meta of configUnitPlanMeta) {
      const { configIndex, fileIndex } = meta;
      const file = formData.get(`config_unitplan_${configIndex}_${fileIndex}`);

      if (file && file instanceof File && file.size > 0) {
        const validation = validateFile(file, 'unitplan');
        if (validation.valid) {
          // Save file
          const filePath = await saveSingleFile(file, 'unitplan', projectId);

          // Insert into project_files
          const fileResult = await query(
            'INSERT INTO project_files (project_id, file_name, file_type, file_path) VALUES (?, ?, ?, ?)',
            [projectId, file.name, 'unitplan', filePath]
          );

          const fileId = fileResult.insertId;

          // Add file_id to configuration's unit_plan_ids
          if (configurationsForDb[configIndex]) {
            if (!configurationsForDb[configIndex].unit_plan_ids) {
              configurationsForDb[configIndex].unit_plan_ids = [];
            }
            configurationsForDb[configIndex].unit_plan_ids.push(fileId);
            configurationsUpdated = true;
          }
        }
      }
    }

    // Update configurations in DB if unit plans were added
    if (configurationsUpdated) {
      await query(
        'UPDATE project_details SET configurations = ? WHERE project_id = ?',
        [JSON.stringify(configurationsForDb), projectId]
      );
    }
    // ============ END CONFIG-WISE UNIT PLANS ============

    // Insert nearby locations
    if (nearby_locations && nearby_locations.length > 0) {
      for (const location of nearby_locations) {
        if (location.place_name) {
          await query(
            `INSERT INTO project_nearby (project_id, place_name, distance_value, distance_unit, category, place_link)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              projectId,
              location.place_name,
              location.distance_value,
              location.distance_unit,
              location.category,
              location.place_link || null
            ]
          );
        }
      }
    }

    // Insert FAQs
    if (faqs && faqs.length > 0) {
      for (const faq of faqs) {
        if (faq.question && faq.answer) {
          await query(
            'INSERT INTO project_faq (project_id, question, answer) VALUES (?, ?, ?)',
            [projectId, faq.question, faq.answer]
          );
        }
      }
    }

    // Insert SEO data
    await query(
      `INSERT INTO project_seo (project_id, developer_name, city, meta_title, meta_keywords, meta_description, rich_snippets)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        projectId,
        seo_developer_name || developer.name,
        seo_city || city,
        meta_title || null,
        meta_keywords || null,
        meta_description || null,
        rich_snippets || null,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Project created successfully',
      data: { project_id: projectId, project_code: finalProjectCode },
    });

  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create project: ' + error.message },
      { status: 500 }
    );
  }
}