import { Router } from "express";
import {productDAO} from '../dao/product/index.js'
import {chatDAO} from '../dao/chat/index.js'

const router= Router(); 

router.get('/', async(req,res)=>{
  if(req.session.user){
      let sesionUser=req.session.user
      let characters =  await productDAO.getAll()
      let characterData = characters.map(char => {
          return {
              name: char.name,
              thumbnail: char.thumbnail,
              price: char.price,
              stock: char.stock,
              description: char.description
          }
      })
      res.render('home.handlebars',{userData:sesionUser, characters:characterData})
  }else{
      res.redirect('/login');
  }
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

router.get('/api/productos-test', async(req,res)=>{
    res.render('hometable.handlebars')
}) 

router.get('/login', async(req,res)=>{
    if(req.session.user){
    res.redirect('/');}
    else{
    res.render('login.handlebars')
  }
})


router.get('/loginfail', async(req, res) => {
  const errorMessage = req.flash('error')[0]; 
  res.send({status:"error",error:errorMessage})
  // res.render('loginfail.handlebars', { errorMessage });
});

router.get('/register', async(req,res)=>{
  if(req.session.user){
    res.redirect('/');}
  else{
    res.render('register.handlebars')
  }
})

router.get('/registerfail', async(req, res) => {
  const errorMessage = req.flash('error')[0];
  // res.render('registerfail.handlebars', { errorMessage });
  res.send({status:"error",error:errorMessage})
  
});
router.get('/recoverfail', async(req,res)=>{
  const errorMessage = req.flash('error')[0];
  res.send({status:"error",error:errorMessage})
})
const infodelProceso = {
    // [-] Argumentos de entrada  
    args: process.argv.slice(2),
    // [-] Path de ejecución
    execPath: process.cwd(),
    // [-] Nombre de la plataforma (sistema operativo)      
    plataforma: process.platform,
    // [-] Process id
    processID: process.pid,
    // [-] Versión de node.js      
    nodeVersion: process.version,
    // [-] Carpeta del proyecto
    carpeta: process.argv[1],
    // [-] Memoria total reservada (rss)
    memoria:  ` ${Math.round( JSON.stringify(process.memoryUsage.rss())/ 1024 / 1024 * 100) / 100} MB`,
}

router.get('/info', async(req, res,) => {
    console.log('/info')
    const data = infodelProceso
    res.render('info', {data})
})

// router.get('/recover', async(req, res,) => {
//   res.render('recover.handlebars')
// })

router.get('/restore', async(req, res,) => {
  res.render('recoverPassword.handlebars')
})

// router.get('/restoreFail', async(req, res,) => {
//  ///res.render('restoreFail.handlebars')
//  const errorMessage = req.flash('error')[0];
//  res.send({status:"error",error:errorMessage})
// })

router.get('/chat', async(req,res)=>{
  if(req.session.user){
    let sesionUser=req.session.user
    let chats =  await chatDAO.getAll()
    let chat = chats.map(char => {
      return {
          user: char.user,
          message: char.message,
          date: char.date,
      }
    })
    res.render('chat.handlebars',{userData:sesionUser,chats:chat})
  }else(
    res.redirect('/login')
  )
})

router.get('/registersucced', async(req, res,) => {
  res.render('registersucced.handlebars')
})

export default router;   