const prisma = require('../config/prisma');

// GET /api/properties/featured
exports.getFeatured = async (_req, res) => {
  const properties = await prisma.property.findMany({
    where: { status: 'available' },
    orderBy: { created_at: 'desc' },
    take: 12,
    select: {
      property_id: true,
      title: true,
      description: true,
      price: true,
      bedrooms: true,
      images: true,
      location_data: true,
      created_at: true,
    },
  });

  res.json({ properties });
};

// GET /api/properties/suggestions
exports.getSuggestions = async (_req, res) => {
  // Simple placeholder: show latest areas from recent properties
  const suggestions = await prisma.property.findMany({
    orderBy: { created_at: 'desc' },
    take: 8,
    select: {
      property_id: true,
      title: true,
      location_data: true,
    },
  });

  res.json({ suggestions });
};

// POST /api/properties/search
exports.search = async (req, res) => {
  const {
    q,                   // free text
    minPrice,
    maxPrice,
    bedrooms,            // minimum bedrooms
    property_type,
    target_group,
    status,              // available/occupied
    page = 1,
    pageSize = 20,
    orderBy = 'created_at', // created_at | price | bedrooms
    order = 'desc',         // asc | desc
  } = req.body || {};

  const where = {
    ...(status ? { status } : { status: 'available' }),
    ...(property_type ? { property_type } : {}),
    ...(target_group ? { target_group } : {}),
    ...(typeof bedrooms === 'number' ? { bedrooms: { gte: bedrooms } } : {}),
    ...(minPrice || maxPrice
      ? { price: { gte: minPrice ?? 0, lte: maxPrice ?? 999999999 } }
      : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  const [total_count, properties] = await Promise.all([
    prisma.property.count({ where }),
    prisma.property.findMany({
      where,
      orderBy: { [orderBy]: order },
      skip,
      take,
      select: {
        property_id: true,
        title: true,
        description: true,
        price: true,
        bedrooms: true,
        images: true,
        location_data: true,
        status: true,
        created_at: true,
      },
    }),
  ]);

  res.json({ properties, total_count, filters_applied: where, page, pageSize });
};

// GET /api/properties/:id
exports.getById = async (req, res) => {
  const id = Number(req.params.id);

  const property = await prisma.property.findUnique({
    where: { property_id: id },
    select: {
      property_id: true,
      title: true,
      description: true,
      location_data: true,
      price: true,
      bedrooms: true,
      amenities: true,
      property_type: true,
      target_group: true,
      house_rules: true,
      cancellation_policy: true,
      status: true,
      images: true,
      created_at: true,
      landlord: { select: { user_id: true, email: true, role: true } },
      lister: { select: { user_id: true, email: true, role: true } },
    },
  });

  if (!property) return res.status(404).json({ message: 'Property not found' });

  const queue_count = await prisma.queue.count({
    where: { property_id: id, status: 'active' },
  });

  res.json({
    property_data: property,
    availability: property.status,
    queue_count,
    booking_options: { instant_book: false }, // placeholder
  });
};

// POST /api/properties/  (Lister/Landlord/Admin)
exports.create = async (req, res) => {
  const {
    title,
    description,
    location_data = {},
    price,
    bedrooms = 1,
    amenities = {},
    property_type = 'apartment',
    target_group = 'any',
    house_rules = '',
    cancellation_policy = '',
    images = [],
  } = req.body || {};

  if (!title || !description || !price) {
    return res.status(400).json({ message: 'title, description, price required' });
  }

  // lister_id: from token; if landlord posts directly, set both
  const userId = req.user.user_id;

  const property = await prisma.property.create({
    data: {
      title,
      description,
      location_data,
      price: Number(price),
      bedrooms: Number(bedrooms),
      amenities,
      property_type,
      target_group,
      house_rules,
      cancellation_policy,
      images,
      status: 'available',
      lister_id: userId,
      landlord_id: userId, // adjust if you separate lister vs landlord ownership
    },
  });

  res.status(201).json({ property });
};
