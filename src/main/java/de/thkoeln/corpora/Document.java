package de.thkoeln.corpora;

import de.thkoeln.corpora.document.Element;

import java.util.ArrayList;
import java.util.Iterator;

public class Document implements Iterable<Element> {

    private String title;
    private String subtitle;
    private ArrayList<String> authors;
    private String released;
    private String isbn;
    private ArrayList<Element> elements = new ArrayList<>();
    private String text;

    public Document(String title, String text) {
        this.title = title;
        this.text = text;
    }

    public Document(String title, String subtitle, String author, String text) {
        this.title = title;
        this.subtitle = subtitle;
        this.authors.add(author);
        this.text = text;
    }

    public Document(String title, String subtitle, String author, String text, String released, String isbn) {
        this.title = title;
        this.subtitle = subtitle;
        this.authors.add(author);
        this.text = text;
        this.released = released;
        this.isbn = isbn;
    }

    public Document(String title, String subtitle, ArrayList<String> authors, String text, String released, String isbn) {
        this.title = title;
        this.subtitle = subtitle;
        this.authors = authors;
        this.text = text;
        this.released = released;
        this.isbn = isbn;
    }

    public ArrayList<Element> getText() {
        return this.elements;
    }

    public void setText(ArrayList<Element> text) {
        this.elements = text;
    }

    public String getOriginalText() {
        return this.text;
    }

    public void setOriginalText(String text) {
        this.text = text;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    public ArrayList<String> getAuthors() {
        return authors;
    }

    public String getAuthor(int index) {
        return authors.get(index);
    }

    public void addAuthor(String author) {
        this.authors.add(author);
    }

    public int numberOfAuthors() {
        return this.authors.size();
    }

    public String getReleased() {
        return released;
    }

    public void setReleased(String released) {
        this.released = released;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    @Override
    public Iterator<Element> iterator() {
        return this.elements.iterator();
    }
}
