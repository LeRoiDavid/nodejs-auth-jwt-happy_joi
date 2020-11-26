const Joi = require('joi')

const RegisterValidator = Joi.object({
    name:     Joi.string()
                 .min(2)  
                 .required(),  

    email:    Joi.string()
                 .email() 
                 .required(),

    password: Joi.string()
                 .min(6)   
                 .required(),

    password_conf: Joi.string()
                      .valid(Joi.ref('password'))
                      .required()
})


const LoginValidator = Joi.object({
  
    email:    Joi.string()
                 .email() 
                 .required(),

    password: Joi.string()
                 .min(6)   
                 .required()
})


module.exports = {
    RegisterValidator,
    LoginValidator
}