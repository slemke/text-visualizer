package de.thkoeln.corpora.document;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlValue;

@XmlAccessorType(XmlAccessType.NONE)
public final class Token {

    private String token;
    private int id;
    private String tag;

    public Token(String token, String tag) {
        this.token = token;
        this.tag = tag;
    }

    public String getToken() {
        return token;
    }

    @XmlValue
    public void setToken(String token) {
        this.token = token;
    }

    public String getTag() {
        return tag;
    }

    @XmlAttribute
    public void setTag(String tag) {
        this.tag = tag;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getId() {
        return this.id;
    }

}
