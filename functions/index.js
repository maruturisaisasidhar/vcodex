// functions/index.js

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();
const db = admin.firestore();

const mailTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: functions.config().gmail.email,
    pass: functions.config().gmail.password,
  },
});

/**
 * This is the backend function for sending the OTP.
 */
// ✅ FINAL FIX: The unused '_context' variable has been completely removed.
exports.sendVerificationOtp = functions.https.onCall(async (data) => {
  const email = data.email;
  if (!email) {
    throw new functions.https.HttpsError("invalid-argument", "Email is required.");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = admin.firestore.Timestamp.now().toMillis() + 10 * 60 * 1000;

  await db.collection("otp_requests").doc(email).set({ otp, expiresAt });

  const mailOptions = {
    from: `"V-CodeX" <${functions.config().gmail.email}>`,
    to: email,
    subject: "Your V-CodeX Verification Code",
    text: `Your verification code is: ${otp}. It will expire in 10 minutes.`,
  };

  await mailTransport.sendMail(mailOptions);
  return { success: true, message: `Verification code sent to ${email}` };
});

/**
 * This is the backend function for verifying the OTP.
 */
// ✅ FINAL FIX: The unused '_context' variable has been completely removed.
exports.verifyOtp = functions.https.onCall(async (data) => {
  const { email, otp } = data;
  if (!email || !otp) {
    throw new functions.https.HttpsError("invalid-argument", "Email and OTP are required.");
  }

  const otpRef = db.collection("otp_requests").doc(email);
  const otpDoc = await otpRef.get();

  if (!otpDoc.exists) {
    throw new functions.https.HttpsError("not-found", "No OTP request found for this email.");
  }

  const { otp: correctOtp, expiresAt } = otpDoc.data();

  if (admin.firestore.Timestamp.now().toMillis() > expiresAt) {
    await otpRef.delete();
    throw new functions.https.HttpsError("deadline-exceeded", "The OTP has expired.");
  }

  if (correctOtp !== otp) {
    throw new functions.https.HttpsError("permission-denied", "The OTP is incorrect.");
  }

  await otpRef.delete();
  return { success: true, message: "Email verified successfully." };
});