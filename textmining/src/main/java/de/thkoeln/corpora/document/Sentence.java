package de.thkoeln.corpora.document;

import java.util.*;

public final class Sentence extends AbstractList<Token> implements Element {

    private ArrayList<Token> tokens = new ArrayList<Token>();
    private int id;
    private int parent;
    private String originalSentence;

    public Sentence() {}

    public Sentence(String[] tokens) {
        for(String token : tokens) {
            Token t = new Token(token);
            this.tokens.add(t);
        }
    }

    public Sentence(int id, String[] tokens) {
        this.id = id;

        for(String token : tokens)
            this.tokens.add(new Token(token));
    }

    public Sentence(int id, Token[] tokens) {
        this.id = id;
        this.tokens.addAll(Arrays.asList(tokens));
    }

    public Sentence(int id, List tokens) {
        this.id = id;
        this.tokens.addAll(tokens);
    }

    public void setParent(int parent) {
        this.parent = parent;
    }

    public int getParent() {
        return this.parent;
    }

    public boolean add(Token token) {
        return tokens.add(token);
    }

    public Token get(int index) {
        return tokens.get(index);
    }

    public int size() {
        return tokens.size();
    }

    public Iterator<Token> iterator() {
        return tokens.iterator();
    }

    public String getOriginalSentence() {
        return originalSentence;
    }

    public void setOriginalSentence(String originalSentence) {
        this.originalSentence = originalSentence;
    }

    @Override
    public int getID() {
        return this.id;
    }

    @Override
    public String getType() {
        return "sentence";
    }

    @Override
    public String getText() {
        // TODO überarbeiten
        return this.tokens.toString();
    }
}
