const router = require('express').Router();
const { police_check } = require('../../middlewares');
const deliveryAddressController = require('./controller');

router.get('/delivery-addresses',
    police_check('view', 'DeliveryAddress'),
    deliveryAddressController.index
);
router.post('/delivery-address',
    police_check('create', 'DeliveryAddress'),
    deliveryAddressController.store
);
router.put('/delivery-address/:id', deliveryAddressController.update);
router.delete('/delivery-address:id', deliveryAddressController.destroy);

module.exports = router;