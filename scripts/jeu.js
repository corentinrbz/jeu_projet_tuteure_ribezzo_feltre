document.addEventListener('DOMContentLoaded', () => {

    // Récupération des pions depuis le localStorage
    const player1Pion = localStorage.getItem('player1Token');
    const player2Pion = localStorage.getItem('player2Token');

    // Récupération du point de départ dans le SVG
    const startPoint = document.getElementById('depart');
    if (startPoint) {
        // Récupérer les coordonnées du point de départ
        const x = startPoint.getAttribute('x') || startPoint.getAttribute('cx') || 900;
        const y = startPoint.getAttribute('y') || startPoint.getAttribute('cy') || 500;

        // Créer les éléments image dans le SVG pour les pions
        const svgNS = "http://www.w3.org/2000/svg";
        
        // Pion joueur 1
        const pion1 = document.createElementNS(svgNS, "image");
        pion1.setAttributeNS(null, "href", player1Pion);
        pion1.setAttributeNS(null, "width", "50"); 
        pion1.setAttributeNS(null, "height", "50");
        pion1.setAttributeNS(null, "x", Number(x) - 20); 
        pion1.setAttributeNS(null, "y", Number(y) - 15);
        pion1.setAttributeNS(null, "id", "pion-joueur1");

        // Pion joueur 2
        const pion2 = document.createElementNS(svgNS, "image");
        pion2.setAttributeNS(null, "href", player2Pion);
        pion2.setAttributeNS(null, "width", "50");
        pion2.setAttributeNS(null, "height", "50");
        pion2.setAttributeNS(null, "x", Number(x) + 20);
        pion2.setAttributeNS(null, "y", Number(y) - 15);
        pion2.setAttributeNS(null, "id", "pion-joueur2");

        // Récupérer l'élément SVG principal
        const svg = document.querySelector('svg');
        
        // Ajouter les pions au SVG
        svg.appendChild(pion1);
        svg.appendChild(pion2);
    }



    // DEfinition des positions
    const gamePositions = {
        1: { x: 770, y: 840 },  // position arrivé
        2: { x: 1000, y: 250 }, 
        3: { x: 1300, y: 80 },
        4: { x: 1650, y: 240 },
        5: { x: 1740, y: 540 },
        6: { x: 1610, y: 840 },
        7: { x: 1310, y: 970 },
        8: { x: 1050, y: 870 },
        9: { x: 730, y: 170 },
        10: { x: 470, y: 70 },
        11: { x: 170, y: 230 },
        12: { x: 60, y: 530 },
        13: { x: 160, y: 830 },
        14: { x: 470, y: 980 },
        15: { x: 770, y: 840 }
    };

  let currentPlayer = 1;
  const playerPositions = {
      1: 1,
      2: 1
  };

  const boutonLancer = document.getElementById('lancer-de-j1');

  boutonLancer.addEventListener('click', function () {
    const diceValue = Math.floor(Math.random() * 6) + 1; 
    const faceDiv = document.querySelector('#de-1 .face'); 

    if (faceDiv) {
        faceDiv.textContent = diceValue; 
    }
      this.disabled = true; 

      setTimeout(() => {
          movePion(currentPlayer, diceValue); 

          // Passe au joueur suivant
          currentPlayer = currentPlayer === 1 ? 2 : 1;
          console.log('Nouveau joueur :', currentPlayer);

        // Mise à jour du bouton
        const joueurSpan = this.querySelector('.joueur');
        if (joueurSpan) {
            joueurSpan.textContent = `Joueur ${currentPlayer}`;
        }
        
        // Mise à jour de l'ID et de la valeur du bouton
        this.id = `lancer-de-j${currentPlayer}`;
        this.setAttribute('data-player', currentPlayer);
        this.disabled = false;
      }, 1000);
  });

  // Fonction pour déplacer un pion
  function movePion(playerNumber, diceValue) {
      const currentPos = playerPositions[playerNumber];
      const newPos = Math.min(currentPos + diceValue, 14);
      playerPositions[playerNumber] = newPos;

      const pion = document.getElementById(`pion-joueur${playerNumber}`);
      const newCoords = gamePositions[newPos];

      pion.style.transition = "all 0.5s ease";
      
      // Déplacer le pion
      pion.setAttributeNS(null, "x", newCoords.x - (playerNumber === 1 ? 20 : -20));
      pion.setAttributeNS(null, "y", newCoords.y - 15);
  }
    

 
  });









