import { Document, model, Schema } from 'mongoose'
import { IUser } from '@interfaces'
import { v4 } from 'uuid'

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

interface UserDocument extends IUser, Document {
  _id: string
}

const UserModel = model<UserDocument>("User", UserSchema)

export default UserModel;
