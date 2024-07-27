const otpStore = {} // Simple in-memory store for OTPs. Use a persistent store in production.

export const sendOtp = async (phone, otp) => {
  // Implement the logic to send OTP to the user's phone number.
  // Use services like Twilio, Nexmo, etc.
  console.log(`Sending OTP ${otp} to phone number ${phone}`)

  return `Sending OTP ${otp} to phone number ${phone}`
}

export const storeOtp = async (phone, otp) => {
  otpStore[phone] = otp
  setTimeout(() => {
    delete otpStore[phone]
  }, 300000) // OTP expires in 5 minutes
}

export const verifyOtp = async (phone, otp) => {
  if (otpStore[phone] && otpStore[phone] === otp) {
    delete otpStore[phone]

    return true
  }

  return false
}
