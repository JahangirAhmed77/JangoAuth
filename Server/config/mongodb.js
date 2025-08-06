import mongoose from 'mongoose'

const ConnectDB =async()=>{

    mongoose.connection.on('connected',()=> console.log("Database connected"))
  await mongoose.connect(`${process.env.MONGODB_URl}/JangoAuth`)
}

export default ConnectDB