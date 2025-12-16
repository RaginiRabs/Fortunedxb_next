import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { deleteSingleFile, replaceFile, validateFile, saveSingleFile } from '@/lib/fileUpload';

// GET - Single developer with awards
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const developer = await queryOne(
      'SELECT * FROM developers WHERE developer_id = ?',
      [id]
    );

    if (!developer) {
      return NextResponse.json(
        { success: false, message: 'Developer not found' },
        { status: 404 }
      );
    }

    // Get awards
    const awards = await query(
      'SELECT * FROM developer_awards WHERE developer_id = ? ORDER BY year DESC',
      [id]
    );

    return NextResponse.json({
      success: true,
      data: {
        ...developer,
        awards: awards,
      },
    });
  } catch (error) {
    console.error('Get developer error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch developer' },
      { status: 500 }
    );
  }
}

// PUT - Update developer with awards
export async function PUT(request, { params }) {
  try {
    const { id } = await params;

    const currentDeveloper = await queryOne(
      'SELECT * FROM developers WHERE developer_id = ?',
      [id]
    );

    if (!currentDeveloper) {
      return NextResponse.json(
        { success: false, message: 'Developer not found' },
        { status: 404 }
      );
    }

    const formData = await request.formData();

    const name = formData.get('name');
    const logo = formData.get('logo');
    const cover_image = formData.get('cover_image');
    const tagline = formData.get('tagline');
    const description = formData.get('description');
    const established_year = formData.get('established_year');
    const headquarters = formData.get('headquarters');
    const total_projects = formData.get('total_projects');
    const completed_projects = formData.get('completed_projects');
    const ongoing_projects = formData.get('ongoing_projects');
    const awards_count = formData.get('awards_count');
    const countries_present = formData.get('countries_present');
    const is_verified = formData.get('is_verified');
    const website_url = formData.get('website_url');
    const contact_email = formData.get('contact_email');
    const contact_phone = formData.get('contact_phone');
    const contact_phone_ccode = formData.get('contact_phone_ccode'); // NEW
    const facebook_url = formData.get('facebook_url');
    const instagram_url = formData.get('instagram_url');
    const linkedin_url = formData.get('linkedin_url');
    const youtube_url = formData.get('youtube_url');
    const remove_logo = formData.get('remove_logo');
    const remove_cover = formData.get('remove_cover');
    const awardsDataStr = formData.get('awards_data');

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: 'Developer name is required', error: { fields: { name: 'Developer name is required' } } },
        { status: 400 }
      );
    }

    if (name.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: 'Name must be at least 2 characters', error: { fields: { name: 'Name must be at least 2 characters' } } },
        { status: 400 }
      );
    }

    // Check duplicate name
    const duplicateName = await queryOne(
      'SELECT developer_id FROM developers WHERE name = ? AND developer_id != ?',
      [name.trim(), id]
    );

    if (duplicateName) {
      return NextResponse.json(
        { success: false, message: 'Developer with this name already exists', error: { fields: { name: 'Developer with this name already exists' } } },
        { status: 400 }
      );
    }

    // Handle logo
    let logoPath = currentDeveloper.logo_path;

    if (remove_logo === 'true') {
      if (currentDeveloper.logo_path) {
        deleteSingleFile(currentDeveloper.logo_path);
      }
      logoPath = null;
    }

    if (logo && logo instanceof File && logo.size > 0) {
      const validation = validateFile(logo, 'logo');
      if (!validation.valid) {
        return NextResponse.json(
          { success: false, message: validation.error, error: { fields: { logo: validation.error } } },
          { status: 400 }
        );
      }
      try {
        logoPath = await replaceFile(currentDeveloper.logo_path, logo, 'logo', id);
      } catch (uploadError) {
        console.error('Logo upload error:', uploadError);
      }
    }

    // Handle cover image
    let coverPath = currentDeveloper.cover_image;

    if (remove_cover === 'true') {
      if (currentDeveloper.cover_image) {
        deleteSingleFile(currentDeveloper.cover_image);
      }
      coverPath = null;
    }

    if (cover_image && cover_image instanceof File && cover_image.size > 0) {
      const validation = validateFile(cover_image, 'cover');
      if (!validation.valid) {
        return NextResponse.json(
          { success: false, message: validation.error, error: { fields: { cover_image: validation.error } } },
          { status: 400 }
        );
      }
      try {
        coverPath = await replaceFile(currentDeveloper.cover_image, cover_image, 'cover', id);
      } catch (uploadError) {
        console.error('Cover image upload error:', uploadError);
      }
    }

    // Update developer
    await query(
      `UPDATE developers SET
        name = ?,
        logo_path = ?,
        cover_image = ?,
        tagline = ?,
        description = ?,
        established_year = ?,
        headquarters = ?,
        total_projects = ?,
        completed_projects = ?,
        ongoing_projects = ?,
        awards_count = ?,
        countries_present = ?,
        is_verified = ?,
        website_url = ?,
        contact_email = ?,
        contact_phone = ?,
        contact_phone_ccode = ?,
        facebook_url = ?,
        instagram_url = ?,
        linkedin_url = ?,
        youtube_url = ?,
        updated_at = NOW()
      WHERE developer_id = ?`,
      [
        name.trim(),
        logoPath,
        coverPath,
        tagline?.trim() || null,
        description?.trim() || null,
        established_year || null,
        headquarters?.trim() || 'Dubai, UAE',
        total_projects || 0,
        completed_projects || 0,
        ongoing_projects || 0,
        awards_count || 0,
        countries_present || 1,
        is_verified === 'true' || is_verified === true,
        website_url?.trim() || null,
        contact_email?.trim() || null,
        contact_phone?.trim() || null,
        contact_phone_ccode?.trim() || null, // NEW
        facebook_url?.trim() || null,
        instagram_url?.trim() || null,
        linkedin_url?.trim() || null,
        youtube_url?.trim() || null,
        id,
      ]
    );

    // Handle Awards - Smart update (don't delete all, only manage changes)
    if (awardsDataStr) {
      try {
        const awardsData = JSON.parse(awardsDataStr);
        
        // Get existing awards
        const existingAwards = await query(
          'SELECT * FROM developer_awards WHERE developer_id = ?',
          [id]
        );
        
        // Create a map of existing awards by ID
        const existingAwardsMap = new Map();
        existingAwards.forEach(a => existingAwardsMap.set(a.award_id, a));
        
        // Track which existing award IDs are being kept
        const keptAwardIds = new Set();
        
        // Process each award in the new data
        for (let i = 0; i < awardsData.length; i++) {
          const award = awardsData[i];
          
          if (!award.award_name) continue;
          
          const awardImage = formData.get(`award_image_${i}`);
          let awardImagePath = null;
          
          if (award.award_id && existingAwardsMap.has(award.award_id)) {
            // Existing award - update it
            const existingAward = existingAwardsMap.get(award.award_id);
            keptAwardIds.add(award.award_id);
            
            // Handle image
            if (award.removeImage) {
              // User wants to remove the image
              if (existingAward.image_path) {
                deleteSingleFile(existingAward.image_path);
              }
              awardImagePath = null;
            } else if (awardImage && awardImage instanceof File && awardImage.size > 0) {
              // New image uploaded - delete old and save new
              if (existingAward.image_path) {
                deleteSingleFile(existingAward.image_path);
              }
              awardImagePath = await saveSingleFile(awardImage, 'award', id);
            } else {
              // Keep existing image
              awardImagePath = existingAward.image_path;
            }
            
            // Update existing award
            await query(
              `UPDATE developer_awards SET 
                award_name = ?, awarding_body = ?, year = ?, image_path = ?
               WHERE award_id = ?`,
              [award.award_name, award.awarding_body || null, award.year || null, awardImagePath, award.award_id]
            );
          } else {
            // New award - insert it
            if (awardImage && awardImage instanceof File && awardImage.size > 0) {
              awardImagePath = await saveSingleFile(awardImage, 'award', id);
            }
            
            await query(
              `INSERT INTO developer_awards (developer_id, award_name, awarding_body, year, image_path)
               VALUES (?, ?, ?, ?, ?)`,
              [id, award.award_name, award.awarding_body || null, award.year || null, awardImagePath]
            );
          }
        }
        
        // Delete awards that are no longer in the list
        for (const existingAward of existingAwards) {
          if (!keptAwardIds.has(existingAward.award_id)) {
            // Delete the image file
            if (existingAward.image_path) {
              deleteSingleFile(existingAward.image_path);
            }
            // Delete the award record
            await query('DELETE FROM developer_awards WHERE award_id = ?', [existingAward.award_id]);
          }
        }
        
      } catch (parseErr) {
        console.error('Awards update error:', parseErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Developer updated successfully',
      data: { developer_id: parseInt(id), logo_path: logoPath, cover_image: coverPath },
    });
  } catch (error) {
    console.error('Update developer error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update developer' },
      { status: 500 }
    );
  }
}