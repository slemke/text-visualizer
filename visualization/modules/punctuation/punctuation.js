const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/:documentid/punctuation/', function(req, res) {

    const documentID = req.params.documentid;

    const id = req.query.id;

    const chapterID = req.query.chapterid;

    const sectionID = req.query.sectionid;

    const subsectionID = req.query.subsectionid;

    const subsubsectionID = req.query.subsubsectionid;

    const sentenceID = req.query.sentenceid;

    fs.readFile(path.join(__dirname, '../../db/' + documentID, 'punctuation.json'), 'utf-8', function(err, result) {
        if(err)
            res.status(500).end();

        let punctuation = JSON.parse(result);

        if(id != undefined) {
            punctuation = punctuation.filter(function(obj) {
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
            punctuation = punctuation.filter(function(obj) {
                return obj.chapterID == chapterID;
            });
        } else if(sectionID != undefined) {
            punctuation = punctuation.filter(function(obj) {
                return obj.sectionID == sectionID;
            });
        } else if(subsectionID != undefined) {
            punctuation = punctuation.filter(function(obj) {
                return obj.subsectionID == subsectionID;
            });
        } else if(subsubsectionID != undefined) {
            punctuation = punctuation.filter(function(obj) {
                return obj.subsubsectionID == subsubsectionID;
            });
        } else if(sentenceID != undefined) {
            punctuation = punctuation.filter(function(obj) {
                return obj.sentenceID == sentenceID;
            });
        }
        res.status(200).json(punctuation);

    });
});

module.exports = router;
