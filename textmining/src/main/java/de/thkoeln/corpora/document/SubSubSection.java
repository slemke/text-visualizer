package de.thkoeln.corpora.document;

import javax.xml.bind.annotation.XmlAttribute;
import java.util.ArrayList;
import java.util.List;

public class SubSubSection {

    private String title;
    private int id;
    private List<Paragraph> paragraphs = new ArrayList<>();

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<Paragraph> getParagraphs() {
        return this.paragraphs;
    }

    public void setParagraphs(List<Paragraph> paragraphs) {
        this.paragraphs = paragraphs;
    }

    public int getId() {
        return this.id;
    }

    @XmlAttribute
    public void setId(int id) {
        this.id = id;
    }
}
