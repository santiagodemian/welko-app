export {}

declare global {
  interface CustomJwtSessionClaims {
    plan?: 'starter' | 'essential' | 'pro' | 'business'
  }
}
