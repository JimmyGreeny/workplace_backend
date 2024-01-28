const express = require('express')
const router = express.Router()
const invoicesController = require('../controllers/invoicesController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(invoicesController.getAllInvoices)
    .post(invoicesController.createNewInvoice)
    .delete(invoicesController.deleteInvoice)

router.route('/materials')
    .get(invoicesController.getAllMaterials)
    .post(invoicesController.createNewMaterial)
    .patch(invoicesController.updateMaterial)
    .delete(invoicesController.deleteMaterial)

module.exports = router