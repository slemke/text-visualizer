package de.thkoeln.tasks;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.thkoeln.corpora.Document;
import de.thkoeln.corpora.document.*;
import de.thkoeln.corpora.pojo.Wordcount;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class WordcountTask extends AbstractTask {

    @Override
    public Document apply(Document doc) {

        ArrayList<Wordcount> counterList = new ArrayList<>();

        for(Chapter c : doc.getChapters()) {

            for(Section s : c.getSections()) {

                for(Paragraph p : s.getParagraphs()) {
                    HashMap<String, Integer> paragraphWordcount = new HashMap<>();

                    for(Sentence sentence : p.getSentences()) {
                        ArrayList<Token> token = (ArrayList<Token>) sentence.getToken();

                        for(Token t : token) {
                            paragraphWordcount.merge(t.getToken(), 1, (a, b) -> a + b);
                        }
                    }

                    for(Map.Entry<String, Integer> e : paragraphWordcount.entrySet()) {
                        Wordcount wordcount = new Wordcount();
                        wordcount.setChapterID(c.getId());
                        wordcount.setSectionID(s.getId());

                        wordcount.setCount(e.getValue());
                        wordcount.setWord(e.getKey());

                        counterList.add(wordcount);
                    }
                }

                for(Subsection ss : s.getSubsections()) {

                    for(Paragraph p : ss.getParagraphs()) {
                        HashMap<String, Integer> paragraphWordcount = new HashMap<>();

                        for(Sentence sentence : p.getSentences()) {
                            ArrayList<Token> token = (ArrayList<Token>) sentence.getToken();

                            for(Token t : token) {
                                paragraphWordcount.merge(t.getToken(), 1, (a, b) -> a + b);
                            }
                        }

                        for(Map.Entry<String, Integer> e : paragraphWordcount.entrySet()) {
                            Wordcount wordcount = new Wordcount();
                            wordcount.setChapterID(c.getId());
                            wordcount.setSectionID(s.getId());
                            wordcount.setSubsectionID(ss.getId());

                            wordcount.setCount(e.getValue());
                            wordcount.setWord(e.getKey());

                            counterList.add(wordcount);
                        }

                    }

                    for(SubSubSection sss : ss.getSubSubSections()) {

                        for(Paragraph p : sss.getParagraphs()) {
                            HashMap<String, Integer> paragraphWordcount = new HashMap<>();

                            for(Sentence sentence : p.getSentences()) {
                                ArrayList<Token> token = (ArrayList<Token>) sentence.getToken();

                                for(Token t : token) {
                                    paragraphWordcount.merge(t.getToken(), 1, (a, b) -> a + b);
                                }
                            }

                            for(Map.Entry<String, Integer> e : paragraphWordcount.entrySet()) {
                                Wordcount wordcount = new Wordcount();
                                wordcount.setChapterID(c.getId());
                                wordcount.setSectionID(s.getId());
                                wordcount.setSubsectionID(ss.getId());
                                wordcount.setSubsubsectionID(sss.getId());

                                wordcount.setCount(e.getValue());
                                wordcount.setWord(e.getKey());

                                counterList.add(wordcount);
                            }
                        }
                    }
                }
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
