import bcrypt from 'bcrypt'

const saltRounds = 10

/**
 * Generate hash from sting
 * @param text {string}
 * @return string
 */
export const generateHash = (text: string) => {
  return new Promise((resolve, reject) =>
    bcrypt.hash(text, saltRounds, (err, hash) => {
      if (err) return reject(err)
      return resolve(hash)
    })
  ) as Promise<string>
}

/**
 * Compare the actual password text with the hashed password
 * @param text {string}
 * @param hash {string}
 */
export const compareHash = (text: string, hash: string) => {
  return bcrypt.compare(text, hash)
}
