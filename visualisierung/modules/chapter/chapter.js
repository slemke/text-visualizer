const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    // return magic document data
    /*
    {

    }
    */
});

router.get('/:id', function(req, res) {
    let chapter = {
        id: 1,
        title: "Eine kurze Einführung in Betriebssysteme"

    };

    res.json(chapter);
});

module.exports = router;
