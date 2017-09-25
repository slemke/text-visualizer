package de.thkoeln.corpora.document;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import java.util.ArrayList;
import java.util.List;

public class Subsection {

    private String title;
    private int id;
    private List<Paragraph> paragraphs = new ArrayList<>();
    private List<SubSubSection> subSubSections = new ArrayList<>();

    public String getTitle() {
        return this.title;
    }

    @XmlAttribute( name = "title")
    public void setTitle(String title) {
        this.title = title;
    }

    public List<SubSubSection> getSubSubSections() {
        return this.subSubSections;
    }

    @XmlElement(name = "subsubsection")
    public void setSubSubSections(List<SubSubSection> subSubSections) {
        this.subSubSections = subSubSections;
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
