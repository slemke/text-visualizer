package de.thkoeln;

import de.thkoeln.pipeline.PreProcessor;
import de.thkoeln.tasks.DefaultTask;

import java.io.IOException;
import java.nio.file.Paths;

public class Main {

    private static final String PATH = "documents/template/x.xml";

    public static void main(final String... args) throws IOException {

        final PreProcessor processor = PreProcessor.getInstance();

        final DefaultTask task = new DefaultTask();

        processor.addDocument(Paths.get(PATH));

        processor.addTask(task);

        processor.apply();

    }
}
