import prisma from "../prismaClient.js";

// ===== Create a new listing =====
export const createListing = async (req, res) => {
  try {
    const {
      landlord_id,
      lister_id,
      title,
      description,
      location_data,
      price,
      bedrooms,
      amenities,
      property_type,
      target_group,
      house_rules,
      cancellation_policy,
      status,
      images
    } = req.body;

    if (!landlord_id) {
      return res.status(400).json({ error: "landlord_id is required" });
    }

    const property = await prisma.property.create({
      data: {
        landlord_id,
        lister_id,
        title,
        description,
        location_data,
        price,
        bedrooms,
        amenities,
        property_type,
        target_group,
        house_rules,
        cancellation_policy,
        status: status || "available",
        images
      }
    });

    res.status(201).json({ message: "Property created successfully", property });
  } catch (error) {
    console.error("Listing Error:", error);
    res.status(500).json({ error: "Failed to create property listing" });
  }
};

// ===== Get all listings =====
export const getAllListings = async (req, res) => {
  try {
    const properties = await prisma.property.findMany({
      include: {
        landlord: { select: { user_id: true, username: true, email: true } },
        lister: { select: { user_id: true, username: true, email: true } }
      },
      orderBy: { created_at: "desc" }
    });
    res.status(200).json(properties);
  } catch (error) {
    console.error("Fetch Listings Error:", error);
    res.status(500).json({ error: "Failed to fetch properties" });
  }
};

// ===== Get single listing by ID =====
export const getListingById = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({
      where: { property_id: parseInt(id) },
      include: {
        landlord: { select: { user_id: true, username: true, email: true } },
        lister: { select: { user_id: true, username: true, email: true } },
        bookings: true
      }
    });

    if (!property) return res.status(404).json({ error: "Property not found" });

    res.status(200).json(property);
  } catch (error) {
    console.error("Fetch Listing Error:", error);
    res.status(500).json({ error: "Failed to fetch property" });
  }
};

// ===== Update listing =====
export const updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const property = await prisma.property.update({
      where: { property_id: parseInt(id) },
      data: updates
    });

    res.status(200).json({ message: "Property updated successfully", property });
  } catch (error) {
    console.error("Update Listing Error:", error);
    res.status(500).json({ error: "Failed to update property" });
  }
};

// ===== Delete listing =====
export const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.property.delete({
      where: { property_id: parseInt(id) }
    });

    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Delete Listing Error:", error);
    res.status(500).json({ error: "Failed to delete property" });
  }
};
