package de.thkoeln.corpora.document;

public final class Token {

    private String token;
    private String tag;

    public Token(String token) {
        this.token = token;
    }

    public Token(String token, String tag) {
        this.token = token;
        this.tag = tag;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Token token1 = (Token) o;

        if (token != null ? !token.equals(token1.token) : token1.token != null) return false;
        return tag != null ? tag.equals(token1.tag) : token1.tag == null;
    }

    @Override
    public int hashCode() {
        int result = token != null ? token.hashCode() : 0;
        result = 31 * result + (tag != null ? tag.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "Token{" +
                "token='" + token + '\'' +
                ", tag='" + tag + '\'' +
                '}';
    }
}
