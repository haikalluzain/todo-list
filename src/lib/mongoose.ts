import mongoose from 'mongoose'
import config from '@config'

export default async(): Promise<any> => {
  const connection = await mongoose.connect(config.databaseURL, {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true
  })

  return connection.connection.db
} 