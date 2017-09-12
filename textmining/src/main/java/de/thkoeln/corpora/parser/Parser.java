package de.thkoeln.corpora.parser;

import de.thkoeln.corpora.Document;
import org.w3c.dom.Node;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class Parser {


    public static Document read(Path path) {

        Document d = null;

        try {
            String content = new String(Files.readAllBytes(path));
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();

            ByteArrayInputStream input = new ByteArrayInputStream(content.getBytes("UTF-8"));
            org.w3c.dom.Document document = builder.parse(input);

            Node title = document.getElementsByTagName("title").item(0);
            String titleText = title.getTextContent();

            String text = document.getElementsByTagName("text").item(0).getTextContent();

            d = new Document(titleText, text);

        } catch (IOException | SAXException | ParserConfigurationException e) {
            e.printStackTrace();
        }
        return d;
    }

    public static void write(Document document) {
        System.out.println(document.getOriginalText());
    }
}
