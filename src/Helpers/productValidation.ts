import joi from 'joi'

export const productSchema = joi.object({
    productName:joi.string().required(),
    inStock: joi.number().required(),
    price: joi.number().required(),
    image: joi.string().required(),
    description: joi.string().required()
})