const express = require('express');
const router = express.Router();

router.get('/:documentID/token', function(req, res) {

    const documentID = req.params.documentID;

    const chapterID = req.query.chapterID;

    const sectionID = req.query.sectionID;

    const subsectionID = req.query.subsectionID;

    const paragraphID = req.query.paragraphID;

});

router.get('/:documentID/token/:tokenID', function(req, res) {

    const documentID = req.params.documentID;

    const tokenID = req.params.tokenID;

});

module.exports = router;
