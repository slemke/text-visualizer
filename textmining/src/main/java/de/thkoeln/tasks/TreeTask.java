package de.thkoeln.tasks;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.thkoeln.corpora.Document;
import de.thkoeln.corpora.document.*;
import de.thkoeln.corpora.document.Chapter;
import de.thkoeln.corpora.document.Section;
import de.thkoeln.corpora.document.SubSubSection;
import de.thkoeln.corpora.pojo.*;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

public class TreeTask extends AbstractTask {

    @Override
    public Document apply(Document doc) {

        ArrayList<Node> nodeList = new ArrayList<>();

        ObjectMapper mapper = new ObjectMapper();

        ArrayList<SentenceLength> sentenceLengthArrayList = new ArrayList<>();
        ArrayList<Punctuation> punctuationArrayList = new ArrayList<>();
        ArrayList<Stopword> stopwordArrayList = new ArrayList<>();
        ArrayList<Wordcount> wordcountArrayList = new ArrayList<>();

        try {
            sentenceLengthArrayList = mapper.readValue(new File("textmining/output/length.json"), new TypeReference<ArrayList<SentenceLength>>() {});
            punctuationArrayList = mapper.readValue(new File("textmining/output/punctuation.json"), new TypeReference<ArrayList<Punctuation>>() {});
            stopwordArrayList = mapper.readValue(new File("textmining/output/stopwords.json"), new TypeReference<ArrayList<Stopword>>() {});
            wordcountArrayList = mapper.readValue(new File("textmining/output/wordcount.json"), new TypeReference<ArrayList<Wordcount>>() {});
        } catch (IOException e) {
            e.printStackTrace();
        }


        Node root = new Node();
        root.setId(0);
        root.setName(doc.getTitle());

        for(Chapter c : doc.getChapters()) {
            Node node = new Node();
            ArrayList<Node> chapterChildren = new ArrayList<>();

            node.setId(c.getId());
            node.setName(c.getTitle());
            int chapterCount = 0;

            for(Section s : c.getSections()) {
                Node sectionNode = new Node();
                ArrayList<Node> sectionChildren = new ArrayList<>();

                int sectionCount = 0;

                sectionNode.setId(s.getId());
                sectionNode.setName(s.getTitle());

                for(Paragraph p : s.getParagraphs()) {
                    ArrayList<Sentence> sentences = (ArrayList<Sentence>) p.getSentences();

                    for(Sentence sentence : sentences) {
                        chapterCount += sentence.getToken().size();
                        sectionCount += sentence.getToken().size();
                    }
                }

                for(Subsection ss : s.getSubsections()) {
                    Node subSectionNode = new Node();
                    ArrayList<Node> subSectionChildren = new ArrayList<>();

                    subSectionNode.setId(ss.getId());
                    subSectionNode.setName(ss.getTitle());

                    int subsectionCount = 0;

                    for(Paragraph p : ss.getParagraphs()) {
                        ArrayList<Sentence> sentences = (ArrayList<Sentence>) p.getSentences();

                        for(Sentence sentence : sentences) {
                            chapterCount += sentence.getToken().size();
                            sectionCount += sentence.getToken().size();
                            subsectionCount += sentence.getToken().size();
                        }
                    }

                    for(SubSubSection sss : ss.getSubSubSections()) {
                        Node subSubSectionNode = new Node();

                        subSubSectionNode.setId(sss.getId());
                        subSubSectionNode.setName(sss.getTitle());

                        int subsubsectionCount = 0;

                        for(Paragraph p : ss.getParagraphs()) {
                            ArrayList<Sentence> sentences = (ArrayList<Sentence>) p.getSentences();

                            for(Sentence sentence : sentences) {
                                chapterCount += sentence.getToken().size();
                                sectionCount += sentence.getToken().size();
                                subsectionCount += sentence.getToken().size();
                                subsubsectionCount += sentence.getToken().size();
                            }
                        }

                        // set worst word count
                        int worstWordCount = 0;
                        for(Wordcount count : wordcountArrayList) {
                            if(count.getChapterID() == c.getId()
                                    && count.getSectionID() == s.getId()
                                    && count.getSubsectionID() == ss.getId()
                                    && count.getSubsubsectionID() == sss.getId()) {
                                if(count.getCount() > worstWordCount)
                                    worstWordCount = count.getCount();
                            }
                        }
                        subSubSectionNode.setWorstWordCount(worstWordCount);

                        // set worst stopwords
                        int worstStopwordsCount = 0;
                        for(Stopword stopword : stopwordArrayList) {
                            if(stopword.getChapterID() == c.getId()
                                    && stopword.getSectionID() == s.getId()
                                    && stopword.getSubsectionID() == ss.getId()
                                    && stopword.getSubsubsectionID() == sss.getId()) {
                                if(stopword.getCount() > worstStopwordsCount)
                                    worstStopwordsCount = stopword.getCount();
                            }
                        }
                        subSubSectionNode.setWorstStopwordCount(worstStopwordsCount);

                        // set worst punctuation
                        int worstPunctuation = 0;
                        for(Punctuation punctuation : punctuationArrayList) {
                            if(punctuation.getChapterID() == c.getId()
                                    && punctuation.getSectionID() == s.getId()
                                    && punctuation.getSubsectionID() == ss.getId()
                                    && punctuation.getSubsubsectionID() == sss.getId()) {
                                if(punctuation.getCount() > worstPunctuation)
                                    worstPunctuation = punctuation.getCount();
                            }
                        }
                        subSubSectionNode.setWorstSentencePunctuation(worstPunctuation);

                        // set worst length
                        int worstLength = 0;
                        for(SentenceLength length : sentenceLengthArrayList) {
                            if(length.getChapterID() == c.getId()
                                    && length.getSectionID() == s.getId()
                                    && length.getSubsectionID() == ss.getId()
                                    && length.getSubsubsectionID() == sss.getId())
                                if(length.getLength() > worstLength)
                                    worstLength = length.getLength();
                        }
                        subSubSectionNode.setWorstSentenceLength(worstLength);

                        subSubSectionNode.setSize(subsubsectionCount);
                        subSectionChildren.add(subSubSectionNode);
                    }

                    // set worst word count
                    int worstWordCount = 0;
                    for(Wordcount count : wordcountArrayList) {
                        if(count.getChapterID() == c.getId()
                                && count.getSectionID() == s.getId()
                                && count.getSubsectionID() == ss.getId()) {
                            if(count.getCount() > worstWordCount)
                                worstWordCount = count.getCount();
                        }
                    }
                    subSectionNode.setWorstWordCount(worstWordCount);

                    // set worst stopwords
                    int worstStopwordsCount = 0;
                    for(Stopword stopword : stopwordArrayList) {
                        if(stopword.getChapterID() == c.getId()
                                && stopword.getSectionID() == s.getId()
                                && stopword.getSubsectionID() == ss.getId()) {
                            if(stopword.getCount() > worstStopwordsCount)
                                worstStopwordsCount = stopword.getCount();
                        }
                    }
                    subSectionNode.setWorstStopwordCount(worstStopwordsCount);

                    // set worst punctuation
                    int worstPunctuation = 0;
                    for(Punctuation punctuation : punctuationArrayList) {
                        if(punctuation.getChapterID() == c.getId()
                                && punctuation.getSectionID() == s.getId()
                                && punctuation.getSubsectionID() == ss.getId()) {
                            if(punctuation.getCount() > worstPunctuation)
                                worstPunctuation = punctuation.getCount();
                        }
                    }
                    subSectionNode.setWorstSentencePunctuation(worstPunctuation);

                    // set worst length
                    int worstLength = 0;
                    for(SentenceLength length : sentenceLengthArrayList) {
                        if(length.getChapterID() == c.getId()
                                && length.getSectionID() == s.getId()
                                && length.getSubsectionID() == ss.getId())
                            if(length.getLength() > worstLength)
                                worstLength = length.getLength();
                    }
                    subSectionNode.setWorstSentenceLength(worstLength);

                    subSectionNode.setSize(subsectionCount);
                    sectionChildren.add(subSectionNode);
                    subSectionNode.setChildren(subSectionChildren);
                }

                // set worst word count
                int worstWordCount = 0;
                for(Wordcount count : wordcountArrayList) {
                    if(count.getChapterID() == c.getId() && count.getSectionID() == s.getId()) {
                        if(count.getCount() > worstWordCount)
                            worstWordCount = count.getCount();
                    }
                }
                sectionNode.setWorstWordCount(worstWordCount);

                // set worst stopwords
                int worstStopwordsCount = 0;
                for(Stopword stopword : stopwordArrayList) {
                    if(stopword.getChapterID() == c.getId() && stopword.getSectionID() == s.getId()) {
                        if(stopword.getCount() > worstStopwordsCount)
                            worstStopwordsCount = stopword.getCount();
                    }
                }
                sectionNode.setWorstStopwordCount(worstStopwordsCount);

                // set worst punctuation
                int worstPunctuation = 0;
                for(Punctuation punctuation : punctuationArrayList) {
                    if(punctuation.getChapterID() == c.getId() && punctuation.getSectionID() == s.getId()) {
                        if(punctuation.getCount() > worstPunctuation)
                            worstPunctuation = punctuation.getCount();
                    }
                }
                sectionNode.setWorstSentencePunctuation(worstPunctuation);

                // set worst length
                int worstLength = 0;
                for(SentenceLength length : sentenceLengthArrayList) {
                    if(length.getChapterID() == c.getId() && length.getSectionID() == s.getId())
                        if(length.getLength() > worstLength)
                            worstLength = length.getLength();
                }
                sectionNode.setWorstSentenceLength(worstLength);

                sectionNode.setSize(sectionCount);
                sectionNode.setChildren(sectionChildren);
                chapterChildren.add(sectionNode);
            }

            // set worst word count
            int worstWordCount = 0;
            for(Wordcount count : wordcountArrayList) {
                if(count.getChapterID() == c.getId()) {
                    if(count.getCount() > worstWordCount)
                        worstWordCount = count.getCount();
                }
            }
            node.setWorstWordCount(worstWordCount);

            // set worst stopwords
            int worstStopwordsCount = 0;
            for(Stopword stopword : stopwordArrayList) {
                if(stopword.getChapterID() == c.getId()) {
                    if(stopword.getCount() > worstStopwordsCount)
                        worstStopwordsCount = stopword.getCount();
                }
            }
            node.setWorstStopwordCount(worstStopwordsCount);

            // set worst punctuation
            int worstPunctuation = 0;
            for(Punctuation punctuation : punctuationArrayList) {
                if(punctuation.getChapterID() == c.getId()) {
                    if(punctuation.getCount() > worstPunctuation)
                        worstPunctuation = punctuation.getCount();
                }
            }
            node.setWorstSentencePunctuation(worstPunctuation);

            // set worst length
            int worstLength = 0;
            for(SentenceLength length : sentenceLengthArrayList) {
                if(length.getChapterID() == c.getId())
                    if(length.getLength() > worstLength)
                        worstLength = length.getLength();
            }
            node.setWorstSentenceLength(worstLength);


            node.setSize(chapterCount);
            node.setChildren(chapterChildren);
            nodeList.add(node);
        }

        root.setChildren(nodeList);

        try {
            mapper.writerWithDefaultPrettyPrinter().writeValue(new File("textmining/output/tree.json"), root);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return doc;
    }
}
