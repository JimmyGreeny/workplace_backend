// Load Book model
import Book from '../models/Book.js'
import MaterialItem from '../models/MaterialItem.js'
import Invoice from '../models/Invoice.js'

// @route GET api/books/test
// @description tests books route
// @access Public
const test = (req, res) => {
    return res.send('book route testing!');
}

const listInvoices = (req, res) => {
  Invoice.find()
    .then((invoices) => res.json(invoices))
    .catch((err) => res.status(404).json({ nobooksfound: 'No Invoices found' }));
}

const createInvoice = (req, res) => {
  Invoice.create(req.body)
    .then((invoice) => res.json(invoice))
    .catch((err) => res.status(400).json({ error: 'Unable to add this Invoice' }));
}

const removeInvoice = (req, res) => {
  Invoice.findByIdAndRemove(req.params.id, req.body)
    .then((materialItem) => res.json({ mgs: 'Invoice entry deleted successfully' }))
    .catch((err) => res.status(404).json({ error: 'No such a Invoice' }));
}

// @route GET api/books
// @description Get all books
// @access Public
const list = (req, res) => {
    Book.find()
      .then((books) => res.json(books))
      .catch((err) => res.status(404).json({ nobooksfound: 'No Books found' }));
}

const listItems = (req, res) => {
  MaterialItem.find().sort({ index: 'desc' })
    .then((materialItem) => res.json(materialItem))
    .catch((err) => res.status(404).json({ nobooksfound: 'No Books found' }));
}


// @route GET api/books
// @description add/save book
// @access Public
const create = (req, res) => {
  Book.create(req.body)
    .then((book) => res.json({ msg: 'Book added successfully' }))
    .catch((err) => res.status(400).json({ error: 'Unable to add this book' }));
}

const createItem = (req, res) => {
  MaterialItem.create(req.body)
    .then((materialItem) => res.json( materialItem._id ))
    .catch((err) => res.status(400).json({ error: 'Unable to add this item' }));
}

// @route GET api/books/:id
// @description Update book
// @access Public
const update = (req, res) => {
    Book.findByIdAndUpdate(req.params.id, req.body)
      .then((book) => res.json({ msg: 'Updated successfully' }))
      .catch((err) =>
        res.status(400).json({ error: 'Unable to update the Database' })
    );
}

const updateItem = (req, res) => {
  MaterialItem.findByIdAndUpdate(req.params.id, req.body)
    .then((materialItem) => res.json({ msg: 'Updated successfully' }))
    .catch((err) =>
      res.status(400).json({ error: 'Unable to update the Database' })
  );
}

// @route GET api/books/:id
// @description Delete book by id
// @access Public
const remove = (req, res) => {
    Book.findByIdAndRemove(req.params.id, req.body)
      .then((book) => res.json({ mgs: 'Book entry deleted successfully' }))
      .catch((err) => res.status(404).json({ error: 'No such a book' }));
  }

  const removeItem = (req, res) => {
    MaterialItem.findByIdAndRemove(req.params.id, req.body)
      .then((materialItem) => res.json({ mgs: 'Book entry deleted successfully' }))
      .catch((err) => res.status(404).json({ error: 'No such a book' }));
  }

  const removeAllItems = (req, res) => {
    MaterialItem.deleteMany({})
      .then((materialItem) => res.json({ mgs: 'Book entry deleted successfully' }))
      .catch((err) => res.status(404).json({ error: 'No such a items' }));
  }

  export default {
    test,
    list,
    create,
    update,
    remove,
    createItem,
    listItems,
    removeItem,
    updateItem,
    removeAllItems,

    listInvoices,
    createInvoice,
    removeInvoice
}