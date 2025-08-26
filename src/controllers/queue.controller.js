const prisma = require('../config/prisma');

// POST /api/queue/join
exports.join = async (req, res) => {
  const { property_id } = req.body || {};
  const tenant_id = req.user.user_id;

  if (!property_id) return res.status(400).json({ message: 'property_id required' });

  const already = await prisma.queue.findFirst({
    where: { property_id: Number(property_id), tenant_id, status: 'active' },
  });
  if (already) {
    return res.json({ message: 'Already in queue', position: already.position });
  }

  const position = await prisma.queue.count({
    where: { property_id: Number(property_id), status: 'active' },
  });

  const entry = await prisma.queue.create({
    data: {
      property_id: Number(property_id),
      tenant_id,
      position: position + 1,
      status: 'active',
    },
  });

  res.status(201).json({
    message: 'Joined queue',
    position: entry.position,
  });
};
