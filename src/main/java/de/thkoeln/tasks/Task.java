package de.thkoeln.tasks;

import de.thkoeln.corpora.Document;

public interface Task {

    Document apply(Document doc);

    String[] tokenize(String text);

    String[] tag (String[] tokens);

    String[] detect(String text);

}
