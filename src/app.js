import express from "express";
import __dirname from './utils.js'
import handlebars from 'express-handlebars'
import viewsRouter from './routes/views.routes.js'
import { Server } from "socket.io";
import fs from 'fs';
import testProducts from "./service/faker.js";
import session, {Cookie} from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import initializePassport from "./public/config/passport.config.js";
import passport from "passport";
import flash from "express-flash";
import randomRouter from './routes/random.routes.js'
import config from './config.js'
import productsRouter from './routes/products.routes.js' 
import cartsRouter from './routes/cart.routes.js'

const app =express();

const connection =mongoose.connect(config.mongo.urlmongo)
const PORT =   config.app.PORT || 3000;
const server = app.listen(PORT,async()=>{
    console.log('Its Working')
});
const io= new Server(server);
app.use(express.json());
app.use(session({
    store: MongoStore.create({
        mongoUrl:config.mongo.urlmongo,
        ttl:600
    }),
    secret: "nosequeponer000",
    resave:true,
    saveUninitialized:true,
}));

app.use(flash());
app.use(passport.session());
initializePassport();
app.use(passport.initialize());

app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');

app.use(express.urlencoded({extended:true}));
app.use('/',viewsRouter);
app.use('/api/randoms', randomRouter)
app.use('/api/products',productsRouter)
app.use('/api/carts',cartsRouter)

app.use(express.static(__dirname+'/public'));

io.on('connection', socket=>{
    socket.on('test',async()=>{
        const logtest = await testProducts.getTest();
        io.emit('logtest',logtest)
    }) 

    socket.on('cartsredirect',async()=>{
        let destination = config.url.mainurl+'/api/carts';
        io.emit('cartredirect', destination);
    })

    socket.on('thispokemonredirect',async(id)=>{
        id=id.id+1
        let destination = config.url.mainurl+'/api/products/'+id;
        io.emit('pokemonredirect', destination);
    })

})