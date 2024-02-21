<%@page import="java.io.FileWriter"%>
<%@page import="java.io.PrintWriter"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page language="java"%>
<%@page import="Dati.Nominativo"%>
<%@page import="java.util.*"%>

try {
    File file = new File("output.txt");
    Scanner scanner = new Scanner(System.in);
    PrintWriter printWriter = new PrintWriter(new FileWriter(file));

    for (Gestione place : places) {
        System.out.println("Place: " + place.getPlace());
        System.out.println("Coordinates: " + place.getCoords());
        System.out.println("Image: " + place.getImage());
        System.out.println("--------------------");

    String input = scanner.nextLine();
    printWriter.println(input);
    }

    printWriter.close();
} catch (IOException e) {
 e.printStackTrace();
}   

%>
