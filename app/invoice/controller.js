const Invoice = require('./model');
const Order = require('../order/model');
const { policyFor } = require('../../utils');
const { subject } = require('@casl/ability');


const show = async (req, res, next) => {
    try {

        //let { order_id } = req.params;
        let { order_id } = req.params;
        //console.log(id)
        let invoice = await Invoice
            .findOne({ order: order_id })
            .populate('order')
            .populate('user');

        // List produk yang diorder        
        let order = await Order.findById(order_id).populate('order_items');

        let policy = policyFor(req.user);
        let subjectInvoice = subject('Invoice', { ...invoice, user_id: invoice.user._id });
        if (!policy.can('read', subjectInvoice)) {
            return res.json({
                error: 1,
                message: 'Anda tidak memiliki akses untuk melihat invoice ini'
            });
        }


        let formatInvoices = {
            _id: invoice._id,
            payment_status: invoice.payment_status,
            sub_total: invoice.sub_total,
            delivery_fee: invoice.delivery_fee,
            total: invoice.total,
            order: {
                order_number: invoice.order.order_number,
                order_items: order.order_items
            },
            delivery_address: invoice.delivery_address,
            user: {
                name: invoice.user.full_name,
                email: invoice.user.email,
            },
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt
        }

        return res.json(formatInvoices);
        //return res.json(invoice);
    } catch (err) {
        return res.json({
            error: 1,
            message: err.message
            //message: "Error when getting invoice"
        });
    }
}

const showSells = async (req, res, next) => {
    try {
        //console.log(id)
        let sells = await Invoice.find()

        let total = sells.map(sell => {
            return {
                total: sell.total
            }
        })
        let totalSellItem = items => {
            return items.reduce((acc, curr) => acc + curr.total, 0);
        }

        return res.json(totalSellItem(total));
        //return res.json(invoice);
    } catch (err) {
        return res.json({
            error: 1,
            message: err.message
            //message: "Error when getting invoice"
        });
    }
}
module.exports = {
    show,
    showSells
};
