const mongoose = require("mongoose");

const accessAuditSchema = new mongoose.Schema({
    studentEmail: { type: String, required: true },
    professorEmail: { type: String, required: true },
    action: { type: String, enum: ["GRANTED", "REVOKED"], required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AccessAudit", accessAuditSchema);