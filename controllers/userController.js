import UserModel from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

class UserController {
    static userRegistration = async (req, res) =>{
        const {name, father_name, mother_name, date_of_birth, gender, phone_num, address, email, password, password_confirmation, tc} = req.body
        const user = await UserModel.findOne({email:email})
        if (user) {
            res.send({"status": "failed", "message": "This Email is already exists."})
        } else {
            if(name && father_name && mother_name && date_of_birth && gender && phone_num && address && email && password && password_confirmation && tc !== undefined) {
                if(password === password_confirmation) { 
                   try {
                    const salt = await bcrypt.genSalt(10)
                    const hashPassword = await bcrypt.hash(password, salt)
                    const doc = new UserModel ({
                        name: name,
                        father_name: father_name,
                        mother_name: mother_name,
                        date_of_birth: date_of_birth,
                        gender: gender,
                        phone_num: phone_num,
                        address: address,
                        email: email,
                        password: hashPassword,
                        tc: Boolean(tc) // Ensure tc is a boolean
                    })
                    await doc.save()
                    const saved_user = await UserModel.findOne({email: email})
                    // Generate JWT Token
                    const token = jwt.sign({UserID: saved_user._id}, process.env.JWT_SECRET_KEY, {expiresIn: "7D"})

                    res.status(201).send({"status": "success", "message": "Registration Success.", "token": token})
                   } catch (error) {
                    console.log(error)
                    res.send({"status": "failed", "message": "Registration failed."})
                   }  
                } else {
                    res.send({"status": "failed", "message": "Password and Confirm Password are not same."})
                }
            } else {
                res.send({"status": "failed", "message": "All fields are required."})
            }
        }
    }

    static userLogin = async (req, res) =>{
        try {
            const {email, password} = req.body
            if(email && password) {
                const user = await UserModel.findOne({email:email})
                if (user != null) {
                    const isValidPassword = await bcrypt.compare(password, user.password)
                    if((user.email === email) && isValidPassword) {
                        // Generate JWT Token
                        const token = jwt.sign({UserID: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: "7D"})
                        res.status(201).send({"status": "success", "message": "Login Success.", "token": token})
                    } else {
                        res.send({"status": "failed", "message": "Invalid Email or Password"})
                    }
                } else {
                    res.send({"status": "failed", "message": "You are not a Registered User."})
                }
            } else {
                res.send({"status": "failed", "message": "Email and Password are required."})
            }
        } catch (error) {
            console.log(error)
            res.send({"status": "failed", "message": "Login failed."})
        }
    }

    static changeUserPassword = async ( req, res) => {
        const {password, password_confirmation} = req.body
        if (password && password_confirmation) {
            if(password !== password_confirmation) {
                res.send({"status": "failed", "message": "Password and Confirm Password does not match."})
            } else {
                const salt = await bcrypt.genSalt(10)
                const newHashPassword = await bcrypt.hash(password, salt)
                await UserModel.findByIdAndUpdate(req.user._id, { $set: { password: newHashPassword } })
                res.send({"status": "success", "message": "Password is Changed."})
            }
        } else {
            res.send({"status": "failed", "message": "All Fields are Required."})
        }
    }

    static loggedUser = async (req, res) => {
        res.send({"user": req.user})
    }
}

export default UserController