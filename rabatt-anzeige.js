// ========================================
// FIREBASE KONFIGURATION
// ========================================
const firebaseConfig = {
  apiKey: "AIzaSyBNu_uK3SsALV12NZbDi_YhkKwBfaExCOU",
  authDomain: "studies-a1902.firebaseapp.com",
  databaseURL: "https://studies-a1902-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "studies-a1902",
  storageBucket: "studies-a1902.firebasestorage.app",
  messagingSenderId: "488227703018",
  appId: "1:488227703018:web:81f9ca5ed7e62ecfcb6f93"
};
// Firebase initialisieren (falls noch nicht geschehen)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();
const aktionenRef = database.ref('rabattAktionen');

// ========================================
// RABATTE ANZEIGEN
// ========================================
(function() {
  const aktuelleSeite = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
  const seitenMapping = {
    'index': 'index',
    'Umzug': 'umzug',
    'MoebelAufbau': 'moebel',
    'Transport': 'transport'
  };

  const seite = seitenMapping[aktuelleSeite] || aktuelleSeite;

  // Firebase-Daten laden
  aktionenRef.once('value', (snapshot) => {
    const aktionen = [];
    snapshot.forEach((child) => {
      aktionen.push(child.val());
    });

    const relevante = aktionen.filter(a => a.seiten.includes(seite));

    if (relevante.length === 0) return;

    // Container erzeugen
    const container = document.createElement('div');
    container.style.cssText = 'margin:20px auto;max-width:800px;';

    relevante.forEach(aktion => {
      const [bg, textColor] = aktion.farbe.split(',');
      const box = document.createElement('div');
      box.style.cssText = `
        background:${bg};
        color:${textColor};
        padding:18px 22px;
        border-radius:12px;
        margin-bottom:15px;
        border-left:4px solid ${textColor};
        box-shadow:0 4px 15px rgba(0,0,0,0.08);
      `;
      box.innerHTML = `
        <strong style="display:block;margin-bottom:5px;font-size:17px;">${aktion.titel}</strong>
        <div style="font-size:15px;">${aktion.text}</div>
      `;
      container.appendChild(box);
    });

    // In den Platzhalter einfügen
    const ziel = document.getElementById("rabatt-hinweis");
    if (ziel) ziel.appendChild(container);
  }).catch(error => {
    console.error('Fehler beim Laden der Rabatte:', error);
  });
})();