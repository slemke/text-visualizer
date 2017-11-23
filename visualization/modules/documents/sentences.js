const express = require('express');
const router = express.Router();

router.get('/:documentID/sentences/', function(req, res) {

    const documentID = req.query.documentID;

    const chapterID = req.query.chapterID;

    const sectionID = req.query.sectionID;

    const subsectionID = req.query.subsectionID;

    const paragraphID = req.query.paragraphID;

});

router.get('/:documentID/sentences/:sentenceID', function(req, res) {

    const documentID = req.params.documentID;

    const sentenceID = req.params.sentenceID;
});

module.exports = router;
