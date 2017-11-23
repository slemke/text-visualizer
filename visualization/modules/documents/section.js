const express = require('express');
const router = express.Router();

router.get('/:documentID/section/', function(req, res) {

    const documentID = req.params.documentID;

    const chapterID = req.query.chapterID;

});

router.get('/:documentID/section/:sectionID', function(req, res) {

    const documentID = req.params.documentID;

    const sectionID = req.params.sectionID;
});

module.exports = router;
