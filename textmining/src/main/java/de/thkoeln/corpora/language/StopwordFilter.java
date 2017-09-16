package de.thkoeln.corpora.language;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.HashMap;

public class StopwordFilter {

    private ArrayList<String> stopWords = new ArrayList<String>();

    public StopwordFilter(String[] tokens) {
        if(tokens == null || tokens.length == 0)
            throw new IllegalArgumentException("List of Stopwords is null or is empty!");

        for(String token : tokens) {
            if(!this.stopWords.contains(token))
                    this.stopWords.add(token);
        }
    }

    public StopwordFilter(String path) {
        if(path.equals(""))
                throw new IllegalArgumentException("Path to stopword list is empty!");

        StringBuilder builder = new StringBuilder();

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
        ArrayList<String> validToken = new ArrayList<String>();

        for(String stopword : stopWords) {
            for(String token : tokens) {
                if(!token.equals(stopword))
                    validToken.add(token);
            }
        }
        return validToken;
    }

    public HashMap<String, Integer> count(String[] tokens) {
        HashMap<String, Integer> map = new HashMap<String, Integer>();

        for(String stopword : this.stopWords) {
            for(String token : tokens) {
                if(token.equals(stopword)) {
                    if(map.containsKey(token)) {
                        int value = map.get(token);
                        map.put(token, ++value);
                    } else {
                        map.put(token, 1);
                    }
                }
            }
        }
        return map;
    }

    public ArrayList<String> getStopWords() {
        return this.stopWords;
    }
}
