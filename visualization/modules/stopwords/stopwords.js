const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/:documentid/stopwords/', function(req, res) {

    const documentID = req.params.documentid;

    const id = req.query.id;

    const chapterID = req.query.chapterid;

    const sectionID = req.query.sectionid;

    const subsectionID = req.query.subsectionid;

    const subsubsectionID = req.query.subsubsectionid;

    const paragraphID = req.query.paragraphid;

    fs.readFile(path.join(__dirname, '../../db/' + documentID, 'stopwords.json'), 'utf-8', function(err, result) {
        if(err)
            res.status(500).end();

        let stopwords = JSON.parse(result);

        if(id != undefined) {
            stopwords = stopwords.filter(function(obj) {
                let found = false;

                if(id == obj.chapterID)
                    found = true;

                if(id == obj.sectionID)
                    found = true;

                if(id == obj.subsectionID)
                    found = true;

                if(id == obj.subsubsectionID)
                    found = true;

                if(id == obj.paragraphID)
                    found = true;

                return found;
            });
        } else if(chapterID != undefined) {
            stopwords = stopwords.filter(function(obj) {
                return obj.chapterID == chapterID;
            });
        } else if(sectionID != undefined) {
            stopwords = stopwords.filter(function(obj) {
                return obj.sectionID == sectionID;
            });
        } else if(subsectionID != undefined) {
            stopwords = stopwords.filter(function(obj) {
                return obj.subsectionID == subsectionID;
            });
        } else if(subsubsectionID != undefined) {
            stopwords = stopwords.filter(function(obj) {
                return obj.subsubsectionID == subsubsectionID;
            });
        } else if(paragraphID != undefined) {
            stopwords = stopwords.filter(function(obj) {
                return obj.paragraphID == paragraphID;
            });
        }
        res.status(200).json(stopwords);

    });

});

module.exports = router;
