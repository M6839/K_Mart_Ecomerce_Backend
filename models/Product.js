const mongoose=require('mongoose')


const ProductSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true, 
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:[{
             type:String,
             enum:['Kitchen','Men Fashion','Woman Fashion','Electronics','Mobiles','Watches','Books','TVs','Furniture'],
             required:true
        }
        ]
    },
    image:{
        type:String,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    }
},{ timestamps: true })

module.exports=mongoose.model("Product",ProductSchema);