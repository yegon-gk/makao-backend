// src/controllers/bookingController.js
import prisma from "../prismaClient.js";

export const createBooking = async (req, res) => {
  try {
    const { tenant_id, property_id, check_in, check_out, total_amount } = req.body;

    const booking = await prisma.booking.create({
      data: {
        tenant_id,
        property_id,
        check_in: new Date(check_in),
        check_out: new Date(check_out),
        total_amount,
        booking_status: "pending",
        payment_status: "unpaid",
      },
    });

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ error: "Booking creation failed" });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const booking = await prisma.booking.update({
      where: { booking_id: parseInt(id) },
      data: updates,
    });

    res.json({ message: "Booking updated successfully", booking });
  } catch (error) {
    console.error("Update Booking Error:", error);
    res.status(500).json({ error: "Booking update failed" });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.booking.delete({ where: { booking_id: parseInt(id) } });

    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Delete Booking Error:", error);
    res.status(500).json({ error: "Booking deletion failed" });
  }
};
