# API @cmda-minor-web 2023 - 2024
## Samenvatting

## De opdracht

## Installatie
### Localhost
De repository is vrijwel 'ready to use'. De enige vereiste software-componenten voor de installatie van Dopify zijn NodeJS en NPM. Optioneel is Nodemon dat globaal geïnstalleerd is, maar dat wordt meer gebruikt voor testdoeleindes. Eerst moet natuurlijk de repository geclonned worden. Het enige dat mist aan de repository is een access token en een secret token, die app gebonden zijn. Lees de informatie door van de volgende [link](https://developer.spotify.com/documentation/web-api/tutorials/code-flow) voor meer informatie. Deze dienen in een file gezet te worden genaamd *token.env*, dat natuurlijk niet is meegegeven aan de repository. De structuur van de file ziet er als volgt uit:

```
client_id= { access token v/d app }
client_secret= { secret token v/d app }
```

Vervolgens dienen er een aantal dingen te worden aangepast in twee files, namelijk *server.js* en *index.liquid*. *server.js* bevat een redirect URL dat gelijk moet zijn aan de ingestelde redirect URL in de Spotify app. Het gaat om de waarde van **redirect_uri**, dat te vinden is in regel 23. *index.liquid* bevat meerdere 'buttons' (aria labels) die ieder een href bevatten die de gebruiker ergens naar toe door verwijzen. Het is van belang dat het path onaangepast blijft, alleen de domeinnaam moet gewijzigd worden. Het gaat om de regels *15*, *20* en *21*.

Als de hierboven genoemde stappen zijn uitgevoerd, kan de installatie beginnen. Wanneer zowel NodeJS als NPM aanwezig zijn op het systeem, kan Dopify worden geïnstalleerd door het volgende commando te runnen in de folder van de cloned repository.

```
npm install
```

Vervolgens wordt de server opgestart door één van de volgende commando's uit te voeren in de folder genaamd Dopify.

```
--- NODE ---
node server.js

--- NODEMON ---
nodemon server.js
```

De server zal nu zonder problemen worden uitgevoerd. 

### Publiekelijk toegankelijk
Om de server publiekelijk toegankelijk te maken, is het vereist dat er gebruik wordt gemaakt van HTTPS. Zonder HTTPS zal de Spotify API errors geven en niet functioneren, omdat zij willen dat er gebruik wordt gemaakt van HTTPS. Voor localhost maakt het niet uit. Er zijn twee manieren, de simpele manier waarbij gebruik wordt gemaakt van een NPM-module en de ingewikkelde manier. De laatste methode heb ik gebruikt om [Dopify](https://dopify-player.nl) te hosten. 


<details>
    <summary>#### NPM-module - localtunnel<summary>
**localtunnel** is een NPM module dat het HTTP verkeer van localhost doorstuurt naar een server van localtunnel, dat dient als HTTPS proxy. Het is namelijk onmogelijk om met *tinyhttp* gebruik te kunnen maken van SSL certificaten om HTTPS te verkrijgen op de website. Om localtunnel te installeren is het vereist om deze global te installeren, om de tool zo goed mogelijk te laten functioneren.

```
npm install -g localtunnel
```

Vervolgens moet de webserver (nodeJS of nodemon) worden gestart in een terminal, waarna er in een andere terminal het volgende commando wordt uitgevoerd.

```
lt --port { poortnummer v/d server (standaard 8500) }
```

Nu zal *localtunnel* een URL genereren, die de website met HTTPS zal weergeven aan de gebruiker dat de URL bezoekt. Let wel op, de URL is beveiligd met een wachtwoord. Het wachtwoord is het publieke [IP](https://www.whatsmyip.org/) van het systeem waar de webserver op wordt uitgevoerd.
</details>

#### Apache2 i.c.m. Nginx Proxy Manager
<details>
<summary>Klap de tekst open...</summary>
Apache2 kan voor meerdere doeleindes worden gebruikt, zoals het hosten van een simpele website. Maar dankzij de talloze beschikbare modules kan Apache2 ook worden gebruikt als HTTPS Proxy. Apache2 dient in mijn geval als Proxy voor de NodeJS server dat draait op HTTP. De proxy zorgt ervoor dat de buiten wereld denkt een HTTPS-verbinding te hebben met de webserver en dat is voor het grootste gedeelte ook zo. Het verkeer is alleen geen HTTPS-verkeer als het vanaf de proxy naar de NodeJS webserver gaat, maar als beide services op dezelfde host worden uitgevoerd, zal het geen beveiligings-risico's met zich meebrengen. Om Apache2 te installeren moet het volgende commando worden uitgevoerd:

```
apt-get install apache2 -y
```

Apache2 heeft een configuratie file nodig om te kunnen functioneren. Hiervoor stel ik de volgende template beschikbaar (alles tussen {} moet worden ingevuld):

```
NameVirtualHost *:443
<VirtualHost *:443>
  ServerName { domeinnaam }
  DocumentRoot { path naar bestanden voor de website, niet zo relevant }

  CustomLog <LOG-PATH> combined
  ErrorLog <ERROR-LOG-PATH>

  # Example SSL configuration
  SSLEngine on
  SSLProtocol all -SSLv2
  SSLCipherSuite HIGH:MEDIUM:!aNULL:!MD5
  SSLCertificateFile "{ path naar HTTPS certificaat }"
  SSLCertificateKeyFile "{ path naar private key file }"
  SSLCACertificateFile "{ path naar chain file }"

  ProxyPass / http://0.0.0.0:{ poortnummer }/
  ProxyPassReverse / http://0.0.0.0:{ poortnummer }/
</VirtualHost>
```

Dit configuratie bestand moet worden geplaatst op het pad */etc/apache2/sites-available/{ naam }.conf*. Om Apache2 te laten werken met dit configuratie bestand moeten de modules *ssl*, *proxy* en *proxy_http* worden geïnstalleerd en moet de configuratie file zelf worden geactiveerd. 
```
a2ensite { path naar configuratie file }
a2enmod ssl
a2enmod proxy
a2enmod proxy_http
```

Nu moeten er nog enkele functies in Nginx Proxy Manager worden ingesteld.
</details>

 
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