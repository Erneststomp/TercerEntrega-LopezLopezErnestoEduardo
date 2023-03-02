import { Router } from "express";
import passport from "passport";
import config from "../config.js";
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
        res.redirect('/login');
    }    
})

router.post('/login', passport.authenticate('login', {
    failureRedirect: '/loginfail',
    failureFlash: true 
  }), async(req, res) => {
    req.session.user = {
      id: req.user.id,
      names: req.user.names,
      lastname: req.user.lastnames,
      age: req.user.age,
      avatar: req.user.avatar,
      alias: req.user.alias
    }
    res.redirect('/');
  });

router.post('/register', passport.authenticate('register', {
    failureRedirect: '/registerfail',
    failureFlash: true 
  }), async(req, res) => {
    console.log('entro al envio del correo')
    const {id}=req.body;
    const mailer = new MailingService();
    let result=await mailer.sendSimpleMAil({
      from: process.env.EMAIL_ADDRESS,
      to: id,
      subject:'Regsitration',
      html:`<div>
      <h1>The user has been registered </h1>
      <p>${id}</p>
      
      </div>`
    })
    res.send({status:'success',message:"The user has been registered"})
  });


router.post('/recover', async(req,res)=>{
  const {email}=req.body;
  const restoreURL=config.url.mainurl
  const recoveryToken=jwt.sign({email},'Nosequeponer01',{expiresIn:600})
  const mailer = new MailingService();
  let user=await userService.findOne({id:email})
  if(!user) return res.send({status:"error",error:"There is no user with this email, please verify or register"})
  let result=await mailer.sendSimpleMAil({
    from: process.env.EMAIL_ADDRESS,
    to: email, 
    subject:'Restore Pasword',
    html:`<div>
    <h1>To restore your password, please </h1>
    <p>De click en el siguiente enlace</p>
    <a href="${restoreURL}/restore?tkn=${recoveryToken}">Reestablecer</a>
    </div>`
  })
  res.send({status:'success',message:"Recovery message sent"})
})

router.put('/restore', async(req, res) => {
  console.log(req.body)
  try{
    let{newPassword,token}=req.body
    let {email}=jwt.verify(token,'Nosequeponer01');
    let user=await userService.findOne({id:email})
    if(!user) return res.send({status:"error",error:"There is no user with this email, please verify or register"})
    user.password=createHash(newPassword)
    let result=await userService.findByIdAndUpdate(user._id,{$set:{password:user.password}})
    res.send({status:"success",message:'pasword changed'})
  }
  catch (error){
    if(error.expiredAt){
      res.send({status:"error",error:"el token expiro"})
    }else{
      console.log(error)
    }
  }     
})


export default router;  