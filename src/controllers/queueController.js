import prisma from '../prismaClient.js';  


export const joinQueue = async (req, res) => {
  try {
    const { tenant_id, property_id } = req.body;

    if (!tenant_id || !property_id) {
      return res.status(400).json({ message: "tenant_id and property_id required" });
    }

    // Count current queue to assign position
    const count = await prisma.queue.count({
      where: { property_id: Number(property_id), status: "active" }
    });

    const queue = await prisma.queue.create({
      data: {
        tenant_id: Number(tenant_id),
        property_id: Number(property_id),
        position: count + 1
      }
    });

    console.log("New Queue Entry:", queue);
    res.status(201).json({ message: "Added to queue successfully", queue });
  } catch (error) {
    console.error("Queue Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
