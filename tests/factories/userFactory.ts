import { generateToken } from './../../src/lib/token';
import { generateHash } from '../../src/utils/password';
import { IUser } from '../../src/interfaces';
import UserModel from '../../src/models/User';
import faker from 'faker'


// export const createUser = async (num = 1) => {
//   let users: IUser[]
//   for (let i = 0; i < num; i++) {
//     let password = await generateHash('12345678')

//     users.push({
//       name: faker.name.findName(),
//       email: faker.internet.email(),
//       password 
//     })
//   }

//   return num === 1 ? users[0] : users
// }

export const createUser = async (payload: IUser = null) => {
  if (!payload) {
    let password = await generateHash('12345678')
    payload = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password
    }
  } else {
    payload.password = await generateHash(payload.password)
  }

  return await UserModel.create(payload) as IUser
}

export const getAuth = async (user: IUser) => {
  return generateToken({ _id: user._id, name: user.name })
}