const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const productCartSchema = new mongoose.Schema({
    product: {
        type: ObjectId,
        ref: "Product"
    },
    name: { type: String },
    count: { type: Number },
    price: { type: Number }
});

const ProductCart = mongoose.model("ProductCart", productCartSchema);

const orderSchema = new mongoose.Schema({
    products: [ productCartSchema ],
    transaction_id: {},
    amount: { type: Number },
    address: { type: String },
    status: {
        type: String,
        default: "Received",
        enum: [ "Cancelled", "Delivered", "Shiped", "Processing", "Received" ]
    },
    updated: { type: Date },
    user: {
        type: ObjectId,
        ref: "User"
    }
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order, ProductCart }


