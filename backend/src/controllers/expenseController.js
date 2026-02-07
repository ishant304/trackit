import Expense from "../models/expenseSchema.js";

export const getExpense = async (req, resp) => {

    const id = req.user.id;

    const filter = {
        owner: id
    }

    const allowed_categories = ["rent","food","travel","bills","misc","entertainment","shopping","others"];

    if (req.query.category) {
        if(!allowed_categories.includes(req.query.category)){
            return resp.status(400).json({
                "success": false,
                "message":"Invalid category"
            })
        }
        filter.category = req.query.category
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

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    const skip = (page - 1) * limit

    try {
        const expenseList = await Expense.find(filter).sort({ date: -1 }).lean().skip(skip).limit(limit)

        const totalExpense = await Expense.countDocuments(filter)

        const totalPages = Math.ceil(totalExpense/limit)

        const expenses = expenseList.map(obj => {
            return {
                _id: obj._id,
                amount: obj.amount,
                category: obj.category,
                description: obj.description,
                date: obj.date
            }
        })

        return resp.status(200).json({
            "success": true,
            "message": "Expense fetched successfully",
            "page":page,
            "limit":limit,
            "totalExpense":totalExpense,
            "totalPage":totalPages,
            "expenses": expenses
        })

    }
    catch (err) {
        return resp.status(500).json({
            "success": false,
            "message": "Internal server error"
        })
    }

}

export const getExpenseById = async (req, resp) => {

    const id = req.params.id

    try {
        const selectedExpense = await Expense.findById(id).lean()

        if (!selectedExpense) {
            return resp.status(404).json({
                "success": false,
                "message": "Given expense not found"
            })
        }

        if (selectedExpense.owner.toString() !== req.user.id) {
            return resp.status(403).json({
                "success": false,
                "message": "Authorization failed! Expense belongs to other user"
            })
        }

        const expense = {
            _id: selectedExpense._id,
            amount: selectedExpense.amount,
            category: selectedExpense.category,
            description: selectedExpense.description,
            date: selectedExpense.date
        }

        return resp.status(200).json({
            "success": true,
            "message": "Expense fetched successfully",
            "data": expense
        })
    }
    catch (err) {
        if (err.name == "CastError") {
            return resp.status(400).json({
                "success": false,
                "name": err.name,
                "message": err.message
            })
        }
        else {
            return resp.status(500).json({
                "success": false,
                "message": "Internal server error"
            })
        }
    }

}

export const postExpense = async (req, resp) => {

    const body = req.body;

    const expenseData = {
        ...body,
        owner: req.user.id
    }

    try {
        const savedExpense = await Expense.create(expenseData)

        const expense = savedExpense.toObject()
        delete expense.owner
        delete expense.__v

        if (savedExpense) {
            return resp.status(201).json({
                "success": true,
                "message": "New expense created successfully",
                "data": expense
            })
        }
    }
    catch (err) {
        if (err.name == "ValidationError") {
            return resp.status(400).json({
                "success": false,
                "name": err.name,
                "message": err.message
            })
        }
        if (err.name == "CastError") {
            return resp.status(400).json({
                "success": false,
                "name": err.name,
                "message": err.message
            })
        }
        if (err.code == 11000) {
            return resp.status(409).json({
                "success": false,
                "name": err.name,
                "message": err.message
            })
        }
        else {
            return resp.status(500).json({
                "success": false,
                "name": err.name,
                "message": err.message
            })
        }
    }

}

export const deleteExpense = async (req, resp) => {

    const id = req.params.id

    try {
        const selectedExpense = await Expense.findById(id)

        if (!selectedExpense) {
            return resp.status(404).json({
                "success": false,
                "message": "Given expense not found"
            })
        }

        if (selectedExpense.owner.toString() !== req.user.id) {
            return resp.status(403).json({
                "success": false,
                "message": "Authorization failed! Expense belongs to other user"
            })
        }

        await Expense.findByIdAndDelete(id)

        return resp.status(200).json({
            "success": true,
            "message": "Given expense is deleted"
        })
    }
    catch (err) {
        return resp.status(500).json({
            "success": false,
            "message": "Internal server error"
        })
    }

}

export const updateExpense = async (req, resp) => {

    const id = req.params.id;
    const body = req.body

    const { amount, description, category, date } = body

    try {
        const selectedExpense = await Expense.findById(id)

        if (!selectedExpense) {
            return resp.status(404).json({
                "success": false,
                "message": "Given expense not found"
            })
        }
        if (selectedExpense.owner.toString() !== req.user.id) {
            return resp.status(403).json({
                "success": false,
                "message": "Authorization failed! Expense belongs to other user"
            })
        }

        if (body.amount !== undefined) {
            selectedExpense.amount = body.amount
        }
        if (body.description !== undefined) {
            selectedExpense.description = body.description
        }
        if (body.category !== undefined) {
            selectedExpense.category = body.category
        }
        if (body.date !== undefined) {
            selectedExpense.date = body.date
        }

        await selectedExpense.save()

        const expense = selectedExpense.toObject()
        delete expense.__v
        delete expense.owner


        return resp.status(200).json({
            "success": true,
            "message": "Expense successfully updated",
            "data": expense
        })

    }
    catch (err) {
        if (err.name == "ValidationError") {
            return resp.status(400).json({
                "success": false,
                "name": err.name,
                "message": err.message
            })
        }
        if (err.name == "CastError") {
            return resp.status(400).json({
                "success": false,
                "name": err.name,
                "message": err.message
            })
        }
        if (err.code == 11000) {
            return resp.status(409).json({
                "success": false,
                "name": err.name,
                "message": err.message
            })
        }
        else {
            return resp.status(500).json({
                "success": false,
                "name": err.name,
                "message": err.message
            })
        }
    }

}