const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/:documentid/length/', function(req, res) {
    // return sentence length
    const documentID = req.params.documentid;

    const id = req.query.id;

    const chapterID = req.query.chapterid;

    const sectionID = req.query.sectionid;

    const subsectionID = req.query.subsectionid;

    const subsubsectionID = req.query.subsubsectionid;

    const sentenceID = req.query.sentenceid;

    fs.readFile(path.join(__dirname, '../../db/' + documentID, 'length.json'), 'utf-8', function(err, result) {
        if(err)
            res.status(500).end();

        let length = JSON.parse(result);

        if(id != undefined) {
            length = length.filter(function(obj) {
                let found = false;

                if(id == obj.chapterID)
                    found = true;

                if(id == obj.sectionID)
                    found = true;

                if(id == obj.subsectionID)
                    found = true;

                if(id == obj.subsubsectionID)
                    found = true;

                if(id == obj.sentenceID)
                    found = true;

                return found;
            });
        } else if(chapterID != undefined) {
            length = length.filter(function(obj) {
                return obj.chapterID == chapterID;
            });
        } else if(sectionID != undefined) {
            length = length.filter(function(obj) {
                return obj.sectionID == sectionID;
            });
        } else if(subsectionID != undefined) {
            length = length.filter(function(obj) {
                return obj.subsectionID == subsectionID;
            });
        } else if(subsubsectionID != undefined) {
            length = length.filter(function(obj) {
                return obj.subsubsectionID == subsubsectionID;
            });
        }
        res.status(200).json(length);
    });
});

module.exports = router;
