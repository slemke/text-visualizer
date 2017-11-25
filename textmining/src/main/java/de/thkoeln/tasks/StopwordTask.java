package de.thkoeln.tasks;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.thkoeln.corpora.Document;
import de.thkoeln.corpora.document.*;
import de.thkoeln.corpora.language.StopwordFilter;
import de.thkoeln.corpora.pojo.Stopword;
import javafx.scene.paint.Stop;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class StopwordTask extends AbstractTask {

    @Override
    public Document apply(Document doc) {

        ArrayList<Stopword> stopwords = new ArrayList<>();

        StopwordFilter filter = new StopwordFilter("textmining/lists/stopwords.txt");
        ArrayList<String> stopWords = filter.getStopWords();

        for(Chapter c : doc.getChapters()) {

            int idInChapter = 1;

            for(Section s : c.getSections()) {

                for(Paragraph p : s.getParagraphs()) {
                    Stopword stopword = new Stopword();
                    ArrayList<Integer> tokenList = new ArrayList<>();

                    int counter = 0;

                    for(Sentence sentence : p.getSentences()) {
                        ArrayList<Token> token = (ArrayList<Token>) sentence.getToken();

                        for(Token t : token) {
                            if(stopWords.contains(t.getToken())) {
                                counter++;
                                tokenList.add(t.getId());
                            }
                        }
                    }
                    stopword.setCount(counter);
                    stopword.setParagraphID(p.getId());
                    stopword.setToken(tokenList);

                    stopword.setChapterID(c.getId());
                    stopword.setSectionID(s.getId());

                    stopword.setChaptername(c.getTitle());
                    stopword.setSectionname(s.getTitle());

                    stopword.setIdInChapter(idInChapter++);

                    stopwords.add(stopword);
                }

                for(Subsection ss : s.getSubsections()) {

                    for(Paragraph p : ss.getParagraphs()) {
                        Stopword stopword = new Stopword();
                        ArrayList<Integer> tokenList = new ArrayList<>();

                        int counter = 0;

                        for(Sentence sentence : p.getSentences()) {
                            ArrayList<Token> token = (ArrayList<Token>) sentence.getToken();

                            for(Token t : token) {
                                if(stopWords.contains(t.getToken())) {
                                    counter++;
                                    tokenList.add(t.getId());
                                }
                            }
                        }
                        stopword.setCount(counter);
                        stopword.setParagraphID(p.getId());
                        stopword.setToken(tokenList);

                        stopword.setChapterID(c.getId());
                        stopword.setSectionID(s.getId());
                        stopword.setSubsectionID(ss.getId());


                        stopword.setChaptername(c.getTitle());
                        stopword.setSectionname(s.getTitle());
                        stopword.setSubsectionname(ss.getTitle());

                        stopword.setIdInChapter(idInChapter++);

                        stopwords.add(stopword);
                    }

                    for(SubSubSection sss :  ss.getSubSubSections()) {

                        for(Paragraph p : sss.getParagraphs()) {
                            Stopword stopword = new Stopword();
                            ArrayList<Integer> tokenList = new ArrayList<>();

                            int counter = 0;

                            for(Sentence sentence : p.getSentences()) {
                                ArrayList<Token> token = (ArrayList<Token>) sentence.getToken();

                                for(Token t : token) {
                                    if(stopWords.contains(t.getToken())) {
                                        counter++;
                                        tokenList.add(t.getId());
                                    }
                                }
                            }
                            stopword.setCount(counter);
                            stopword.setParagraphID(p.getId());
                            stopword.setToken(tokenList);

                            stopword.setChapterID(c.getId());
                            stopword.setSectionID(s.getId());
                            stopword.setSubsectionID(ss.getId());
                            stopword.setSubsubsectionID(sss.getId());

                            stopword.setChaptername(c.getTitle());
                            stopword.setSectionname(s.getTitle());
                            stopword.setSubsectionname(ss.getTitle());
                            stopword.setSubsubsectionname(sss.getTitle());

                            stopword.setIdInChapter(idInChapter++);

                            stopwords.add(stopword);
                        }
                    }
                }
            }
        }
        ObjectMapper mapper = new ObjectMapper();

        try {
            mapper.writerWithDefaultPrettyPrinter().writeValue(new File("textmining/output/stopwords.json"), stopwords);
        } catch (IOException e) {
            e.printStackTrace();
        }


        return doc;
    }
}
