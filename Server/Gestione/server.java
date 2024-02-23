package gestione;

public class Server {
  private String latitudine;  
  private String longitudine;
  private String nome;
  private String indirizzo;

    public Server(String latitudine, String longitudine, String nome, String indirizzo) {
        this.latitudine = latitudine;
        this.longitudine = longitudine;
        this.nome = nome;
        this.indirizzo = indirizzo;
    }

    @Override
    public String toString() {
        return latitudine + "%%%" + longitudine + "%%%" + nome + "%%%" + indirizzo;
    }
  
}