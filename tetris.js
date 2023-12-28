var menu = 1, jouer = 0, courant, suivant, retour = [], position, intervalID, ligne = 0, pts = 0, lvl = 1, timerID = 0, time, start_time;
var jeu = document.getElementById("jeu"), preview = document.getElementById("preview");
var jeu_ctx = jeu.getContext('2d'), preview_ctx = preview.getContext('2d');
var score = document.getElementById('score'), niveau = document.getElementById('niveau'), nbr_ligne = document.getElementById('lignes');
const color = ['orange', '#000099', '#0099FF', 'yellow', 'red', 'green', 'purple'];
const barem = [40, 100, 300, 1200];

var tableau = [
	[[0, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [0, 7]],//voyage avec tableau[y][x] (origine en haut à gauche)
	[[0, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [0, 7]],//L'intérieur du tableau fait 15*10
	[[0, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [0, 7]],//La présence des 0 permettra de faire un test de secu
	[[0, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [0, 7]],//0 = bord, 1 = vide, 2 = bloc fixe 
	[[0, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [0, 7]],
	[[0, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [0, 7]],
	[[0, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [0, 7]],
	[[0, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [0, 7]],
	[[0, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [0, 7]],
	[[0, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [0, 7]],
	[[0, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [0, 7]],
	[[0, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [0, 7]],
	[[0, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [0, 7]],
	[[0, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [0, 7]],
	[[0, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [0, 7]],
	[[0, 7], [0, 7], [0, 7], [0, 7], [0, 7], [0, 7], [0, 7], [0, 7], [0, 7], [0, 7], [0, 7], [0, 7]]];

function Tetromino () {//Création du Tetromino
    this.forme = Math.floor(Math.random()*7); //de 0 à 6
    if (this.forme == 7) {
    	this.forme = 6;
    }
    this.x = 5; //position du centre
    this.y = 1;
    this.rotation = 0; //de 0 à 3
}

function current(forme, x, y, rotation) {//courant sera une instance de current
	this.bloc_1 = [];
	this.bloc_2 = [];
	this.bloc_3 = [];
	this.bloc_4 = [];
	this.forme = forme;
	this.rotation = rotation;
	this.bloc_1 = [x, y];
	switch (this.forme) {
		case 0:
			//en L (orange)
			if (this.rotation == 0) {
				this.bloc_2 = [x, y-1];
				this.bloc_3 = [x, y+1];
				this.bloc_4 = [x+1, y+1];
			} else if (this.rotation == 1) {
				this.bloc_2 = [x-1, y];
				this.bloc_3 = [x+1, y];
				this.bloc_4 = [x+1, y-1];
			} else if (this.rotation == 2) {
				this.bloc_2 = [x, y+1];
				this.bloc_3 = [x, y-1];
				this.bloc_4 = [x-1, y-1];
			} else if (this.rotation == 3) {
				this.bloc_2 = [x+1, y];
				this.bloc_3 = [x-1, y];
				this.bloc_4 = [x-1, y+1];
			}
		break;
		
		case 1:
			//reverse L (bleu foncé)
			if (this.rotation == 0) {
				this.bloc_2 = [x, y-1];
				this.bloc_3 = [x, y+1];
				this.bloc_4 = [x-1, y+1];
			} else if (this.rotation == 1) {
				this.bloc_2 = [x-1, y];
				this.bloc_3 = [x+1, y];
				this.bloc_4 = [x+1, y+1];
			} else if (this.rotation == 2) {
				this.bloc_2 = [x, y+1];
				this.bloc_3 = [x, y-1];
				this.bloc_4 = [x+1, y-1];
			} else if (this.rotation == 3) {
				this.bloc_2 = [x+1, y];
				this.bloc_3 = [x-1, y];
				this.bloc_4 = [x-1, y-1];
			}
		break;

		case 2:
			//en l (bleu clair)
			if (this.rotation == 0 || this.rotation == 2) {
				this.bloc_2 = [x, y-1];
				this.bloc_3 = [x, y+1];
				this.bloc_4 = [x, y+2];
			} else if (this.rotation == 1 || this.rotation == 3) {
				this.bloc_2 = [x-1, y];
				this.bloc_3 = [x+1, y];
				this.bloc_4 = [x+2, y];
			}
		break;

		case 3:
			//en [] (jaune)
			this.bloc_2 = [x, y-1];
			this.bloc_3 = [x+1, y-1];
			this.bloc_4 = [x+1, y];
		break;

		case 4:
			//en Z (rouge)
			if (this.rotation == 0) {
				this.bloc_2 = [x-1, y];
				this.bloc_3 = [x, y+1];
				this.bloc_4 = [x+1, y+1];
			} else if (this.rotation == 1) {
				this.bloc_2 = [x, y+1];
				this.bloc_3 = [x+1, y];
				this.bloc_4 = [x+1, y-1];
			} else if (this.rotation == 2) {
				this.bloc_2 = [x+1, y];
				this.bloc_3 = [x, y-1];
				this.bloc_4 = [x-1, y-1];
			} else if (this.rotation == 3) {
				this.bloc_2 = [x, y-1];
				this.bloc_3 = [x-1, y];
				this.bloc_4 = [x-1, y+1];
			}
		break;

		case 5:
			//en S (vert)
			if (this.rotation == 0) {
				this.bloc_2 = [x+1, y];
				this.bloc_3 = [x, y+1];
				this.bloc_4 = [x-1, y+1];
			} else if (this.rotation == 1) {
				this.bloc_2 = [x, y-1];
				this.bloc_3 = [x+1, y];
				this.bloc_4 = [x+1, y+1];
			} else if (this.rotation == 2) {
				this.bloc_2 = [x-1, y];
				this.bloc_3 = [x, y-1];
				this.bloc_4 = [x+1, y-1];
			} else if (this.rotation == 3) {
				this.bloc_2 = [x, y+1];
				this.bloc_3 = [x-1, y];
				this.bloc_4 = [x-1, y-1];
			}
		break;

		case 6:
			//en _|_ (violet)
			if (rotation == 0) {
				this.bloc_2 = [x, y-1];
				this.bloc_3 = [x-1, y];
				this.bloc_4 = [x+1, y];
			} else if (rotation == 1) {
				this.bloc_2 = [x-1, y];
				this.bloc_3 = [x, y+1];
				this.bloc_4 = [x, y-1];
			} else if (rotation == 2) {
				this.bloc_2 = [x, y+1];
				this.bloc_3 = [x+1, y];
				this.bloc_4 = [x-1, y];
			} else if (rotation == 3) {
				this.bloc_2 = [x+1, y];
				this.bloc_3 = [x, y-1];
				this.bloc_4 = [x, y+1];
			}
		break;

		default:
			console.log('Erreur in current fonction : forme non prise en compte');
	}
}

function effacer () {
	jeu_ctx.clearRect(courant.bloc_1[0]*40-40, courant.bloc_1[1]*40, 40, 40);
	jeu_ctx.clearRect(courant.bloc_2[0]*40-40, courant.bloc_2[1]*40, 40, 40);
	jeu_ctx.clearRect(courant.bloc_3[0]*40-40, courant.bloc_3[1]*40, 40, 40);
	jeu_ctx.clearRect(courant.bloc_4[0]*40-40, courant.bloc_4[1]*40, 40, 40);
}

function dessiner () {
	jeu_ctx.fillStyle = color[courant.forme];
	jeu_ctx.strokeStyle = 'black';
	jeu_ctx.fillRect(courant.bloc_1[0]*40-40, courant.bloc_1[1]*40, 40, 40);
	jeu_ctx.fillRect(courant.bloc_2[0]*40-40, courant.bloc_2[1]*40, 40, 40);
	jeu_ctx.fillRect(courant.bloc_3[0]*40-40, courant.bloc_3[1]*40, 40, 40);
	jeu_ctx.fillRect(courant.bloc_4[0]*40-40, courant.bloc_4[1]*40, 40, 40);
}

function test_deplacement (d) {//d de 0 à 1 pour gauche droite, courant : current
	if (d) {//1=droite
		return !((tableau[courant.bloc_1[1]][courant.bloc_1[0]+1][0] == 0 || tableau[courant.bloc_1[1]][courant.bloc_1[0]+1][0] == 2) || (tableau[courant.bloc_2[1]][courant.bloc_2[0]+1][0] == 0 || tableau[courant.bloc_2[1]][courant.bloc_2[0]+1][0] == 2) || (tableau[courant.bloc_3[1]][courant.bloc_3[0]+1][0] == 0 || tableau[courant.bloc_3[1]][courant.bloc_3[0]+1][0] == 2) || (tableau[courant.bloc_4[1]][courant.bloc_4[0]+1][0] == 0 || tableau[courant.bloc_4[1]][courant.bloc_4[0]+1][0] == 2));
	} else {
		return !((tableau[courant.bloc_1[1]][courant.bloc_1[0]-1][0] == 0 || tableau[courant.bloc_1[1]][courant.bloc_1[0]-1][0] == 2) || (tableau[courant.bloc_2[1]][courant.bloc_2[0]-1][0] == 0 || tableau[courant.bloc_2[1]][courant.bloc_2[0]-1][0] == 2) || (tableau[courant.bloc_3[1]][courant.bloc_3[0]-1][0] == 0 || tableau[courant.bloc_3[1]][courant.bloc_3[0]-1][0] == 2) || (tableau[courant.bloc_4[1]][courant.bloc_4[0]-1][0] == 0 || tableau[courant.bloc_4[1]][courant.bloc_4[0]-1][0] == 2));
	}
}

function deplacement (d) {
	if (test_deplacement(d)) {
		if (d) {
			effacer();
			courant.bloc_1[0] += 1;
			courant = new current(courant.forme, courant.bloc_1[0], courant.bloc_1[1], courant.rotation);
			dessiner();
		} else {
			effacer();
			courant.bloc_1[0] -= 1;
			courant = new current(courant.forme, courant.bloc_1[0], courant.bloc_1[1], courant.rotation);
			dessiner();
		}
	}
	return courant;
}

function test_tourner (i) {
	var objet_test;
	switch (i) {
		case 0:
			if (courant.rotation + 1 > 3) {
				objet_test = new current(courant.forme, courant.bloc_1[0], courant.bloc_1[1], 0);
				return !((tableau[objet_test.bloc_1[1]][objet_test.bloc_1[0]][0] == 0 || tableau[objet_test.bloc_1[1]][objet_test.bloc_1[0]][0] == 2) || (tableau[objet_test.bloc_2[1]][objet_test.bloc_2[0]][0] == 0 || tableau[objet_test.bloc_2[1]][objet_test.bloc_2[0]][0] == 2) || (tableau[objet_test.bloc_3[1]][objet_test.bloc_3[0]][0] == 0 || tableau[objet_test.bloc_3[1]][objet_test.bloc_3[0]][0] == 2) || (tableau[objet_test.bloc_4[1]][objet_test.bloc_4[0]][0] == 0 || tableau[objet_test.bloc_4[1]][objet_test.bloc_4[0]][0] == 2));
			} else {
				objet_test = new current(courant.forme, courant.bloc_1[0], courant.bloc_1[1], courant.rotation+1);
				return !((tableau[objet_test.bloc_1[1]][objet_test.bloc_1[0]][0] == 0 || tableau[objet_test.bloc_1[1]][objet_test.bloc_1[0]][0] == 2) || (tableau[objet_test.bloc_2[1]][objet_test.bloc_2[0]][0] == 0 || tableau[objet_test.bloc_2[1]][objet_test.bloc_2[0]][0] == 2) || (tableau[objet_test.bloc_3[1]][objet_test.bloc_3[0]][0] == 0 || tableau[objet_test.bloc_3[1]][objet_test.bloc_3[0]][0] == 2) || (tableau[objet_test.bloc_4[1]][objet_test.bloc_4[0]][0] == 0 || tableau[objet_test.bloc_4[1]][objet_test.bloc_4[0]][0] == 2));
			}
		break;

		case 1:
			if (courant.rotation + 1 > 3) {
				objet_test = new current(courant.forme, courant.bloc_1[0]-1, courant.bloc_1[1], 0);
				return !((tableau[objet_test.bloc_1[1]][objet_test.bloc_1[0]][0] == 0 || tableau[objet_test.bloc_1[1]][objet_test.bloc_1[0]][0] == 2) || (tableau[objet_test.bloc_2[1]][objet_test.bloc_2[0]][0] == 0 || tableau[objet_test.bloc_2[1]][objet_test.bloc_2[0]][0] == 2) || (tableau[objet_test.bloc_3[1]][objet_test.bloc_3[0]][0] == 0 || tableau[objet_test.bloc_3[1]][objet_test.bloc_3[0]][0] == 2) || (tableau[objet_test.bloc_4[1]][objet_test.bloc_4[0]][0] == 0 || tableau[objet_test.bloc_4[1]][objet_test.bloc_4[0]][0] == 2));
			} else {
				objet_test = new current(courant.forme, courant.bloc_1[0]-1, courant.bloc_1[1], courant.rotation+1);
				return !((tableau[objet_test.bloc_1[1]][objet_test.bloc_1[0]][0] == 0 || tableau[objet_test.bloc_1[1]][objet_test.bloc_1[0]][0] == 2) || (tableau[objet_test.bloc_2[1]][objet_test.bloc_2[0]][0] == 0 || tableau[objet_test.bloc_2[1]][objet_test.bloc_2[0]][0] == 2) || (tableau[objet_test.bloc_3[1]][objet_test.bloc_3[0]][0] == 0 || tableau[objet_test.bloc_3[1]][objet_test.bloc_3[0]][0] == 2) || (tableau[objet_test.bloc_4[1]][objet_test.bloc_4[0]][0] == 0 || tableau[objet_test.bloc_4[1]][objet_test.bloc_4[0]][0] == 2));
			}
		break;

		case 2:
			if (courant.rotation + 1 > 3) {
				objet_test = new current(courant.forme, courant.bloc_1[0]+1, courant.bloc_1[1], 0);
				return !((tableau[objet_test.bloc_1[1]][objet_test.bloc_1[0]][0] == 0 || tableau[objet_test.bloc_1[1]][objet_test.bloc_1[0]][0] == 2) || (tableau[objet_test.bloc_2[1]][objet_test.bloc_2[0]][0] == 0 || tableau[objet_test.bloc_2[1]][objet_test.bloc_2[0]][0] == 2) || (tableau[objet_test.bloc_3[1]][objet_test.bloc_3[0]][0] == 0 || tableau[objet_test.bloc_3[1]][objet_test.bloc_3[0]][0] == 2) || (tableau[objet_test.bloc_4[1]][objet_test.bloc_4[0]][0] == 0 || tableau[objet_test.bloc_4[1]][objet_test.bloc_4[0]][0] == 2));
			} else {
				objet_test = new current(courant.forme, courant.bloc_1[0]+1, courant.bloc_1[1], courant.rotation+1);
				return !((tableau[objet_test.bloc_1[1]][objet_test.bloc_1[0]][0] == 0 || tableau[objet_test.bloc_1[1]][objet_test.bloc_1[0]][0] == 2) || (tableau[objet_test.bloc_2[1]][objet_test.bloc_2[0]][0] == 0 || tableau[objet_test.bloc_2[1]][objet_test.bloc_2[0]][0] == 2) || (tableau[objet_test.bloc_3[1]][objet_test.bloc_3[0]][0] == 0 || tableau[objet_test.bloc_3[1]][objet_test.bloc_3[0]][0] == 2) || (tableau[objet_test.bloc_4[1]][objet_test.bloc_4[0]][0] == 0 || tableau[objet_test.bloc_4[1]][objet_test.bloc_4[0]][0] == 2));
			}
		break;

		case 3:
			if (courant.rotation + 1 > 3) {
				objet_test = new current(courant.forme, courant.bloc_1[0], courant.bloc_1[1]-1, 0);
				return !((tableau[objet_test.bloc_1[1]][objet_test.bloc_1[0]][0] == 0 || tableau[objet_test.bloc_1[1]][objet_test.bloc_1[0]][0] == 2) || (tableau[objet_test.bloc_2[1]][objet_test.bloc_2[0]][0] == 0 || tableau[objet_test.bloc_2[1]][objet_test.bloc_2[0]][0] == 2) || (tableau[objet_test.bloc_3[1]][objet_test.bloc_3[0]][0] == 0 || tableau[objet_test.bloc_3[1]][objet_test.bloc_3[0]][0] == 2) || (tableau[objet_test.bloc_4[1]][objet_test.bloc_4[0]][0] == 0 || tableau[objet_test.bloc_4[1]][objet_test.bloc_4[0]][0] == 2));
			} else {
				objet_test = new current(courant.forme, courant.bloc_1[0], courant.bloc_1[1]-1, courant.rotation+1);
				return !((tableau[objet_test.bloc_1[1]][objet_test.bloc_1[0]][0] == 0 || tableau[objet_test.bloc_1[1]][objet_test.bloc_1[0]][0] == 2) || (tableau[objet_test.bloc_2[1]][objet_test.bloc_2[0]][0] == 0 || tableau[objet_test.bloc_2[1]][objet_test.bloc_2[0]][0] == 2) || (tableau[objet_test.bloc_3[1]][objet_test.bloc_3[0]][0] == 0 || tableau[objet_test.bloc_3[1]][objet_test.bloc_3[0]][0] == 2) || (tableau[objet_test.bloc_4[1]][objet_test.bloc_4[0]][0] == 0 || tableau[objet_test.bloc_4[1]][objet_test.bloc_4[0]][0] == 2));
			}
		break;

		default:
			console.log('Erreur in test_tourner fonction : argument non compris entre 0 et 3');
	}
	
}

function tourner (c) {
	var continuer = c;
	effacer();
	while (continuer) {
		if (test_tourner(0)) {
			if (courant.rotation + 1 > 3) {
				courant = new current(courant.forme, courant.bloc_1[0], courant.bloc_1[1], 0);
				dessiner();
				continuer = 0;
			} else {
				courant = new current(courant.forme, courant.bloc_1[0], courant.bloc_1[1], courant.rotation+1);
				dessiner();
				continuer = 0;
			}
		} else {
			if (test_tourner(1)) {
				courant = new current(courant.forme, courant.bloc_1[0]-1, courant.bloc_1[1], courant.rotation);
			} else if (test_tourner(2)) {
				courant = new current(courant.forme, courant.bloc_1[0]+1, courant.bloc_1[1], courant.rotation);
			} else if (test_tourner(3)) {
				courant = new current(courant.forme, courant.bloc_1[0], courant.bloc_1[1]-1, courant.rotation);
			} else {
				dessiner();
				continuer = 0;
			}
		}
	}
	return courant;
}

function test_tomber () {
	return !((tableau[courant.bloc_1[1]+1][courant.bloc_1[0]][0] == 0 || tableau[courant.bloc_1[1]+1][courant.bloc_1[0]][0] == 2) || (tableau[courant.bloc_2[1]+1][courant.bloc_2[0]][0] == 0 || tableau[courant.bloc_2[1]+1][courant.bloc_2[0]][0] == 2) || (tableau[courant.bloc_3[1]+1][courant.bloc_3[0]][0] == 0 || tableau[courant.bloc_3[1]+1][courant.bloc_3[0]][0] == 2) || (tableau[courant.bloc_4[1]+1][courant.bloc_4[0]][0] == 0 || tableau[courant.bloc_4[1]+1][courant.bloc_4[0]][0] == 2));
}

function tomber () {//fonction principale qui met à jour le tableau
	if (typeof courant != 'object' || typeof suivant != 'object') {
		suivant = prochain(0);
		courant = new current(suivant.forme, suivant.x, suivant.y, suivant.rotation);
		suivant = prochain(1);
		dessiner();
	} else if (test_tomber()) {
		effacer();
		courant.bloc_1[1] += 1;
		courant = new current(courant.forme, courant.bloc_1[0], courant.bloc_1[1], courant.rotation);
		dessiner();
	} else {
		tableau[courant.bloc_1[1]][courant.bloc_1[0]] = [2, courant.forme];
		tableau[courant.bloc_2[1]][courant.bloc_2[0]] = [2, courant.forme];
		tableau[courant.bloc_3[1]][courant.bloc_3[0]] = [2, courant.forme];
		tableau[courant.bloc_4[1]][courant.bloc_4[0]] = [2, courant.forme];
		musique(3);
		destroy_ligne();
		courant = new current(suivant.forme, suivant.x, suivant.y, suivant.rotation);
		suivant = prochain(1);
		if (tableau[1][5][0] == 2) {
			clearInterval(intervalID);
			clearTimeout(timerID);
			musique(2);
			jeu_ctx.clearRect(0, 0, jeu.width , jeu.height);
			preview_ctx.clearRect(0, 0, preview.width , preview.height);
			jeu_ctx.fillStyle = '#777777';
			jeu_ctx.fillRect(75, 230, 250, 160);
			jeu_ctx.fillStyle = 'white';
			jeu_ctx.font = '48px serif';
			jeu_ctx.fillText('Fin du jeu', 85, 310);
			jeu_ctx.font = '40px serif';
			jeu_ctx.fillText("score : "+String(time+pts), 85, 350);
		} else {
			dessiner();
		}
	}
	return [courant, suivant];
}

function prochain (a) {
	suivant = new Tetromino();
	if (a) {
		while (suivant.forme == courant.forme) {
			suivant = new Tetromino();
		}
	}
	switch (suivant.forme) {
		case 0:
			preview_ctx.clearRect(0, 0, 90, 90);
			preview_ctx.fillStyle = color[0];
			preview_ctx.fillRect(31, 3, 28, 84);
			preview_ctx.fillRect(59, 59, 28, 28);
		break;

		case 1:
			preview_ctx.clearRect(0, 0, 90, 90);
			preview_ctx.fillStyle = color[1];
			preview_ctx.fillRect(31, 3, 28, 84);
			preview_ctx.fillRect(3, 59, 28, 28);
		break;

		case 2:
			preview_ctx.clearRect(0, 0, 90, 90);
			preview_ctx.fillStyle = color[2];
			preview_ctx.fillRect(5, 35, 80, 20);
		break;

		case 3:
			preview_ctx.clearRect(0, 0, 90, 90);
			preview_ctx.fillStyle = color[3];
			preview_ctx.fillRect(15, 15, 60, 60);
		break;

		case 4:
			preview_ctx.clearRect(0, 0, 90, 90);
			preview_ctx.fillStyle = color[4];
			preview_ctx.fillRect(3, 3, 56, 28);
			preview_ctx.fillRect(31, 31, 56, 28);
		break;

		case 5:
			preview_ctx.clearRect(0, 0, 90, 90);
			preview_ctx.fillStyle = color[5];
			preview_ctx.fillRect(31, 3, 56, 28);
			preview_ctx.fillRect(3, 31, 56, 28);
		break;

		case 6:
			preview_ctx.clearRect(0, 0, 90, 90);
			preview_ctx.fillStyle = color[6];
			preview_ctx.fillRect(3, 31, 84, 28);
			preview_ctx.fillRect(31, 3, 28, 28);
		break;

		default:
			console.log('Erreur in prochain fonction : forme non prise en compte');
	}
	return suivant;
}

function rappel () {//fonction "callback"
	retour = tomber();
	courant = retour[0];
	suivant = retour[1];
}

function getStart () {//déclenche le jeu
	if (position) {
		jeu_ctx.clearRect(0, 0, jeu.width , jeu.height);
		musique(1);
		intervalID = setInterval(rappel, 1000);//fait tomber à interval régulier
		start_time = new Date();
		chrono()
		menu = 0;
		jouer = 1;
	}
}

function getPosition(jeu, e) {
	var rect = jeu.getBoundingClientRect();
	return {
		x: Math.round(e.clientX - rect.left),
		y: Math.round(e.clientY - rect.top)
	};
}

function destroy_ligne () {//la fonction sensée tester le contenu du tableau
	var a = 0;
	for (var i = 0; i <= tableau.length - 1; i++) {
		var test_ligne = 1;
		for (var e = 1; e <= 10; e++) {
			if (tableau[i][e][0] != 2) {
				test_ligne = 0;
			}
		}
		if (test_ligne) {
			jeu_ctx.clearRect(0, i*40, 400, 40);
			musique(4);
			a += 1;
			for (var y = i; y >= 0; y--) {
				if (y == 0) {
					tableau[y] = [[0, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [1, 7], [0, 7]];
				} else {
					jeu_ctx.clearRect(0, (y-1)*40, 400, 40);
					tableau[y] = tableau[y-1];
					for (var x = tableau[y].length - 1; x >= 0; x--) {
						if (tableau[y][x][0] == 2) {
							jeu_ctx.fillStyle = color[tableau[y][x][1]];
							jeu_ctx.fillRect(x*40-40, y*40, 40, 40);
						}
					}
				}
			}
		}
	}
	ligne += a;
	if (a) {
		pts += barem[a-1]*lvl;
	}
	score.innerHTML = time+pts;
	nbr_ligne.innerHTML = ligne;
}

function chrono () {
	var test_lvl = lvl;
	var now = new Date();
	var diff = now - start_time;
	diff = new Date(diff);
	var sec = diff.getSeconds();
	var min = diff.getMinutes();
	var hr = diff.getHours()-1;
	time = hr*3600 + min*60 + sec;
	score.innerHTML = time+pts;
	lvl = Math.floor(time/60)+1;
	niveau.innerHTML = lvl;
	if (!(test_lvl == lvl) && lvl <= 13) {
		clearInterval(intervalID);
		intervalID = setInterval(rappel, 1000-(lvl-1)*75);
	}
	musique(1);
	timerID = setTimeout("chrono()", 100);
}

function musique (a) {
	var mus_menu = document.querySelector('#mus_menu'), mus_jeu = document.querySelector('#mus_jeu'), mus_score = document.querySelector('#mus_score'), SFX_1 = document.querySelector('#SFX_1'), SFX_2 = document.querySelector('#SFX_2');
	switch (a) {
		case 0:
			if (menu) {
				mus_menu.volume = 0.7;
				mus_menu.play();
			}
		break;

		case 1:
			mus_menu.pause();
			mus_jeu.volume = 0.7;
			mus_jeu.play();
		break;

		case 2:
			mus_jeu.pause();
			mus_score.volume = 0.7;
			mus_score.play();
		break;

		case 3:
			SFX_1.play();
		break;

		case 4:
			SFX_2.play();
		break;
	}
}

jeu.addEventListener('mousemove', function(e) {//écran de démarrage
	if (menu) {
		var mousePos = getPosition(jeu, e);
		position = (130 <= mousePos.x && mousePos.x <= 280 && 255 <= mousePos.y && mousePos.y <= 335);
	}
}, false);

document.addEventListener('keydown', function(e) {//jeu
	if (jouer) {
		if (String.fromCharCode(e.keyCode) == "Q") {
			//Gauche
			courant = deplacement (0);
		} else if (String.fromCharCode(e.keyCode) == "D") {
			//Droite
			courant = deplacement (1);
		} else if (String.fromCharCode(e.keyCode) == "Z") {
			//Tourner
			courant = tourner (2);
		} else if (String.fromCharCode(e.keyCode) == "S") {
			//Tomber
			while (test_tomber()) {
				rappel();
			}
		}
	}
})

//Premier écran affiché est une page avec "Appuyez sur Entrée pour jouer"
jeu_ctx.clearRect(0, 0, jeu.width , jeu.height);
jeu_ctx.fillStyle = 'red';
jeu_ctx.fillRect(125, 250, 150, 80);
jeu_ctx.fillStyle = 'white';
jeu_ctx.font = '48px serif';
jeu_ctx.fillText('START', 126, 310);
score.innerHTML = 0;
niveau.innerHTML = 1;
nbr_ligne.innerHTML = 0;