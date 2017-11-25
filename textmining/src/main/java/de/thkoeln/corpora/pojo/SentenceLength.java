package de.thkoeln.corpora.pojo;

public class SentenceLength {

    private int chapterID;
    private int sectionID;
    private int subsectionID;

    public int getChapterID() {
        return chapterID;
    }

    public void setChapterID(int chapterID) {
        this.chapterID = chapterID;
    }

    public int getSectionID() {
        return sectionID;
    }

    public void setSectionID(int sectionID) {
        this.sectionID = sectionID;
    }

    public int getSubsectionID() {
        return subsectionID;
    }

    public void setSubsectionID(int subsectionID) {
        this.subsectionID = subsectionID;
    }

    public int getSubsubsectionID() {
        return subsubsectionID;
    }

    public void setSubsubsectionID(int subsubsectionID) {
        this.subsubsectionID = subsubsectionID;
    }

    private int subsubsectionID;
    private int sentenceID;

    public int getSentenceID() {
        return sentenceID;
    }

    public void setSentenceID(int sentenceID) {
        this.sentenceID = sentenceID;
    }

    public int getLength() {
        return length;
    }

    public void setLength(int length) {
        this.length = length;
    }

    public String getSentence() {
        return sentence;
    }

    public void setSentence(String sentence) {
        this.sentence = sentence;
    }

    private int length;
    private String sentence;
}
