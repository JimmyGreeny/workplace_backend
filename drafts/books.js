import express from 'express'
import userCtrl from '../../controllers/user.controller.js'

const router = express.Router();


router.route('/test')
.get(userCtrl.test)

router.route('/')
//.get(userCtrl.list)
//.post(userCtrl.create)
.get(userCtrl.listItems)
.post(userCtrl.createItem)
.delete(userCtrl.removeAllItems)

router.route('/:id')
//.put(userCtrl.update)
.put(userCtrl.updateItem)
//.delete(userCtrl.remove)
.delete(userCtrl.removeItem)

router.route('/invoices')
.get(userCtrl.listInvoices)
.post(userCtrl.createInvoice)

router.route('/invoices/:id')
.delete(userCtrl.removeInvoice)
//.delete(userCtrl.removeAllItems)

export default router