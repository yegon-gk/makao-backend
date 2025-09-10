// src/controllers/bookingController.js
import prisma from '../config/prisma.js';

export const createBooking = async (req, res) => {
  try {
    const { tenant_id, property_id, check_in, check_out, total_amount } = req.body;

    // Create booking in DB
    const booking = await prisma.booking.create({
      data: {
        tenant_id,
        property_id,
        check_in: new Date(check_in),
        check_out: new Date(check_out),
        total_amount,
        booking_status: 'pending',
        payment_status: 'unpaid'
      }
    });

    console.log("✅ Booking Created:", booking);
    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ error: 'Booking creation failed', details: error.message });
  }
};
