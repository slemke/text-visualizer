package de.thkoeln.corpora.language;

import de.thkoeln.corpora.document.Token;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.HashMap;

public class StopwordFilter {

    private ArrayList<String> stopWords = new ArrayList<String>();

    public StopwordFilter(String path) {
        if(path.equals(""))
            throw new IllegalArgumentException("Path to stopword list is empty!");

        try {
            String line;
            FileReader fileReader = new FileReader(new File(path));
            BufferedReader textReader = new BufferedReader(fileReader);

            while((line = textReader.readLine()) != null) {
                this.stopWords.add(line);
            }
        } catch (java.io.IOException e) {
            e.printStackTrace();
        }
    }

    public ArrayList<String> filter(String [] tokens) {
        ArrayList<String> validToken = new ArrayList<>();

        for(String stopword : stopWords) {
            for(String token : tokens) {
                if(!token.equals(stopword))
                    validToken.add(token);
            }
        }
        return validToken;
    }

    public int countStopwords(ArrayList<Token> tokens) {
        int counter = 0;
        for(Token token : tokens) {
            if(this.stopWords.contains(token.getToken()))
                counter++;
        }
        return counter;
    }

    public HashMap<String, Integer> count(ArrayList<Token> tokens) {
        HashMap<String, Integer> map = new HashMap<>();

        for(String stopword : this.stopWords)
            for(Token token : tokens)
                if(token.getToken().equals(stopword))
                    map.merge(token.getToken(), 1, (a, b) -> a + b);

        return map;
    }

    public ArrayList<String> getStopWords() {
        return this.stopWords;
    }
}
