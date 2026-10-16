# NPO Podcast — vaste links toevoegen

Versie 1.0.3 voor Chrome op Windows en macOS, met Tampermonkey.

Dit pakket bestaat uit precies twee bestanden:

- `npo-podcast-vaste-links.user.js`: het installeerbare browserhulpmiddel.
- `README.md`: deze handleiding. GitHub toont hem vanzelf op de repositorypagina.

## Wat is gecontroleerd?

Het volledige script is overgenomen uit het werkende Tampermonkey-script dat David heeft aangeleverd. Alleen het versienummer en de twee GitHub-updateadressen zijn gewijzigd. Het standaardlinkblok bevat exact dezelfde tekst, emoji's, HTML, acht hyperlinks en het slot 'Relevante afleveringen:'. Er zijn geen voorbeeldlinks gebruikt.

De acht linkbestemmingen uit het aangeleverde script:

1. Archieftool: https://www.eo.nl/campagne/welke-de-ongelooflijke-podcast-aflevering-luister-jij-vandaag
2. Online platform (Substack): https://deongelooflijke.substack.com/
3. De Ongelooflijke Geschiedenis: https://www.eo.nl/podcast/de-ongelooflijke-geschiedenis/afleveringen
4. YouTube: https://www.youtube.com/@deongelooflijke
5. Instagram: https://www.instagram.com/deongelooflijke/
6. David op LinkedIn: https://www.linkedin.com/in/david-boogerd-44207a7b?originalSubdomain=nl
7. David op Blue Sky: https://bsky.app/profile/davidboogerd.bsky.social
8. Stefan op LinkedIn: https://www.linkedin.com/in/stefan-paas-51373a5/

Deze controle betreft de exacte overname uit de bron, geen controle van de bereikbaarheid of inhoud van die websites.

## De twee bestanden op GitHub zetten

1. Pak `npo-podcast-delen-v1.0.3.zip` uit. Op een Mac dubbelklik je op de zip. Op Windows klik je erop met de rechtermuisknop en kies je **Alles uitpakken**.
2. Open de uitgepakte map. Daarin staan het bestand met `.user.js` en `README.md`.
3. Log in op GitHub en open [jullie repository](https://github.com/DavidBoogerd/ongelooflijke-redactietool).
4. Als er al bestanden staan, controleer je linksboven boven de bestandenlijst of de branch **main** heet. Staat daar een andere naam, stop dan even: de updateadressen zijn ingesteld op `main` en moeten dan worden aangepast.
5. Klik op **Add file** en daarna op **Upload files**. Is de repository nog leeg? Klik dan op het linkje **uploading an existing file** op de lege repositorypagina.
6. Sleep de **twee losse bestanden** uit de uitgepakte map naar het uploadvak. Upload dus geen zip en geen hele map. Je hoort de namen `npo-podcast-vaste-links.user.js` en `README.md` te zien. Bestaande bestanden met dezelfde namen worden bij het opslaan bijgewerkt; controleer dat dit de bestanden zijn die je wilt vervangen.
7. Typ bij het bericht: **Vaste links toevoegen — versie 1.0.3**.
8. Kies, als GitHub die keuze toont, **Commit directly to the main branch**. Klik op **Commit changes**, eventueel nogmaals in het bevestigingsvenster. Dit betekent 'bestanden opslaan op GitHub'. Als GitHub alleen een nieuwe branch of een voorstel toestaat, moet een repositorybeheerder dat voorstel eerst samenvoegen met `main` voordat de update beschikbaar is.
9. Controleer dat beide bestanden nu in de hoofdmap staan en dat de branch **main** heet. Bij een lege repository kan de branch pas na deze eerste upload zichtbaar zijn.
10. Open de [installatielink](https://raw.githubusercontent.com/DavidBoogerd/ongelooflijke-redactietool/main/npo-podcast-vaste-links.user.js). Je hoort een Tampermonkey-installatievenster of JavaScript-tekst te zien met `@version 1.0.3`. Een foutmelding zoals 404 betekent dat bestand, branch of openbare toegang nog niet klopt.
11. Controleer dezelfde link ook in een incognitovenster zonder inloggen op GitHub. Als daar de scripttekst zichtbaar is, is de link zonder GitHub-login bereikbaar voor de updatecontrole.

Er is bij het maken van dit pakket niets naar GitHub geüpload. De branch `main` is de ingestelde bestemming; deze kon hier niet worden bevestigd. Voor deze eenvoudige updateopzet moet de Raw-link zonder inloggen bereikbaar zijn. Bij een privérepository is ingelogd zijn op github.com geen garantie voor achtergrond-updates. Verander de zichtbaarheid van de repository alleen als jullie de inhoud openbaar willen delen; bij een privérepository kun je het pakket voorlopig handmatig delen.

## Installeren in Chrome op een MacBook

1. Open Chrome en ga naar [tampermonkey.net](https://www.tampermonkey.net/). Kies de Chrome-versie en installeer de extensie via de Chrome Web Store met **Toevoegen aan Chrome**.
2. Typ `chrome://extensions` in de adresbalk. Klik bij Tampermonkey op **Details** en zet **Gebruikersscripts toestaan / Allow User Scripts** aan. Ontbreekt die optie, volg [Tampermonkeys uitleg voor Developer mode](https://www.tampermonkey.net/faq.php?locale=en&q=Q209). Geef de extensie toegang tot `podcast.npo.nl` als Chrome daarom vraagt.
3. Open de [installatielink](https://raw.githubusercontent.com/DavidBoogerd/ongelooflijke-redactietool/main/npo-podcast-vaste-links.user.js), nadat de bestanden op GitHub zijn gezet.
4. Tampermonkey toont **NPO Podcast - Vaste links toevoegen**. Klik op **Installeren**. Heb je een oudere versie, accepteer dan de aangeboden update of vervanging. Zorg dat er maar één exemplaar actief is.
5. Verschijnt alleen code? Klik op het Tampermonkey-icoontje, open **Dashboard** en kies **Nieuw script / +**. Selecteer de voorbeeldcode met `⌘A`, plak de volledige scripttekst en kies **Bestand → Opslaan** in de editor. Je kunt hiervoor ook het meegestuurde `.user.js`-bestand in een teksteditor openen en alle tekst kopiëren.
6. Open de NPO-beheerpagina en herlaad met `⌘R`. Bij het bewerken van een aflevering verschijnt **🔗 Vaste links toevoegen** bij Omschrijving.
7. Klik erop, controleer de shownotes en sla de aflevering zelf op met de gewone NPO-knop.

Op Windows volg je dezelfde stappen. Gebruik `Ctrl` in plaats van `⌘` voor selecteren, kopiëren, plakken en herladen. Een script dat de werkgever via Chrome blokkeert, moet door de IT-beheerder worden toegestaan.

## Wat doet de knop?

De knop voegt onderaan twee lege alinea's en het standaardblok toe. De bestaande TinyMCE-API, editorherkenning, iframe-fallback, dynamische detectie en consolelogging zijn behouden. Het script verstuurt wijzigings-events en synchroniseert het formulierveld. De onzichtbare marker voorkomt dat het blok opnieuw wordt toegevoegd. Bij een tweede klik verschijnt: **De vaste links staan al in deze omschrijving.**

Het script draait met `@grant none`, uitsluitend op `https://podcast.npo.nl/admin/*`. Het slaat of publiceert zelf geen podcastafleveringen. TinyMCE `save()` werkt alleen het onderliggende formulierveld bij. Ook een update van het script publiceert niets.

## De vaste tekst centraal aanpassen

Spreek af wie het standaardblok beheert. Die persoon kan het bestand op GitHub openen en met het potloodje bewerken:

1. Zoek bovenaan `const STANDARD_LINKS_HTML =`.
2. Wijzig de tekst en HTML tussen de twee backticks. Behoud de gewenste `<a href="...">`-links en `<br>`-regeleinden. Laat de marker `<!-- ongelooflijke-standaardlinks -->` staan.
3. Verhoog bovenaan `@version`, bijvoorbeeld van `1.0.3` naar `1.0.4`, ook als alleen één link is gewijzigd.
4. Controleer de wijziging in de eigen browser voordat je hem opslaat op de gedeelde branch. Controleer tekst, opmaak en dubbele-invoercontrole.
5. Sla de wijziging op GitHub op met **Commit changes**. Collega's ontvangen de nieuwe versie via Tampermonkeys updatecontrole, als die bij hen is ingeschakeld. Voor direct bijwerken kunnen ze de actie **Check for updates / Controleren op updates** in Tampermonkey gebruiken of opnieuw de installatielink openen.
6. Herlaad de NPO-pagina na de update.

Beide updateadressen zijn al ingesteld op hetzelfde volledige userscript in de hoofdmap van `main`. Een extra metadata-bestand is niet nodig. Wijzig `@name` en `@namespace` niet bij gewone updates.

Aanpassingen gelden voor nieuwe toevoegingen. Tekst die al in een aflevering staat, verandert niet automatisch. Collega's kunnen het centraal beheerde blok beter niet afzonderlijk in hun browser wijzigen: een volgende scriptupdate kan die lokale aanpassingen vervangen.

## Hulp bij problemen

- Geen knop? Controleer of Tampermonkey en het script aanstaan, of Chrome gebruikersscripts toestaat en of de pagina onder `https://podcast.npo.nl/admin/` staat. Herlaad de pagina na installatie of update.
- Geen updates? Controleer of de installatielink zonder inloggen werkt en of de nieuwe versie een hoger `@version` heeft. Gebruikers van de oude versie zonder updateadressen moeten de gekoppelde versie eenmalig handmatig installeren.
- Bekijk meldingen in de Chrome-console met `⌘⌥J` op Mac of `Ctrl+Shift+J` op Windows. Filter op `[NPO vaste links]`.

## Officiële uitleg

- [GitHub: bestanden uploaden](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)
- [Tampermonkey: userscripts installeren](https://www.tampermonkey.net/faq.php?q=Q102)
- [Tampermonkey: Chrome-toestemming](https://www.tampermonkey.net/faq.php?locale=en&q=Q209)
- [Tampermonkey: updateadressen](https://www.tampermonkey.net/documentation.php?q=update_url)
