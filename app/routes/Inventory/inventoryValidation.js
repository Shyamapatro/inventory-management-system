const { celebrate, Joi, Segments } = require('celebrate');

const addItemSchema = celebrate({
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
        price: Joi.number().precision(2).required(),
        description: Joi.string().optional(),
        category: Joi.string().valid('running', 'casual', 'formal', 'sports', 'boots').required(),
        imageUrl: Joi.string().optional(),
},{ warnings: true })
})


const updateItemSchema = celebrate({
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().optional(),
        quantity: Joi.number().integer().min(1).optional(),
        price: Joi.number().precision(2).optional(),
        description: Joi.string().optional(),
        category: Joi.string().valid('running', 'casual', 'formal', 'sports', 'boots').optional(),
        imageUrl: Joi.string().optional(),
},{ warnings: true })
})

module.exports = { 
    addItemSchema,
    updateItemSchema
};



