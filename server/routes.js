const express = require("express");
const createInvoice = require("./controllers/createInvoice");
const getInvoice = require("./controllers/getInvoice");
const deleteInvoice = require("./controllers/deleteInvoice");
const updateInvoice = require("./controllers/updateInvoice");
const createMembership = require("./controllers/createMembership");
const checkIn = require("./controllers/checkIn");
const createUser = require("./controllers/createUser");

const router = express.Router();

router.post("/invoice/create", createInvoice);
router.get("/invoice/read/:id", getInvoice);
router.delete("/invoice/delete/:id", deleteInvoice);
router.patch("/invoice/update/:id", updateInvoice);

router.post("/membership/create", createMembership);

router.get("/checkIn/:id", checkIn);

router.post("/user/create", createUser);

module.exports = router;
