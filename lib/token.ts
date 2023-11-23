import config from '../config'
import jwt from 'jsonwebtoken'

export const generateToken = (data: any) => {
  const token = jwt.sign(data, config.jwtSecret, { 
    // algorithm: 'RS256'
    expiresIn: '1d'
  })
  return token
}