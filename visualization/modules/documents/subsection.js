const express = require('express');
const router = express.Router();

router.get('/:documentID/subsection/', function(req, res) {

    const documentID = req.params.documentID;

    const chapterID = req.query.chapterID;

    const sectionID = req.query.sectionID;

});

router.get('/:documentID/subsection/:subsectionID', function(req, res) {

    const documentID = req.params.documentID;

    const subsectionID = req.params.subsectionID;
});

module.exports = router;
