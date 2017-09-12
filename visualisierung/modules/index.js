const express = require('express');
const router = express.Router();

router.use('/documents', require('./documents/documents.js'));

module.exports = router;
