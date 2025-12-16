# GitHub Pages Deployment Guide

## Opsætning

Applikationen er konfigureret til automatisk deployment på GitHub Pages ved hver push til `main` branch.

## Trin for Deployment

### 1. GitHub Repository Indstillinger

Gå til dit GitHub repository:

1. Klik på **Settings** (Indstillinger)
2. I venstre menu, klik på **Pages**
3. Under **Source** (Kilde), vælg **GitHub Actions**

### 2. Push til GitHub

Når du pusher til `main` branch, vil GitHub Actions automatisk:
- Installere dependencies
- Bygge projektet med Vite
- Deploye til GitHub Pages

```bash
git add .
git commit -m "Deploy til GitHub Pages"
git push origin main
```

### 3. Tjek Deployment Status

1. Gå til **Actions** tab i dit repository
2. Se deployment progress
3. Når deployment er færdig, vil din site være tilgængelig på:
   ```
   https://[dit-brugernavn].github.io/project/
   ```

## Manuel Deployment

Hvis du vil deploye manuelt:

1. Gå til **Actions** tab
2. Klik på **Deploy to GitHub Pages** workflow
3. Klik på **Run workflow** knappen
4. Vælg `main` branch og klik **Run workflow**

## Lokal Test af Production Build

For at teste production build lokalt:

```bash
npm run build
npm run preview
```

Dette vil starte en lokal server på `http://localhost:4173/`

## Bemærkninger

- Base URL er sat til `./` (relative paths) i `vite.config.js` - virker med alle repository navne
- GitHub Actions workflow ligger i `.github/workflows/deploy.yml`
- Build output går til `dist/` mappen (ignoreret i git)
- Virker både som projekt-page og organization/user page

## Troubleshooting

### Siden loader ikke korrekt
- Tjek at base URL i `vite.config.js` matcher dit repository navn
- Tjek at GitHub Pages er aktiveret i repository settings
- Tjek Actions tab for fejlmeddelelser

### CSS eller JavaScript loader ikke
- Tjek browser konsollen for fejl
- Sørg for at GitHub Actions workflow er kørt succesfuldt
- Prøv at clear browser cache og reload (Ctrl+Shift+R)

### 404 Fejl
- Tjek at deployment workflow'en er kørt succesfuldt
- Tjek at `dist/` mappen bliver uploadet korrekt i workflow'en
