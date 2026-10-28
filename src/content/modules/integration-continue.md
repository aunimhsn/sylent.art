---
title: "Intégration continue"
domain: methodologie-et-tests
order: 3
days: 1
summary: "Vérifier automatiquement le code à chaque modification."
scene: pipeline
audience: "Étudiants, développeurs, chefs de projet technique"
level: "Intermédiaire"
prerequisites: "Les bases de Git et GitHub."
objectives:
  - "Écrire un workflow GitHub Actions"
  - "Lancer automatiquement les tests, le linter et le build à chaque modification"
  - "Garder les secrets hors du code"
  - "N’accepter une pull request que si toutes les vérifications passent"
program:
  - title: "Les workflows"
    text: "Les déclencheurs, comme un push ou une pull request, les jobs et les étapes."
  - title: "Vérifier le code"
    text: "Lancer les tests, le linter et le build, et accélérer les workflows avec le cache."
  - title: "Les secrets"
    text: "Donner à un workflow les clés dont il a besoin sans les écrire dans le code."
  - title: "Protéger la branche principale"
    text: "Une pull request n’est fusionnée que si toutes les vérifications passent."
  - title: "Travaux pratiques"
    text: "Par exemple le chiffre de César : un petit formulaire en JavaScript et ses tests Cypress, lancés à chaque modification, parmi d’autres exercices."
---

Plus une équipe attend pour vérifier son code, plus les erreurs coûtent cher à corriger. L’intégration continue lance automatiquement les tests et les vérifications à chaque modification, pour repérer un problème dès qu’il apparaît. Ce module la met en place avec GitHub Actions, de la première vérification jusqu’à la protection de la branche principale.
