const express = require('express');
const router = express.Router();

router.get('/:documentID/statistics/', function(req, res) {

    const documentID = req.params.documentID;

    const chapterID = req.query.chapterID;

    const sectionID = req.query.sectionID;

    const subsectionID = req.query.subsectionID;

    let stopwords = req.query.stopwords;

    // return stats based on filter / selection

});
