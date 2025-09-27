// src/controllers/searchController.js
import prisma from "../prismaClient.js";

export const searchProperties = async (req, res) => {
  try {
    const { location, price_range, bedrooms, amenities, target_group, page = 1, limit = 10 } = req.body;

    const filters = {
      status: "available",
      ...(location && { location_data: { path: "$.city", equals: location } }),
      ...(price_range && { price: { gte: price_range.min, lte: price_range.max } }),
      ...(bedrooms && { bedrooms: bedrooms }),
      ...(target_group && { target_group: target_group }),
    };

    const skip = (page - 1) * limit;

    const properties = await prisma.property.findMany({
      where: filters,
      skip,
      take: limit,
    });

    const totalCount = await prisma.property.count({ where: filters });

    res.json({ properties, total_count: totalCount, filters_applied: filters });
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ error: "Search failed" });
  }
};
