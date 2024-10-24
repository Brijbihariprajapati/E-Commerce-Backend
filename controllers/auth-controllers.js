const Admin = require('../models/adminSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const AdminRegister = async(req,resp)=>{
      try {
        const {name, email, password} = req.body
        console.log(name, email,password);
        
        const isexist = await Admin.findOne({email:email})
        if(isexist){
            resp.status(400).json({msg:'You Are Already Register'})
            console.log('you Are Already Register',isexist);
            
        }else{
            const saltround = 10
           const hashedpassword = await bcrypt.hash(password,saltround)
           const data = await Admin.create({
            name,
            email,
            password:hashedpassword
           })
           resp.status(200).json({msg:'Registerd Succesfully', data})
           console.log('Reggister Succesfully',data);
           
        }
      } catch (error) {
        resp.status(400).json({msg:'Failed To Register',error})
        console.log('Failed To Register', error);
        
      }
}

const AdminLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log('login', email, password);
  
      
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(400).json({ msg: 'User not registered', email });
      }
  
     
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Wrong email or password' });
      }
  
      
      const token = jwt.sign(
        { id: admin._id, email: admin.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } 
      );
  
     
      return res.status(200).json({
        msg: 'Login successful',
        email: admin.email,
        userid: admin._id,
        token, 
        _id: admin._id,
      });
    } catch (error) {
      console.error('Login Error:', error);
      return res.status(500).json({ msg: 'Login failed', error: error.message });
    }
  };

  const findadmin  = async (req,resp)=>{
    try {
        const id = req.params.id
        console.log('id',id);
        
        const data = await Admin.findById(id)
        if(data){
            resp.status(200).json({data})
        }
    } catch (error) {
        resp.status(500).json({msg:'Server Error'})
    }
  }
module.exports = {AdminRegister,AdminLogin,findadmin}