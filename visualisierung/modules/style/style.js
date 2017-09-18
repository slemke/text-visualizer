const express = require('express');
const router = express.Router();

router.get('/:documentID/nominalstyle/', function(req, res) {

    const documentID = req.params.documentID;

    const chapterID = req.query.chapterID;

    const sectionID = req.query.sectionID;

    const subsectionID = req.query.subsectionID;

    const paragraphID = req.query.paragraphID;

});

module.exports = router;
