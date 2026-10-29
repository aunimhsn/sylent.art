---
title: "Principes SOLID"
domain: conception-logicielle
order: 3
days: 2
summary: "Organiser son code objet pour qu’il reste simple à faire évoluer."
scene: solid
audience:
  - "Étudiants"
  - "Développeurs"
level: "Intermédiaire"
prerequisites: "Les bases de la programmation orientée objet."
objectives:
  - "Reconnaître un code difficile à faire évoluer"
  - "Appliquer chacun des cinq principes SOLID"
  - "Refactoriser un code existant sans changer son comportement"
  - "Situer SOLID parmi les autres principes de conception"
program:
  - title: "Ce que SOLID essaie de sauver"
    text: "Le code qui se rigidifie, et le coût de chaque changement."
  - title: "Responsabilité unique"
    text: "Une classe, une seule raison de changer."
  - title: "Ouvert et fermé"
    text: "Ajouter un comportement sans modifier le code qui fonctionne déjà."
  - title: "Substitution de Liskov"
    text: "Des classes filles qui tiennent les promesses de leur classe mère."
  - title: "Ségrégation des interfaces"
    text: "Des interfaces petites et précises plutôt qu’une seule qui fait tout."
  - title: "Inversion des dépendances"
    text: "Dépendre d’abstractions plutôt que de classes concrètes."
  - title: "En pratique"
    text: "Les cinq principes ensemble, ce qui fait mal quand on les applique, et pour aller plus loin DRY, KISS, YAGNI et la loi de Déméter."
  - title: "Travaux pratiques"
    text: "Cinq refactorings, pour observer la plus-value de chaque principe."
---

Un code qui fonctionne aujourd’hui peut devenir un frein demain, quand chaque modification en casse une autre. Les cinq principes SOLID donnent des repères simples pour organiser un code objet qui reste facile à comprendre, à tester et à faire évoluer. Ce module les présente un par un, chacun avec un exemple qui le viole puis sa correction.
