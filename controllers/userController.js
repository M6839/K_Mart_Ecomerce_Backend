const User=require('../models/userRegister');
const dotenv=require("dotenv");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
dotenv.config();
const secretKey=process.env.whatismyname

const userRegister= async (req, res) => {
    const { username, email, password,role } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email  is required" });
    }
    try {
      const userexist = await User.findOne({ email });
      if (userexist) {
        return res.status(409).json({ message: "Email already in Registered" });
      }
      const newuser = await User.create({
        username,
        email,
        password: await bcrypt.hash(password, 12),
        role: role || 'user' 
      });
      await newuser.save();
      res.status(201).json({message: "user successfully registered"});
      console.log('registered');
    }
    catch (err) {
      res.status(422).json(err);
    }
  }
  
  const userLogin=async(req,res)=>{
    const {email,password}= req.body;
    try{
        const userinfo=await User.findOne({email});
        if(!userinfo || !(await bcrypt.compare(password,userinfo.password))){
            return res.status(401).json({error:'Invalid email or password'})
        }
        const token=jwt.sign({_id: userinfo._id},secretKey,{expiresIn: "1h"})
        res.status(200).json({success:'login successfull',token,
           user: {
        username: userinfo.username,
        email: userinfo.email,
        role: userinfo.role
      }
        })

        console.log(email)
        console.log(token);
    }
    catch(error){
        res.status(500).json({Error:"email is not registered"})


    }
 };

 

const forgotpassword= async (req, res) => {
  const { email, newPassword } = req.body;
  const userinfo = await User.findOne({ email });

  if (!userinfo) {
      return res.status(404).json({ message: 'User not found' });
  }

  userinfo.password = await bcrypt.hash(newPassword, 10);
  await userinfo.save();
  
  res.json({ message: 'Password reset successfully' });
};


const userlogout = (req, res) => {
  res.clearCookie("token"); 
  res.json({ success: true });
};
module.exports={userRegister,userLogin,forgotpassword,userlogout}
  