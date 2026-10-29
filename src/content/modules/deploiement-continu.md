---
title: "Déploiement continu"
domain: methodologie-et-tests
order: 4
days: 1
summary: "Mettre en ligne automatiquement chaque nouvelle version."
scene: deploy
audience:
  - "Étudiants"
  - "Développeurs"
  - "Chefs de projet technique"
level: "Intermédiaire"
prerequisites: "Les bases de Git et GitHub."
objectives:
  - "Choisir un hébergement selon le type d’application"
  - "Mettre en ligne automatiquement chaque version fusionnée"
  - "Configurer une application en ligne avec ses variables d’environnement"
  - "Revenir à une version précédente en cas de problème"
program:
  - title: "Héberger une application"
    text: "La différence entre un site statique et une application avec un serveur, et les hébergeurs qui leur conviennent."
  - title: "Déployer automatiquement"
    text: "Relier un dépôt GitHub à Vercel ou à Render, déployer à chaque fusion et prévisualiser chaque pull request."
  - title: "Configurer"
    text: "Les variables d’environnement et les noms de domaine."
  - title: "Surveiller et réparer"
    text: "Lire les journaux et revenir à une version précédente."
  - title: "Travaux pratiques"
    text: "Par exemple mettre en ligne un front sur Vercel et son API sur Render, parmi d’autres exercices."
---

Une nouvelle version n’apporte rien tant qu’elle n’est pas en ligne. Le déploiement continu publie automatiquement chaque version validée, sans manipulation à la main ni oubli. Ce module montre comment le mettre en place avec Vercel et Render, deux hébergeurs simples à prendre en main, et comment réagir quand une mise en ligne se passe mal.
