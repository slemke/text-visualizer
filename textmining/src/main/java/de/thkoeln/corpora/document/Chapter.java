package de.thkoeln.corpora.document;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import java.util.ArrayList;
import java.util.List;

public class Chapter {

    private String title;
    private int id;

    private List<Section> sections = new ArrayList<>();


    public String getTitle() {
        return this.title;
    }

    @XmlAttribute( name = "title")
    public void setTitle(String title) {
        this.title = title;
    }

    public List<Section> getSections() {
        return this.sections;
    }

    @XmlElement( name = "section")
    public void setSections(List<Section> sections) {
        this.sections = sections;
    }

    public int getId() {
        return this.id;
    }

    @XmlAttribute
    public void setId(int id) {
        this.id = id;
    }
}
