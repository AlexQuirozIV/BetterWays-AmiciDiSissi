package gestione;

public class Gestione {
    private String place;
    private String coords;
    private String image;

    public Gestione(String place, String coords, String image) {
        this.place = place;
        this.coords = coords;
        this.image = image;
    }

    public Gestione() {
    }

    public String getPlace() {
        return place;
    }

    public void setPlace(String place) {
        this.place = place;
        this.coords = "";
        this.image = "";
    }

    public String getCoords() {
        return coords;
    }

    public void setCoords(String coords) {
        this.coords = coords;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
}