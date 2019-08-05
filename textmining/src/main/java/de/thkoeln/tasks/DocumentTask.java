package de.thkoeln.tasks;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.thkoeln.corpora.Document;

import java.io.File;
import java.io.IOException;

public class DocumentTask extends AbstractTask {
    @Override
    public Document apply(Document doc) {

        ObjectMapper mapper = new ObjectMapper();

        try {
            mapper.writerWithDefaultPrettyPrinter().writeValue(new File("output/document.json"), doc);
        } catch (IOException e) {
            e.printStackTrace();
        }


        return doc;
    }
}
