/**
 * Welko — AES-256-GCM encryption utility
 *
 * Encrypts sensitive patient data (names, phones, diagnoses) before storing
 * in the database. Each value gets a unique random IV so identical plaintexts
 * produce different ciphertexts.
 *
 * Env var required:
 *   ENCRYPTION_KEY=<64 hex chars = 32 bytes>
 *   Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 *
 * Wire-format:  base64(iv):base64(authTag):base64(ciphertext)
 */

import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const ALGORITHM  = 'aes-256-gcm'
const KEY_BYTES  = 32   // 256-bit key
const IV_BYTES   = 12   // 96-bit IV — recommended for GCM
const TAG_BYTES  = 16   // 128-bit authentication tag

function getKey(): Buffer {
  const raw = process.env.ENCRYPTION_KEY
  if (!raw) {
    throw new Error(
      '[Welko] ENCRYPTION_KEY is not set. ' +
      'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
    )
  }
  const key = Buffer.from(raw, 'hex')
  if (key.length !== KEY_BYTES) {
    throw new Error(
      `[Welko] ENCRYPTION_KEY must be exactly ${KEY_BYTES * 2} hex characters (${KEY_BYTES} bytes).`
    )
  }
  return key
}

/**
 * Encrypts a plaintext string.
 * @returns Wire-format string: `iv:tag:ciphertext` (all base64)
 */
export function encrypt(plaintext: string): string {
  const key    = getKey()
  const iv     = randomBytes(IV_BYTES)
  const cipher = createCipheriv(ALGORITHM, key, iv, { authTagLength: TAG_BYTES })

  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ])
  const tag = cipher.getAuthTag()

  return [
    iv.toString('base64'),
    tag.toString('base64'),
    encrypted.toString('base64'),
  ].join(':')
}

/**
 * Decrypts a value produced by `encrypt()`.
 * Throws if the ciphertext has been tampered with (GCM authentication).
 */
export function decrypt(ciphertext: string): string {
  const key   = getKey()
  const parts = ciphertext.split(':')

  if (parts.length !== 3) {
    throw new Error('[Welko] decrypt: invalid ciphertext format — expected iv:tag:data')
  }

  const [ivB64, tagB64, dataB64] = parts
  const iv        = Buffer.from(ivB64,   'base64')
  const tag       = Buffer.from(tagB64,  'base64')
  const encrypted = Buffer.from(dataB64, 'base64')

  const decipher = createDecipheriv(ALGORITHM, key, iv, { authTagLength: TAG_BYTES })
  decipher.setAuthTag(tag)

  return Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]).toString('utf8')
}

/**
 * Encrypts only if the value is not already encrypted.
 * Safe to call on already-encrypted fields (idempotent read-modify-write).
 */
export function encryptIfPlain(value: string): string {
  if (value.split(':').length === 3) return value  // already encrypted
  return encrypt(value)
}

/**
 * Returns true if the string looks like an encrypted value from this module.
 */
export function isEncrypted(value: string): boolean {
  const parts = value.split(':')
  return parts.length === 3 && parts.every((p) => {
    try { return Buffer.from(p, 'base64').length > 0 } catch { return false }
  })
}
