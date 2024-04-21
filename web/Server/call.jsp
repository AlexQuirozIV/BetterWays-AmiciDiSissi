<%@page import="java.lang.String"%>                     <!-- Importa la classe String dal package java.lang -->
<%@page import="java.lang.reflect.Method"%>             <!-- Importa la classe Method dal package java.lang.reflect -->
<%@page import="betterwayss.*"%>                        <!-- Importa tutte le classi dal package betterwayss -->
<%@page contentType="text/html" pageEncoding="UTF-8"%>  <!-- Imposta il tipo di contenuto della pagina come HTML e l'encoding come UTF-8 -->


<!DOCTYPE html> <!-- Dichiara il tipo di documento come HTML -->
<html>
    <head>
    </head>
    <body>
        <%
            String className = request.getParameter("class"); // Ottiene il valore del parametro "class" dalla richiesta HTTP e lo memorizza nella variabile className 
            String srcFunc = request.getParameter("func");   // Ottiene il valore del parametro "func" dalla richiesta HTTP e lo memorizza nella variabile srcFunc 
            String srcArgs = request.getParameter("args");   // Ottiene il valore del parametro "args" dalla richiesta HTTP e lo memorizza nella variabile srcArgs 
            
            System.out.println(className);                  // Stampa il valore di className sulla console di output
                        
            Class<?> c = Class.forName(className);         // Ottiene l'oggetto Class corrispondente al nome di classe specificato in className 
            Method method = c.getDeclaredMethod(srcFunc, Object.class);         // Ottiene l'oggetto Method corrispondente al nome del metodo specificato in srcFunc all'interno della classe specificata in className 
            method.invoke(c, srcArgs);                    // Invoca il metodo specificato in srcFunc sull'oggetto specificato in c, con gli argomenti specificati in srcArgs 
        %>
        
        <h1>JSPBridge/Attempting call:</h1> <!-- Intestazione che indica che si sta tentando di effettuare una chiamata -->
        <p>Namespace/Class (if present): <%=className %></p> <!-- Mostra il valore di className -->
        <p>Func Name: <%=srcFunc %></p> <!-- Mostra il valore di srcFunc -->
        <p>Args: <%=srcArgs %></p> <!-- Mostra il valore di srcArgs -->
    </body>
</html>