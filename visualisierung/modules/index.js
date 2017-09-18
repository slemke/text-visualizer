const express = require('express');
const router = express.Router();

router.use('/documents', require('./abstract/abstract.js'));
router.use('/documents', require('./chapter/chapter.js'));
router.use('/documents', require('./documents/documents.js'));
router.use('/documents', require('./paragraph/paragraph.js'));
router.use('/documents', require('./section/section.js'));
router.use('/documents', require('./sentences/sentences.js'));
router.use('/documents', require('./subsection/subsection.js'));
router.use('/documents', require('./words/words.js'));

module.exports = router;
