const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/:documentid/wordcount/', function(req, res) {
    // returns wordcount for the given document
    const documentID = req.params.documentid;

    const id = req.query.id;

    const chapterID = req.query.chapterid;

    const sectionID = req.query.sectionid;

    const subsectionID = req.query.subsectionid;

    const subsubsectionID = req.query.subsubsectionid;

    fs.readFile(path.join(__dirname, '../../db/' + documentID, 'wordcount.json'), 'utf-8', function(err, result) {
        if(err)
            res.status(500).end();

        let wordcount = JSON.parse(result);

        if(id != undefined) {
            wordcount = wordcount.filter(function(obj) {
                let found = false;

                if(id == obj.chapterID)
                    found = true;

                if(id == obj.sectionID)
                    found = true;

                if(id == obj.subsectionID)
                    found = true;

                if(id == obj.subsubsectionid)
                    found = true;

                return found;
            });
        } else if(chapterID != undefined) {
            wordcount = wordcount.filter(function(obj) {
                return obj.chapterID == chapterID;
            });
        } else if(sectionID != undefined) {
            wordcount = wordcount.filter(function(obj) {
                return obj.sectionID == sectionID;
            });
        } else if(subsectionID != undefined) {
            wordcount = wordcount.filter(function(obj) {
                return obj.subsectionID == subsectionID;
            });
        } else if(subsubsectionID != undefined) {
            wordcount = wordcount.filter(function(obj) {
                return obj.subsubsectionID == subsubsectionID;
            });
        } else if(paragraphID != undefined) {
            wordcount = wordcount.filter(function(obj) {
                return obj.paragraphID == paragraphID;
            });
        }
        res.status(200).json(wordcount);

    });
});

module.exports = router;
