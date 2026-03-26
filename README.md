# Texas Hold'em Poker Hand Evaluator - TDD Exam

## 🃏 Présentation du Projet
Ce projet est un évaluateur de mains de Poker (Texas Hold'em) réalisé en suivant la méthodologie **TDD (Test Driven Development)**. L'objectif est de déterminer la meilleure main de 5 cartes possible parmi 7 (2 cartes privées + 5 cartes communes) et de comparer les joueurs pour désigner un gagnant.

## 🚀 Stack Technique
- **Langage :** TypeScript
- **Tests :** Jest (`ts-jest`)
- **Environnement :** Node.js

## 🛠 Méthodologie TDD
Le développement a suivi le cycle **Red-Green-Refactor** :
1. **Red** : Écriture d'un test unitaire pour une règle spécifique (ex: détection d'une Paire).
2. **Green** : Implémentation minimale du code de production pour faire passer le test.
3. **Refactor** : Optimisation du code (ex: extraction de la logique de groupage des cartes) tout en garantissant que la suite de tests reste au vert.

## 📋 Choix de Conception & Hypothèses

### 1. Représentation des mains (Chosen5)
Conformément aux consignes, le programme retourne toujours les **5 cartes exactes** constituant la meilleure main. 
- **Ordre déterministe** : Pour faciliter les tests et la comparaison, les cartes dans `chosen5` sont triées par importance (ex: pour un Brelan, les 3 cartes identiques d'abord, puis les 2 kickers par ordre décroissant).

### 2. Gestion des égalités (Tie-breaks)
Le programme implémente les règles de départage standards de la Wikipedia :
- Comparaison du rang de la combinaison principale.
- Comparaison des "kickers" (cartes d'accompagnement) par ordre décroissant en cas d'égalité sur la combinaison.
- **Note sur les couleurs** : Aucune couleur n'est supérieure à une autre (conformément au sujet).

### 3. Cas Particuliers
- **Ace-low straight (The Wheel)** : L'As est traité comme une valeur 14 pour les combinaisons hautes, mais une logique spécifique gère le cas `A-2-3-4-5`.
- **Board plays** : L'évaluateur fusionne les 7 cartes et extrait les 5 meilleures, permettant ainsi de gagner avec les 5 cartes du board si nécessaire.

## 🧪 Lancer les tests
Pour vérifier la validité de l'implémentation et la couverture des règles métier :

```bash
# Installation des dépendances
npm install

# Lancement des tests unitaires
npm test

# Lancement en mode observation (watch)
npm run test:watch
