// Stubs — integrate Stripe/M-Pesa later
exports.process = async (req, res) => {
  // Expect: { booking_id, payment_method, payment_details }
  return res.status(501).json({ message: 'Payment gateway not integrated yet' });
};

exports.webhook = async (req, res) => {
  // Verify signature, update booking/payment status
  return res.status(200).end();
};
