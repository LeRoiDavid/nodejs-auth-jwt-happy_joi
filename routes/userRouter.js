const connexion = require('../config/db')
const authMiddleware = require('../middleware/UserMiddleware')

const router = require('express').Router()

router.get('/', authMiddleware,(req, res) => {
    const sql = 'SELECT * FROM users';
    connexion.query(sql, [], (error, result, fields) => {
        
        if(error){
            return res.status(400).json({
                success: false,
                message: 'Serveur error'
            })
        }else{
            let users = JSON.parse(JSON.stringify(result))
            users = users.filter(user => delete user.password)
            return res.status(200).json({
                data: users,
                success: true
            })
        } 

        
    })
})




module.exports = router