package de.thkoeln.tasks;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.thkoeln.corpora.Document;
import de.thkoeln.corpora.document.*;
import de.thkoeln.corpora.pojo.Node;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class TreeTask extends AbstractTask {

    @Override
    public Document apply(Document doc) {

        ArrayList<Node> nodeList = new ArrayList<>();

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

                        subSubSectionNode.setSize(subsubsectionCount);
                        subSectionChildren.add(subSubSectionNode);
                    }
                    subSectionNode.setSize(subsectionCount);
                    sectionChildren.add(subSectionNode);
                    subSectionNode.setChildren(subSectionChildren);
                }
                sectionNode.setSize(sectionCount);
                sectionNode.setChildren(sectionChildren);
                chapterChildren.add(sectionNode);
            }
            node.setSize(chapterCount);
            node.setChildren(chapterChildren);
            nodeList.add(node);
        }

        root.setChildren(nodeList);

        ObjectMapper mapper = new ObjectMapper();

        try {
            mapper.writerWithDefaultPrettyPrinter().writeValue(new File("textmining/output/tree.json"), root);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return doc;
    }
}
