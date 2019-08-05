package de.thkoeln.tasks;

import opennlp.tools.postag.POSModel;
import opennlp.tools.postag.POSTaggerME;
import opennlp.tools.sentdetect.SentenceDetectorME;
import opennlp.tools.sentdetect.SentenceModel;
import opennlp.tools.tokenize.Tokenizer;
import opennlp.tools.tokenize.TokenizerME;
import opennlp.tools.tokenize.TokenizerModel;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

public abstract class AbstractTask implements Task {

    private Tokenizer tokenizer;
    private SentenceDetectorME detector;
    private POSTaggerME tagger;

    public AbstractTask() {
        try {
            loadTokenizer("models/en-token.bin");
            loadSentenceModel("models/en-sent.bin");
            loadTaggerModel("models/en-pos-maxent.bin");
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    public AbstractTask(String tokenizerModel) {
        try {
            loadTokenizer(tokenizerModel);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public AbstractTask(String tokenizerModel, String sentenceModel) {
        try {
            loadTokenizer(tokenizerModel);
            loadSentenceModel(sentenceModel);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public AbstractTask(String tokenizerModel, String sentenceModel, String taggerModel) {
        try {
            loadTokenizer(tokenizerModel);
            loadSentenceModel(sentenceModel);
            loadTaggerModel(taggerModel);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public String[] tokenize(String text) {
        if(this.tokenizer == null)
            throw new NullPointerException("No tokenizer model set");
        return this.tokenizer.tokenize(text);
    }

    public String[] tag(String[] tokens) {
        if(this.tagger == null)
            throw new NullPointerException("No POSTagger model set!");

        return this.tagger.tag(tokens);
    }

    public String[] detect(String text) {
        if(detector == null)
            throw new NullPointerException("No sentence detection model set!");

        return this.detector.sentDetect(text);
    }

    public void loadTaggerModel(String path) throws IOException {
        if(path.equals(""))
            throw new IllegalArgumentException("Path to POSTagger model is empty!");

        InputStream is = new FileInputStream(path);
        POSModel model = new POSModel(is);
        this.tagger = new POSTaggerME(model);
    }

    public void loadSentenceModel(String path) throws IOException {
        if(path.equals(""))
            throw new IllegalArgumentException("Path to sentence model is empty!");

        InputStream stream = new FileInputStream(path);
        SentenceModel model = new SentenceModel(stream);
        this.detector = new SentenceDetectorME(model);
    }

    public void loadTokenizer(String path) throws IOException {
        InputStream stream = new FileInputStream(path);
        TokenizerModel model = new TokenizerModel(stream);
        this.tokenizer = new TokenizerME(model);
    }
}

