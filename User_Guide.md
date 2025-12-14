# Brugerguide
## Salgsanalyse Dashboard

**Version:** 1.1  
**Sidst opdateret:** December 2025  

---

## Velkommen til Salgsanalyse Dashboard

Dette værktøj hjælper dig med at analysere dine salgsdata fra tele.csv filer og identificere profitable produkter, lageroptimering muligheder og produkter der giver tab.

**Hvad du kan forvente:**
- ⚡ Hurtig analyse på under 30 sekunder
- 🔒 Privat - alle data behandles lokalt
- 📱 Virker på computer, tablet og telefon
- 🎯 Klare anbefalinger til handling

---

## Hurtig Start (3 trin)

### Trin 1: Åbn Værktøjet
1. Åbn din browser (Chrome, Firefox, Safari eller Edge)
2. Naviger til dashboard URL'en
3. Sørg for at JavaScript er aktiveret

### Trin 2: Upload Din CSV Fil
```
📂 Find din tele.csv fil
🖱️  Træk filen til upload-zonen
📊 Vent på automatisk analyse
```

### Trin 3: Udforsk Resultaterne
```
🐮 Se dine top profitable produkter
📦 Find produkter der bør sælges aktivt
⚠️  Identificer tabsgivende produkter
```

---

## Detaljeret Brugerguide

### 1. Forberedelse af Data

#### Understøttede CSV Formater
Systemet genkender automatisk forskellige kolonnenavne fra dit butikssystem:

**Produkt Information:**
- `Varenavn`, `Varetekst.`, `Varetekst`

**Pris Information:**
- `Udpris` (salgspris inkl. moms)
- `GnSKost` eller `GnsKost` (kostpris)

**Lager Information:**
- `Disp.beh` (antal på lager)

#### Data Krav
- ✅ CSV format (.csv filendelse)
- ✅ UTF-8 eller Latin-1 encoding
- ✅ Maksimal 50MB filstørrelse
- ✅ Kolonner med danske talformater som "5.376,43"

#### Tips til Data Kvalitet
- **Fjern overskrifter:** Første række bør være kolonnenavne
- **Undgå tomme rækker:** Systemet springer automatisk over
- **Tjek talformater:** Brug komma som decimal (5.376,43)
- **Dummy data:** Systemet ignorerer automatisk 99999 og 9999 værdier

---

### 2. Upload Processen

#### Mulighed 1: Drag & Drop
```
1. Find din tele.csv fil på computeren
2. Træk filen til den grå upload-zone
3. Slip filen når zonen bliver blå
4. Vent på "Data uploadet!" bekræftelse
```

#### Mulighed 2: Klik for at Vælge
```
1. Klik på "Vælg fil" knappen
2. Naviger til din tele.csv fil
3. Klik "Åbn" eller "Vælg"
4. Vent på automatisk behandling
```

#### Hvad sker der under behandlingen?
- 📖 CSV filen læses og valideres
- 🔢 Danske talformater konverteres
- 💰 Moms fjernes fra salgspriser (Udpris / 1.25)
- 📊 Fortjeneste beregnes for hver vare
- 🎯 Resultater kategoriseres automatisk

---

### 3. Forstå Resultaterne

#### 🐮 Cash Cows - Top 10 Fortjeneste
Dette afsnit viser dine mest profitable produkter.

**Hvad viser det:**
- Top 10 produkter sorteret efter højeste fortjeneste
- Produktnavn, lagerantal og fortjeneste pr. stk.
- Grøn farve indikerer positive værdier

**Sådan bruger du det:**
```
🎯 Fokusér salgsindsatsen på disse produkter
📈 Overvej at øge lagerbeholdningen
💡 Brug som benchmark for nye produkter
```

**Søgefunktion:**
- Skriv i søgefeltet for at filtrere produkter
- Søgning sker i realtid
- Klik søgefeltet for at rydde

#### 📦 Lager-Guld - Sælg nu!
Produkter der både har godt lager og god fortjeneste.

**Kriterier:**
- Mere end 10 stk. på lager
- Fortjeneste over 50 kr. pr. stk.
- Sorteret efter lagerantal (højest først)

**Anbefaling:**
```
🚀 Sælg aktivt af disse produkter
📦 Reducer lageromkostninger
💰 Øg cash flow
```

#### ⚠️ Tabs-listen - Pas på!
Produkter hvor butikken taber penge.

**Hvad viser det:**
- Alle produkter med negativ fortjeneste
- Rød farve markerer tab
- Sorteret efter størst tab først

**Handlinger at overveje:**
```
💭 Analyser årsager til tab
📉 Juster priser eller stop salg
🔄 Forhandle bedre indkøbspriser
❌ Overvej at fjerne fra sortiment
```

---

### 4. Fejlhåndtering

#### Almindelige Problemer

**"Vælg venligst en CSV-fil"**
```
❌ Du uploadede ikke en .csv fil
✅ Løsning: Kontroller filendelsen og prøv igen
```

**"Kunne ikke læse CSV-filen"**
```
❌ CSV formatet er ugyldigt
✅ Løsning: Åbn filen i Excel og gem som CSV igen
```

**"Filen er for stor"**
```
❌ Fil over 50MB
✅ Løsning: Del data op i mindre filer eller filtrer data først
```

**Ingen resultater vises**
```
❌ Data opfylder ikke kriterier
✅ Løsning: Tjek at kolonner har korrekte navne og data
```

#### Browser Problemer

**JavaScript deaktiveret:**
```
⚙️  Aktiver JavaScript i browser indstillinger
🔄 Genindlæs siden
```

**Udateret browser:**
```
⬆️  Opdater til nyeste version
✅ Anbefalede browsere: Chrome 80+, Firefox 75+, Safari 13+
```

---

### 5. Avancerede Funktioner

#### Ryd Data Funktion
```
1. Klik "Ryd data / Upload ny fil"
2. Bekræft at du vil slette nuværende data
3. Upload zone vises igen
4. Alle resultater fjernes fra hukommelse
```

#### Performance Tips
- **Store filer:** Behandling kan tage 10-30 sekunder
- **Browser hukommelse:** Luk andre faner for bedre performance
- **Fil optimering:** Fjern unødvendige kolonner før upload

---

### 6. Tekniske Detaljer

#### Beregninger
```javascript
// Eksempel på hvordan fortjeneste beregnes
const salgspris = 125.00;    // Udpris fra CSV
const kostpris = 75.00;      // GnSKost fra CSV

const reelOmsaetning = salgspris / 1.25;  // Fjern 25% moms
const reelFortjeneste = reelOmsaetning - kostpris;

// Resultat: reelFortjeneste = 25.00 kr
```

#### Data Behandling
- **Lokalt:** Alt behandles i din browser
- **Privat:** Ingen data sendes til servere
- **Sikkert:** Data slettes når du lukker browseren
- **Hurtigt:** Ingen netværksforsinkelser

---

### 7. Support og Hjælp

#### Selv-hjælp
1. **Tjek denne guide** først
2. **Se browser konsol** for tekniske fejl
3. **Prøv en anden browser**
4. **Test med eksempel data**

#### Kontakt Support
- **GitHub Issues:** Rapporter bugs og forbedringsforslag
- **Dokumentation:** Se teknisk specifikation for detaljer
- **Community:** Del erfaringer med andre brugere

#### System Krav
- **Browser:** Moderne browser med JavaScript aktiveret
- **Internet:** Kun nødvendig første gang (CDN loading)
- **Hardware:** Minimum 2GB RAM, fungerer offline efter load

---

### 8. Bedste Praksis

#### For Butiksledere
```
📊 Analyser ugentligt for trends
🎯 Sæt mål baseret på Cash Cows
⚠️  Adresser Tabs-liste produkter hurtigt
📈 Track forbedringer over tid
```

#### For Økonomiansvarlige
```
💰 Fokus på margin optimering
📦 Optimer lager binding
🔍 Identificer sæsonmæssige mønstre
📋 Dokumenter prisændringer
```

#### For Salgsansvarlige
```
🚀 Prioriter Cash Cows i salgsindsats
📞 Uddan sælgere om top produkter
🎁 Skab kampagner omkring Lager-Guld
📈 Mål performance mod dashboard metrics
```

---

### 9. Ofte Stillede Spørgsmål

#### Generelt
**Q: Er mine data sikre?**  
**A:** Ja! Alt behandles lokalt i din browser. Ingen data sendes til vores servere.

**Q: Virker det på min telefon?**  
**A:** Ja, det er responsivt og virker på alle moderne enheder.

**Q: Hvor hurtigt virker det?**  
**A:** Typisk under 30 sekunder for normale butiksdatasæt.

#### Tekniske Spørgsmål
**Q: Hvilke CSV formater understøttes?**  
**A:** Vi genkender automatisk de fleste danske butikssystemer og deres kolonnenavne.

**Q: Kan jeg uploade flere filer?**  
**A:** I øjeblikket én fil ad gangen. Funktion til sammenligning af perioder kommer snart.

**Q: Hvad hvis min CSV har andre kolonnenavne?**  
**A:** Systemet prøver automatisk forskellige variationer. Kontakt support hvis det fejler.

#### Fejlfinding
**Q: Hvide skærm efter upload?**  
**A:** Tjek browser konsol for fejlmeddelelser og prøv at genindlæse siden.

**Q: Forkerte beregninger?**  
**A:** Kontroller at dine kolonner har de forventede navne og danske talformater.

**Q: Langsom performance?**  
**A:** Prøv at lukke andre browser faner eller brug en mere moderne browser.

---

### 10. Version Historik

#### Version 1.1 (December 2025)
- ✅ Understøttelse af flere kolonnenavne
- ✅ Forbedret dansk tal parsing
- ✅ Søgefunktion i resultater
- ✅ Bedre fejlhåndtering
- ✅ Performance optimeringer

#### Version 1.0 (Initial Release)
- ✅ Grundlæggende CSV upload og parsing
- ✅ De tre analyse sektioner
- ✅ Responsivt design
- ✅ Lokal databehandling

---

### 11. Fremtidige Funktioner

Vi arbejder på følgende forbedringer:
- 📊 **Grafer og visualiseringer**
- 📤 **Eksport af resultater til Excel**
- 📅 **Sammenligning af flere perioder**
- 🔍 **Avancerede filter muligheder**
- 💾 **Mulighed for at gemme analyser**

---

*Tak for at du bruger Salgsanalyse Dashboard!*

Har du feedback eller forslag til forbedringer?  
Besøg vores [GitHub repository](https://github.com/your-repo) for at bidrage.

**Sidste opdatering:** December 2025