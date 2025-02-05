document.addEventListener('DOMContentLoaded', () => {
  const body = document.querySelector('body');
  const buttons = document.querySelectorAll('button'); // Tous les boutons
  let rotatingCursor;

  // Fonction : Création du curseur personnalisé
  function createCursor() {
    if (!rotatingCursor) {
      rotatingCursor = document.createElement('div');
      rotatingCursor.id = 'rotating-cursor';
      rotatingCursor.style.position = 'fixed';
      rotatingCursor.style.width = '32px';
      rotatingCursor.style.height = '32px';
      rotatingCursor.style.background = "url('./scripts/roue_blanc_32x32.png') no-repeat center/contain";
      rotatingCursor.style.pointerEvents = 'none'; // Empêche les interactions
      rotatingCursor.style.animation = 'none'; // Pas de rotation par défaut
      body.style.cursor = "none"; // Cache le curseur natif
      body.appendChild(rotatingCursor);

      // Déplace le curseur personnalisé avec la souris
      document.addEventListener('mousemove', moveCursor);
    }
  }

  // Fonction : Mise à jour de la position du curseur
  function moveCursor(e) {
    if (rotatingCursor) {
      rotatingCursor.style.left = `${e.pageX - 16}px`;
      rotatingCursor.style.top = `${e.pageY - 16}px`;
    }
  }

  // Fonction : Activation de la rotation
  function activateRotation() {
    if (rotatingCursor) {
      rotatingCursor.style.animation = 'rotation 2s linear infinite'; // Active la rotation
    }
  }

  // Fonction : Désactivation de la rotation
  function deactivateRotation() {
    if (rotatingCursor) {
      rotatingCursor.style.animation = 'none'; // Stoppe la rotation
    }
  }

  // Fonction : Animation des dés
  function lancerDe(id) {
    const cube = document.querySelector(`#${id}`);
    const randomX = Math.floor(Math.random() * 4) * 90 + 360; // Génère une rotation aléatoire sur X
    const randomY = Math.floor(Math.random() * 4) * 90 + 360; // Génère une rotation aléatoire sur Y

    cube.style.transform = `rotateX(${randomX}deg) rotateY(${randomY}deg)`; // Applique les rotations
  }

  // Applique le curseur personnalisé au chargement de la page
  createCursor();

  // Gestion des boutons : Rotation active uniquement au survol
  buttons.forEach(button => {
    button.addEventListener('mouseover', () => {
      activateRotation(); // Active la rotation lorsque le curseur est sur un bouton
    });

    button.addEventListener('mouseout', () => {
      deactivateRotation(); // Désactive la rotation lorsque le curseur quitte le bouton
    });

    // Déclenchement de l'animation des dés au clic
    button.addEventListener('click', (e) => {
      const buttonId = e.target.id;
      if (buttonId === 'lancer-de-j1') {
        lancerDe('de-1'); // Dé 1 tourne
      } else if (buttonId === 'lancer-de-j2') {
        lancerDe('de-2'); // Dé 2 tourne
      }
    });
  });
});
