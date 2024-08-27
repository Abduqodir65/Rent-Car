import { Schema,model } from 'mongoose'

const carSchema = new Schema({
    brand:String,
    model:String,
    vehicles_count:Number,
    price:String,
})

export const Car = model('Car',carSchema)
