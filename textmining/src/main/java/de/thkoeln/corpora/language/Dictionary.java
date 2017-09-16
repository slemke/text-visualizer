package de.thkoeln.corpora.language;

import java.util.ArrayList;

public final class Dictionary {

    private ArrayList<String> dictionary = new ArrayList<String>();

    public Dictionary(String[] tokens) {
        for(String token : tokens) {
            if(!dictionary.contains(token))
                    this.dictionary.add(token);
        }
    }

    public String getToken(int index) {
        return dictionary.get(index);
    }

    public void addToken(String token) {
        if(!dictionary.contains(token))
            dictionary.add(token);
    }

    public int size() {
        return dictionary.size();
    }

    public boolean contains(String token) {
        return dictionary.contains(token);
    }

    public void remove(String token) {
        dictionary.remove(token);
    }

    @Override
    public String toString() {
        return "Dictionary{" +
                "dictionary=" + dictionary +
                '}';
    }
}
