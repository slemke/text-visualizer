package de.thkoeln.corpora.document;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import java.util.*;

@XmlAccessorType(XmlAccessType.NONE)
public final class Sentence {

    private List<Token> tokens;
    private int id;

    public String getSentence() {
        return sentence;
    }

    public void setSentence(String sentence) {
        this.sentence = sentence;
    }

    private String sentence;


    @XmlElement
    public List<Token> getToken() {
        return this.tokens;
    }

    public void setToken(List<Token> token) {
        this.tokens = token;
    }

    @XmlAttribute
    public void setId(int id) {
        this.id = id;
    }

    public int getId() {
        return this.id;
    }

}
