document.addEventListener('DOMContentLoaded', () => {

    const player1Pion = localStorage.getItem('player1Token');
    const player2Pion = localStorage.getItem('player2Token');

    const startPoint = document.getElementById('depart');
    if (startPoint) {
        const x = startPoint.getAttribute('x') || startPoint.getAttribute('cx') || 900;
        const y = startPoint.getAttribute('y') || startPoint.getAttribute('cy') || 500;

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

        const svg = document.querySelector('svg');
        
        svg.appendChild(pion1);
        svg.appendChild(pion2);
    }

    // Définition des points des joueurs
    const playerPoints = {
        1: 0,
        2: 0
    };

    let finishReached = false;
    let winnerByPosition = null;

    const specialSquares = {
        /*2: { type: 'malus-points', effect: -45, message: 'Malheureux, Vous retourner à la case départ !' },*/
        3: { type: 'bonus-points', points: 4, message: 'Bonus ! Vous gagnez 4 goupilles !' },
        4: { type: 'bonus', effect: 4, message: 'Bonus ! Avancez de 4 cases' },
        6: { type: 'malus', effect: -5, message: 'Malus! Reculez de 5 cases' },
        7: { type: 'bonus-points', points: 5, message: 'Bonus ! Vous gagnez 5 goupilles !' },
        9: { type: 'malus-points', points: -4, sharePercent: 50, message: 'Malus ! Vous perdez 4 goupilles et votre adversaire en récupère 2 !' },
        10: { type: 'malus', effect: -2, message: 'Malus ! Reculez de 2 cases' },
        11: { type: 'bonus', effect: 3, message: 'Super bonus ! Avancez de 3 cases' },
        13: { type: 'malus-points', points: -4, sharePercent: 50, message: 'Malus ! Vous perdez 4 goupilles et votre adversaire en récupère 2 !' },
        15: { type: 'bonus-points', points: 4, message: 'Bonus ! Vous gagnez 4 goupilles !' },

        //tour 2

        17: { type: 'malus-points', effect: -45, message: 'Malheureux, Vous retourner à la case départ !' },
        18: { type: 'bonus-points', points: 4, message: 'Bonus ! Vous gagnez 4 goupilles !' },
        19: { type: 'bonus', effect: 4, message: 'Bonus ! Avancez de 4 cases' },
        21: { type: 'malus', effect: -5, message: 'Malus! Reculez de 5 cases' },
        22: { type: 'bonus-points', points: 5, message: 'Bonus ! Vous gagnez 5 goupilles !' },
        24: { type: 'malus-points', points: -4, sharePercent: 50, message: 'Malus ! Vous perdez 4 goupilles et votre adversaire en récupère 2 !' },
        25: { type: 'malus', effect: -2, message: 'Malus ! Reculez de 2 cases' },
        26: { type: 'bonus', effect: 3, message: 'Super bonus ! Avancez de 3 cases' },
        28: { type: 'malus-points', points: -4, sharePercent: 50, message: 'Malus ! Vous perdez 4 goupilles et votre adversaire en récupère 2 !' },
        30: { type: 'bonus-points', points: 4, message: 'Bonus ! Vous gagnez 4 goupilles !' },


        32: { type: 'malus-points', effect: -45, message: 'Malheureux, Vous retourner à la case départ !' },
        33: { type: 'bonus-points', points: 4, message: 'Bonus ! Vous gagnez 4 goupilles !' },
        34: { type: 'bonus', effect: 4, message: 'Bonus ! Avancez de 4 cases' },
        36: { type: 'malus', effect: -5, message: 'Malus! Reculez de 5 cases' },
        37: { type: 'bonus-points', points: 5, message: 'Bonus ! Vous gagnez 5 goupilles !' },
        39: { type: 'malus-points', points: -4, sharePercent: 50, message: 'Malus ! Vous perdez 4 goupilles et votre adversaire en récupère 2 !' },
        40: { type: 'malus', effect: -2, message: 'Malus ! Reculez de 2 cases' },
        41: { type: 'bonus', effect: 3, message: 'Super bonus ! Avancez de 3 cases' },
        43: { type: 'malus-points', points: -4, sharePercent: 50, message: 'Malus ! Vous perdez 4 goupilles et votre adversaire en récupère 2 !' },
        45: { type: 'bonus-points', points: 4, message: 'Bonus ! Vous gagnez 4 goupilles !' },

    };

    updatePlayerHighlight(1);

    const gamePositions = {
        1: { x: 900, y: 500 }, //départ
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
        15: { x: 770, y: 840 },

        16: { x: 900, y: 500 }, //tour 1
        17: { x: 1000, y: 250 }, 
        18: { x: 1300, y: 80 },
        19: { x: 1650, y: 240 },
        20: { x: 1740, y: 540 },
        21: { x: 1610, y: 840 },
        22: { x: 1310, y: 970 },
        23: { x: 1050, y: 870 },
        24: { x: 730, y: 170 },
        25: { x: 470, y: 70 },
        26: { x: 170, y: 230 },
        27: { x: 60, y: 530 },
        28: { x: 160, y: 830 },
        29: { x: 470, y: 980 },
        30: { x: 770, y: 840 },

        31: { x: 900, y: 500 }, //tour 2
        32: { x: 1000, y: 250 }, 
        33: { x: 1300, y: 80 },
        34: { x: 1650, y: 240 },
        35: { x: 1740, y: 540 },
        36: { x: 1610, y: 840 },
        37: { x: 1310, y: 970 },
        38: { x: 1050, y: 870 },
        39: { x: 730, y: 170 },
        40: { x: 470, y: 70 },
        41: { x: 170, y: 230 },
        42: { x: 60, y: 530 },
        43: { x: 160, y: 830 },
        44: { x: 470, y: 980 },
        45: { x: 770, y: 840 },

        46: { x: 900, y: 500 } //arrivée
    };

    
    let currentPlayer = 1;
    const playerPositions = {
        1: 1,
        2: 1
    };
    window.playerPositions = playerPositions;

    window.currentPlayer = currentPlayer;
/*-----------------------------------------------------------------------*/
    const messageDiv = document.createElement('div');
    messageDiv.className = 'game-message';
    document.querySelector('.scene-jeu').appendChild(messageDiv);

    const pointsElements = document.querySelectorAll('.points-joueur p');
    if (pointsElements.length >= 2) {
        pointsElements[0].id = 'points-joueur1';
        pointsElements[1].id = 'points-joueur2';
        
        
        pointsElements[0].textContent = '0';
        pointsElements[1].textContent = '0';
    }

    
    const boutonLancer = document.getElementById('lancer-de-j1');
    
/*-----------------------------------------------------------------------*/
    
    function handleDiceRoll() {
        // Désactiver le bouton avant de lancer
        boutonLancer.disabled = true;
        
        const diceValue = Math.floor(Math.random() * 6) + 1; 
        const faceDiv = document.querySelector('#de-1 .face'); 

        if (faceDiv) {
            faceDiv.textContent = diceValue; 
        }

        setTimeout(() => {
            const finalPosition = movePion(currentPlayer, diceValue);
            
            // Vérifier si le joueur a atteint la case 46 (fin du jeu)
            if (finalPosition === 46 && !finishReached) {
                finishReached = true;
                winnerByPosition = currentPlayer;
                
                // Bonus de 8 goupilles pour le premier à atteindre la fin
                playerPoints[currentPlayer] += 8;
                updatePointsDisplay();
                
                messageDiv.textContent = `Félicitations Joueur ${currentPlayer} ! Vous avez atteint l'arrivée et gagnez 8 goupilles !`;
                messageDiv.style.display = 'block';
                
                setTimeout(() => {
                    messageDiv.style.display = 'none';
                    
                    // Si les deux joueurs ont joué leur tour et un a atteint la case 46, terminer le jeu
                    if (playerPositions[1] === 46 || playerPositions[2] === 46) {
                        endGame();
                    } else {
                        finishTurn();
                    }
                }, 2000);
                return;
            }
            
            // Vérifier s'il y a un bonus ou malus
            setTimeout(() => {
                if (specialSquares[finalPosition]) {
                    const specialSquare = specialSquares[finalPosition];
                    
                    // Afficher le message
                    messageDiv.textContent = specialSquare.message;
                    messageDiv.style.display = 'block';
                    
                    // Appliquer l'effet après un délai
                    setTimeout(() => {
                        if (specialSquare.type === 'bonus' || specialSquare.type === 'malus') {
                            // Bonus/malus de mouvement
                            const effectValue = specialSquare.effect;
                            const newPos = Math.max(1, Math.min(finalPosition + effectValue, 46));
                            playerPositions[currentPlayer] = newPos;
                            
                            // Déplacer le pion vers la nouvelle position
                            const pion = document.getElementById(`pion-joueur${currentPlayer}`);
                            const newCoords = gamePositions[newPos];

                            
                            pion.style.transition = "all 0.5s ease";
                            pion.setAttributeNS(null, "x", newCoords.x - (currentPlayer === 1 ? 20 : -20));
                            pion.setAttributeNS(null, "y", newCoords.y - 15);
                            
                            // Vérifier à nouveau si le joueur a atteint la case 46 après un bonus de mouvement
                            if (newPos === 46 && !finishReached) {
                                finishReached = true;
                                winnerByPosition = currentPlayer;
                                
                                // Bonus de 8 goupilles pour le premier à atteindre la fin
                                playerPoints[currentPlayer] += 8;
                                updatePointsDisplay();
                                
                                setTimeout(() => {
                                    messageDiv.textContent = `Félicitations Joueur ${currentPlayer} ! Vous avez atteint l'arrivée et gagnez 8 goupilles !`;
                                    messageDiv.style.display = 'block';
                                    
                                    setTimeout(() => {
                                        messageDiv.style.display = 'none';
                                        
                                        // Vérifier si le jeu doit se terminer
                                        if (playerPositions[1] === 46 || playerPositions[2] === 46) {
                                            endGame();
                                        } else {
                                            finishTurn();
                                        }
                                    }, 2000);
                                }, 600);
                                return;
                            }
                        } else if (specialSquare.type === 'bonus-points') {
                            // Bonus de points
                            playerPoints[currentPlayer] += specialSquare.points;
                            updatePointsDisplay();
                        } else if (specialSquare.type === 'malus-points') {
                            // Malus de points avec partage à l'adversaire
                            const otherPlayer = currentPlayer === 1 ? 2 : 1;
                            
                            // Vérifier que le joueur a des points à perdre
                            const pointsToLose = Math.min(Math.abs(specialSquare.points), playerPoints[currentPlayer]);
                            playerPoints[currentPlayer] -= pointsToLose;
                            
                            // Calculer les points à donner à l'adversaire (50%)
                            const pointsToShare = Math.floor(pointsToLose * (specialSquare.sharePercent / 100));
                            playerPoints[otherPlayer] += pointsToShare;
                            
                            updatePointsDisplay();
                        }
                        
                        // Masquer le message
                        setTimeout(() => {
                            messageDiv.style.display = 'none';
                            
                            // Passer au joueur suivant
                            finishTurn();
                        }, 1500);
                    }, 2000);
                } else {
                    // Pas de bonus/malus, passer directement au joueur suivant
                    finishTurn();
                }
            }, 600);
        }, 1000);
    }
    
    // Attacher l'événement au bouton
    boutonLancer.addEventListener('click', handleDiceRoll);
    
    // Fonction pour terminer le tour
    function finishTurn() {
        window.finishTurn = finishTurn;
        // Vérifier si un joueur est sur la case 46 et si les deux joueurs ont joué
        if (playerPositions[1] === 46 || playerPositions[2] === 46) {
            const otherPlayer = currentPlayer === 1 ? 2 : 1;
            
            // Si le joueur actuel est sur la case 46 et l'autre joueur a déjà joué son tour
            if (playerPositions[currentPlayer] === 46 && playerPositions[otherPlayer] !== 46) {
                endGame();
                return;
            }
            
            // Si les deux joueurs ont atteint la case 46
            if (playerPositions[1] === 46 && playerPositions[2] === 46) {
                endGame();
                return;
            }
        }
        
        // Si aucun des joueurs n'a terminé ou si le joueur actuel n'est pas sur la case 46,
        // passer au joueur suivant
        if (window.checkQuestionCase && window.checkQuestionCase(playerPositions[currentPlayer])) {
            return;
        }
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        
        // Mise à jour du texte du bouton sans changer l'ID
        const joueurSpan = boutonLancer.querySelector('.joueur');
        if (joueurSpan) {
            joueurSpan.textContent = `Joueur ${currentPlayer}`;
        }
        
        // Juste changer l'attribut data-player sans changer l'ID
        boutonLancer.setAttribute('data-player', currentPlayer);
        boutonLancer.disabled = false;
        
        // Mettre à jour l'apparence des cartes des joueurs
        updatePlayerHighlight(currentPlayer);
    }

    // Fonction pour déplacer un pion
    function movePion(playerNumber, diceValue) {
        const currentPos = playerPositions[playerNumber];
        const targetPos = Math.min(currentPos + diceValue, 46);
        playerPositions[playerNumber] = targetPos;

        if (window.resetQuestionCase) {
            window.resetQuestionCase(playerNumber, targetPos);
        }
        
        const pion = document.getElementById(`pion-joueur${playerNumber}`);
        
        animatePionMovement(pion, currentPos, targetPos, playerNumber, 0);
        
        return targetPos;
    }



    
    

    function animatePionMovement(pion, startPos, endPos, playerNumber, currentStep) {
        if (startPos + currentStep >= endPos) {
            return endPos;
        }
        
        // Position intermédiaire actuelle
        const currentPos = startPos + currentStep;
        // Prochaine position
        const nextPos = currentPos + 1;
        
        // Coordonnées de la position actuelle
        const currentCoords = gamePositions[nextPos];
        
        // Appliquer la transition
        pion.style.transition = "all 0.3s ease";
        pion.setAttributeNS(null, "x", currentCoords.x - (playerNumber === 1 ? 20 : -20));
        pion.setAttributeNS(null, "y", currentCoords.y - 15);
        
        // Continuer l'animation après un délai
        setTimeout(() => {
            animatePionMovement(pion, startPos, endPos, playerNumber, currentStep + 1);
        }, 300);
    }

    
    // Fonction pour mettre à jour l'affichage des points
    function updatePointsDisplay() {
        const pointsJoueur1 = document.getElementById('points-joueur1');
        const pointsJoueur2 = document.getElementById('points-joueur2');
        
        if (pointsJoueur1) pointsJoueur1.textContent = playerPoints[1];
        if (pointsJoueur2) pointsJoueur2.textContent = playerPoints[2];
        
        console.log("Points joueur 1:", playerPoints[1]);
        console.log("Points joueur 2:", playerPoints[2]);
    }

    function updatePlayerHighlight(playerNumber) {
        // Sélectionner les deux cartes de joueur
        const carteJoueur1 = document.querySelector('.carte-joueur:nth-child(1)');
        const carteJoueur2 = document.querySelector('.carte-joueur:nth-child(2)');
        
        if (playerNumber === 1) {
            // Mettre en évidence le joueur 1
            carteJoueur1.style.backgroundColor = '#FFA500'; 
            carteJoueur1.style.transform = 'scale(1.1)';
            
            // Remettre le joueur 1 à l'état normal
            carteJoueur2.style.backgroundColor = '#b79d4f';
            carteJoueur2.style.transform = 'scale(1)';
        } else {
            // Mettre en évidence le joueur 2
            carteJoueur2.style.backgroundColor = '#FFA500'; // Orange plus foncé
            carteJoueur2.style.transform = 'scale(1.1)';
            
            // Remettre le joueur 1 à l'état normal
            carteJoueur1.style.backgroundColor = '#b79d4f';
            carteJoueur1.style.transform = 'scale(1)';
        }
    }

    // Fonction pour terminer le jeu et afficher le gagnant
    function endGame() {
        // Récupérer les points finaux
        const pointsJoueur1 = playerPoints[1];
        const pointsJoueur2 = playerPoints[2];
        
        // Déterminer le gagnant
        let winner;
        let gagnantPoints;
        
        if (pointsJoueur1 > pointsJoueur2) {
            winner = 1;
            gagnantPoints = pointsJoueur1;
        } else if (pointsJoueur2 > pointsJoueur1) {
            winner = 2;
            gagnantPoints = pointsJoueur2;
        } else {
            // En cas d'égalité, le joueur qui a atteint la case 46 en premier gagne
            if (winnerByPosition !== null) {
                winner = winnerByPosition;
                gagnantPoints = playerPoints[winnerByPosition];
            } else {
                // Si personne n'a atteint la case 46 (ne devrait pas arriver dans la logique du jeu)
                winner = "Égalité";
                gagnantPoints = pointsJoueur1; // Les deux joueurs ont le même nombre de points
            }
        }
        
        // Désactiver le bouton de lancer
        boutonLancer.disabled = true;
        
        // Créer le popup de fin de jeu
        createEndGamePopup(winner, gagnantPoints);
    }
    
    // Fonction pour créer le popup de fin de jeu
    function createEndGamePopup(winner, points) {
        // Créer le conteneur du popup
        const popupContainer = document.createElement('div');
        popupContainer.className = 'end-game-popup-container';
        popupContainer.style.position = 'fixed';
        popupContainer.style.top = '0';
        popupContainer.style.left = '0';
        popupContainer.style.width = '100%';
        popupContainer.style.height = '100%';
        popupContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        popupContainer.style.display = 'flex';
        popupContainer.style.justifyContent = 'center';
        popupContainer.style.alignItems = 'center';
        popupContainer.style.zIndex = '1000';
        
        const popup = document.createElement('div');
        popup.className = 'end-game-popup';
        popup.style.backgroundColor = '#FFC61D';
        popup.style.borderRadius = '10px';
        popup.style.padding = '30px';
        popup.style.textAlign = 'center';
        popup.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
        popup.style.maxWidth = '500px';
        popup.style.width = '80%';
        
        const title = document.createElement('h2');
        title.textContent = 'Fin de la partie !';
        title.style.marginTop = '0';
        title.style.fontSize = '28px';
        title.style.color = '#333';
        
        const message = document.createElement('p');
        if (winner === "Égalité") {
            message.textContent = `Égalité ! Les deux joueurs ont ${points} goupilles !`;
        } else {
            message.textContent = `Le Joueur ${winner} a gagné avec ${points} goupilles !`;
        }
        message.style.fontSize = '20px';
        message.style.margin = '20px 0';
        message.style.color = '#333';
        
        const button = document.createElement('button');
        button.textContent = 'Retour au menu';
        button.style.backgroundColor = '#FF8C00';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.padding = '12px 24px';
        button.style.borderRadius = '5px';
        button.style.fontSize = '18px';
        button.style.cursor = 'pointer';
        button.style.transition = 'background-color 0.3s';
        
        button.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#E57C00';
        });
        
        button.addEventListener('mouseout', function() {
            this.style.backgroundColor = '#FF8C00';
        });
        
        button.addEventListener('click', function() {
            // Rediriger vers la page du menu
            window.location.href = 'index.html';
        });
        
        popup.appendChild(title);
        popup.appendChild(message);
        popup.appendChild(button);
        
        popupContainer.appendChild(popup);
        
        document.body.appendChild(popupContainer);
    }
});