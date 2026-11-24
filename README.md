# AquaWatch AI — Marine Debris Monitoring Prototype

**Team:** AquaSentinels  
**Tagline:** Guarding Oceans Through Intelligence.

AquaWatch AI is a responsive, browser-based hackathon prototype demonstrating a workflow for recording coastal observations, reviewing image submissions, prioritizing field follow-up, exploring illustrative hotspot locations, and exporting observation records.

## Run locally
1. Download or clone this repository.
2. Open `index.html` in Chrome, Edge, or Firefox.
3. Open **Analyze image**, select a JPG, PNG, or WEBP image (up to 10 MB), and run the prototype workflow.

No build step or package installation is required. Google Fonts are optional; the interface uses local HTML, CSS, and JavaScript.

## Features
- Responsive overview dashboard with sample metrics.
- Image upload, drag-and-drop, and preview.
- Guided prototype analysis screen.
- Illustrative hotspot map with selectable markers.
- Save observations to the current browser session.
- Export observation records as CSV.

## Important limitation — not a trained AI detector
This repository currently contains a **front-end demonstration only**. The displayed debris count, confidence, and priority score are simulated from uploaded-file metadata. No computer-vision model processes the image, and the website does not identify or localize debris objects. Hotspot locations and dashboard sample figures are illustrative, not live measurements or GPS-accurate data.

Do not interpret prototype scores as scientific pollution measurements or real model predictions. Before claiming AI detection, integrate and test a trained marine-debris detection model (for example, a suitably trained YOLO model) through an inference service, display its actual detections and confidence values, and document the model, dataset, and evaluation results.

## Project files
- `index.html` — page structure and content
- `style.css` — responsive visual design
- `app.js` — browser interactions and prototype behavior

## Suggested demo flow
1. Show the overview and explain that its metrics are sample data.
2. Upload a coastal or water-surface image and run the clearly labelled simulated workflow.
3. Save the observation and show it in the dashboard.
4. Open the hotspot map and explain that its locations are illustrative.
5. Export the CSV report.
