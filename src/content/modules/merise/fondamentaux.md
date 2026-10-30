---
title: "Merise"
domains:
  - bases-de-donnees
order: 1
days: 2
summary: "Modéliser les données d’un projet avant de créer la base."
scene: entities
audience:
  - "Étudiants"
  - "Développeurs"
  - "Chefs de projet technique"
level: "Débutant"
prerequisites: "Aucun."
objectives:
  - "Traduire un besoin en règles de gestion"
  - "Recenser les données dans un dictionnaire de données"
  - "Construire un modèle conceptuel des données avec ses cardinalités"
  - "Passer du modèle conceptuel au modèle logique, puis au modèle physique"
  - "Vérifier un modèle avec les contraintes d’intégrité et les formes normales"
program:
  - title: "Les données"
    text: "De la donnée à l’information, la qualité des données et le modèle relationnel."
  - title: "Analyser le besoin"
    text: "Recueillir les règles de gestion, choisir une convention de nommage et recenser les données dans un dictionnaire, tenu dans un tableur."
  - title: "Le modèle conceptuel"
    text: "Les entités, les identifiants, les associations et les cardinalités, dessinés avec Looping."
  - title: "Le modèle logique"
    text: "Les règles de passage du modèle conceptuel aux tables, aux clés primaires et aux clés étrangères."
  - title: "Vérifier le modèle"
    text: "Les contraintes d’intégrité et les formes normales."
  - title: "Les cas particuliers"
    text: "La propriété portée, l’association réflexive, l’association ternaire et l’héritage."
  - title: "Le modèle physique"
    text: "Le schéma de la base, prêt à être créé, avec MySQL Workbench."
  - title: "Travaux pratiques"
    text: "Par exemple Spotilike : concevoir la base d’une plateforme de streaming musical, sans cahier des charges, parmi d’autres exercices."
---

Une base de données mal pensée se paie tout au long de la vie d’une application : données en double, incohérences, requêtes compliquées. Merise est une méthode éprouvée pour modéliser les données d’un projet avant d’écrire la moindre table. Ce module se concentre sur les données, du besoin exprimé par le client jusqu’au schéma prêt à être créé.
