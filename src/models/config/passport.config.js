import passport from "passport";
import local from 'passport-local';
import userService from "../../public/users.js";
import { createHash } from "../../utils.js";
import { validatePassword } from "../../utils.js";
import {cartsController} from '../../controllers/carts.controller.js'
import MailingService from "../../service/mailing.js";

const localStrategy=local.Strategy;

const initializePassport=()=>{
    
    passport.use('register',new localStrategy({passReqToCallback:true,usernameField:'id'},
    async(req,id,password,done)=>{
        try{
            const {names,lastname,age,avatar,alias,phone,adress,CountryCode}=req.body
            let Phone= CountryCode+phone;
            if(!names||!id||!lastname||!age||!avatar||!alias||!Phone||!adress)return done(null, false, {message:"All fields are needed"})
            const exist =await userService.findOne({id:id})
            if(exist) return done(null,false,{message:"User already exist"})
            const newUSer={
                id,names,lastname,age,avatar,alias,Phone,adress,
                password:createHash(password)
            } 
            let result=await userService.create(newUSer)
            let newcart=await cartsController.addNewCartPersonal(req, id)

            // const mailer = new MailingService();
            // let resultEmail=await mailer.sendSimpleMAil({
            //     from: process.env.EMAIL_ADDRESS,
            //     to: id,
            //     subject:'Register confirmation',
            //     html:`<div>
            //     <h1>The user has been registered </h1>
            //     <p>${id}</p>
            //     </div>`
            // })


            return done(null,result)
        }
        catch(error){
            done(error)
        }
    })) 

    passport.use('login',new localStrategy({usernameField:'id'},
    async(id,password,done)=>{
        try{
            if(!id||!password)return done(null, false, {message:"All fields are needed"})
            const user =await userService.findOne({id:id})
            if(!user) return done(null, false,{message:"There is no user with this email, please verify or register"})
            if(!validatePassword(user,password)) return done(null,false,{message:'Incorrect Password'})
            return done(null,user)
        }
        catch(error){
            done(error)
        }
    }))


    
    passport.use('deleteaccount',new localStrategy({usernameField:'id'},
    async(id,password,done)=>{
        try{
            if(!id||!password)return done(null, false, {message:"All fields are needed"})
            const user =await userService.findOne({id:id})
            if(!user) return done(null, false,{message:"There is no user with this email"})
            if(!validatePassword(user,password)) return done(null,false,{message:'Incorrect Password'})
            let result=await userService.deleteOne(user)
            let newcart = await cartsController.deletePersonalCartById(id);
            return done(null,user)
        }
        catch(error){
            done(error)
        }
    }))


    passport.serializeUser((user,done)=>{
        done(null,user._id)
    })
    passport.deserializeUser(async(id,done)=>{
        let result=await userService.findOne({_id:id})
        return done(null,result)
    })
}

export default initializePassport