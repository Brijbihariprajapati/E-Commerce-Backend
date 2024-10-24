const express = require('express')
const authcontrollers = require('../controllers/auth-controllers')
const productsControllers = require('../controllers/admin-actions')
const usercontrollers = require('../controllers/user-Actions')
const vlogController = require('../controllers/Vlog-Controller')
const protect = require('../middleware/Authentication')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, './public/ProductsImage')
    },filename:function(req,file,cb){
        cb(null,`${Date.now()}_${file.originalname}`);
    }
})

const upload = multer({storage})

const router = express.Router()
router.route('/adminRegister',).post(authcontrollers.AdminRegister)
router.route('/adminLogin').post(authcontrollers.AdminLogin)
router.route('/findadmin/:id').get(authcontrollers.findadmin)
router.route('/homebanner').post(productsControllers.homebanner)
router.route('/findBannerText').get(productsControllers.findBannerText)
router.route('/authrization').get(protect, (req, res) => {
   res.json({ msg: `Welcome to your dashboard, user: ${req.user.email}` });
  }); 






// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< products>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const storagee = multer.diskStorage({destination:function(req,file,cb){
    cb(null, './public/ProductsImage')
},filename:function(req,file,cb){
    cb(null,`${Date.now()}_${file.originalname}`)
}})


const uploadd = multer({storage:storagee})
router.route('/addproducts').post(upload.single('image'),productsControllers.AllProducts)
router.route('/findproduct').get(productsControllers.findProduct)
router.route('/status/:id').put(productsControllers.status)
router.route('/delete/:id').delete(productsControllers.deleteproducts)
router.route('/editproduct/:id').put(uploadd.single('image'),productsControllers.Edit)
router.route('/search').get(productsControllers.search)



// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<User Actions>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


router.route('/userregister').post(usercontrollers.Register)
router.route('/userlogin').post(usercontrollers.Login)
router.route('/userfind').get(usercontrollers.userfind)
router.route('/active/:id').put(usercontrollers.activeuser)
router.route('/randomproducts').get(usercontrollers.RandomProducts)
router.route('/addcart').post(usercontrollers.addCart)
router.route('/findcartproduct/:id').get(usercontrollers.findcartproducts)
router.route('/deletecartitem/:id').delete(usercontrollers.deletecartitem)
router.route('/incDec/:id').put(usercontrollers.incDec)
router.route('/findproductbyid/:id').get(usercontrollers.findproductbyid)
router.route('/purchaseproducts').post(usercontrollers.purchaseproducts)
router.route('/findordersdetails').get(usercontrollers.findordersdetails)
router.route('/findproductbyidupdate/:id/:idd').get(usercontrollers.findproductbyidupdate)
router.route('/getUserCounts').get(usercontrollers.getUserCounts)
router.route('/orderCounts').get(usercontrollers.orderCounts)
router.route('/contact').post(usercontrollers.contact)
router.route('/findmessage').get(usercontrollers.findmessage)
router.route('/Reply').post(usercontrollers.ReplyMessage)
router.route('/messagecount').get(usercontrollers.MessageCounts)


// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Payment>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.route('/create-payment').post(usercontrollers.payment)
router.route('/paymentdetail/:sessionId').get(usercontrollers.paymentDetaile)




// ---------------------------------------------------vlogs content--------------------------------------------

const storages = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/Vlog');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const uploads = multer({ storage: storages });

router.route('/vlogupload').post(uploads.single('image'), vlogController.vlogPost);
router.route('/findVlog').get(vlogController.findVlog)
router.route('/deleteVlog/:id').delete(vlogController.deleteVlog)
router.route('/editVlog/:id').put(uploads.single('image'),vlogController.editVlog)
module.exports = router