# API @cmda-minor-web 2023 - 2024
## Samenvatting

## Installatie
De repository is vrijwel 'ready to use'. De enige vereiste voor de installatie van Dopify zijn NodeJS en NPM. Optioneel is Nodemon dat globaal geïnstalleerd is, maar dat wordt meer gebruikt voor testdoeleindes. Eerst moet natuurlijk de repository geclonned worden. Wanneer zowel NodeJS als NPM aanwezig zijn op het systeem, kan Dopify worden geïnstalleerd door het volgende commando te runnen in de folder van de cloned repository.

```
npm install
```

Vervolgens wordt a.d.h.v. één van de volgende commando's uit te voeren in de folder genaamd Dopify, de server voor Dopify opgestart.

```
--- NODE ---
node server.js

--- NODEMON ---
nodemon server.js
```

## De opdracht


## Gebruikte API's
De API dat ik heb gebruikt voor de opdracht is de API van Spotify. Spotify stelt vrijwel hun hele assortiment van API's beschikbaar voor Premium gebruikers om te gebruiken als Developer. Hiervoor heb ik in de Developer Panel een app aangemaakt, die ik de naam Dopify heb gegeven. Op het moment kon ik geen andere naam bedenken en ik heb de naam van mijn tool simpelweg zo gelaten. 

### Spotify API
Ik ben begonnen met het uitproberen van verschillende functionaliteiten van de Spotify API, waarbij ik vooraf kort onderzoek heb gedaan over wat er überhaupt mogelijk is met de API. Al snel kwam ik erachter dat mijn denkwijze over hoe Spotify werkt niet klopte. Ik had namelijk het idee dat Spotify als media player functioneerde en telkens het nummer dat werd afgespeeld vooraf ophaalde en dat de media controls, zoals de knoppen om te pauzeren, het liedje te skippen, etc., in de applicatie werden uitgevoerd. Maar eigenlijk werkt alles in Spotify, zowel de web versie als alle applicaties die op apparaten kan worden gedownload, a.d.h.v. API calls naar de servers van Spotify, vanuit waar de muziek wordt gestreamed naar het afspeelapparaat. 

Toen ik dit eenmaal doorhad, begon ik de werking van de Spotify API beter te begrijpen en vond ik het makkelijker om er gebruik van te maken.

### Web API: Notification
Als extra web API heb ik gebruik gemaakt van Notifications. Ik heb dit gebruikt om een browser notificatie te tonen wanneer er een nieuw nummer wordt afgespeeld. Hierdoor hoeft een gebruiker van Dopify niet de player constant open te hebben om te zien wat er afspeelt, gezien er vanuit het OS een notificatie wordt getoond. Zelf heb ik geconstateerd dat de notificaties op MacOS te kaal zijn om te kunnen gebruiken, maar op Windows wordt er in een Chromium browser netjes de notificatie getoond.

## Concepten / Prototypes


### Schetsen


### Authenticatie


### Player


## Eindresultaat


## Logs