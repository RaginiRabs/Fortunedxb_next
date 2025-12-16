import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { saveSingleFile, validateFile } from '@/lib/fileUpload';

// GET - List all developers with awards count
export async function GET() {
  try {
    const developers = await query(`
      SELECT 
        d.developer_id,
        d.name,
        d.logo_path,
        d.cover_image,
        d.tagline,
        d.description,
        d.established_year,
        d.headquarters,
        d.total_projects,
        d.completed_projects,
        d.ongoing_projects,
        d.awards_count,
        d.countries_present,
        d.is_verified,
        d.website_url,
        d.contact_email,
        d.contact_phone,
        d.contact_phone_ccode,
        d.facebook_url,
        d.instagram_url,
        d.linkedin_url,
        d.youtube_url,
        d.created_at,
        d.updated_at,
        (SELECT COUNT(*) FROM developer_awards WHERE developer_id = d.developer_id) as awards_added
      FROM developers d
      ORDER BY d.created_at DESC
    `);

    return NextResponse.json({
      success: true,
      data: developers,
    });
  } catch (error) {
    console.error('Get developers error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch developers' },
      { status: 500 }
    );
  }
}

// POST - Create new developer with awards
export async function POST(request) {
  try {
    const formData = await request.formData();

    // Get all fields
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

    // Awards data
    const awardsDataStr = formData.get('awards_data');

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: 'Developer name is required',
          error: { fields: { name: 'Developer name is required' } },
        },
        { status: 400 }
      );
    }

    if (name.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: 'Name must be at least 2 characters',
          error: { fields: { name: 'Name must be at least 2 characters' } },
        },
        { status: 400 }
      );
    }

    // Check duplicate name
    const existing = await query('SELECT developer_id FROM developers WHERE name = ?', [
      name.trim(),
    ]);

    if (existing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Developer with this name already exists',
          error: { fields: { name: 'Developer with this name already exists' } },
        },
        { status: 400 }
      );
    }

    // Validate logo
    if (logo && logo instanceof File && logo.size > 0) {
      const validation = validateFile(logo, 'logo');
      if (!validation.valid) {
        return NextResponse.json(
          { success: false, message: validation.error, error: { fields: { logo: validation.error } } },
          { status: 400 }
        );
      }
    }

    // Validate cover
    if (cover_image && cover_image instanceof File && cover_image.size > 0) {
      const validation = validateFile(cover_image, 'cover');
      if (!validation.valid) {
        return NextResponse.json(
          { success: false, message: validation.error, error: { fields: { cover_image: validation.error } } },
          { status: 400 }
        );
      }
    }

    // Insert developer
    const result = await query(
      `INSERT INTO developers (
        name, tagline, description, established_year, headquarters,
        total_projects, completed_projects, ongoing_projects, awards_count, countries_present,
        is_verified, website_url, contact_email, contact_phone, contact_phone_ccode,
        facebook_url, instagram_url, linkedin_url, youtube_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
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
      ]
    );

    const developerId = result.insertId;
    let logoPath = null;
    let coverPath = null;

    // Save logo
    if (logo && logo instanceof File && logo.size > 0) {
      try {
        logoPath = await saveSingleFile(logo, 'logo', developerId);
        await query('UPDATE developers SET logo_path = ? WHERE developer_id = ?', [logoPath, developerId]);
      } catch (uploadError) {
        console.error('Logo upload error:', uploadError);
      }
    }

    // Save cover image
    if (cover_image && cover_image instanceof File && cover_image.size > 0) {
      try {
        coverPath = await saveSingleFile(cover_image, 'cover', developerId);
        await query('UPDATE developers SET cover_image = ? WHERE developer_id = ?', [coverPath, developerId]);
      } catch (uploadError) {
        console.error('Cover image upload error:', uploadError);
      }
    }

    // Handle Awards
    if (awardsDataStr) {
      try {
        const awardsData = JSON.parse(awardsDataStr);

        for (let i = 0; i < awardsData.length; i++) {
          const award = awardsData[i];

          if (award.award_name) {
            let awardImagePath = null;
            const awardImage = formData.get(`award_image_${i}`);

            if (awardImage && awardImage instanceof File && awardImage.size > 0) {
              try {
                awardImagePath = await saveSingleFile(awardImage, 'award', developerId);
              } catch (err) {
                console.error('Award image upload error:', err);
              }
            }

            await query(
              `INSERT INTO developer_awards (developer_id, award_name, awarding_body, year, image_path)
               VALUES (?, ?, ?, ?, ?)`,
              [developerId, award.award_name, award.awarding_body || null, award.year || null, awardImagePath]
            );
          }
        }
      } catch (parseErr) {
        console.error('Awards parsing error:', parseErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Developer created successfully',
      data: { developer_id: developerId, logo_path: logoPath, cover_image: coverPath },
    });
  } catch (error) {
    console.error('Create developer error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create developer' },
      { status: 500 }
    );
  }
}