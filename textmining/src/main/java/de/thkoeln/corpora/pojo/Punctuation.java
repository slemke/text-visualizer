package de.thkoeln.corpora.pojo;

import de.thkoeln.corpora.document.Token;

import java.util.ArrayList;

public class Punctuation {

    private int sentenceID;
    private int count;
    private String sentence;
    private ArrayList<Integer> token;
    private int chapterID;
    private int sectionID;
    private int subsectionID;
    private int subsubsectionID;

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


    public int getSentenceID() {
        return sentenceID;
    }

    public void setSentenceID(int sentenceID) {
        this.sentenceID = sentenceID;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public String getSentence() {
        return sentence;
    }

    public void setSentence(String sentence) {
        this.sentence = sentence;
    }

    public ArrayList<Integer> getToken() {
        return token;
    }

    public void setToken(ArrayList<Integer> token) {
        this.token = token;
    }
}
