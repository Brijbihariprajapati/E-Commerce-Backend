const Vlog = require("../models/Vlog-Schema");

const vlogPost = async (req, resp) => {
    try {
        const { title, description, date } = req.body;
        const image = req.file;

        // Log the received data for debugging
        console.log('Title:', title);
        console.log('Description:', description);
        console.log('Date:', date);
        console.log('Image:', image);

        // Create a new vlog entry in the database
        const data = await Vlog.create({
            title,
            description,
            date,
            image: image ? image.filename : null, // Check if image exists and use its filename
        });

        // Send a success response
        resp.status(200).json({ msg: 'Vlog uploaded successfully', data });
        
    } catch (error) {
        // Log the error for debugging
        console.error('Error uploading vlog:', error);
        resp.status(500).json({ msg: 'Network error', error: error.message });
    }
}


const findVlog = async (req,resp)=>{
    try {
        const data = await Vlog.find()
        if(data){
            resp.status(200).json({msg:'Find vlogs succesfull', data})
        }
    } catch (error) {
        resp.status(500).json({nsg:'Network error'})
    }
}

const deleteVlog = async (req,resp)=>{
    try {
        const id = req.params.id
    
        const deletevlog = await Vlog.findByIdAndDelete(id)
        if(deletevlog){
            resp.status(200).json({msg:'Delete Succesfull'})
        }
    } catch (error) {
        resp.status(500).json({msg:'Network Error Failed To Delete'})
    }
}
const editVlog = async (req, resp) => {
    try {
        const id = req.params.id;
        const { title, description } = req.body;
        const image = req.file;

        console.log(id, title, description, image);

        const updateFields = {
            title,
            description,
        };

        if (image) {
            updateFields.image = image.filename;
        }

        const data = await Vlog.findByIdAndUpdate(
            { _id: id },
            { $set: updateFields },
            { new: true } 
        );

        resp.status(200).json({ msg: 'Update Successful' });
    } catch (error) {
        console.error('Error updating vlog:', error);
        resp.status(500).json({ msg: 'Network error' });
    }
};




module.exports = { vlogPost ,findVlog,deleteVlog,editVlog};
