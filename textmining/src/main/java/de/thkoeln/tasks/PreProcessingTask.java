package de.thkoeln.tasks;

import de.thkoeln.corpora.Document;
import de.thkoeln.corpora.document.*;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class PreProcessingTask extends AbstractTask {

    public PreProcessingTask(String tokenizerModel) {
        super(tokenizerModel);
    }

    public PreProcessingTask(String tokenizerModel, String sentenceModel) {
        super(tokenizerModel, sentenceModel);
    }

    public PreProcessingTask(String tokenizerModel, String sentenceModel, String taggerModel) {
        super(tokenizerModel, sentenceModel, taggerModel);
    }

    @Override
    public Document apply(Document doc) {
        System.out.println("Preprocessing: " + doc.getTitle());

        int id = 1;
        int tokenid = 1;

        // set ids for every node
        for(Chapter c : doc.getChapters()) {
            c.setId(id++);

            for(Section s : c.getSections()) {
                s.setId(id++);

                for (Paragraph p : s.getParagraphs()) {
                    p.setId(id++);
                }

                for(Subsection ss : s.getSubsections()) {
                    ss.setId(id++);


                    for (Paragraph p : ss.getParagraphs()) {
                        p.setId(id++);
                    }

                    for(SubSubSection sss : ss.getSubSubSections()) {
                        sss.setId(id++);

                        for (Paragraph p : sss.getParagraphs()) {
                            p.setId(id++);
                        }
                    }
                }
            }
        }

        // compute strings for every block
        // preprocess data
        HashMap<Integer, ArrayList<Sentence>> chapter = new HashMap<>();
        HashMap<Integer, ArrayList<Sentence>> section = new HashMap<>();
        HashMap<Integer, ArrayList<Sentence>> subsection = new HashMap<>();
        HashMap<Integer, ArrayList<Sentence>> subsubsection = new HashMap<>();

        for(Chapter c : doc.getChapters()) {

            for(Section s : c.getSections()) {

                for(Paragraph p : s.getParagraphs()) {

                    //System.out.println(p.getText());

                    // compute text
                    String text = p.getText().get(0);
                    text = text.replace("\t", "");
                    text = text.replace("\n", "");
                    String[] sentences = this.detect(text);
                    ArrayList<Sentence> sentenceList = new ArrayList<>();

                    // iterate sentences
                    for(String sentence : sentences) {
                        String[] tokens = this.tokenize(sentence);
                        String[] tag = this.tag(tokens);

                        Sentence sentenceObject = new Sentence();
                        sentenceObject.setId(id++);

                        ArrayList<Token> token = new ArrayList<>();

                        for(int i = 0; i < tokens.length; i++) {
                            Token t = new Token(tokens[i], tag[i]);
                            t.setId(tokenid++);
                            token.add(t);
                        }

                        sentenceObject.setToken(token);
                        sentenceObject.setSentence(sentence);

                        sentenceList.add(sentenceObject);
                    }
                    p.setSentences(sentenceList);
                }

                for(Subsection ss : s.getSubsections()) {

                    for(Paragraph p : ss.getParagraphs()) {

                        // compute text
                        String text = p.getText().get(0);
                        text = text.replace("\t", "");
                        text = text.replace("\n", "");
                        String[] sentences = this.detect(text);
                        ArrayList<Sentence> sentenceList = new ArrayList<>();

                        // iterate sentences
                        for(String sentence : sentences) {
                            String[] tokens = this.tokenize(sentence);
                            String[] tag = this.tag(tokens);
                            Sentence sentenceObject = new Sentence();
                            sentenceObject.setId(id++);

                            ArrayList<Token> token = new ArrayList<>();

                            for(int i = 0; i < tokens.length; i++) {
                                Token t = new Token(tokens[i], tag[i]);
                                t.setId(tokenid++);
                                token.add(t);
                            }

                            sentenceObject.setToken(token);
                            sentenceObject.setSentence(sentence);

                            sentenceList.add(sentenceObject);
                        }
                        p.setSentences(sentenceList);

                    }

                    for(SubSubSection sss : ss.getSubSubSections()) {

                        for(Paragraph p : sss.getParagraphs()) {

                            // compute text
                            String text = p.getText().get(0);
                            text = text.replace("\t", "");
                            text = text.replace("\n", "");
                            String[] sentences = this.detect(text);
                            ArrayList<Sentence> sentenceList = new ArrayList<>();

                            // iterate sentences
                            for(String sentence : sentences) {
                                String[] tokens = this.tokenize(sentence);
                                String[] tag = this.tag(tokens);
                                Sentence sentenceObject = new Sentence();
                                sentenceObject.setId(id++);

                                ArrayList<Token> token = new ArrayList<>();

                                for(int i = 0; i < tokens.length; i++) {
                                    Token t = new Token(tokens[i], tag[i]);
                                    t.setId(tokenid++);
                                    token.add(t);
                                }

                                sentenceObject.setToken(token);
                                sentenceObject.setSentence(sentence);

                                sentenceList.add(sentenceObject);
                            }
                            p.setSentences(sentenceList);
                        }
                    }
                }
            }
        }

        return doc;
    }
}
