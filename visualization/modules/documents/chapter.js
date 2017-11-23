const express = require('express');
const router = express.Router();

router.get('/:documentID/chapter/', function(req, res) {

    const documentID = req.params.documentID;
});

router.get('/:documentID/chapter/:chapterID', function(req, res) {

    const documentID = req.params.documentID;

    const chapterID = req.query.chapterID;
});

module.exports = router;
