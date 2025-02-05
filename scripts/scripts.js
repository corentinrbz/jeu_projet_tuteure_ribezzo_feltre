document.addEventListener('DOMContentLoaded', () => {
    // Variables pour les joueurs
    let joueur1Pion = null;
    let joueur2Pion = null;
  
    // Sélection des éléments
    const pionsJoueur1 = document.querySelectorAll('.joueur-1 .pion');
    const pionsJoueur2 = document.querySelectorAll('.joueur-2 .pion');
    const startButton = document.querySelector('.start-button');
    const body = document.querySelector('body');
  
    // Fonctionnalité : Sélection des pions pour chaque joueur
    pionsJoueur1.forEach(pion => {
      pion.addEventListener('click', () => {
        pionsJoueur1.forEach(p => p.classList.remove('selected'));
        pion.classList.add('selected');
        joueur1Pion = pion.alt;
      });
    });
  
    pionsJoueur2.forEach(pion => {
      pion.addEventListener('click', () => {
        pionsJoueur2.forEach(p => p.classList.remove('selected'));
        pion.classList.add('selected');
        joueur2Pion = pion.alt;
      });
    });
  
    // Bouton pour démarrer la partie
    startButton.addEventListener('click', () => {
      if (!joueur1Pion || !joueur2Pion) {
        alert('Chaque joueur doit choisir un pion pour commencer.');
      } else {
        alert(`Joueur 1 : ${joueur1Pion}\nJoueur 2 : ${joueur2Pion}\nLa partie commence !`);
      }
    });
  
    // Fonctionnalité : Curseur tournant sur les pions
    const pions = document.querySelectorAll('.pion');
  
    pions.forEach(pion => {
      pion.addEventListener('mouseover', () => {
        body.style.cursor = "none"; // Cache le curseur par défaut
        createRotatingCursor();
      });
  
      pion.addEventListener('mouseout', () => {
        body.style.cursor = "url('./scripts/roue_blanc_32x32.png') 16 16, auto"; // Réinitialise le curseur
        removeRotatingCursor();
      });
    });
  
    // Fonction pour créer un curseur tournant
    function createRotatingCursor() {
      const rotatingCursor = document.createElement('div');
      rotatingCursor.id = 'rotating-cursor';
      rotatingCursor.style.position = 'fixed';
      rotatingCursor.style.width = '32px';
      rotatingCursor.style.height = '32px';
      rotatingCursor.style.background = "url('./scripts/roue_blanc_32x32.png') no-repeat center/contain";
      rotatingCursor.style.pointerEvents = 'none'; // Empêche d'interagir avec cet élément
      rotatingCursor.style.animation = 'rotation 2s linear infinite'; // Applique la rotation
      document.body.appendChild(rotatingCursor);
  
      // Met à jour la position du curseur tournant
      document.addEventListener('mousemove', moveRotatingCursor);
    }
  
    // Fonction pour déplacer le curseur tournant
    function moveRotatingCursor(e) {
      const rotatingCursor = document.getElementById('rotating-cursor');
      if (rotatingCursor) {
        rotatingCursor.style.left = `${e.pageX - 16}px`;
        rotatingCursor.style.top = `${e.pageY - 16}px`;
      }
    }
  
    // Fonction pour supprimer le curseur tournant
    function removeRotatingCursor() {
      const rotatingCursor = document.getElementById('rotating-cursor');
      if (rotatingCursor) {
        rotatingCursor.remove();
      }
      document.removeEventListener('mousemove', moveRotatingCursor);
    }
  });
  