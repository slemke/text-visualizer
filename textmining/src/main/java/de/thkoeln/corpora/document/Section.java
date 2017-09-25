package de.thkoeln.corpora.document;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import java.util.ArrayList;
import java.util.List;

public class Section {

    private String title;
    private int id;
    private List<Paragraph> paragraphs = new ArrayList<>();
    private List<Subsection> subsections = new ArrayList<>();

    public String getTitle() {
        return this.title;
    }

    @XmlAttribute( name = "title")
    public void setTitle(String title) {
        this.title = title;
    }

    public List<Subsection> getSubsections() {
        return this.subsections;
    }

    @XmlElement( name = "subsection")
    public void setSubsections(List<Subsection> subsections) {
        this.subsections = subsections;
    }

    public List<Paragraph> getParagraphs() {
        return this.paragraphs;
    }

    @XmlElement( name = "paragraph")
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
