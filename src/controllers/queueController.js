// src/controllers/queueController.js
import prisma from "../prismaClient.js";

export const joinQueue = async (req, res) => {
  try {
    const { tenant_id, property_id } = req.body;

    const position = await prisma.queue.count({ where: { property_id } }) + 1;

    const queueEntry = await prisma.queue.create({
      data: {
        tenant_id,
        property_id,
        position,
      },
    });

    res.status(201).json({ message: "Joined queue successfully", queueEntry });
  } catch (error) {
    console.error("Queue Error:", error);
    res.status(500).json({ error: "Queue join failed" });
  }
};

export const leaveQueue = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.queue.delete({ where: { queue_id: parseInt(id) } });

    res.json({ message: "Left queue successfully" });
  } catch (error) {
    console.error("Leave Queue Error:", error);
    res.status(500).json({ error: "Leave queue failed" });
  }
};
