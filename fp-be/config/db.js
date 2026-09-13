import mongoose from 'mongoose'

export const connectDB = async () => {
    try{

        await mongoose.connect('mongodb+srv://jahangir:dHKfwPxXzdOLtNo3@cluster0.0ypdela.mongodb.net/');

         console.log("Database connected successfully")
    }catch(err){
        return console.log(err,"error while connecting with db")
    }
}