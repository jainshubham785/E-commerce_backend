const mongoose = require('mongoose')

const DB = process.env.DATABASE

mongoose.connect(DB, {
    useFindAndModify: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
    console.log("DATABASE IS CONNECTED");
}).catch((err) => {
    console.log("SOMETHING WRONG WITH DATABASE CONNECTION");
})