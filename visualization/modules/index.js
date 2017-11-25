const express = require('express');
const router = express.Router();

router.use('/document', require('./documents/documents.js'));
router.use('/document', require('./length/length.js'));
router.use('/document', require('./punctuation/punctuation.js'));
router.use('/document', require('./stopwords/stopwords.js'));
router.use('/document', require('./wordcount/wordcount.js'));

module.exports = router;
