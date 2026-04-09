type OTPRecord = {
  otp: string
  expiresAt: number
  type: "email" | "mobile"
}

// 🔥 GLOBAL STORE
const globalAny = global as any

if (!globalAny.otpStore) {
  globalAny.otpStore = new Map<string, OTPRecord>()
}

const otpStore: Map<string, OTPRecord> = globalAny.otpStore

// 🔥 KEY BUILDER (BEST PRACTICE)
const buildKey = (value: string, type: "email" | "mobile") => {
  return `${type}:${value}`
}

// ✅ SET OTP
export const setOtp = (
  value: string,
  otp: string,
  type: "email" | "mobile"
) => {
  const key = buildKey(value, type)

  otpStore.set(key, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
    type,
  })
}

// ✅ GET OTP
export const getOtp = (
  value: string,
  type: "email" | "mobile"
) => {
  const key = buildKey(value, type)

  const record = otpStore.get(key)

  if (!record) return null

  if (Date.now() > record.expiresAt) {
    otpStore.delete(key)
    return null
  }

  return record
}

// ✅ DELETE OTP
export const deleteOtp = (
  value: string,
  type: "email" | "mobile"
) => {
  const key = buildKey(value, type)
  otpStore.delete(key)
}

// 🔥 AUTO CLEAN (every 1 min)
setInterval(() => {
  const now = Date.now()

  for (const [key, record] of otpStore.entries()) {
    if (now > record.expiresAt) {
      otpStore.delete(key)
    }
  }
}, 60 * 1000)