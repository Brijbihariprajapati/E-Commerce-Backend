const { response } = require("express");
const products = require("../models/productsSchema");
const home = require("../models/HomeBannerSchema");
const { options } = require("../routers/auth-router");

const AllProducts = async (req, resp) => {
  try {
    const { name, price, color, stocks, available, status } = req.body;
    const image = req.file;

    console.log(image);

    const data = await products.create({
      name,
      price,
      color,
      stocks,
      available,
      status,
      image: image ? image.filename : null,
    });

    resp.status(200).json({ msg: "Products Save Succesfully", data });
    console.log("products save succesfully");
  } catch (error) {
    resp.status(400).json({ msg: "Failed to save Products", error });
    console.log("Failed to save Products", error);
  }
};
const findProduct = async (req, resp) => {
  try {
    const data = await products.find();
    if (data) {
      resp.status(200).json({ msg: "Find Succesfully", data });
    }
  } catch (error) {
    resp.status(400).json({ msg: "Failed To find Products", error });
  }
};

const status = async (req, resp) => {
  try {
    const id = req.params.id;

    console.log(id);

    const data = await products.findById(id);
    if (data.status == 0) {
      await products.findByIdAndUpdate({ _id: id }, { $set: { status: 1 } });
      resp.status(200).json({ msg: "Deactivate Succesfully" });
      console.log("Deactivate Succesfully");
    } else {
      await products.findByIdAndUpdate({ _id: id }, { $set: { status: 0 } });
      resp.status(200).json({ msg: "Activate Succesfully" });
      console.log("Activate Succesfully");
    }
  } catch (error) {
    resp.status(400).json({ msg: "Failed To Update Status", error });
    console.log("Failed To Update Status");
  }
};

const deleteproducts = async (req, resp) => {
  try {
    const id = req.params.id;
    const response = await products.findByIdAndDelete(id);
    if (response) {
      resp.status(200).json({ msg: `${response.name} Delete Succesfully` });
    }
  } catch (error) {
    resp.status(400).json({ msg: `${response.name} Failed To Delete` });
  }
};

const Edit = async (req, resp) => {
  try {
    const id = req.params.id;
    const { name, price, color, stocks, available, status } = req.body;
    const image = req.file;

    console.log(id,name,image);
    
    const res = await products.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            name,
            price,
            color,
            stocks,
            status,
            available,
            image: image ? image.filename : undefined, 
          },
        },
        { new: true }
    );

    if(res){
        resp.status(200).json({msg:'Products Update Succesfully',name})
    console.log('Products Update Succesfully');
    
    }else {
        resp.status(404).json({ msg: 'Product Not Found' });
      }
  } catch (error) {
     resp.status(400).json({msg:'Failed to update products'})
     console.log('Failed to update products');
     
  }
};

const homebanner = async(req,resp)=>{
  try {
    const {name, description, offerText,offer} = req.body
    console.log(name,description,offerText);
    
    const isexist = await home.findOne({name})
    if(!isexist){
      await home.create({
        name,
        description,
        offerText,
        offer
      })
      resp.status(200).json({msg:'Created Succesfull'})
    }else{
          await home.updateOne({name},{name,description,offerText,offer})
          resp.status(201).json({msg:'Update Succesfull'})
    }
    
  } catch (error) {
    resp.status(500).json({msg:'network error'})
  }
}
const findBannerText = async(req,resp) =>{
  try {
    const data = await home.find()
    if(data ){
      resp.status(200).json({msg:'Fetch Data Succesfull',data})
    }else{
      resp.status(400).json({msg:'failed to get data'})
    }
  } catch (error) {
    resp.status(500).json({msg:'network error'})
  }
}



const search = async(req,resp)=>{
  try {
    const query = req.query.query
    console.log(query);
    if (!query) {
      return resp.status(400).json({ msg: "Search query is required" });
    }

    const searchResult = await products.find({
      $or: [{ name: { $regex: query, $options: 'i' } }],
    });
    resp.status(200).json({ searchResult });
  } catch (error) {
    resp.status(500).json({msg:'Network error'})
  }
}

module.exports = { AllProducts, findProduct, status, deleteproducts,Edit,homebanner,findBannerText,search };
