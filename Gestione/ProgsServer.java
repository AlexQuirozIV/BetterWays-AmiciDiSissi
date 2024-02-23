package gestione;

public class ProgGestione {


    public static void main(String[] args) {
       Gestione gestorePlaces = new Gestione();
        gestorePlaces.places(new Gestione("Torre Zucchetti", "45.301689, 9.492247", "image1.jpg"));
        gestorePlaces.places(new Gestione("IIS A. Volta", "45.303372, 9.498577", "image2.jpg"));

        for (Gestione place : gestorePlaces.getPlaces()) {
            System.out.println("Place: " + place.getPlace());
            System.out.println("Coordinates: " + place.getCoords());
            System.out.println("Image: " + place.getImage());
            System.out.println("--------------------");
        }
    }
}