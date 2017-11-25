package de.thkoeln.corpora.parser;

import de.thkoeln.corpora.Document;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;
import java.io.File;
import java.nio.file.Path;

public class Parser {

    public Document read(Path path) throws JAXBException {

        File file = new File(path.toString());
        JAXBContext context = JAXBContext.newInstance(Document.class);
        Unmarshaller unmarshaller = context.createUnmarshaller();
        Document d = (Document) unmarshaller.unmarshal(file);

        return d;
    }

    public static void write(Document document, Path path) throws JAXBException {
        File file = new File(path.toString());
        JAXBContext context = JAXBContext.newInstance(Document.class);
        Marshaller marshaller = context.createMarshaller();

        marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);

        marshaller.marshal(document, file);
    }
}
