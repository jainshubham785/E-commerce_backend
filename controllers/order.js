const { Order, Product } = require("../models/order")

exports.getOrderById = (req, res, next, id) => {
    Order.findById(id)
        .populate("products.product", "name price")
        .exec((err, order) => {
            if (err) {
                return res.status(400).json({
                    error: "No order Found"
                })
            }
            req.order = order;
            next();
        })
}


exports.createOrder = (req, res) => {
    req.body.order.user = req.profile;
    console.log(req.body);
    const order = new Order(req.body.order)
    order.save((err, order) => {
        if (err) {
            return res.status(400).json({
                erorr: "Failed to Save Order In DB"
            })
        }
        res.json(order);
    })
}

exports.getAllOrders = (req, res) => {
    Order.find()
        .populate("user", "_id name")
        .exec((err, order) => {
            if (err) {
                return res.status(400).json({
                    error: "No orders found in DB"
                })
            }
            res.json(order);
        })
}


exports.getOrderStatus = (req, res) => {
    res.json(Order.schema.path("status").enumValues)
    //
}

exports.updateStatus = (req, res) => {
    Order.update(
        { _id: req.body.oderId },
        { $set: { status: req.body.status } },
        (err, order) => {
            if (err) {
                return res.status(400).json({
                    error: "Cannot update order status"
                })
            }
            res.json(order)
        }
    )
}