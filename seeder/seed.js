let mongoose = require("mongoose");
let db = require("../models");

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/budget", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

let budgetSeed = [
  {
    name: "Rent",
    value: 1000,
    day: new Date(new Date().setDate(new Date().getDate() - 10)),
  },
  {
    name: "Gas",
    value: 500,
    day: new Date(new Date().setDate(new Date().getDate() - 8)),
  },
  {
    name: "Food",
    value: 2000,
    day: new Date(new Date().setDate(new Date().getDate() - 6)),
  },
  {
    name: "Utilities",
    value: 1500,
    day: new Date(new Date().setDate(new Date().getDate() - 4)),
  },
  {
    name: "Internet",
    value: 700,
    day: new Date(new Date().setDate(new Date().getDate() - 2)),
  },
];

db.Transaction.deleteMany({})
  .then(() => db.Transaction.collection.insertMany(budgetSeed))
  .then((data) => {
    console.log(data.result.n + " records inserted!");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });