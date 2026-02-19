Place the provided image in `src/assets/favicon.png` (overwrite the placeholder if present).

If you have the image file locally (e.g., `plate.png`), copy it into the project assets folder and name it `favicon.png`:

PowerShell commands:

```
# From project root
Copy-Item .\path\to\plate.png .\src\assets\favicon.png -Force
```

Then rebuild or restart the dev server. The app will serve the favicon from `/assets/favicon.png`.
