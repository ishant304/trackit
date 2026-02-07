import mongoose from 'mongoose'
import User from './userSchema.js'

const expenseSchema = new mongoose.Schema({
    amount : {
        type : Number,
        required : true,
        min : 0
    },
    description : {
        type : String,
        trim : true,
        maxLength : 100,
        default : ""
    },
    date : {
        type : Date,
        required : true,
        default : Date.now
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : User,
        required : true,
        immutable : true
    },
    category : {
        type : String,
        required : true,
        enum : ["rent","food","travel","bills","misc","entertainment","shopping","others"]
    }
},
{timestamps:true})

const Expense = mongoose.model("expense",expenseSchema)

export default Expense;