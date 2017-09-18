const express = require('express');
const router = express.Router();

router.get('/:documentID/paragraph/', function(req, res) {

    const documentID = req.params.documentID;

    const chapterID = req.query.chapterID;

    const sectionID = req.query.sectionID;

    const subsectionID = req.query.subsectionID;

});

router.get('/:documentID/paragraph/:paragraphID', function(req, res) {

    const documentID = req.params.documentID;

    const paragraphID = req.params.paragraphID;
});

module.exports = router;
