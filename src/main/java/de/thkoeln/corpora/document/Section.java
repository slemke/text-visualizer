package de.thkoeln.corpora.document;

public class Section implements Element {

    private int id;
    private String title;

    public Section(int id, String title) {
        this.id = id;
        this.title = title;
    }

    @Override
    public int getID() {
        return this.id;
    }

    @Override
    public String getType() {
        return "section";
    }

    @Override
    public String getText() {
        return this.title;
    }
}
