package de.thkoeln.corpora.document;

public class Chapter implements Element {

    private int id;
    private String title;

    public Chapter(int id, String title) {
        this.id = id;
        this.title = title;
    }

    @Override
    public int getID() {
        return this.id;
    }

    @Override
    public String getType() {
        return "chapter";
    }

    @Override
    public String getText() {
        return this.title;
    }
}
