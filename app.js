//jshint esversion:6

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb+srv://octapff:weddewtr3_ASD@cluster0.7usqj.mongodb.net/secretsDB?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

const secretSchema = new mongoose.Schema({
    content:{
        type: String,
        required: true
    }
});

const userSchema = new mongoose.Schema({
    userEmail:{
        type: String,
        required: true
    },
    userPassword:{
        type: String,
        minlength: 8,
        required: true
    }
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["userPassword"] });



const Secret = mongoose.model("Secret", secretSchema);

const User = mongoose.model("User", userSchema);





app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    const newUser = new User({
        userEmail: req.body.username,
        userPassword: req.body.password
    });

    newUser.save( (err) => {
        if (err) {
            console.error(err);
        } else {
            res.render("secrets");
        }
    });

});

app.post("/login", (req, res) => {
    const userName = req.body.username;
    const password = req.body.password;

    User.findOne({userEmail: userName}, (err, docs) => {
        if (err) {
            console.log(err)
        } else {
            if (docs) {
                if (docs.userPassword === password) {
                    res.render("secrets");
                }
            }
        }
    });

});


app.listen(3000, () => {
    console.log("Server started on port 3000");
});