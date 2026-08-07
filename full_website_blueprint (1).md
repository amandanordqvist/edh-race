# Komplett Webbspecifikation & Informationsarkitektur: EDH Racing (Helhetsdesign)

Detta dokument utgör den fullständiga specifikationen och textinnehållet för hela **EDH Racings** nya digitala plattform. Målet är att binda samman alla delar av Anders Edhs karriär, teamets sammansättning, maskinens extrema prestanda och den visuella identiteten ("Skandinavisk minimalism möter racing") till en heltäckande, funktionell och professionell helhet [53, 66, 85].

---

## 1. Global Struktur & Webbkarta (Sitemap)

Plattformen bygger på en Next.js-arkitektur utvecklad av **AINE** med en skräddarsydd backend för enkel resultatuppdatering och sponsorhantering [52, 53]. 

### Global Meny & Navigering
*   **HEM (Startsida):** Den visuella portalen med den interaktiva dragstrip-simulatorn [25].
*   **ANDERS RESA (Journey):** Berättelsen om föraren, karriärtidslinjen och de största milstolparna [25].
*   **MASKINEN (The Machine):** Tekniska specifikationer för Chevrolet Camaro "The Beast" [25, 29, 34].
*   **RESULTAT & TÄVLINGAR (Races):** Historiska meriter, årsbästa och SM-kalendern [2, 25, 135].
*   **TEAMET (Team):** Presentation av mekaniker, strategiska rådgivare och stödpersoner [25, 30, 137].
*   **MEDIA (Galleri):** Actionbilder, slowmotion-klipp och onboard-videor [25, 31].
*   **SPONSORER & KONTAKT (Contact):** Sponsringsmöjligheter, värdeerbjudanden och kontaktformulär [25, 31].

---

## 2. Globalt Designsystem (Skandinavisk Racing-Minimalism)

### Färgpalett
*   **Basfärg (Almost Black):** `#0B0C0E` – Ger ett oändligt, djupt mörker som påminner om asfalten på en kvällstävling.
*   **Primär Accent (Primary Blue):** `#1b3e84` – En kraftfull, mättad kungsblå inspirerad av kolfiber-Camarons lack [Bild 5, 18].
*   **Stödfärg (Supporting Navy):** `#1d2a3e` – En dämpad marinblå som används som bakgrund för kort och sektioner för att skapa visuella lager.
*   **Inramning (Silver Gray):** `#C4C7CC` – Laserskarpa, tunna linjer (0.5px) som ramar in kort och element.
*   **Textfärg (Almost White):** `#F5F6F8` – Maximal kontrast mot den mörka basen.

### Typografi
*   **Speed Rusher:** Används exklusivt för stora H1/H2-rubriker. Lutande, aggressivt och laddat med fart.
*   **Aristotele:** Används för navigering, knappar, mindre rubriker (H3) samt tabellhuvuden. Geometriskt och minimalistiskt.
*   **DM Sans:** Används för all löpande brödtext, listor och specifikationer. Säkrar renhet och läsbarhet på alla enheter.

### Djup & Struktur
*   Alla kort och tabeller använder en mjuk, djup skugga för att visuellt "sväva" ovanpå den mörka bakgrunden:
    `box-shadow: 0 24px 48px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.05);`
*   Asymmetriska, sneda sektionsavskiljare (skew divider på -3 grader) bryter av det skandinaviska rutnätet och skapar en känsla av framåtrörelse.

---

## 3. Sektionsspecifikationer för alla sidor

### SIDA 1: STARTSIDA (Home)

Startsidan är den ultimata sälj- och upplevelseportalen, utformad för att fängsla besökaren och konvertera potentiella sponsorer [66, 85].

*   **HERO-SEKTION ("The Blast"):**
    *   *Visuell bakgrund:* Stor, mättad actionbild på Camaron "The Beast" mitt i en rökfylld burnout på Santa Pod, där vit däckrök tonar ut i `Almost Black` nedtill [Bild 8, 18].
    *   *Rubrik (Speed Rusher):* `EDH RACING`
    *   *Tagline (Aristotele):* `PUSHING SWEDISH DRAGRACING BEYOND LIMITS`
    *   *Svävande prestandakort (Supporting Navy + Djup skugga):*
        1.  `5.74s` – Quarter Mile [25, 34, 72, 110]
        2.  `415 km/h` – Toppfart [25, 34, 72, 110]
        3.  `3.82s` – Eighth Mile [25, 35, 72, 110]
        4.  `2 500 - 3 000` – Hästkrafter [81, 100, 119]
    *   *CTA-knapp (Aristotele):* `UPPLEV RESAN` (Solid kungsblå med en subtil blå ljusskugga bakom).

*   **SPONSORNAVET ("Driven av Precision"):**
    *   *Rubrik (Speed Rusher):* `BYGGD FÖR SPONSORER. DRIVEN AV PRECISION.`
    *   *Löpande text (DM Sans):* "Ett dragracingteam i den absoluta Europatoppen kräver mer än bara hästkrafter – det kräver extrem precision, uthållighet och passion [53, 66, 85]. Anders Edh bygger, utvecklar och kalibrerar sin 3 000-hästars Camaro helt på egen hand i garaget i Hudiksvall [68, 106]. Genom att samarbeta med EDH Racing syns ert varumärke på Europas snabbaste arenor och förknippas med skandinavisk spetskompetens och ingenjörskonst i dess mest extrema form."
    *   *Sponsor-galleri (Silvergrå logotyper):* Visar partners som **AINE**, **Olle Edhs Tvätt & Kyl**, **Hudiksvalls Isolering**, m.fl. [77, 115, 138].

*   **DRAGSTRIP-SIMULATOR (React-komponent):**
    *   En fullt fungerande, interaktiv simulator där besökaren klickar på "STAGEA BILEN" för att starta startgranen [46]. Vid grönt ljus simuleras loppet över 402 meter i realtid, där Camaron (5.74s) jämförs mot en Formel 1-bil och ett passagerarflygplan [36, 74, 112, 151].

*   **FOOTER:**
    *   *Innehåll:* Snabblänkar, sociala medielänkar (Facebook, Instagram, YouTube) samt kontaktkort [31].

---

### SIDA 2: ANDERS RESA (Om Anders & Tidslinje)

Denna sida fokuserar på protagonisten Anders Edh och hans osannolika väg till Europatoppen [66, 85]. Den är skriven för att engagera läsaren känslomässigt och visa på den enorma uthållighet som krävs [68, 98, 106].

*   **FÖRARENS BERÄTTELSE (DM Sans):**
    *   *Inledning:* Anders växte upp i trakten kring Hudiksvall [67, 105]. Fascinationen för fart och mekanik föddes redan som 9-åring när han kände motorvibrationerna genom styret på en mini-moped [67, 105]:
        > *"Jag minns fortfarande känslan när motorn startade och vibrationerna gick genom styret. Den känslan har aldrig lämnat mig."* – Anders Edh [27, 28, 67, 105]
    *   *Vändpunkten:* Som 16-åring köpte Anders sin första Chevrolet Camaro (1971 års modell) för 14 800 kr [28, 67, 105]. Men det var på nyårsafton 2004 som dragracing-ödet beseglades [26, 68, 106]. Efter ett spontant köp av en 1970 års Camaro från New Jersey på eBay startade en resa som kom att förändra allt [26, 68, 106].
    *   *Filosofin:* Anders skiljer sig från många konkurrenter genom att han gör allt själv [68, 106]. Istället för att köpa ett färdigt chassi från USA, bygger, utvecklar och tunar han bilarna i det egna garaget [68, 106]. Hans metod är djupstudier och att ta reda på tekniska detaljer som ingen annan gör [68, 106].
        > *"Vem som helst kan ta reda på informationen – svårigheten är att veta vad man ska ta reda på."* – Anders Edh [68, 106]

*   **DEN VERIFIERADE TIDSLINJEN (Interaktiv tidslinje med hover-effekter):**
    *   **1970-tal:** Köper sin första Camaro (1971) för 14 800 kr som 16-åring [69, 107].
    *   **Nyårsafton 2004:** Spontanköp av 1970 Camaro på eBay [69, 107].
    *   **2005:** Introduceras till dragracing av Kjell-Åke Kring (Norrbo) och tar licens i Söderhamn [28, 68, 106]. Mekanikern Martin Ekstedt dyker upp i garaget [69, 107].
    *   **2006:** Kör 10,0 sekunder på 402 meter (kvartsmilen) [70, 108].
    *   **2010:** Når 7,8 sekunder på 402 meter med en lustgasmotor [70, 108].
    *   **2013:** River bilen helt och bygger rörchassi från grunden. Gatubilen är nu en ren tävlingsmaskin [70, 108].
    *   **2016:** Presterar 6,80 sekunder på 402 meter [70, 108]. Anders står vid ett vägskäl och överväger att sälja allt [70, 108].
    *   **2016–2017:** Byter till en kompressormotor (Chevrolet), vilket inleder en helt ny era av framgång [70, 108].
    *   **2017:** Kör 4,15 sekunder på 201 meter nästan direkt [70, 108]. Slutar på 6:e plats i European Drag Racing Series [6, 32].
    *   **2018:** Blir Runner Up (2:a) i nordeuropeiska Summit Racing EDRS Series i Top Doorslammer [125].
    *   **2019 (Mästerskapsåret):** **Vinner Top Doorslammer-serien i Norden och tar 1:a plats i European Drag Racing Series (EDRS)** [6, 32, 70, 108].
    *   **2021:** Sista säsongen med plåtbilen. Sätter ett historiskt plåtbilsrekord i Europa på 3,89 sekunder på 201 meter [71, 73, 109, 111].
    *   **2023:** Bygger en helt ny Camaro med kolfiberkaross, BAE 521-motor och MB-chassi [71, 109].
    *   **2024:** Det globala genombrottet på Santa Pod i England. Kör ett spektakulärt personbästa på **5,74 sekunder @ 415 km/h** [71, 72, 109, 110].
    *   **2025:** Rekryterar Andreas Gröning till teamet [71, 109]. Slutar på en stark 3:e plats totalt i Top Doorslammer European Drag Racing Series [6, 32].
    *   **2026:** Inleder säsongen med vinst i första tävlingen på Santa Pod [71, 109]. Sätter 3,87 sekunder på asfaltsbana i Hudiksvall (näst snabbaste tiden någonsin på banan) efter ett intensivt precisionsarbete med fyrlänk och viktbalans [71, 109].

---

### SIDA 3: MASKINEN (Bilen i detalj)

Denna sida tillhandahåller djupgående teknisk information om Chevrolet Camaro "The Beast" [73, 111]. Den visar teamets tekniska excellens och tilltalar teknikentusiaster samt ingenjörsfokuserade sponsorer [66, 85].

*   **INTERAKTIVT 3D-CHASSI (SVG Blueprint / WebGL):**
    *   En stilren, roterbar och sprängskissartad vy över bilen där användaren kan klicka på pulserande sensorpunkter för att läsa om maskinens anatomi:
        *   **BAE 521 Hemi-motor:** 8,5-liters kompressormaskin matad med metanol som levererar runt 2 500–3 000 hästkrafter [73, 81, 111, 119].
        *   **PSI Skruvkompressor:** Ger ett konstant, brutalt tryck till motorn [74, 112].
        *   **Mats Brag (MB) Chassi:** Rörchassi i krommolybdenstål [73, 111].
        *   **MB 4-Link:** Den ställbara bakhjulsupphängningen som kontrollerar chassits vinkel och planterar kraften i asfalten [71, 80, 109].

*   **TEKNISKA SPECIFIKATIONER (Tabell i JetBrains Mono-stil):**

| Komponent | Kanonisk Specifikation |
| :--- | :--- |
| **Modell** | Chevrolet Camaro (2023) [73, 111] |
| **Klass** | Top Doorslammer [73, 111] |
| **Kaross** | Five Star kolfiberkaross (USA-tillverkad) [73, 92, 111] |
| **Motor** | BAE (Brad Anderson Engineering) 521 Hemi [73, 111] |
| **Slagvolym** | 521 kubiktum (8,5 liter) [73, 111] |
| **Effekt** | ~2 500 – 3 000 HK [81, 100, 119] |
| **Växellåda** | Coan 400 med sprag-frikoppling [74, 80, 112, 118] |
| **Vevaxel** | Sonny [74, 112] |
| **Bränsle** | Metanol (~25 liter förbrukas per repa) [74, 112] |
| **Vikt** | ~1 140 kg (Klassens minimivikt är 1 179 kg inkl. förare efter mål) [74, 82, 112, 120] |

*   **NARRATIV COPY & KURIOSA (DM Sans):**
    *   **Extrema Krafter:** Bromsskärmarna som fälls ut vid målgång måste tåla enorma påfrestningar för att bromsa ekipaget från 415 km/h [36, 74, 112]. Vid det historiska rekordåket på Santa Pod utvecklades så mycket kraft att skärmarna lyfte bilens bakvagn från marken [36, 74, 112].
    *   **Fartjämförelse:** Vid 415 km/h färdas Anders snabbare än de flesta kommersiella passagerarflygplan under start (vilket sker vid ca 290 km/h) [36, 74, 112].
    *   **Logistiken:** Att transportera och tävla med denna maskin genom Europa kräver enorm logistik och höga kostnader – enbart färja och frakt för ekipaget till England kostar över 30 000 SEK per resa [37, 74, 112].

---

### SIDA 4: TÄVLINGAR & RESULTAT (Meriter & Kalender)

Denna sida visar att EDH Racing är ett vinnande team i den absoluta nordeuropeiska dragracingtoppen [6, 32]. Den hålls automatiskt uppdaterad via en databas [52, 53].

*   **MÄSTERSKAPSMERITER (EDRS Top Doorslammer):**
    *   **2019:** 🥇 Seriesegrare / 1:a plats [6, 32, 70, 108]
    *   **2018:** 🥈 Runner Up / 2:a plats [125]
    *   **2025:** 🥉 3:e plats [6, 32]
    *   **2023:** 🥉 3:e plats [6, 32]
    *   **2017:** 6:e plats [6, 32]
    *   **2022:** 7:e plats [6, 32]
    *   **2021:** 10:e plats [6, 32]

*   **HISTORISKA PRESTANDA (Verifierade årsbästa på 201 meter / 660 ft):**

| År | Tävling / Event | Tid (sekunder) | Sluthastighet (km/h) |
| :--- | :--- | :--- | :--- |
| **2026** | Doorslammers | 3.859 s | 326,71 km/h [32] |
| **2025** | Speedevents Internationals | 3.803 s | 327,07 km/h [32] |
| **2024** | Scandinavian Internationals | 3.913 s | 318,96 km/h [32] |
| **2023** | Sweden Internationals | 4.006 s | 308,57 km/h [32] |
| **2022** | Sweden Nationals | 3.893 s | 314,14 km/h [32] |
| **2021** | Scandinavian Internationals | 3.898 s | 306,12 km/h [32] |
| **2020** | Mantorp Drag Revival | 4.015 s | 290,79 km/h [32] |
| **2019** | FHRA Night Race Finals | 4.031 s | 293,16 km/h [32] |
| **2018** | Winter Nats | 4.054 s | 291,03 km/h [32] |
| **2017** | Winter Nats | 4.120 s | 283,90 km/h [32] |
| **2014** | Marie Memorial Race | 4.590 s | 249,19 km/h [32] |

*   **SM-KALENDERN 2026 (För närvarande pågående säsong):**
    *   *Deltävling 1 (5–7 juni):* Tierp Arena [131, 135]
    *   *Deltävling 2 (19–21 juni):* Orsa (Tallhed) [135]
    *   *Deltävling 3 (3–5 juli):* Sundsvall [135]
    *   *Deltävling 4 (11–12 juli):* Piteå [135]
    *   *Deltävling 5 (17–18 juli):* Piteå [135]
    *   *Deltävling 6 (21–23 augusti):* Sundsvall [135]
    *   *Deltävling 7 (25–27 september):* Tierp Arena (Final) [131, 135]

---

### SIDA 5: TEAMET (Möt Crewet)

Dragracing är en lagsport där hundradelar avgörs av mekanikernas precision i depån [30, 137]. Här presenteras det sammansvetsade teamet som gör framgångarna möjliga [137].

*   **NYCKELPERSONER I DEPÅN (DM Sans):**
    *   **Anders Edh (Förare & Teamägare):** Grundare och den drivande kraften som styr och leder hela teamet [76, 114, 137].
    *   **Martin Ekstedt (Mekaniker):** Teamets ryggrad som har varit med i garaget sedan 2005 (och tävlat sedan 2007) [76, 114, 137]. Oerhört detaljfokuserad och ser till att allt fungerar vid startlinjen [76, 114, 137].
    *   **Andreas Gröning (Mekaniker):** Rekryterades inför säsongen 2025 [71, 109]. Har snabbt utvecklats till en ovärderlig tillgång med sin tekniska snabbhet [71, 76, 109, 114, 137].
    *   **John Claussen (Mekaniker):** "Vår allas glada John", anslöt till teamet 2024 och har med sin breda kunskap bidragit starkt till teamets tekniska utveckling [30, 76, 114, 137].

*   **STÖD & FAMILJ (DM Sans):**
    *   **Olle Edh (Teknisk rådgivare):** Anders bror [76, 114, 137]. Brinner för motorsport och har med sin djupa tekniska kompetens bidragit med geniala idéer och lösningar genom alla år [76, 114, 137].
    *   **Marie Andersson Hållen (Logistikchef):** Anders sambo och teamets stöttepelare [77, 115, 138]. Ansvarar för mat, logistik och ser till att allt i depån flyter sömlöst under tävlingshelgerna [77, 115, 138].
    *   **Amanda Nordqvist Ed (Media & PR):** Anders dotter [77, 115, 138]. Ansvarar för sociala medier, webbplatsen och marknadsföringen för att öka teamets synlighet [77, 115, 138].
    *   **Siggi (Dokumentärfilmare):** Följer teamet tätt för att föreviga resan och producera professionellt videomaterial [77, 115, 138].

---

### SIDA 6: MEDIA (Bilder & Rörligt material)

Denna sida visar dragracingens råa kraft genom ett dynamiskt galleri fyllt med material från det egna arkivet [25, 30, 31].

*   **BENTO GRID-LAYOUT (Visuellt gränssnitt):**
    *   *Komponent 1 (Huvudvideo - 16:9):* **"The Miracle Run"** – Det historiska och osannolika rekordåket på Santa Pod (5.74s @ 415 km/h) med slowmotion-sekvenser och det fantastiska däckskaket [31, 78, 151].
    *   *Komponent 2 (Onboard-video - 1:1):* Onboard-kamera inifrån förarhytten på Mantorp Park som visar Anders reaktion och hur han hanterar den stående gaspedalen [78, 157].
    *   *Komponent 3 (Actionbild - 4:3):* Camaron "The Beast" som utför en våldsam burnout på Tierp Arena under SM-starten [30, 131].
    *   *Komponent 4 (Mekmoment - 3:4):* Martin Ekstedt och John Claussen när de precisionsjusterar fyrlänksupphängningen under depåtältet [30, 71, 109].
    *   *Komponent 5 (Historiskt arkiv - 4:3):* Anders på startlinjen i Helsinge Open 2009 med sin tidigare plåtbil [46, 82].

---

### SIDA 7: SPONSORER & KONTAKT (Partnerportal)

Då webbplatsens primära mål är att attrahera nya sponsorer, är denna sida utformad som en professionell pitchplattform [66, 85].

*   **VÅRT ERBJUDANDE TILL PARTNERS (DM Sans):**
    *   "Ett partnerskap med EDH Racing är mer än bara en logotyp på en bil [53, 66, 85]. Vi erbjuder ert företag exponering i den absoluta Europatoppen inom dragracing inför hundratusentals hängivna fans på plats och via digitala sändningar [6, 32, 53]. Vi skräddarsyr lösningar där ni kan använda vårt team och vår unika Camaro 'The Beast' i er egen marknadsföring, för kundevent eller interna inspirationsföreläsningar om extrem precision, samarbete och uthållighet under press [30, 53, 66, 85, 137]."

*   **KONTAKTKORT & INTRESSEANMÄLAN (Svävande element med shadow-deep):**
    *   *E-post:* `edhracing@gmail.com` [67, 105]
    *   *Telefon:* `+46 70 207 32 55` [67, 105]
    *   *Ort:* Hudiksvall, Sverige [67, 105]
    *   *Formulärfält:* Namn, Företag, E-post, Telefon, Meddelande, Intresseområde (Huvudsponsor, Guldpartner, Silverpartner, Materialpartner).
