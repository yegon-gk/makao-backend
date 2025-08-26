const prisma = require('../config/prisma');

// POST /api/issues/report
exports.report = async (req, res) => {
  const { property_id, issue_type, description } = req.body || {};
  const tenant_id = req.user.user_id;

  if (!property_id || !issue_type || !description) {
    return res.status(400).json({ message: 'property_id, issue_type, description required' });
  }

  // naive mapping: landlord_id from property
  const prop = await prisma.property.findUnique({
    where: { property_id: Number(property_id) },
    select: { landlord_id: true },
  });
  if (!prop) return res.status(404).json({ message: 'Property not found' });

  const issue = await prisma.issue.create({
    data: {
      tenant_id,
      property_id: Number(property_id),
      landlord_id: prop.landlord_id,
      issue_type,
      description,
      status: 'open',
    },
  });

  res.status(201).json({ issue_id: issue.issue_id, status: issue.status });
};
