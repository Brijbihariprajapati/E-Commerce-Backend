const { response } = require("express");
const Cart = require("../models/Cart-Schema");
const Products = require("../models/productsSchema");
const purchase = require("../models/PurchaseSchema");
const User = require("../models/User-Schema");
const bcrypt = require("bcrypt");
const ContactUs = require("../models/ContactUsSchema");
const nodemailer = require('nodemailer')
const stripe = require("stripe")(
  "sk_test_51QAFSxBU5ng3PRs8SU9FLkMRviT7y1LuHQT6hgQhBcnv63j9ASnUQqUlyxI3gazNlNPRiTBaMUw6BXpM900BOkSz00apQgAGEF"
);

const Register = async (req, resp) => {
  try {
    const { name, email, password } = req.body;

    const isexist = await User.findOne({ email: email });
    if (isexist) {
      resp.status(400).json({ msg: "You Are Already Registerd" });
    } else {
      const saltRound = 10;
      const hashedpassword = await bcrypt.hash(password, saltRound);
      const response = await User.create({
        name,
        email,
        password: hashedpassword,
      });
      if (response) {
        resp.status(200).json({ msg: "Registerd Succesfully" });
      }
    }
  } catch (error) {
    resp.status(400).json({ msg: "Server Error" });
  }
};

const Login = async (req, resp) => {
  try {
    const { email, password } = req.body;
    console.log(email);

    const isexist = await User.findOne({ email: email });
    if (!isexist) {
      resp
        .status(400)
        .json({ msg: "You Are Not Register Please Register First" });
    } if(isexist.status==='Deactive'){
        resp.status(404).json({msg:'You Are Unuthorized User'})
    } 
    else {
      const ismatch = await bcrypt.compare(password, isexist.password);
      if (!ismatch) {
        resp.status(400).json({ msg: "Wrong Email Or Password Try Again" });
      } else {
        resp.status(200).json({ msg: "Login Succesfull", isexist });
      }
    }
  } catch (error) {
    resp.status(400).json({ msg: "Server error", error });
  }
};

const userfind = async (req, resp) => {
  try {
    const data = await User.find();
    resp.status(200).json({ msg: "Find Succesfull", data });
  } catch (error) {
    resp.status(500).json({ msg: "server error" });
  }
};

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<poducts>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const RandomProducts = async (req, resp) => {
  try {
    const data = await Products.aggregate([{ $sample: { size: 4 } }]);
    if (data) {
      resp.status(200).json({ msg: "Find data Succesfully", data });
    } else {
      resp.status(400).json({ msg: "Failed to get data" });
    }
  } catch (error) {
    resp.status(400).json({ msg: "Server Error", error });
  }
};

const addCart = async (req, resp) => {
  try {
    const { userid, productid } = req.body;

    const isexist = await Cart.findOne({ productid, userid });
console.log('us', userid,'pr', productid );
if(!userid){
  resp.status(400).json({msg:'Login First'})
}

   else if (isexist) {
      resp.status(409).json({ msg: "Product Already Added In Your Cart" });
    } else {
      const res = await Cart.create({
        userid,
        productid,
      });
      if (res) {
        resp
          .status(200)
          .json({ msg: "Product Added To Your Cart Successfully" });
        console.log(res);
      } else {
        resp.status(400).json({ msg: "Failed to add to cart" });
      }
    }
  } catch (error) {
    resp.status(500).json({ msg: "Server Error" });
  }
};

const findcartproducts = async (req, resp) => {
  try {
    const id = req.params.id;
    console.log(id);

    const cartItems = await Cart.find({ userid: id });

    const productIds = cartItems.map((v) => v.productid);

    const products = await Products.find(
      { _id: { $in: productIds } },
      { name: 1, color: 1, price: 1, image: 1 }
    );

    const productsWithCount = [];

    for (let i = 0; i < cartItems.length; i++) {
      const cartItem = cartItems[i];

      const product = products.find(
        (p) => p._id.toString() === cartItem.productid.toString()
      );

      if (product) {
        productsWithCount.push({
          ...product._doc,
          count: cartItem.count,
        });
      }
    }

    resp.status(200).json({
      success: true,
      data: productsWithCount,
    });

    console.log(productsWithCount);
  } catch (error) {
    console.error(error);
    resp.status(500).json({
      success: false,
      message: "Server error occurred",
    });
  }
};

const deletecartitem = async (req, resp) => {
  try {
    const id = req.params.id;
    console.log(id);

    const response = await Cart.deleteOne({ productid: id });
    if (response) {
      resp.status(200).json({ msg: "Deleted Succesfull" });
    }
    console.log("delete", response);
  } catch (error) {
    resp.status(400).json({ msg: "server Error" });
  }
};
const incDec = async (req, resp) => {
  try {
    const id = req.params.id;
    const val = req.body;

    console.log(val.val, id);

    if (val.val === "dec") {
      const counts = await Cart.findOne({ productid: id });

      const count = counts.count;
      await Cart.updateOne({ productid: id }, { $set: { count: count - 1 } });
      resp.status(200).json({ msg: "Item Removed Succesfull" });
    } else {
      const counts = await Cart.findOne({ productid: id });

      const count = counts.count;
      await Cart.updateOne({ productid: id }, { $set: { count: count + 1 } });
      resp.status(200).json({ msg: "Item Add Succesfull" });
    }
  } catch (error) {
    resp.status(501).json({ msg: "Server Error" });
  }
};

const findproductbyid = async (req, resp) => {
  try {
    const id = req.params.id;
    console.log("idddd", id);

    const data = await Products.findById(id);
    console.log("daaaaaaaaaaaa", data);

    resp.status(200).json({ msg: "Find Succesfull", data });
  } catch (error) {
    resp.status(501).json({ msg: "Server Error" });
  }
};
const purchaseproducts = async (req, resp) => {
  try {
    const {
      productId,
      quantity,
      userId,
      name,
      address,
      mobile,
      paymentMethod,
      price,
    } = req.body;
    console.log(
      productId,
      quantity,
      userId,
      name,
      address,
      mobile,
      paymentMethod,
      price
    );

    if (
      !productId ||
      !quantity ||
      !userId ||
      !name ||
      !address ||
      !mobile ||
      !paymentMethod ||
      !price
    ) {
      return resp.status(400).json({ msg: "All fields are required" });
    }

    const product = await Products.findById(productId);
    if (!product) {
      return resp.status(404).json({ msg: "Product not found" });
    }

    if (product.available < quantity) {
      return resp.status(400).json({ msg: "Not enough stock available" });
    }
    
    await Products.updateOne(
      { _id: productId },
      { $inc: { available: -quantity } }
    );

    const data = await purchase.create({
      userId,
      productId,
      quantity,
      name,
      address,
      mobile,
      paymentMethod,
      price,
      totalPrice: product.price * quantity,
      orderDate: new Date(),
    });

    return resp.status(200).json({ msg: "Order placed successfully", data });
  } catch (error) {
    console.error("Error in purchaseproducts: ", error);
    return resp.status(500).json({ msg: "Internal server error" });
  }
};

const findordersdetails = async (req, resp) => {
  try {
    const data = await purchase.find();
    resp.status(200).json({ msg: "Find Detailes Succesfull", data });
  } catch (error) {
    resp.status(500).json({ msg: "Network Error" });
  }
};

const findproductbyidupdate = async (req, resp) => {
  try {
    const id = req.params.id;
    const orderID = req.params.idd;

    const product = await Products.findById(id);

    if (!product) {
      return resp.status(404).json({ msg: "Product not found" });
    } else {
      await purchase.updateOne(
        { _id: orderID.toString() },
        { $set: { status: "dispatch" } }
      );

      resp.status(200).json({ msg: "Find successful", data: product });
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    resp.status(500).json({ msg: "Server Error", error: error.message });
  }
};

const activeuser = async (req, resp) => {
  try {
    const id = req.params.id;
    const res = await User.findById(id);

    console.log(res.status);
    if (res.status === "Active") {
      await User.updateOne({ _id: id }, { $set: { status: "Deactive" } });
      resp.status(200).json({ msg: `${res.name} Deactivate` });
      console.log(res);
    } else {
      await User.updateOne({ _id: id }, { $set: { status: "Active" } });
      resp.status(200).json({ msg: `${res.name} Activate` });
    }
  } catch (error) {
    resp.status(500).json({ msg: "Server Error" });
  }
};
const getUserCounts = async (req, resp) => {
  try {
    const activeCount = await User.countDocuments({ status: "Active" });
    const deactiveCount = await User.countDocuments({ status: "Deactive" });

    resp.status(200).json({
      activeCount,
      deactiveCount,
    });
  } catch (error) {
    console.error(error);
    resp.status(500).json({ msg: "Server Error" });
  }
};


const orderCounts = async (req, resp) => {
    try {
      const pendingCount = await purchase.countDocuments({ status: "Pending" });
      const dispatchCount = await purchase.countDocuments({ status: "dispatch" });
  console.log(pendingCount,dispatchCount);
  
      resp.status(200).json({
        pendingCount,
        dispatchCount,
      });
    } catch (error) {
      console.error(error);
      resp.status(500).json({ msg: "Server Error" });
    }
  };

  const contact = async (req,resp)=>{
    try {
      const {name, email, subject, message} = req.body
      const response = await ContactUs.create({
        name,email,message,subject
      })
      if(response){
        resp.status(200).json({msg:'Message Sent Succesfull'})
      }
    } catch (error) {
      resp.status(500).json({msg:'Network Error'})
    }
  }
  const findmessage = async(req,resp)=>{
    try {
      const response = await ContactUs.find()
      if(response){
        resp.status(200).json({msg:'Find Succesfull',response})
      }
    } catch (error) {
      resp.status(500).json({msg:'Network Error'})
    }
  }



  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  
  const ReplyMessage = async (req, resp) => {
    try {
      const { email, reply, name, id } = req.body;
  
      console.log(email, name, reply);
  
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Your Message",
        text: `Hello ${name}, thanks for contacting me. ${reply}`,
      };
  
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info.response);
      
      await ContactUs.updateOne({ _id: id }, { $set: { status: 1 } });
      
      return resp.json({ message: "Message sent successfully" });
  
    } catch (error) {
      console.error("Error sending email:", error.message);
      return resp.status(500).json({ message: "Failed to send message", error: error.message });
    }
  };
  
  
const MessageCounts = async (req, resp) => {
  try {
    const ZeroCount = await ContactUs.countDocuments({ status: 0 });
    const OneCount = await ContactUs.countDocuments({ status: 1 });
console.log(ZeroCount,OneCount);

    resp.status(200).json({
      ZeroCount,
      OneCount,
    });
  } catch (error) {
    console.error(error);
    resp.status(500).json({ msg: "Server Error" });
  }
};


const payment = async (req, resp) => {
  try {
    const { totalPrice, quantity } = req.body; // Ensure quantity is being passed in request

    const lineItems = [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: "pankha", // You can dynamically get the product name here
          },
          unit_amount: totalPrice * 100, // Total price in paise
        },
        quantity: quantity || 1, // Fallback to 1 if quantity is not provided
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}', // Redirect to your success page
      cancel_url: 'http://localhost:3000/cancel', // Redirect to your cancel page
    });

    // Send the session ID back to the frontend
    resp.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating payment session:", error);
    resp.status(500).json({ error: "Failed to create payment session" });
  }
};
  
  
//     resp.status(200).json({msg:'send send succesfull', sessionId: session.id });

//   } catch (error) {
//     resp.status(500).json({msg:'network error'})
//   }
// }


const paymentDetaile= async(req,resp)=>{
  try {
    const { sessionId } = req.params;
    
    const details =  await stripe.checkout.sessions.retrieve(sessionId)
    console.log(details);

    resp.status(200).json(details);
  } catch (error) {
    resp.status(500).json({msg:'network error'})
  }
}
module.exports = {
  Register,
  Login,
  userfind,
  activeuser,
  RandomProducts,
  addCart,
  findcartproducts,
  deletecartitem,
  incDec,
  findproductbyid,
  purchaseproducts,
  findordersdetails,
  findproductbyidupdate,
  getUserCounts,
  orderCounts,
  contact,
  findmessage,
  ReplyMessage,
  MessageCounts,
  payment,  
  paymentDetaile
};
