const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/:documentid', function(req, res) {

    const documentID = req.params.documentid;

    res.sendFile(path.join(__dirname, '../../db/' + documentID, 'document.json'));
});

router.get('/:documentid/meta', function(req, res) {

    const documentID = req.params.documentid;

    res.sendFile(path.join(__dirname, '../../db/' + documentID, 'tree.json'));
});

module.exports = router;
