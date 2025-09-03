// src/controllers/propertyController.js
import prisma from '../prismaClient.js';

// ===== GET FEATURED PROPERTIES =====
export async function getFeatured(req, res) {
  try {
    const properties = await prisma.property.findMany({
      where: { status: 'available' },
      orderBy: { created_at: 'desc' },
      take: 10,
      select: {
        property_id: true,
        title: true,
        description: true,
        price: true,
        bedrooms: true,
        status: true,
        location_data: true,
        images: true,
      },
    });

    return res.status(200).json({
      message: 'Featured properties fetched successfully',
      count: properties.length,
      properties,
    });
  } catch (error) {
    console.error('getFeatured error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// ===== GET ALL PROPERTIES =====
export async function getProperties(req, res) {
  try {
    const properties = await prisma.property.findMany();
    return res.status(200).json(properties);
  } catch (error) {
    console.error('getProperties error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// ===== GET SEARCH SUGGESTIONS =====
export async function getSuggestions(req, res) {
  try {
    const properties = await prisma.property.findMany({
      where: { status: 'available' },
      select: { location_data: true },
      take: 50,
    });

    const suggestions = Array.from(
      new Set(
        properties
          .map((p) => {
            if (p.location_data && typeof p.location_data === 'object') {
              return p.location_data.city || p.location_data.area || null;
            }
            return null;
          })
          .filter(Boolean)
      )
    ).slice(0, 10);

    return res.status(200).json({
      message: 'Search suggestions fetched successfully',
      suggestions,
    });
  } catch (error) {
    console.error('getSuggestions error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// ===== SEARCH PROPERTIES =====
export async function search(req, res) {
  try {
    const { location, min_price, max_price, bedrooms, target_group, amenities } = req.body;

    const filters = { status: 'available' };

    if (location) {
      filters.location_data = { path: ['city'], equals: location };
    }
    if (bedrooms) filters.bedrooms = Number(bedrooms);
    if (target_group) filters.target_group = target_group;
    if (min_price || max_price) {
      filters.price = {};
      if (min_price) filters.price.gte = Number(min_price);
      if (max_price) filters.price.lte = Number(max_price);
    }
    if (amenities && Array.isArray(amenities) && amenities.length > 0) {
      filters.amenities = { hasEvery: amenities };
    }

    const properties = await prisma.property.findMany({
      where: filters,
      select: {
        property_id: true,
        title: true,
        description: true,
        price: true,
        bedrooms: true,
        status: true,
        location_data: true,
        images: true,
        amenities: true,
      },
    });

    return res.status(200).json({
      message: 'Properties fetched successfully',
      total_count: properties.length,
      properties,
    });
  } catch (error) {
    console.error('search error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// ===== GET PROPERTY DETAIL =====
export async function getById(req, res) {
  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({
      where: { property_id: Number(id) },
      include: {
        landlord: { select: { user_id: true, username: true, email: true, phone: true } },
        lister: { select: { user_id: true, username: true } },
        bookings: {
          select: { booking_id: true, check_in: true, check_out: true, booking_status: true },
        },
      },
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    return res.status(200).json({
      message: 'Property detail fetched successfully',
      property,
    });
  } catch (error) {
    console.error('getById error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// ===== CREATE PROPERTY =====
export async function createProperty(req, res) {
  try {
    const {
      title,
      description,
      price,
      bedrooms,
      location_data,
      amenities,
      property_type,
      target_group,
      images,
    } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!price || isNaN(Number(price))) {
      return res.status(400).json({ message: "Valid price is required" });
    }
    if (!bedrooms || isNaN(Number(bedrooms))) {
      return res.status(400).json({ message: "Valid bedrooms count is required" });
    }

    const landlordId = req.user?.user_id;
    if (!landlordId) {
      return res.status(401).json({ message: "User ID not found in token" });
    }

    const property = await prisma.property.create({
      data: {
        title,
        description: description || "",
        price: Number(price),
        bedrooms: Number(bedrooms),
        location_data: location_data || "",
        amenities: amenities || "",
        property_type: property_type || "",
        target_group: target_group || "",
        images: images || "",
        landlord_id: landlordId,
        lister_id: landlordId,
      },
    });

    return res.status(201).json({
      message: 'Property created successfully',
      property,
    });
  } catch (error) {
    console.error('createProperty error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// ===== UPDATE PROPERTY =====
export async function updateProperty(req, res) {
  try {
    const { id } = req.params;

    const existing = await prisma.property.findUnique({
      where: { property_id: Number(id) },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (req.user.role !== 'admin' && existing.landlord_id !== req.user.user_id) {
      return res.status(403).json({ message: 'Not authorized to update this property' });
    }

    const updated = await prisma.property.update({
      where: { property_id: Number(id) },
      data: req.body,
    });

    return res.status(200).json({
      message: 'Property updated successfully',
      property: updated,
    });
  } catch (error) {
    console.error('updateProperty error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// ===== DELETE PROPERTY =====
export async function deleteProperty(req, res) {
  try {
    const { id } = req.params;

    const existing = await prisma.property.findUnique({
      where: { property_id: Number(id) },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }

    await prisma.property.delete({
      where: { property_id: Number(id) },
    });

    return res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('deleteProperty error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}
