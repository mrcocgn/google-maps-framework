# Google Maps React Framework

Dies ist ein minimalistisches, aber leistungsfähiges React-Framework zur Integration von Google Maps mit eigener Benutzersteuerung.

## 🔧 Features

- Eigene Buttons für:
  - Zoom In / Zoom Out
  - Kartentyp umschalten (Satellit/Karte)
  - Benutzerstandort zentrieren
- Automatische Standorterkennung bei Start
- Benutzerstandort als Marker mit eigenem Icon
- Touch-optimiertes Verhalten (ideal für mobile Geräte)
- Keine standardmäßige Google-UI – volle Kontrolle

## 📦 Tech Stack

- React + TypeScript
- Vite
- @react-google-maps/api
- CSS (modular erweiterbar)
- Google Maps JavaScript API (über `.env` eingebunden)

## 🚀 Quickstart

```bash
git clone https://github.com/mrcocgn/google-maps-framework.git
cd google-maps-framework
yarn install
yarn dev
