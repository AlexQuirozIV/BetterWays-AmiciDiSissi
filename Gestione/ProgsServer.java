package gestione;

public class ProgGestione {


    public static void main(String[] args) {
        GestorePlaces gestorePlaces = new GestorePlaces();

        gestorePlaces.addPlace(new Gestione("Torre Zucchetti", "45.301689, 9.492247", "image1.jpg"));
        gestorePlaces.addPlace(new Gestione("IIS A. Volta", "45.303372, 9.498577", "image2.jpg"));


        for (Gestione place : places) {
            System.out.println("Place: " + place.getPlace());
            System.out.println("Coordinates: " + place.getCoords());
            System.out.println("Image: " + place.getImage());
            System.out.println("--------------------");
        }
    }
}