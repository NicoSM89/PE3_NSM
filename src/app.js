import express from "express";
import mongoose from 'mongoose';
import handlebars from 'express-handlebars' 
import session from 'express-session';
import { secret } from './configurations/consts.js';
import MongoStore from 'connect-mongo';
import viewsRoutes from './routes/views.routes.js';
import sessionRoutes from './routes/session.routes.js';
import initialePassport from './configurations/passport.config.js';
import passport from 'passport';
import { Server } from 'socket.io'
import photosRoutes from './routes/photos.routes.js';
import productRouter from "./routes/productRoutes.js";
import cartRouter from "./routes/cartsRoutes.js";
import messagesRouter from "./routes/messagesRoutes.js";
import viewRoutes from './routes/viewsRoutes.js'
import userRoutes from './routes/users.routes.js';
import ordersRoutes from './routes/orders.routes.js';
import businessRoutes from './routes/business.routes.js';
import contactRoutes from './routes/contacts.routes.js';
import productsRoutes from './routes/products.routes.js';
import { ProductMongoManager } from "./dao/managerDB/ProductMongoManager.js";
import { MessageMongoManager } from "./dao/managerDB/MessageMongoManager.js";

import cors from 'cors';

//configuraciones

const PORT = 8080;
const app = express();
const productManager = new ProductMongoManager();
const messageManager = new MessageMongoManager()

app.engine('handlebars', hbs.engine);
app.set('views', 'src/views');
app.set('view engine', 'handlebars');

app.use(session({
  secret: secret,
  store: MongoStore.create({
      mongoUrl: 'mongodb+srv://fergiraudo91:Luna.2024@coder.3hytpje.mongodb.net/coder'
  }),
  resave: true,
  saveUninitialized: true
}));

app.use('/', viewsRoutes);
app.use('/api/session', sessionRoutes);

app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(express.static('public'))
app.use(cors());

mongoose.connect("mongodb+srv://nsalamanca:sammy123@cluster0.rwbs3lx.mongodb.net/ecommerce")

app.engine('handlebars',hbs.engine) 
app.set('views','src/views')
app.set('view engine', 'handlebars')
app.use('/', viewRoutes) //Configuracion de las vistas handlebars

//APIS

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/photos', photosRoutes);
app.use('/api/messages', messagesRouter);
app.use('/api/users', userRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/products', productsRoutes);

//servidor

const httpServer = app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

const socketServer = new Server(httpServer) 

const messages=[]

socketServer.on("connection", async (socket)=>{
  console.log("New Cliente Online");
  
  socket.on('addProd', async prod => {
    try {
     const rdo = await productManager.addProduct(prod)
     if (rdo.message==="OK")
     {
      const resultado = await productManager.getProducts();
      if (resultado.message==="OK")
      {
        socket.emit("getAllProducts",resultado.rdo )  
      }
     }
     return rdo
    } catch (error) {
      console.log("Error when registering a product: ", error)
    }
	})

  socket.on('delProd', async id => {
    const deleted=await productManager.deleteProduct(id)
    if (deleted.message==="OK")
    {
      const resultado = await productManager.getProducts();
      if (resultado.message==="OK")
      {
        socket.emit("getAllProducts",resultado.rdo )  
      }
    }
    else
      console.log("Error deleting a product: ", deleted.rdo)
  });

  socket.on('message', data=>{
    messages.push(data)
    messageManager.addMessage(data)
    socketServer.emit('messageLogs', messages)
  })

  socket.on('newUser', data =>{
    socket.emit('newConnection', 'A new user logged in - ' + data)
    socket.broadcast.emit('notification', data)
  })

});

//handlebars

const hbs = handlebars.create({
  runtimeOptions: {
      allowProtoPropertiesByDefault: true
  }
});

initialePassport();
app.use(passport.initialize());
app.use(passport.session());

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
})