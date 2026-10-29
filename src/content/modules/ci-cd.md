---
title: "CI/CD"
domain: methodologie-et-tests
order: 3
days: 2
summary: "Vérifier et mettre en ligne automatiquement chaque modification."
scene: pipeline
audience:
  - "Étudiants"
  - "Développeurs"
  - "Chefs de projet technique"
level: "Intermédiaire"
prerequisites: "Les bases de Git et GitHub."
objectives:
  - "Écrire un workflow GitHub Actions"
  - "Lancer automatiquement les tests, le linter et le build à chaque modification"
  - "N’accepter une pull request que si toutes les vérifications passent"
  - "Mettre en ligne automatiquement chaque version fusionnée"
  - "Garder les secrets hors du code, et revenir à une version précédente en cas de problème"
program:
  - title: "Les workflows"
    text: "Les déclencheurs, comme un push ou une pull request, les jobs et les étapes."
  - title: "Vérifier le code"
    text: "Lancer les tests, le linter et le build, et accélérer les workflows avec le cache."
  - title: "Protéger la branche principale"
    text: "Une pull request n’est fusionnée que si toutes les vérifications passent."
  - title: "Héberger une application"
    text: "La différence entre un site statique et une application avec un serveur, et les hébergeurs qui leur conviennent."
  - title: "Déployer automatiquement"
    text: "Relier un dépôt GitHub à Vercel ou à Render, déployer à chaque fusion, prévisualiser chaque pull request et relier un nom de domaine."
  - title: "Les secrets"
    text: "Donner à un workflow et à une application en ligne les clés dont ils ont besoin, sans les écrire dans le code."
  - title: "Surveiller et réparer"
    text: "Lire les journaux et revenir à une version précédente."
  - title: "Travaux pratiques"
    text: "Par exemple le chiffre de César : ses tests Cypress lancés à chaque modification, puis sa mise en ligne sur Vercel à chaque fusion, parmi d’autres exercices."
---

Plus une équipe attend pour vérifier son code, plus les erreurs coûtent cher à corriger, et une nouvelle version n’apporte rien tant qu’elle n’est pas en ligne. Le CI/CD, l’intégration et le déploiement continus, automatise les deux : chaque modification est vérifiée, et chaque version validée est publiée, sans manipulation à la main. Ce module le met en place avec GitHub Actions, Vercel et Render, de la première vérification jusqu’au retour à une version précédente quand une mise en ligne se passe mal.
