/**
 * Packages menu
 */

"use strict";

//* Variabili inerenti */
var __isPackageLaid__ = false;      // C'è un pacchetto piazzato?
var __wasProgressMade__ = false;    // C'è percorso verde (progresso) sulla mappa?
var __howMuchProgressWasMade__ = 0; // Quanto progresso (index del waypoint)?
var waypoints;                      // Collezione Waypoints
var completedItinerarySegment;      // Contiene il 'L.route' della sezione completata


function packagesMenu() {
    let id = 'packages-menu';


    /* Funzioni necessarie gestione menu */
    let menu = document.getElementById(id);
    let shouldThisMenuClose = handleMenuButtonPress(menu);
    if (shouldThisMenuClose == 'yes') { return; }


    /* Titolo */
    document.getElementById('packages-menu--title').textContent = menuTranslations["packages-menu--title"][languageID];


    /* Opzioni per il select */
    let select = menu.querySelector('select');
    let selectedIndex = select.selectedIndex; // Salva l'index, così rimane alla prossima apertura

    // Svuota il select...
    if (select.hasChildNodes()) {
        while (select.firstChild) {
            select.removeChild(select.firstChild);
        }
    }

    // ... ottieni e ordina alfabeticamente i nomi delle opzioni...
    let optionsNames = Object.keys(itinerariesTranslations)
    .map(key => itinerariesTranslations[key]["translations"][languageID]);

    let optionsValues = Object.keys(itinerariesTranslations);

    let combinedOptions = optionsValues.map((value, index) => ({
        value: value,
        name: optionsNames[index]
    }));

    combinedOptions.sort((a, b) => a.name.localeCompare(b.name));

    optionsNames = combinedOptions.map(option => option.name);
    optionsValues = combinedOptions.map(option => option.value);


    // ... e riempi il select con le "nuove" opzioni ordinate
    for (let i = 0; i < optionsNames.length; i++) {
        let option = document.createElement('option');
        option.value = optionsValues[i];
        option.text = optionsNames[i];
        select.appendChild(option);
    }

    // Ripristina l'index per l'apertura
    if (selectedIndex >= 0 && selectedIndex < select.options.length) {
        select.selectedIndex = selectedIndex;
    }


    /* Pulsanti */
    let buttons = menu.querySelectorAll('div button');

    // Testo e funzione per ciascuno
    buttons[0].textContent = menuTranslations["packages-menu--start-new-itinerary-button"][languageID];
    buttons[0].setAttribute('onclick', 'layPackage()');

    buttons[1].textContent = menuTranslations["packages-menu--cancel-current-itinerary-button"][languageID];
    buttons[1].setAttribute('onclick', 'removeLaidPackage()');


    /* Attiva il menu */
    menu.classList.toggle('menu--active');

    // Update flag
    openedMenuId = id;
}

//* Funzioni inerenti */
/* Metti / togli itinerario piazzato. __isFinal__ controlla se de'evessere oro o no */
function layPackage(__isFinal__, __shouldDrawProgess__) {
    /* Chiudi menu e barra laterale */
    __shouldNavbarExpand__ = false;
    toggleExpandedNavbar();


    /* Rimuove pacchetto già piazzato */
    removeLaidPackage();

    const selectedPackage = document.querySelector('#packages-menu select').value;


    /* Contiene la lista dei luoghi (tappe) (ID) nel pacchetto */
    var listOfPlacesInThePackage = itinerariesTranslations[selectedPackage]["stages"];


    /* Continene le informazioni per ciascun luogo (tappa) */
    var places = [];
    listOfPlacesInThePackage.forEach(element => {
        places.push(placesTranslations[element]);
    });


    /* Preleva le coordinate da 'places' e le salva in 'waypoints' */
    waypoints = places.map((place) => {
        return place["coordinates"];
    });
    // Ordina le coordinate in base alla DISTANZA
    // (non conteggia il persorso migliore) (how the fuck would I do that)
    waypoints = orderCoordinates(waypoints);


    /* Preleva titoli */
    var titles = places.map(place => place.titles[languageID]);


    /* Preleva rating */
    var ratings = places.map(place => place.rating);


    /* Preleva description */
    var descriptions = places.map(place => place.descriptions[languageID]);


    /* Preleva imageLink */
    var imageLinks = places.map(place => place.image);


    /* Aggiungi alla mappa */
    var pathColor = __isFinal__ ? '#D98E31' : 'red';     // Colore percorso
    currentPackageRouting = L.Routing.control({
        // Per ogni singolo 'waypoint'
        waypoints: waypoints,
        lineOptions: {
            styles: [{ color: pathColor, opacity: 0.8, weight: 4 }]
        },
        language: languageID,

        // Impostazioni per evitare 'dragging' dei waypoints e 'lines' (percorsi in rosso)
        draggableWaypoints: false,
        addWaypoints: false,

        // Classe del Widget (a destra)
        show: !__isFinal__, // Se NON è percorso dorato, allora mostra la strada
        containerClassName: !__isFinal__ ? 'widget--itinerary' : 'widget--itinerary--hidden',

        // Effettiva creazione (_i è un contatore necessario alla funzione)
        createMarker: function (_i, waypoint) {
            // Generazione icona in base al completamento
            function getIcon() {
                if (__isFinal__) {
                    return markerIconGold;
                } else if (__shouldDrawProgess__ && __howMuchProgressWasMade__ > 0) {
                    return markerIconGreen;
                } else {
                    return markerIcon;
                }
            }

            // Genera colore del 'div' con il numero
            function getTooltipClass() {
                if (__isFinal__) {
                    return 'custom-colored-tooltips custom-colored-tooltips--gold';
                } else if (__shouldDrawProgess__ && __howMuchProgressWasMade__ > 0) {
                    return 'custom-colored-tooltips custom-colored-tooltips--green';
                } else {
                    return 'custom-colored-tooltips';
                }
            }

            // Marker base...
            var marker = L.marker(waypoint.latLng, {
                draggable: false,
                icon: getIcon()
            }).on('click', closeOpenMenus);

            // ...con Tooltip...
            marker.bindTooltip(`${_i + 1}`, {   // `${_i + 1}` è l'indice di quale pop-up è
                permanent: true,
                direction: 'top',
                className: getTooltipClass(),
                offset: [-11, -18]
            }).openTooltip();

            // ...e Pop-up
            marker.bindPopup(
                // Info + bottone extra con testo dinamico
                bindPopupInfos(titles[_i], ratings[_i], descriptions[_i], imageLinks[_i]) +
                    '<button class="function-buttons-section--buttons popup--completed-button text-to-speak" onclick="recreateCompletedRoute(' + (_i + 1) + ')">' +
                    (
                        _i == 0 ? menuTranslations["packages-popup--begin-itinerary-button"][languageID] :
                        _i == waypoints.length - 1 ? menuTranslations["packages-popup--completed-itinerary-button"][languageID] :
                        menuTranslations["packages-popup--arrived-itinerary-button"][languageID]
                    ) +
                    '</button>'
            );

            __howMuchProgressWasMade__--;

            return marker;
        }
    }).addTo(map);
    

    /* Update flag */
    __isPackageLaid__ = true;


    /* Pop-up "Complimenti hai completato il percorso!" */
    if (__isFinal__) { compleatedItineraryCelebration(); }
}

/* Riordinare le coordinate date... le coordinate */
function orderCoordinates(coords) {
    if (coords.length <= 1) {
        return coords;
    }

    const firstCoord = coords[0];
    const otherCoords = coords.slice(1);

    otherCoords.sort((a, b) => {
        const distanceA = calculateDistance(firstCoord, a);
        const distanceB = calculateDistance(firstCoord, b);
        return distanceA - distanceB;
    });

    return [firstCoord, ...otherCoords];
}

/* Calcola la distanza fra due coordinate usando la scienza B)  (formula di Haversine) */
function calculateDistance(coord1, coord2) {
    const [lat1, lon1] = coord1;
    const [lat2, lon2] = coord2;

    const R = 6371; // Raggio della Terra in chilometri (science motherfuckers)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distanza in chilometri

    return distance;
}

/* BRAVISSIMO/A!!! */
function compleatedItineraryCelebration() {
    /* Controllo classi per animazione pop-up */
    var completedItineraryPopupContainer = document.getElementById("completed-itinerary");
    var completedItineraryPopup = document.getElementById("completed-itinerary--popup");
    completedItineraryPopup.innerHTML = menuTranslations["completed-itinerary--popup"][languageID];

    completedItineraryPopupContainer.classList.toggle('completed-itinerary--popup--shown');
    setTimeout(() => {
        completedItineraryPopupContainer.classList.toggle('completed-itinerary--popup--shown');
    }, 2300);
    
    completedItineraryPopup.classList.toggle('completed-itinerary--popup--shown');
    setTimeout(() => {
        completedItineraryPopup.classList.toggle('completed-itinerary--popup--shown');
    }, 2000);

    /* Coriandoli */
    letThemRain();
}

/* Rimuove il pacchetto piazzato */
function removeLaidPackage() {
    // Se non c'è un itinerario piazzato o non stiamo analizzando un itinerario, esci...
    if (!__isPackageLaid__ || !currentPackageRouting) {
        return;
    }
    // ...altrimenti, rimuovi il pacchetto piazzato a 'currentPackageRouting' e, se "__wasProgressMade__", allora rimuovi anche quello
    map.removeControl(currentPackageRouting);
    if (__wasProgressMade__) {
        map.removeControl(completedItinerarySegment);
    }

    // Resetta i valori
    __isPackageLaid__ = false;
    __wasProgressMade__ = false;
    currentPackageRouting = undefined;
}

/* Gestisce il completamento di un segmento (dato l'indice del marker) */
function recreateCompletedRoute(index) {
    // Resetta il percorso ed esce se il pirla (l'utente) tenta di completare zero tappe (index == 1)
    if (index == 1) {
        layPackage(false, false);
        return;
    }

    // Se c'era già piazzato un segmento precedente, cancellalo
    if (__wasProgressMade__) {
        map.removeControl(completedItinerarySegment);
    }

    // Piazza oro se viene completata tutta, altrimenti verde
    if (index == waypoints.length) {
        layPackage(true, false);
        return;
    } else {
        __howMuchProgressWasMade__ = index;
        layPackage(false, true);
        completedItinerarySegment = L.Routing.control({
            waypoints: waypoints.slice(0, index),   // I waypoint vanno dal primo (0) all'index
            routeWhileDragging: false,
            draggableWaypoints: false,
            addWaypoints: false,
            show: false,    // Niente Widget
            containerClassName: 'widget--completed-segment',
            lineOptions: {
                styles: [{ color: 'green', opacity: 1, weight: 5 }]
            },
            createMarker: () => { return null; }       // Niente markers
        }).addTo(map);
    }

    // Update flag
    __wasProgressMade__ = true;
}