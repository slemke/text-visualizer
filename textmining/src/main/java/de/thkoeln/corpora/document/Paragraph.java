package de.thkoeln.corpora.document;

import javax.xml.bind.annotation.*;
import java.util.List;

@XmlAccessorType(XmlAccessType.NONE)
public class Paragraph {

    private List<String> text;
    private List<Sentence> sentences;
    private int id;

    @XmlMixed
    public List<String> getText() {
        return this.text;
    }

    public void setText(List<String> text) {
        this.text = text;
    }

    public void setSentences(List<Sentence> sentences) {
        this.sentences = sentences;
    }

    @XmlElement
    public List<Sentence> getSentences() {
        return sentences;
    }

    public void setId(int id) {
        this.id = id;
    }

    @XmlAttribute
    public int getId() {
        return this.id;
    }
}
