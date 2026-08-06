Designspecifikation v2: EDH Racing – Startsida (3D, Animering & Interaktiva Funktioner)
Detta dokument är en vidareutveckling av designspecifikationen för EDH Racings nya digitala plattform. Det beskriver hur skandinavisk minimalism möter racingens råa krafter genom att integrera moderna, interaktiva gränssnittskomponenter: interaktiva 3D-modeller, fysiksimuleringar och jämförande realtidsanimeringar.

Målet är att förvandla statisk prestandadata till en engagerande, taktil upplevelse som omedelbart övertygar potentiella sponsorer om teamets extrema ingenjörskonst och professionalism.

1. Visuella Grundpelare & Designsystem (Repetition)
Typsnittshierarki
Huvudrubriker (H1, H2): Speed Rusher – Fartfyllt, lutande, hög visuell tyngd.
Undertext & Navigering (H3, Knappar, Tabellhuvuden): Aristotele – Geometriskt, skarpkantat, skandinavisk precision.
Brödtext (P, Listor): DM Sans – Rent, öppet och högfunktionellt för maximal läsbarhet.
Färgpalett
Bakgrund: Almost Black (#0B0C0E) – Oändligt djup.
Primär Accent: Primary Blue (#1b3e84) – Den kungsblå nyansen från kolfiber-Camaron.
Stöd- & Skuggfärg: Supporting Navy (#1d2a3e) – För svävande kort och asymmetriska fält.
Gränser & Linjer: Silver Gray (#C4C7CC / opaciteter) – Tunna, precisionsfrästa detaljlinjer.
Text: Almost White (#F5F6F8) – Krispig kontrast.
2. Nya Interaktiva & 3D-Komponenter
Komponent 1: Den Interaktiva 3D-Modellen ("The Interactive Chassis")
Placeras centralt i sektionen "The Machine" och ger besökaren möjlighet att utforska Camaron "The Beast" (2023 års kolfibermodell) i detalj.

Teknik: WebGL / Three.js (eller React Three Fiber för Next.js).
Utförande: En mörkt kungsblå Chevrolet Camaro (byggd 2023 med Five Star kolfiberkaross) visas i en roterbar och zoombar 3D-vy mot den mörka bakgrunden. Subtila ljusströmmar sveper över karossens linjer för att framhäva aerodynamiken.
Clickable Hotspots (Tekniska detaljer): Genom att klicka på markerade, pulserande blå punkter på 3D-modellen delas karossen upp (exploding wireframe-effekt) och visar de inre mekaniska precisionskomponenterna:
Motorn (Hotspot: Front): Visar BAE 521-kompressormotorn (8,5 liter). Texten förklarar hur kompressorn (PSI Screw Rotor) trycker in luft för att generera runt 2 500–3 000 hästkrafter på ren metanol.
Chassit & Bakhjulsupphängningen (Hotspot: Bakvagn): Visar MB (Mats Brag) rörchassi och den avancerade fyrlänksupphängningen (4-link). Texten beskriver hur millimeterprecision i inställningarna av fyrlänken var avgörande för att tygla krafterna och sätta 3,87-repan i Hudiksvall.
Växellådan (Hotspot: Center): Visar Coan 400-växellådan. Besökaren kan klicka för att se en schematisk animation av hur den känsliga frikopplingen (sprag) fungerar, samt hur teamet felsökte och löste sprag-problemen under tre intensiva tävlingshelger 2024.
Komponent 2: Jämförande Accelerations-Simulator ("The Drag Strip Simulator")
En interaktiv split-screen-animering placerad direkt under Hero-sektionen för att ge en fysisk förståelse för vad en acceleration på 0–415 km/h på 5,74 sekunder faktiskt innebär.

Layout: Tre horisontella, parallella banor (stripar) inkapslade i ett svävande kort med djup skugga (--shadow-deep).
Interaktivitet: En stor, kungsblå knapp med texten "LAUNCH" (i typsnittet Aristotele). När besökaren klickar startar simuleringen synkroniserat med startgranens (Christmas Tree) nedräkning.
Bana 1: EDH Racing Camaro "The Beast"
Kapacitet: Skjuter iväg extremt hårt från stillastående. Hittar omedelbart fäste och accelererar linjärt till 415 km/h på exakt 5,74 sekunder.
Visuell effekt: Bilen lyfter lätt i framvagnen (wheelie), bakdäcken deformeras och kungsblå fartlinjer sveper förbi. Ett omisskännligt, "stuttrande" ljud spelas upp för att demonstrera hur traction control-systemet drar ner tändningen för att bibehålla greppet.
Bana 2: Kommersiellt Passagerarflygplan (t.ex. Boeing 737)
Kapacitet: Börjar rulla långsamt, bygger upp fart och når sin start/takeoff-hastighet på ca 290 km/h efter ca 30–40 sekunder.
Jämförelse: När Camaron korsar mållinjen i 415 km/h efter 5,74 sekunder, har flygplanet knappt hunnit rulla 100 meter och rör sig i under 80 km/h. En textruta poppar upp: "Vid målgång färdas Anders mer än 120 km/h snabbare än takeoff-hastigheten för ett passagerarflygplan."
Bana 3: Modern Formel 1-bil
Kapacitet: Har utmärkt kurvhastighet, men i ren acceleration på raksträcka når den 300 km/h på ca 8–10 sekunder. Topphastigheten på långa raksträckor understiger Camarons brutala 415 km/h.
Jämförelse: Camaron krossar F1-bilen i ren acceleration och korsar mållinjen långt före.
Komponent 3: Bromskrafts- och Parachtutesimulator ("The Parachute Physics Visualizer")
En scroll-triggad fysikanimering som förklarar hur den extrema inbromsningen går till när bilen ska stoppas från 415 km/h.

Utförande: När besökaren scrollar ner på sidan, rör sig en 2D-vektorskiss av bilen horisontellt.
Scroll-trigger: Vid 50% scrollfokus fälls de dubbla bromsskärmarna ut från bilens bakvagn.
Fysikvisualisering:
En röd och blå kraftmätare (vektorpilar) visas dynamiskt runt chassit.
När skärmarna vecklas ut genereras en så enorm nedåtriktad och bakåtriktad kraft att bilens bakvagn lyfts uppåt (en visuell representation av den historiska Santa Pod-repan där skärmarnas lyftkraft fick bakvagnen att lätta från asfalten).
Mätare visar G-krafterna minska från en extrem deceleration till ett mjukt stopp på bara några sekunder.
Texten förklarar de aerodynamiska krafter som bromsskärmarna måste tåla för att tygla energin i 415 km/h.
Komponent 4: Interaktiv Metanol- & Effekträknare ("The Fuel & Power Counter")
En rolig, minimalistisk kalkylator där besökaren kan dra i ett reglage (slider) för att se maskinella samband.

Reglage 1 (Slider): Repor (Körningar)
Omfång: 1 till 10 repor.
Dynamisk beräkning: Visar bränsleförbrukning. Eftersom bilen förbrukar ungefär 25 liter ren metanol per repa, räknar kalkylatorn omedelbart ut totalen (t.ex. 5 repor = 125 liter metanol).
Reglage 2 (Slider): Transportsträcka
Omfång: Sverige till England (Santa Pod).
Dynamisk beräkning: Visar logistik- och fraktkostnader. Drar man reglaget hela vägen till England visar den omedelbart den faktiska transportkostnaden för enbart färjan/frakten: "Över 30 000 SEK för en enkel transport av ekipaget."
3. Implementeringsprioritering för AINE
För att hålla Next.js-applikationen snabb och prestandaoptimerad rekommenderas följande implementeringssteg:

Fas 1 (Låg latency): Implementera Drag Strip Simulator (CSS-animeringar med Next.js state) och Metanolräknaren (ren React-logik).
Fas 2 (Scroll-animeringar): Implementera Parachute Physics Visualizer med hjälp av Framer Motion för mjuka, scroll-triggade vektorövergångar.
Fas 3 (Avancerad 3D): Integrera 3D-chassit via React Three Fiber (R3F) med lazy-loading, så att 3D-modellen endast laddas när besökaren scrollar ner till sektionen "The Machine".
Gemini Notebook kan göra misstag, så dubbelkolla svaren.