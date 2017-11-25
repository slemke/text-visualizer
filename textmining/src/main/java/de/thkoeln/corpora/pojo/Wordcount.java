package de.thkoeln.corpora.pojo;

import java.util.ArrayList;

public class Wordcount {

    private String word;
    private int count;

    private int chapterID;
    private int sectionID;
    private int subsectionID;
    private int subsubsectionID;
    private double normalized;

    public String getWord() {
        return word;
    }

    public void setWord(String word) {
        this.word = word;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

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

    public double getNormalized() {
        return normalized;
    }

    public void setNormalized(double normalized) {
        this.normalized = normalized;
    }
}
