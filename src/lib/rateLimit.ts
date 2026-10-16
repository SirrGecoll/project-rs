type RateLimitStore = {
  count: number
  resetTime: number
}

const tracker = new Map<string, RateLimitStore>()

export function rateLimit(ip: string, limit = 5, windowMs = 60 * 1000) {
  const now = Date.now()
  const userStore = tracker.get(ip)

  // Kalau IP belum terdaftar atau window time udah lewat, reset count
  if (!userStore || now > userStore.resetTime) {
    tracker.set(ip, {
      count: 1,
      resetTime: now + windowMs
    })
    return { success: true }
  }

  // Jika masih di dalam window time tapi melebihi limit
  if (userStore.count >= limit) {
    return { success: false }
  }

  // Tambah hit count
  userStore.count += 1
  return { success: true }
}