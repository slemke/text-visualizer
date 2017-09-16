package de.thkoeln.corpora.document;

public class SubSubSection implements Element {

    private int id;
    private String title;

    public SubSubSection(int id, String title) {
        this.id = id;
        this.title = title;
    }

    @Override
    public int getID() {
        return this.id;
    }

    @Override
    public String getType() {
        return "subsubsection";
    }

    @Override
    public String getText() {
        return this.title;
    }
}
