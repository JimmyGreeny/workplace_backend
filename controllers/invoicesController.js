const User = require('../models/User')
const Invoice = require('../models/Invoice')
const InvoiceMaterial = require('../models/InvoiceMaterial')

// @desc Get all invoices
// @route GET /invoices
// @access Private
const getAllInvoices = async (req, res) => {
    // Get all invoice from MongoDB
    const invoices = await Invoice.find().lean()

    // If no invoice 
    if (!invoices?.length) {
        return res.status(400).json({ message: 'No invoices found' })
    }

    // Add username to each invoice before sending the response 
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
    // You could also do this with a for...of loop
    const invoicesWithUser = await Promise.all(invoices.map(async (invoice) => {
        const user = await User.findById(invoice.user).lean().exec()
        return { ...invoice, username: user.username }
    }))

    res.json(invoicesWithUser)
}

// @desc Create new invoice
// @route POST /invoices
// @access Private
const createNewInvoice = async (req, res) => {

    // Create and store the new user 
    const invoice = await Invoice.create(req.body)

    if (invoice) { // Created 
        return res.status(201).json({ message: 'New invoice created' })
    } else {
        return res.status(400).json({ message: 'Invalid invoice data received' })
    }

}

// @desc Delete a invoice
// @route DELETE /invoices
// @access Private
const deleteInvoice = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Invoice ID required' })
    }

    // Confirm invoice exists to delete 
    const invoice = await Invoice.findById(id).exec()

    if (!invoice) {
        return res.status(400).json({ message: 'Invoice not found' })
    }

    const result = await invoice.deleteOne()

    const reply = `Invoice '${result.title}' with ID ${result._id} deleted`

    res.json(reply)
}

// @desc Get all materials
// @route GET /materials
// @access Private
const getAllMaterials = async (req, res) => {
    // Get all invoice from MongoDB
    const materials = await InvoiceMaterial.find().lean()

    // If no invoice 
    if (!materials?.length) {
        return res.status(400).json({ message: 'No materials found' })
    }

    // Add username to each invoice before sending the response 
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
    // You could also do this with a for...of loop
    const materialsWithUser = await Promise.all(materials.map(async (material) => {
        const user = await User.findById(material.user).lean().exec()
        return { ...material, username: user.username }
    }))

    res.json(materials)
}

// @desc Create new material
// @route POST /materials
// @access Private
const createNewMaterial = async (req, res) => {

    // Looking for MAX index among materials
    const max_index_item = await InvoiceMaterial.find().sort({index:-1}).limit(1)
    const max_index = Number(max_index_item.map(item => item?.index))
    Object.assign(req.body, {index:max_index+1})

    // Create and store the new user 
    const material = await InvoiceMaterial.create(req.body)

    if (material) { // Created 
        return res.status(201).json({ message: 'New material created' })
    } else {
        return res.status(400).json({ message: 'Invalid material data received' })
    }

}

// @desc Update a material
// @route PATCH /materials
// @access Private
const updateMaterial = async (req, res) => {
    const { id, in_stock_inc } = req.body

    // Confirm material exists to update
    const material = await InvoiceMaterial.findById(id).exec()

    if (!material) {
        return res.status(400).json({ message: 'Material not found' })
    }

    //material.in_stock = in_stock
    if (in_stock_inc) {
        const updatedMaterial = await material.update({ $inc: { in_stock: in_stock_inc } })
    }

    // merge current entry with changed updated key:values
    //let newObject = ([...material, ...req.body]);
    Object.assign(material, req.body);

    //material.item = item
    //material.price = price
    //material.measure = measure
    //material.in_stock = in_stock

    const updatedMaterial = await material.save()

    // write update to database
    //let updatedMaterial = await  InvoiceMaterial.findOneAndUpdate(id, { $set: newObject }, )

    res.json(`'${updatedMaterial.item}' updated`)
}

// @desc Delete a material
// @route DELETE /materials
// @access Private
const deleteMaterial = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Material ID required' })
    }

    // Confirm material exists to delete 
    const material = await InvoiceMaterial.findById(id).exec()

    if (!material) {
        return res.status(400).json({ message: 'Material not found' })
    }

    const result = await material.deleteOne()

    const reply = `Material '${result.item}' with ID ${result._id} deleted`

    res.json(reply)
}

module.exports = {
    getAllInvoices,
    createNewInvoice,
    deleteInvoice,

    getAllMaterials,
    createNewMaterial,
    updateMaterial,
    deleteMaterial
}