const express = require('express');
const router = express.Router();

router.use('/document', require('./abstract/abstract.js'));
router.use('/document', require('./chapter/chapter.js'));
router.use('/document', require('./documents/documents.js'));
router.use('/document', require('./paragraph/paragraph.js'));
router.use('/document', require('./section/section.js'));
router.use('/document', require('./sentences/sentences.js'));
router.use('/document', require('./subsection/subsection.js'));
router.use('/document', require('./words/words.js'));

router.use('/document', require('./length/length.js'));
router.use('/document', require('./punctuation/punctuation.js'));
router.use('/document', require('./stats/stats.js'));
router.use('/document', require('./stopwords/stopwords.js'));
router.use('/document', require('./style/style.js'));
router.use('/document', require('./wordcount/wordcount.js'));

module.exports = router;
