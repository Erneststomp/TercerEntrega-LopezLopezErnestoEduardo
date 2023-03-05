import { Router } from "express";
import passport from "passport";
import config from "../models/config/config.js";
import jwt from 'jsonwebtoken'
import MailingService from "../service/mailing.js";
import userService from "../public/users.js";
import { createHash } from "../utils.js";

const router= Router();
router.post('/', async(req,res)=>{
    res.redirect('/logout');
})

router.post('/logout', async(req,res)=>{
    if(req.session.user){
        let sesionUser=req.session.user
        res.render('logout.handlebars',{userData:sesionUser})
        req.session.destroy()
        
    }else{
      res.send({status:'error',message:"There is no active session to close"})
    }    
})
    
router.post('/login',passport.authenticate('login',{failureRedirect:'/loginfail',failureFlash: true}) ,async(req,res)=>{
  req.session.user={
      id:req.user.id,names:req.user.names, lastname:req.user.lastnames,age:req.user.age,avatar:req.user.avatar,alias:req.user.alias
  }
  res.send({status:"success", message:"Loged In"})
  //res.redirect('/');
})
router.post('/register', passport.authenticate('register',{failureRedirect:'/registerfail',failureFlash: true}), async(req,res)=>{
  res.send({status:"success", message:"The acount was created successfully"})
  //res.redirect('/registersucced')
})


router.delete('/deleteaccount', passport.authenticate('deleteaccount',{failureRedirect:'/deleteaccountfail',failureFlash: true}), async(req,res)=>{
  res.send({status:"success", message:"The account was deleted"})
  //res.redirect('/registersucced')
})


// router.post('/recover',passport.authenticate('recover',{failureRedirect:'/recoverfail',failureFlash: true}) ,async(req,res)=>{
//    res.send({status:'success',message:"Recovery message sent"})
// })


router.post('/recover', async(req,res)=>{
  const {id}=req.body;
  const restoreURL=config.url.mainurl
  const recoveryToken=jwt.sign({id},'Nosequeponer01',{expiresIn:600})
  const mailer = new MailingService();
  let user=await userService.findOne({id:id})
  if(!user) return res.send({status:"error",error:"There is no user with this email, please verify or register"})
  let result=await mailer.sendSimpleMAil({
    from: process.env.EMAIL_ADDRESS,
    to: id, 
    subject:'Restore Pasword',
    html:`<div>
    <h1>To restore your password, please </h1>
    <p>De click en el siguiente enlace</p> 
    <a href="${restoreURL}/restore?tkn=${recoveryToken}">Reestablecer</a>
    <p>Cuando lo use en Postman, recuerde que debe enviar el token y el newPassword como parametros a la ruta /resore con un POST</p>
    <p>Su token es: </p>
    <p>${recoveryToken}</p>
    </div>`
  })
  res.send({status:'success',message:"Recovery message sent"})
})

router.put('/restore', async(req, res) => {
  try{
    let{newPassword,token}=req.body
    let {id}=jwt.verify(token,'Nosequeponer01');
    let user=await userService.findOne({id:id})
    if(!user) return res.send({status:"error",error:"Invalid Token"})
    user.password=createHash(newPassword)
    let result=await userService.findByIdAndUpdate(user._id,{$set:{password:user.password}})
    res.send({status:"success",message:'pasword changed'})
  }
  catch (error){
    if(error.expiredAt){
      res.send({status:"error",error:"token expired"})
    }else{
      console.log(error)
    }
  }   
})


export default router;  