const mongoose = require("mongoose");
const { Schema } = mongoose;


async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/relationDemo");
}

main()
    .then(() => console.log("connected"))
    .catch(err => console.log(err));

const orderSchema = new Schema({
    item: String,
    price: Number,
});

const customerSchema = new Schema({
    name: String,
    orders: [
        {
            type: Schema.Types.ObjectId,
            ref: "Order"  // this defines the collection to which we get the id from
        }
    ]
});

//pre and post middlewares get triggered when findByIdAndDelete is called for customerschema that is when we call delcust func written below

// customerSchema.pre("findOneAndDelete", async () => {
//     console.log("Pre Middleware");
// });

customerSchema.post("findOneAndDelete", async (customer) => {
    if (customer.orders.length) {
        let res = await Order.deleteMany({ _id: { $in: customer.orders } });
        console.log(res);
    }
});



const Order = mongoose.model("Order", orderSchema);
const Customer = mongoose.model("Customer", customerSchema);

const addCustomer = async () => {
    let cust1 = new Customer({
        name: "RK",
    });

    let order1 = await Order.findOne({ item: "Chips" });
    let order2 = await Order.findOne({ item: "Chocolate" });

    cust1.orders.push(order1);  // Even if you push entire object but only objectId will be pushed iun actual db in mong0
    cust1.orders.push(order2);

    let res = await cust1.save();
    console.log(res);
};

// const addOrders = async () => {
//     let res = await Order.insertMany([
//         { item: "Samosa", price: 12 },
//         { item: "Chips", price: 10 },
//         { item: "Chocolate", price: 40 }
//     ]);
//     console.log(res);
// };

// addOrders();

// addCustomer();

const addCust = async () => {
    let newCust = new Customer({
        name: "Karan"
    });

    let newOrder = new Order({
        item: "Pizza",
        price: 250
    });

    newCust.orders.push(newOrder);

    await newOrder.save();
    await newCust.save();

    console.log("Added");
}

// addCust();

const delCust = async () => {
    let data = await Customer.findByIdAndDelete("69e1292ce95f71327ddb1762");
    console.log(data);
}

// delCust();

const getCust = async () => {
    let res = await Customer.find({ name: "Karan" });
    console.log(res);
};

// getCust();

const getOrder = async () => {
    let res = await Order.find({ item: "Pizza" });
    console.log(res);
};

getOrder();

