const router = require('express').Router();
const invoiceController = require('./controller');
const { police_check } = require('../../middlewares');

router.get('/invoices/:order_id', invoiceController.show);
router.get('/sells', police_check('manage', 'all'), invoiceController.showSells);

module.exports = router;
