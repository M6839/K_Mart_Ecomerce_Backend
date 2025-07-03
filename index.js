const express=require("express");
const app=express();
const bodyparser=require('body-parser');
const dotenv=require('dotenv');
const cors=require("cors");
const mongoose=require('mongoose');
const port=process.env.PORT || 4000;
const userRoutes=require("./routes/userRoutes");
const productRoutes=require("./routes/productRoutes")
const cartRoutes=require('./routes/cartRoutes')
const orderRoutes=require('./routes/orderRoutes')
dotenv.config();
app.use(cors());
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log('Mongodb successfully connected')
})
.catch((error)=>console.log(error))
app.use(bodyparser.json());
app.use('/',userRoutes);
app.use('/product',productRoutes);
app.use('/order',orderRoutes);
app.use('/cart',cartRoutes);
app.use('/uploads', express.static('uploads'));
app.listen(port,(error)=>{
    if(!error){
        console.log(`server is running on port ${port}`);
    }
    else{
        console.log(error);
    }
})