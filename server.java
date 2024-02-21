/*
 
 */
package gestione;

/**
 *
 * @author 
 */

public class Gestione {
    private String Places;
    private String Coords;
    private String Images;
  
   public Gestione (String Places,String Coords,String Images)
   {
   this.Places = Places;
   this.Coords = Coords;
   this.Images = Images;
  
   }      
   public Gestione()
   {
       this.Places="";
       this.Coords"";
       this.Images="";
   }

    public String getPlaces() {
        return Places ;
    }

    public void setPlaces(String Places) {
        this.Places = Places;
    }

    public String getCoords() {
        return Coords;
    }
  
    public void setCoords(String Coords) {
        this.Coords = Coords;
    }

    public String getImages() {
        return Images;
    }
  
    public void setImages(String Images) {
        this.Images = Images;
    }
  
     public String toString() {
        return  Places + "**" + Coords + "**" + Images + "**";   
        
  }
}
