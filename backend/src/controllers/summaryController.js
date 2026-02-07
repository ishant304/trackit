import mongoose, { Mongoose } from "mongoose"
import Expense from "../models/expenseSchema.js"

export const getExpenseSummary = async (req, resp) => {

    const id = req.user.id

    const filter = {
        owner : new mongoose.Types.ObjectId(id)
    }

    if(req.query.from || req.query.to){
        filter.date = {}
    }

    if(req.query.from){

        const fromDate = new Date(req.query.from)

        if(isNaN(fromDate.getTime())){
            return resp.status(400).json({
                "success":false,
                "message":"Invalid Date"
            })
        }
        filter.date.$gte = fromDate
    }

    if(req.query.to){

        const toDate = new Date(req.query.to) 

        if(isNaN(toDate.getTime())){
            return resp.status(400).json({
                "success":false,
                "message":"Invalid Date"
            })
        }
        filter.date.$lte = toDate

    }

    const expenseList = await Expense.aggregate([
        {
            $match : filter
        },
        {
            $group : {
                _id : null,
                countOfExpense : { $sum : 1},
                totalExpense : {$sum : "$amount"},
                averageExpense : {$avg : "$amount"},
                maxExpense : {$max : "$amount"},
                minExpense : {$min : "$amount"}   
            }
        },
        {
            $project : {
                _id : 0,
                countOfExpense :1,
                totalExpense : 1,
                averageExpense :1,
                maxExpense : 1,
                minExpense : 1
            }
        }
    ])
    
    if(expenseList[0]){
        return resp.status(200).json({
        "success":true,
        "message" : "Expense Summary fetched successfully",
        "data" : expenseList[0]
    })
    }
    else{
        return resp.status(200).json({
            "success":true,
            "message" : "No expense found of given user",
            "data" : {
                "countOfExpense" : 0,
                "totalExpense" : 0,
                "averageExpense" : 0 ,
                "maxExpense" : 0,
                "minExpense" : 0
            }
        })
    }

}

export const getCategorySummary = async (req,resp) => {

    const id = req.user.id

    const filter = {
        owner : new mongoose.Types.ObjectId(id)
    }

    if(req.query.to || req.query.from){
        filter.date = {}
    }

    if(req.query.from){

        const fromDate = new Date(req.query.from)

        if(isNaN(fromDate.getTime())){
            return resp.status(400).json({
                "success":false,
                "message":"Invalid Date"
            })
        }
        filter.date.$gte = fromDate
    }

    if(req.query.to){

        const toDate = new Date(req.query.to) 

        if(isNaN(toDate.getTime())){
            return resp.status(400).json({
                "success":false,
                "message":"Invalid Date"
            })
        }
        filter.date.$lte = toDate

    }

    const categoryList = await Expense.aggregate([
        {
            $match : filter
        },
        {
            $group : {
                _id : "$category",
                totalExpense : { $sum : "$amount"},
                countOfExpense : { $sum : 1},
                averageExpense : { $avg : "$amount"},
                maxExpense : { $max : "$amount"},
                minExpense : { $min : "$amount"}
            }
        },
        {
            $project : {
                _id : 1,
                totalExpense : 1,
                countOfExpense : 1,
                averageExpense : 1,
                maxExpense: 1,
                minExpense : 1
            }
        }
    ])

    return resp.status(200).json({
        "success":true,
        "message" : "Category-wise summary fetched successfully",
        "data" : categoryList
    })

}