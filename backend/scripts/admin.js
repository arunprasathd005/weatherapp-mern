const User= require("../models/user");
const bcrypt= require("bcrypt");

async function createAdminAccount(params) {
    try {
        const existingAdmin =await User.findOne({email: "admin@gmail.com"});
        if(!existingAdmin)
        {
            const newAdmin =new User({
                email:"admin@gmail.com",
                name:"Admin",
                password:await bcrypt.hash("admin",10),
                role:"admin"
            })
            await newAdmin.save();
            console.log("admin account was created successfully");
        }
        else{
            console.log("Admin already exist");
        }
    } catch (error) {
        console.log(error.message);
    }
}
module.exports=createAdminAccount