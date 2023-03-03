import mongoose from 'mongoose'
const collection ="Users";
const userSchema=new mongoose.Schema({
    names:String,
    lastname:String,
    id:String,
    age:Number,
    avatar:String,
    Phone:String,
    adress:String,
    alias:String,
    password:String
})

const userService=mongoose.model(collection,userSchema);
export default  userService;