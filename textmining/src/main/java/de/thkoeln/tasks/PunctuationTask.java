package de.thkoeln.tasks;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.thkoeln.corpora.Document;
import de.thkoeln.corpora.document.*;
import de.thkoeln.corpora.pojo.Punctuation;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

public class PunctuationTask extends AbstractTask {

    @Override
    public Document apply(Document doc) {

        ArrayList<Punctuation> punctuations = new ArrayList<>();

        for( Chapter c : doc.getChapters()) {

            for(Section s : c.getSections()) {

                for(Paragraph p : s.getParagraphs()) {

                    for(Sentence sentence : p.getSentences()) {
                        ArrayList<Token> token = (ArrayList<Token>) sentence.getToken();

                        Punctuation punctuation = new Punctuation();
                        punctuation.setSentence(sentence.getSentence());
                        punctuation.setSentenceID(sentence.getId());

                        punctuation.setChapterID(c.getId());
                        punctuation.setSectionID(s.getId());

                        ArrayList<Integer> ids = new ArrayList<>();


                        for(Token t : token) {
                            String tag = t.getTag();

                            switch (tag) {
                                case "-LRB-" :
                                    ids.add(t.getId());
                                    break;
                                case "-RRB-" :
                                    ids.add(t.getId());
                                    break;
                                case "." :
                                    ids.add(t.getId());
                                    break;
                                case "," :
                                    ids.add(t.getId());
                                    break;
                                case ":" :
                                    ids.add(t.getId());
                                    break;
                            }
                        }
                        punctuation.setToken(ids);
                        punctuation.setCount(ids.size());
                        punctuations.add(punctuation);
                    }
                }

                for(Subsection ss : s.getSubsections()) {

                    for(Paragraph p : ss.getParagraphs()) {

                        for(Sentence sentence : p.getSentences()) {
                            ArrayList<Token> token = (ArrayList<Token>) sentence.getToken();

                            Punctuation punctuation = new Punctuation();
                            punctuation.setSentence(sentence.getSentence());
                            punctuation.setSentenceID(sentence.getId());

                            punctuation.setChapterID(c.getId());
                            punctuation.setSectionID(s.getId());
                            punctuation.setSubsectionID(ss.getId());

                            ArrayList<Integer> ids = new ArrayList<>();


                            for(Token t : token) {
                                String tag = t.getTag();

                                switch (tag) {
                                    case "-LRB-" :
                                        ids.add(t.getId());
                                        break;
                                    case "-RRB-" :
                                        ids.add(t.getId());
                                        break;
                                    case "." :
                                        ids.add(t.getId());
                                        break;
                                    case "," :
                                        ids.add(t.getId());
                                        break;
                                    case ":" :
                                        ids.add(t.getId());
                                        break;
                                }
                            }
                            punctuation.setToken(ids);
                            punctuation.setCount(ids.size());
                            punctuations.add(punctuation);
                        }
                    }

                    for(SubSubSection sss : ss.getSubSubSections()) {

                        for(Paragraph p : sss.getParagraphs()) {

                            for(Sentence sentence : p.getSentences()) {
                                ArrayList<Token> token = (ArrayList<Token>) sentence.getToken();

                                Punctuation punctuation = new Punctuation();
                                punctuation.setSentence(sentence.getSentence());
                                punctuation.setSentenceID(sentence.getId());

                                punctuation.setChapterID(c.getId());
                                punctuation.setSectionID(s.getId());
                                punctuation.setSubsectionID(ss.getId());
                                punctuation.setSubsubsectionID(sss.getId());

                                ArrayList<Integer> ids = new ArrayList<>();


                                for(Token t : token) {
                                    String tag = t.getTag();

                                    switch (tag) {
                                        case "-LRB-" :
                                            ids.add(t.getId());
                                            break;
                                        case "-RRB-" :
                                            ids.add(t.getId());
                                            break;
                                        case "." :
                                            ids.add(t.getId());
                                            break;
                                        case "," :
                                            ids.add(t.getId());
                                            break;
                                        case ":" :
                                            ids.add(t.getId());
                                            break;
                                    }
                                }
                                punctuation.setToken(ids);
                                punctuation.setCount(ids.size());
                                punctuations.add(punctuation);
                            }
                        }
                    }
                }
            }
        }

        ObjectMapper mapper = new ObjectMapper();

        try {
            mapper.writerWithDefaultPrettyPrinter().writeValue(new File("output/punctuation.json"), punctuations);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return doc;
    }
}
