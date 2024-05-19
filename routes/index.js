const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken")

const authenticate = require('../middlewares/authenticate.js');

const authRouter = require("./auth");
const bookRouter = require("./books")


router.use("/auth", authRouter);
router.use("/books", bookRouter);
router.use(authenticate);




module.exports = router;