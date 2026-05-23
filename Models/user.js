const mongoose = require("mongoose");
const { Schema } = mongoose;


async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/relationDemo");
}

main()
    .then(() => console.log("connected"))
    .catch(err => console.log(err));

const userSchema = new Schema({
    username: String,
    addresses: [
        {
            _id: false,         //sets no id for adresses if use this
            location: String,
            city: String
        }
    ]
});

const User = mongoose.model("User", userSchema);

const addUsers = async () => {
    let user1 = new User({
        username: "aK",
        addresses: [{
            location: "B643",
            city: "knp"
        }]
    });

    user1.addresses.push({ location: "B6", city: "lko" });

    let res = await user1.save();
    console.log(res);
}

addUsers();
