const express = require('express');
const router = express.Router();

router.get('/:documentID/wordcount/', function(req, res) {
    // returns wordcount for the given document
    const documentID = req.params.documentID;

    const chapterID = req.query.chapterID;

    const sectionID = req.query.sectionID;

    const subsectionID = req.query.subsectionID;

    const paragraphID = req.query.paragraphID;

    let stopwords = req.query.stopwords;

    // filter data based on ids
});
