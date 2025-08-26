const prisma = require('../config/prisma');

// POST /api/bookings/create
exports.create = async (req, res) => {
  const { property_id, check_in, check_out } = req.body || {};
  const tenant_id = req.user.user_id;

  if (!property_id || !check_in || !check_out) {
    return res.status(400).json({ message: 'property_id, check_in, check_out required' });
  }

  const start = new Date(check_in);
  const end = new Date(check_out);
  if (!(start < end)) {
    return res.status(400).json({ message: 'check_in must be before check_out' });
  }

  // atomic transaction: ensure property exists & no overlapping confirmed bookings
  const result = await prisma.$transaction(async (tx) => {
    const property = await tx.property.findUnique({
      where: { property_id: Number(property_id) },
      select: { property_id: true, price: true, status: true },
    });
    if (!property) throw new Error('Property not found');

    // Overlap check (confirmed bookings only)
    const overlap = await tx.booking.findFirst({
      where: {
        property_id: property.property_id,
        booking_status: 'confirmed',
        OR: [
          { AND: [{ check_in: { lte: start } }, { check_out: { gt: start } }] },
          { AND: [{ check_in: { lt: end } }, { check_out: { gte: end } }] },
          { AND: [{ check_in: { gte: start } }, { check_out: { lte: end } }] },
        ],
      },
      select: { booking_id: true },
    });
    if (overlap) throw new Error('Property not available for selected dates');

    // Simple pricing (nights * price)
    const nights = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    const total_amount = Number(property.price) * nights;

    const booking = await tx.booking.create({
      data: {
        tenant_id,
        property_id: property.property_id,
        check_in: start,
        check_out: end,
        total_amount,
        booking_status: 'pending',
        payment_status: 'unpaid',
      },
    });

    return booking;
  });

  // 15-min soft expiry (client-side info; you can persist via a column or Redis)
  const expires_at = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  res.status(201).json({
    booking_id: result.booking_id,
    total_amount: result.total_amount,
    expires_at,
    payment_session: { provider: 'stub', status: 'pending' },
  });
};

// GET /api/bookings/:id
exports.getById = async (req, res) => {
  const id = Number(req.params.id);
  const booking = await prisma.booking.findUnique({
    where: { booking_id: id },
    include: {
      property: { select: { title: true, price: true, images: true } },
      tenant: { select: { user_id: true, email: true } },
    },
  });

  if (!booking) return res.status(404).json({ message: 'Booking not found' });

  res.json({ booking });
};
