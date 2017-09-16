package de.thkoeln.corpora.document;

public class Subsection implements Element {

    private int id;
    private String title;

    public Subsection(int id, String title) {
        this.id = id;
        this.title = title;
    }

    @Override
    public int getID() {
        return this.id;
    }

    @Override
    public String getType() {
        return "subsection";
    }

    @Override
    public String getText() {
        return this.title;
    }
}
