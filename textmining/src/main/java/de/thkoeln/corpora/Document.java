package de.thkoeln.corpora;

import de.thkoeln.corpora.document.Chapter;
import de.thkoeln.corpora.document.Sentence;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@XmlRootElement
@XmlAccessorType(XmlAccessType.NONE)
public class Document {

    private String title;
    private String subtitle;
    private List<Chapter> chapters = new ArrayList<>();

    public String getTitle() {
        return title;
    }

    @XmlElement
    public void setTitle(String title) {
        this.title = title;
    }

    public String getSubtitle() {
        return this.subtitle;
    }

    @XmlElement
    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    @XmlElement( name = "chapter")
    public List<Chapter> getChapters() {
        return chapters;
    }

    public void setChapters(List<Chapter> chapters) {
        this.chapters = chapters;
    }
}
