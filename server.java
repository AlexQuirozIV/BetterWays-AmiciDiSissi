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

    public static void main(String[] args) {
        Gestione[] places = new Gestione[3];
        places[0] = new Gestione("Torre Zucchetti", "45.6789, 12.3456", "image1.jpg");
        places[1] = new Gestione("Colosseo", "41.8902, 12.4922", "image2.jpg");
        places[2] = new Gestione("Duomo di Milano", "45.4642, 9.1900", "image3.jpg");

        for (Gestione place : places) {
            System.out.println("Place: " + place.getPlace());
            System.out.println("Coordinates: " + place.getCoords());
            System.out.println("Image: " + place.getImage());
            System.out.println("--------------------");
        }
    }
}