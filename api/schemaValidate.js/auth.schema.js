const Joi=require('joi')

createUserSchema = Joi.object().keys({ 
    username: Joi.string().required ,
    email: Joi.string().required().email(), 
    password: Joi.number().required() 
  }); 


 