export {}

declare global {
  interface CustomJwtSessionClaims {
    plan?: 'scout' | 'premium'
  }
}
