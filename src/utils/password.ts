import bcrypt from 'bcrypt'

const saltRounds = 10

export const generateHash = (text: string) => {
  return new Promise((resolve, reject) =>
    bcrypt.hash(text, saltRounds, (err, hash) => {
      if (err) return reject(err)
      return resolve(hash)
    })
  ) as Promise<string>
}

export const compareHash = (text: string, hash: string) => {
  return bcrypt.compare(text, hash)
}
