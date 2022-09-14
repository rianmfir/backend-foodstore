const CartItem = require('../cart-item/model');
const DeliveryAddress = require('../delivery-address/model');
const Order = require('../order/model');
const Invoice = require('../invoice/model');
const { Types } = require('mongoose');
const OrderItem = require('../order-item/model');

const store = async (req, res, next) => {
    try {
        let { delivery_fee, delivery_address } = req.body;
        let items = await CartItem.find({ user: req.user._id }).populate('product');
        if (!items) {
            return res.json({
                error: 1,
                message: "You're not create order, because you have not items in cart"
            })
        }
        let address = await DeliveryAddress.findById(delivery_address);
        let order = new Order({
            _id: new Types.ObjectId(),
            status: 'waiting_payment',
            delivery_fee: delivery_fee,
            delivery_address: {
                provinsi: address.provinsi,
                kabupaten: address.kabupaten,
                kecamatan: address.kecamatan,
                kelurahan: address.kelurahan,
                detail: address.detail,
            },
            user: req.user._id
        });
        let orderItems =
            await OrderItem.insertMany(items.map(item => ({
                ...item,
                name: item.product.name,
                qty: parseInt(item.qty),
                price: parseInt(item.product.price),
                order: order._id,
                product: item.product._id
            })));
        orderItems.forEach(item => order.order_items.push(item));
        order.save();
        await CartItem.deleteMany({user: req.user._id});
    	return res.json(order);
    } catch (err) {
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }
        next(err);
    }
}

const index = async (req, res, next) => {
    try {
        let { skip = 0, limit = 10 } = req.query;
        let count = await Order.find({ user: req.user._id }).countDocuments();
        
        let orderDashboard =
            await Order
                .find({ user: req.user._id })
                .populate('order_items');
                
        let orders =
            await Order
                .find({ user: req.user._id })
                .skip(parseInt(skip))
                .limit(parseInt(limit))
                .populate('order_items')
                .sort('-createdAt');     
                        
        let totalItemsOrder = orderDashboard.map(order => order.toJSON({ virtuals: true }).items_count).reduce((acc, curr) => acc + curr, 0);
               
        let dataInvoice = await Invoice.find({ user: req.user._id });
        let totalPayment = dataInvoice.map(invoice => invoice.total).reduce((acc, curr) => acc + curr, 0);
                    	              
        return res.json({
            data: orders.map(order => order.toJSON({ virtuals: true })),
            count,
            totalItemsOrder,
            totalPayment
        });
    } catch (err) {
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }
        next(err);
    }
}

const show = async(req, res, next)=>{
    try {
      
        let {id} = req.params
        let order = await Order.findById(id)
        .populate('order_items')
        .sort('-createdAt');
        
        return res.json(order)
    } catch (err) {
        if (err && err.name === "ValidationError") {
            return res.status(200).json({
              erros: 1,
              message: err.message,
              fields: err.errors,
            });
          }
          next(err);
    }
}

module.exports = {
    store, index, show
}
