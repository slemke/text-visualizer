package de.thkoeln.tasks;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.thkoeln.corpora.Document;
import de.thkoeln.corpora.document.*;
import de.thkoeln.corpora.language.StopwordFilter;
import de.thkoeln.corpora.pojo.Wordcount;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class WordcountTask extends AbstractTask {

    @Override
    public Document apply(Document doc) {

        ArrayList<Wordcount> counterList = new ArrayList<>();

        StopwordFilter filter = new StopwordFilter("textmining/lists/stopwords.txt");
        ArrayList<String> stopWords = filter.getStopWords();

        stopWords.add(",");
        stopWords.add(":");
        stopWords.add(".");
        stopWords.add(";");
        stopWords.add("!");
        stopWords.add("?");

        for(Chapter c : doc.getChapters()) {

            int chapterWordCount = 0;
            HashMap<String, Integer> chapterCount = new HashMap<>();

            for(Section s : c.getSections()) {

                int sectionWordCount = 0;

                HashMap<String, Integer> sectionCount = new HashMap<>();

                for(Paragraph p : s.getParagraphs()) {
                    HashMap<String, Integer> paragraphWordcount = new HashMap<>();

                    for(Sentence sentence : p.getSentences()) {
                        ArrayList<Token> token = (ArrayList<Token>) sentence.getToken();
                        chapterWordCount += token.size();
                        sectionWordCount += token.size();

                        for(Token t : token) {
                            if(!stopWords.contains(t.getToken())) {
                                paragraphWordcount.merge(t.getToken(), 1, (a, b) -> a + b);
                                chapterCount.merge(t.getToken(), 1, (a, b) -> a + b);
                                sectionCount.merge(t.getToken(), 1, (a, b) -> a + b);
                            }
                        }
                    }
                }

                for(Subsection ss : s.getSubsections()) {

                    int subSectionWordCount = 0;

                    HashMap<String, Integer> subsectionCounter = new HashMap<>();

                    for(Paragraph p : ss.getParagraphs()) {
                        HashMap<String, Integer> paragraphWordcount = new HashMap<>();

                        for(Sentence sentence : p.getSentences()) {
                            ArrayList<Token> token = (ArrayList<Token>) sentence.getToken();
                            chapterWordCount += token.size();
                            sectionWordCount += token.size();
                            subSectionWordCount += token.size();

                            for(Token t : token) {
                                if(!stopWords.contains(t.getToken())) {
                                    paragraphWordcount.merge(t.getToken(), 1, (a, b) -> a + b);
                                    chapterCount.merge(t.getToken(), 1, (a, b) -> a + b);
                                    sectionCount.merge(t.getToken(), 1, (a, b) -> a + b);
                                    subsectionCounter.merge(t.getToken(), 1, (a, b) -> a + b);
                                }
                            }
                        }
                    }

                    for(SubSubSection sss : ss.getSubSubSections()) {

                        HashMap<String, Integer> subsubsectionCounter = new HashMap<>();

                        int subsubsectionWordCount = 0;

                        for(Paragraph p : sss.getParagraphs()) {
                            HashMap<String, Integer> paragraphWordcount = new HashMap<>();

                            for(Sentence sentence : p.getSentences()) {
                                ArrayList<Token> token = (ArrayList<Token>) sentence.getToken();
                                chapterWordCount += token.size();
                                sectionWordCount += token.size();
                                subSectionWordCount += token.size();
                                subsubsectionWordCount += token.size();

                                for(Token t : token) {
                                    if(!stopWords.contains(t.getToken())) {
                                        paragraphWordcount.merge(t.getToken(), 1, (a, b) -> a + b);
                                        chapterCount.merge(t.getToken(), 1, (a, b) -> a + b);
                                        sectionCount.merge(t.getToken(), 1, (a, b) -> a + b);
                                        subsectionCounter.merge(t.getToken(), 1, (a, b) -> a + b);
                                        subsubsectionCounter.merge(t.getToken(), 1, (a, b) -> a + b);
                                    }
                                }
                            }
                        }

                        int max = 0;

                        for(Map.Entry<String, Integer> e : chapterCount.entrySet()) {
                            if(e.getValue() > max)
                                max = e.getValue();
                        }

                        for(Map.Entry<String, Integer> e : subsubsectionCounter.entrySet()) {
                            Wordcount wordcount = new Wordcount();
                            wordcount.setChapterID(c.getId());
                            wordcount.setSectionID(s.getId());
                            wordcount.setSubsectionID(ss.getId());
                            wordcount.setSubsubsectionID(sss.getId());

                            wordcount.setCount(e.getValue());
                            wordcount.setWord(e.getKey());
                            wordcount.setNormalized((double) wordcount.getCount() / (double) subsubsectionWordCount * 100.0);

                            counterList.add(wordcount);
                        }
                    }

                    int max = 0;

                    for(Map.Entry<String, Integer> e : chapterCount.entrySet()) {
                        if(e.getValue() > max)
                            max = e.getValue();
                    }

                    for(Map.Entry<String, Integer> e : subsectionCounter.entrySet()) {
                        Wordcount wordcount = new Wordcount();
                        wordcount.setChapterID(c.getId());
                        wordcount.setSectionID(s.getId());
                        wordcount.setSubsectionID(ss.getId());

                        wordcount.setCount(e.getValue());
                        wordcount.setWord(e.getKey());
                        wordcount.setNormalized((double) wordcount.getCount() / (double) subSectionWordCount * 100.0);

                        counterList.add(wordcount);
                    }
                }

                int max = 0;

                for(Map.Entry<String, Integer> e : chapterCount.entrySet()) {
                    if(e.getValue() > max)
                        max = e.getValue();
                }

                for(Map.Entry<String, Integer> e : sectionCount.entrySet()) {
                    Wordcount wordcount = new Wordcount();
                    wordcount.setChapterID(c.getId());
                    wordcount.setSectionID(s.getId());

                    wordcount.setCount(e.getValue());
                    wordcount.setWord(e.getKey());
                    wordcount.setNormalized((double) wordcount.getCount() / (double) sectionWordCount * 100.0);

                    counterList.add(wordcount);
                }
            }

            for(Map.Entry<String, Integer> e : chapterCount.entrySet()) {
                Wordcount wordcount = new Wordcount();
                wordcount.setChapterID(c.getId());

                wordcount.setCount(e.getValue());
                wordcount.setWord(e.getKey());
                wordcount.setNormalized((double) wordcount.getCount() / (double) chapterWordCount * 100.0);

                counterList.add(wordcount);
            }
        }

        ObjectMapper mapper = new ObjectMapper();

        try {
            mapper.writerWithDefaultPrettyPrinter().writeValue(new File("textmining/output/wordcount.json"), counterList);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return doc;
    }
}
