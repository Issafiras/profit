# Salgsanalyse Dashboard - Instruktioner

## Oversigt
Dette er et browser-baseret værktøj til salgsanalyse, der hjælper med at identificere profitabelt salg og potentielle problemer i butiksdata.

## Funktioner

### 1. File Upload
- **Drag & Drop**: Træk og slip din `tele.csv` fil i upload-zonen
- **Klik for at vælge**: Alternativt klik på "Vælg fil" knappen
- Systemet accepterer kun CSV-filer
- **Kompatibelt med dit dataformat**: Genkender kolonner som `Varetekst.`, `Udpris`, `GnsKost`, `Disp.beh`

### 2. Data-behandling
- **Dansk talformat**: Automatisk konvertering af tal som "5.376,43" til 5376.43
- **Moms-korrigering**: Beregner reel omsætning som Udpris / 1.25
- **Fortjeneste-beregning**: Reel Omsætning - GnsKost
- **Data-rensning**: Ignorerer rækker med dummy-data (Udpris = 99999)

### 3. Dashboard Sektioner

#### 🐮 Cash Cows - Top 10 Fortjeneste
- Viser de 10 mest profitable produkter
- Sorteret efter højeste fortjeneste
- Grøn farve markerer positive beløb

#### 📦 Lager-Guld - Sælg nu!
- Produkter med mere end 10 stk. på lager
- Fortjeneste over 50 kr. per stk.
- Sorteret efter lagerantal (højest først)
- Disse varer bør sælges aktivt

#### ⚠️ Tabs-listen - Pas på!
- Produkter hvor butikken taber penge
- Fortjeneste under 0 kr.
- Rød farve markerer tab
- Kræver opmærksomhed - overvej prisjustering eller fjernelse

## Teknisk Information

### Teknisk Stack
- **HTML5**: Semantisk struktur
- **Vanilla JavaScript**: Ingen frameworks nødvendige
- **Tailwind CSS**: Moderne styling via CDN
- **PapaParse**: CSV parsing bibliotek

### Browser Support
- Moderne browsere (Chrome, Firefox, Safari, Edge)
- JavaScript skal være aktiveret
- Fungerer offline efter første load

### CSV Format Forventninger
Forventede kolonner i CSV-filen (systemet genkender flere varianter):
- **Varekode**: `Varenr`, `Varenummer`, `Artikelnummer`, `EAN`, `Produktnr`, eller `SKU` (valgfri)
- **Produktnavn**: `Varenavn`, `Varetekst.`, eller `Varetekst`
- **Salgspris**: `Udpris` (dansk format med komma som decimal)
- **Kostpris**: `GnSKost` eller `GnsKost` (dansk format)
- **Lagerantal**: `Disp.beh` (antal på lager)

**Eksempler på understøttede formater:**
- `5.376,43` (dansk format) → `5376.43`
- `99999` eller `9999` (dummy data ignoreres)
- Kolonnenavne er case-insensitive og genkender flere variationer

## Installation og Hosting

### GitHub Pages
1. Upload `index.html` til dit GitHub repository
2. Aktiver GitHub Pages i repository settings
3. Siden er tilgængelig på `https://dit-brugernavn.github.io/repository-navn/`

### Lokal Udvikling
1. Gem `index.html` i en mappe
2. Åbn filen i en moderne browser
3. Ingen server nødvendig

## Brugervenlighed
- **Intuitiv**: Enkelt drag & drop interface
- **Farvekodet**: Grøn = profit, Rød = tab
- **Responsiv**: Fungerer på desktop og mobile
- **Hurtig**: Behandling sker i browseren

## Fejlhåndtering
- Ugyldige filer afvises med besked
- CSV parse-fejl logges i konsollen
- Manglende data filtreres automatisk

## Support
Ved problemer eller spørgsmål, tjek:
1. Browser konsol for fejlmeddelelser
2. CSV-fil formatet matcher forventningerne
3. JavaScript er aktiveret i browseren

## Version
v1.2 - Tilføjet varekode understøttelse og forbedret søgefunktionalitet.

**Ændringer i v1.2:**
- Tilføjet varekode kolonne i alle tabeller
- Understøtter flere kolonnenavne for varekoder: `Varenr`, `Varenummer`, `Artikelnummer`, `EAN`, `Produktnr`, `SKU`
- Søgning fungerer nu også på varekoder
- CSV eksport inkluderer varekode kolonne
- Monospace font til varekoder for bedre læsbarhed

**Ændringer i v1.1:**
- Understøtter flere kolonnenavne: `Varetekst.`, `Varenavn`, `GnsKost`, `GnSKost`
- Forbedret parsing af danske talformater
- Testet og verificeret med rigtige tele.csv data
- Ignorerer dummy data (99999, 9999) automatisk