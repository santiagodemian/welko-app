export {}

declare global {
  interface CustomJwtSessionClaims {
    plan?: 'essential' | 'pro' | 'business'
  }
}
