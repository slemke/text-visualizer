package de.thkoeln.tasks;

import de.thkoeln.corpora.Document;
import de.thkoeln.corpora.document.Sentence;
import de.thkoeln.corpora.document.Token;

import java.util.ArrayList;

public class DefaultTask extends AbstractTask {

    @Override
    public Document apply(Document doc) {
        System.out.println("Preprocessing: " + doc.getTitle());

        String[] sentences = this.detect(doc.getOriginalText());
        ArrayList<Sentence> sentenceList = new ArrayList<>();

        for(String sentence : sentences) {
            String[] tokens = this.tokenize(sentence);
            String[] tag = this.tag(tokens);

            Sentence sentenceObject = new Sentence();

            for(int i = 0; i < tokens.length; i++) {
                Token token = new Token(tokens[i], tag[i]);
                sentenceObject.add(token);
            }
            sentenceList.add(sentenceObject);
        }

        // add to document

        return doc;
    }
}
