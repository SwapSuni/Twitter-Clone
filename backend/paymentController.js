import { instance } from "./index.js";
import crypto from 'crypto'

export const checkout = async (req, res) => {
  const options = {
    amount: Number(req.body.amount * 100),
    currency: "INR",
  };

  const order = await instance.orders.create(options);

  res.status(200).json({
    success: true,
    order,
  });
};

export const paymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // res.redirect(
    //   `http://localhost:3000/home/more`
    // );
    return res.status(400).json({
      success: true,
      reference: razorpay_payment_id,
    })
  } 
  else {
    res.status(400).json({
      success: false,
    });
  }
};  