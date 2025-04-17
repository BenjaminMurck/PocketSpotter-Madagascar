# PocketSpotter

Een webapplicatie, door Benjamin Murck, om dieren in Madagaskar te identificeren op basis van verschillende kenmerken zoals type, grootte en kleur.

## Functies

- Filter dieren op basis van verschillende kenmerken
- Bekijk gedetailleerde informatie over elk dier
- Responsief ontwerp voor gebruik op mobiele apparaten
- Markeer dieren als "gespot" voor persoonlijke tracking

## Project opzetten

1. Open het project in je favoriete code-editor
2. Installeer de dependencies:
```bash
npm install
```
3. Start de ontwikkelingsserver:
```bash
npm start
```

## Dierendatabase uitbreiden

Om nieuwe dieren toe te voegen, bewerk het bestand `src/data/animals.json`. Voeg nieuwe dieren toe aan de `animals` array met de volgende structuur:

```json
{
  "id": [uniek nummer],
  "name": "[Nederlandse naam]",
  "scientificName": "[Wetenschappelijke naam]",
  "type": "[type dier]",
  "size": "[grootte]",
  "color": ["kleur1", "kleur2", ...],
  "image": "images/animals/[bestandsnaam].webp"
}
```

## Gebruik

1. Gebruik de filters bovenaan de pagina om dieren te filteren op:
   - Type (zoogdier, reptiel, etc.)
   - Grootte
   - Kleur

2. Klik op een dier om meer details te zien
3. Gebruik de "Spot" knop om dieren te markeren als gespot

## Technologieën

- React 18.2.0
- Material-UI 5.17.1
  - @mui/material
  - @mui/icons-material
  - @mui/system
- Emotion voor styling
- React Virtuoso voor efficiënte lijstweergave
- JSON voor dataopslag

## Deployment

De applicatie wordt automatisch gedeployed naar GitHub Pages via GitHub Actions. De laatste deployment status is te zien in de Actions tab van de repository. 