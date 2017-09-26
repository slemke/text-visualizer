package de.thkoeln;

import de.thkoeln.pipeline.Pipeline;
import de.thkoeln.tasks.*;

import java.nio.file.Paths;

public class Main {

    public static void main(String[] args) {
        // get tm pipeline
        Pipeline instance = Pipeline.getInstance();

        // prepare processing task
        final PreProcessingTask task = new PreProcessingTask(
                "textmining/models/en-token.bin",
                "textmining/models/en-sent.bin",
                "textmining/models/en-pos-maxent.bin"
        );

        final SentenceLengthTask task2 = new SentenceLengthTask();

        final PunctuationTask task3 = new PunctuationTask();

        final WordcountTask task4 = new WordcountTask();

        final StopwordTask task5 = new StopwordTask();

        final TreeTask task6 = new TreeTask();

        final DocumentTask task7 = new DocumentTask();

        final ChapterTask task1 = new ChapterTask();

        // add task to pipeline
        instance.addTask(task);

        instance.addTask(task2);

        instance.addTask(task3);

        instance.addTask(task4);

        instance.addTask(task5);

        instance.addTask(task7);

        instance.addTask(task1);

        instance.addTask(task6);

        // add documents
        instance.addDocument(Paths.get("textmining/documents/guidance.xml"));

        // apply tasks to documents
        instance.apply();
    }
}
