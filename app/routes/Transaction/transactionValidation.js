const { celebrate, Joi, Segments } = require('celebrate');

const createTransactionSchema = celebrate({
    [Segments.BODY]: Joi.object().keys({
        items: Joi.array().items(
            Joi.object({
                id: Joi.string().required(),
                quantity: Joi.number().integer().min(1).required()
            })
        ).required()
    })
});

module.exports = {
    createTransactionSchema
};
