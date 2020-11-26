const { required } = require("joi");

const jwt = require('jsonwebtoken')

module.exports = function(req, res, next){

    const token = req.header('access_token')

    if(!token){
        res.status(403).json({
            error: {
                success: false,
                message:"Access denied"
            }
        })
    }

    try{
        const verify = jwt.verify(token, process.env.JWT_SECRET)
        req.user = verify
        next()
    }catch(e){
        res.status(403).json({
            message: "Invalid token",
            success: false
        })
    }

}

