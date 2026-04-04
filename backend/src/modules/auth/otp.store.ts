type OTPRecord = {
  otp: string
  expiresAt: number
}

// 🔥 GLOBAL FIX (IMPORTANT)
const globalAny = global as any

if (!globalAny.otpStore) {
  globalAny.otpStore = new Map<string, OTPRecord>()
}

const otpStore = globalAny.otpStore

export const setOtp = (mobile: string, otp: string) => {
  otpStore.set(mobile, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
  })
}

export const getOtp = (mobile: string) => {
  const record = otpStore.get(mobile)

  if (!record) return null

  if (Date.now() > record.expiresAt) {
    otpStore.delete(mobile)
    return null
  }

  return record
}

export const deleteOtp = (mobile: string) => {
  otpStore.delete(mobile)
}