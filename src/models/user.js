const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

let schema = mongoose.Schema;
let User_schema = new schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: [/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/, 'Please fill a valid phone number']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    default: "user"
  },
  active: {
    type: String,
    required: true,
    default: false
  }
});

module.exports = mongoose.model("User", User_schema);

