package de.thkoeln.tasks;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.thkoeln.corpora.Document;
import de.thkoeln.corpora.document.*;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

public class ChapterTask extends AbstractTask {


    @Override
    public Document apply(Document doc) {

        ArrayList<de.thkoeln.corpora.pojo.Chapter> list = new ArrayList<>();

        for(Chapter c : doc.getChapters()) {

            de.thkoeln.corpora.pojo.Chapter chapter = new de.thkoeln.corpora.pojo.Chapter();
            chapter.setId(c.getId());
            chapter.setTitle(c.getTitle());

            int size = 0;

            for(Section s : c.getSections()) {

                for(Paragraph p : s.getParagraphs())
                    for(Sentence sentence : p.getSentences())
                        size += sentence.getToken().size();

                for(Subsection ss : s.getSubsections()) {


                    for(Paragraph p : ss.getParagraphs())
                        for(Sentence sentence : p.getSentences())
                            size += sentence.getToken().size();

                    for(SubSubSection sss : ss.getSubSubSections()) {

                        for(Paragraph p : sss.getParagraphs())
                            for(Sentence sentence : p.getSentences())
                                size += sentence.getToken().size();
                    }
                }
            }

            chapter.setSize(size);
            list.add(chapter);
        }


        ObjectMapper mapper = new ObjectMapper();

        try {
            mapper.writerWithDefaultPrettyPrinter().writeValue(new File("output/chapter.json"), list);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return doc;
    }
}
