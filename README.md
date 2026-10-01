# Konkurrenz im BWL-Studium – Web-App

Interaktive Begleit-App zur qualitativen Studie
„Wie nehmen BWL-Bachelorstudierende Konkurrenz im Hochschulalltag wahr?“
(Arslan, Mansen, Schims, Stock).

## Inhalt
- Forschungsfrage, Methode, Sampling, Grounded-Theory-Auswertung, erste Ergebnisse
- Klickbarer Interviewleitfaden (7 Phasen)
- Interaktives Theorie-Modell (Regler: Wettbewerb vs. soziale Unterstützung)
- Selbstcheck „Konkurrenz-Kompass“ fürs Publikum (läuft komplett im Browser, speichert nichts)
- Download der PowerPoint-Präsentation

Keine Abhängigkeiten – nur Node.js (>= 18).

## Lokal starten
```bash
npm start
# → http://localhost:3000
```

## Auf Render deployen

**Variante A – Blueprint (empfohlen)**
1. Diesen Ordner als GitHub-Repository hochladen.
2. Auf render.com: **New → Blueprint** → Repository wählen.
3. Render liest `render.yaml` und legt den Web Service automatisch an (Free Plan, Region Frankfurt).

**Variante B – manuell**
1. Repository auf GitHub hochladen.
2. Render: **New → Web Service** → Repository verbinden.
3. Einstellungen:
   - Runtime: **Node**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Health Check Path: `/healthz`

Tipp: Die Render-URL als QR-Code auf die letzte Folie setzen – dann kann das Publikum den Selbstcheck direkt mitmachen.
