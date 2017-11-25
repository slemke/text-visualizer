package de.thkoeln.corpora.pojo;

import java.util.ArrayList;

public class Node {

    private int id;
    private String name;
    private ArrayList<Node> children;
    private int size;

    private int worstSentenceLength;
    private int worstSentencePunctuation;
    private int worstStopwordCount;
    private int worstWordCount;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ArrayList<Node> getChildren() {
        return children;
    }

    public void setChildren(ArrayList<Node> children) {
        this.children = children;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public int getWorstSentenceLength() {
        return worstSentenceLength;
    }

    public void setWorstSentenceLength(int worstSentenceLength) {
        this.worstSentenceLength = worstSentenceLength;
    }

    public int getWorstSentencePunctuation() {
        return worstSentencePunctuation;
    }

    public void setWorstSentencePunctuation(int worstSentencePunctuation) {
        this.worstSentencePunctuation = worstSentencePunctuation;
    }

    public int getWorstStopwordCount() {
        return worstStopwordCount;
    }

    public void setWorstStopwordCount(int worstStopwordCount) {
        this.worstStopwordCount = worstStopwordCount;
    }

    public int getWorstWordCount() {
        return worstWordCount;
    }

    public void setWorstWordCount(int worstWordCount) {
        this.worstWordCount = worstWordCount;
    }
}
