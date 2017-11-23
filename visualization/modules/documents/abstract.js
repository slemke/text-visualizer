const express = require('express');
const router = express.Router();

router.get('/:documentID/abstract/', function(req, res) {

    const documentID = req.params.documentID;

});

module.exports = router;
