package de.thkoeln.tasks;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.thkoeln.corpora.Document;
import de.thkoeln.corpora.document.*;
import de.thkoeln.corpora.pojo.SentenceLength;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

public class SentenceLengthTask extends AbstractTask {

    @Override
    public Document apply(Document doc) {


        ArrayList<SentenceLength> sentenceLengths = new ArrayList<>();

        for(Chapter c : doc.getChapters()) {

            for(Section s : c.getSections()) {

                for(Paragraph p : s.getParagraphs()) {
                    ArrayList<Sentence> sentences = (ArrayList<Sentence>) p.getSentences();

                    for(Sentence sentence : sentences) {
                        SentenceLength length = new SentenceLength();
                        length.setSentence(sentence.getSentence());
                        length.setLength(sentence.getToken().size());
                        length.setSentenceID(sentence.getId());

                        length.setChapterID(c.getId());
                        length.setSectionID(s.getId());
                        sentenceLengths.add(length);
                    }
                }

                for(Subsection ss : s.getSubsections()) {

                    for(Paragraph p : ss.getParagraphs()) {
                        ArrayList<Sentence> sentences = (ArrayList<Sentence>) p.getSentences();

                        for(Sentence sentence : sentences) {
                            SentenceLength length = new SentenceLength();
                            length.setSentence(sentence.getSentence());
                            length.setLength(sentence.getToken().size());
                            length.setSentenceID(sentence.getId());

                            length.setChapterID(c.getId());
                            length.setSectionID(s.getId());
                            length.setSubsectionID(ss.getId());
                            sentenceLengths.add(length);
                        }
                    }

                    for(SubSubSection sss : ss.getSubSubSections()) {

                        for(Paragraph p : sss.getParagraphs()) {
                            ArrayList<Sentence> sentences = (ArrayList<Sentence>) p.getSentences();

                            for(Sentence sentence : sentences) {
                                SentenceLength length = new SentenceLength();
                                length.setSentence(sentence.getSentence());
                                length.setLength(sentence.getToken().size());
                                length.setSentenceID(sentence.getId());

                                length.setChapterID(c.getId());
                                length.setSectionID(s.getId());
                                length.setSubsectionID(ss.getId());
                                length.setSubsubsectionID(sss.getId());
                                sentenceLengths.add(length);
                            }
                        }
                    }
                }
            }
        }

        ObjectMapper mapper = new ObjectMapper();

        try {
            mapper.writerWithDefaultPrettyPrinter().writeValue(new File("textmining/output/length.json"), sentenceLengths);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return doc;
    }
}
