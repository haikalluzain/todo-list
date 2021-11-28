import { Document, Model, model, Schema } from 'mongoose'
import { IUser } from '@interfaces'
import { v4 } from 'uuid'
import { compareHash } from '@utils/password'

const UserSchema = new Schema(
  {
    _id: {
      type: String,
      default: function genUUID() {
        return v4()
      },
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      select: false
    }
  },
  { timestamps: {} }
)
interface IUserDocument extends IUser, Document {
  _id: string
  isPasswordMatch: (password: string) => Promise<boolean>
}

interface IUserModel extends Model<IUserDocument> {
  isEmailTaken: (email: string, excludeId?: string) => Promise<boolean>
}

/**
 * Check if the password match
 * @param password 
 * @returns {Promise<boolean>}
 */
UserSchema.methods.isPasswordMatch = async function (this: IUserDocument, password: string): Promise<boolean> {
  const user = this
  return await compareHash(password, user.password)
}

/**
 * Check if email is already registered
 * @param {string} email 
 * @param {string} excludeId 
 * @returns {Promise<boolean>}
 */
 UserSchema.statics.isEmailTaken = async function (this: IUserModel, email: string, excludeId?: string): Promise<boolean> {
  const user = await this.findOne({ email, _id: { $ne: excludeId } })
  return !!user
}

const UserModel = model<IUserDocument, IUser & IUserModel>("User", UserSchema)

export default UserModel;
