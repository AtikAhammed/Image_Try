import jwt from 'jsonwebtoken'
import UserModel from '../models/User.js'

var checkUserAuth = async (req, res, next) => {
    let token
    const { authorization } = req.headers
    if (authorization && authorization.startsWith('Bearer')) {
        try {
            //Get Token from Header
            token = authorization.split(' ')[1]

            //veriy token
            const {UserID} = jwt.verify(token, process.env.JWT_SECRET_KEY)

            //Get User From Token
            req.user = await UserModel.findById(UserID).select('-password')
            next()


        } catch (error) {
            console.log(error)
            res.status(401).send({"status": "failed", "message": "Unauthorized User"})            
        }
    }

    if(!token) {
        res.status(401).send({"status": "failed", "message": "Unauthorized User, No Token"})
    }
}

export default checkUserAuth 