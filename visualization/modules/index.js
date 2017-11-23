const express = require('express');
const router = express.Router();

router.use('/document', require('./documents/abstract.js'));
router.use('/document', require('./documents/chapter.js'));
router.use('/document', require('./documents/documents.js'));
router.use('/document', require('./documents/paragraph.js'));
router.use('/document', require('./documents/section.js'));
router.use('/document', require('./documents/sentences.js'));
router.use('/document', require('./documents/subsection.js'));
router.use('/document', require('./documents/token.js'));

router.use('/document', require('./length/length.js'));
router.use('/document', require('./punctuation/punctuation.js'));
router.use('/document', require('./stopwords/stopwords.js'));
router.use('/document', require('./wordcount/wordcount.js'));

module.exports = router;
