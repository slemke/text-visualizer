package de.thkoeln.pipeline;

import de.thkoeln.corpora.Document;
import de.thkoeln.corpora.parser.Parser;
import de.thkoeln.tasks.Task;

import javax.xml.bind.JAXBException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;

public class Pipeline {

    private static Pipeline instance;

    private ArrayList<Path> documents = new ArrayList<>();

    private ArrayList<Task> tasks = new ArrayList<>();

    private Pipeline() {}

    public static Pipeline getInstance() {
        if(Pipeline.instance == null)
            Pipeline.instance = new Pipeline();

        return Pipeline.instance;
    }

    public void addDocument(Path... path) {
        this.documents.addAll(Arrays.asList(path));
    }

    public void removeDocument(Path path) {
        this.documents.remove(path);
    }

    public int numberOfDocuments() {
        return this.documents.size();
    }

    public void clearDocuments() {
        this.documents.clear();
    }

    public void addTask(Task... task) {
        this.tasks.addAll(Arrays.asList(task));
    }

    public void removeTask(Task task) {
        this.tasks.remove(task);
    }

    public boolean containsTask(Task task) {
        return tasks.contains(task);
    }

    public int numberOfTasks() {
        return this.tasks.size();
    }

    public void clearTasks() {
        tasks.clear();
    }

    public void apply() {
        if(documents.size() == 0)
            throw new NullPointerException("No documents in preprocessor pipeline!");

        if(tasks.size() == 0)
            throw new NullPointerException("No tasks in preprocessor pipeline");

        for(final Path p : this.documents) {
            Parser parser = new Parser();
            try {
                Document document = parser.read(p);

                for(final Task task : this.tasks) {
                    document = task.apply(document);
                }

                //Parser.write(document, p);
            } catch (JAXBException e) {
                e.printStackTrace();
            }
        }
    }

}
