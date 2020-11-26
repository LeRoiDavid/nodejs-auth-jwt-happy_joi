const router = require('express').Router()
const connexion = require('../config/db')
const { RegisterValidator, LoginValidator } = require('../validation/validator')
const Joi = require('joi')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.post('/register', async (req, res)=> {
    let sql = `INSERT INTO users (name, email, password) VALUES (?,?,?)`;
    let data = req.body 

    try{
        const validator = Joi.attempt(data, RegisterValidator)
        
    }catch(e){
        return res.status(400).send(e)
    }
    const salt = await bcrypt.genSalt(10)
    data.password = await bcrypt.hash(data.password, salt)
 
    connexion.query(sql,[
        data.name, data.email, data.password
    ], (error, result, fields)=> {
        if(error){
            res.status(400).send(error)
        }else {
            const id = result.insertId
            const user = {...data, id}
            const { password, ...userNoPassword } = user
            const {password_conf, ...userNoPasswordConf } = userNoPassword
            res.status(201).json({
                data: userNoPasswordConf,
    
            })
        }

    })
})

router.post('/login', (req, res)=> {
    const data = req.body
    try{
        const validator = Joi.attempt(data, LoginValidator)
    }catch(e){
        return res.status(400).send(e.details)
    }
    const sql = `SELECT * FROM users WHERE email=? limit 1`;

    connexion.query(sql, [
        data.email
    ], (error, result, fields) => {
        if(error){
            return res.status(400).send(error)
        }else if(result.length == 0){
            return res.status(400).json({
                message: 'Username or password not good',
                success: false      
            })
        }else{
            check(result)
        }
    })

    async function check(user){
        const u = JSON.parse(JSON.stringify(user[0]))
        const validPassword = await bcrypt.compare(data.password, u.password)
        console.log(validPassword)
        if(validPassword){
            const token = jwt.sign(
                {user: u}, 
                process.env.JWT_SECRET,
                {expiresIn: 60 * 60 * 24 * 7}
            )

            res.header('auth-token', token).json({
                    access_token: token,
                    message: 'Connexion réussit',
                    success: true
                })

            // return res.status(200).json({
            //     access_token: token,
            //     message: 'Connexion réussit',
            //     success: true
            // })
        }else{
            return res.status(400).json({
                message: 'Username or password not good',
                success: false      
            })
        }
        // try{
        //     console.log(rs)
        //     const token = jwt.sign(
        //         {user: u}, 
        //         process.env.JWT_SECRET,
        //         {expiresIn: 60 * 60 * 24 * 7}
        //     )
        //     return res.status(200).json({
        //         access_token: token,
        //         message: 'Connexion réussit',
        //         success: true
        //     })
        // }catch(e){
        //     return res.status(400).json({
        //         message: 'Username or password not good',
        //         success: false      
        //     })
            
        // }

    }

})

router.get('/', (req, res) => {
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

