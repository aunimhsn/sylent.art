// The content of the module pages, copied from src/content/modules/ on 2026-10-30 for the mock-up of
// step 13b (key: the name of the file). Markdown is kept as text.
const PROGRAMS = {
 "algorithmique": {
  "audience": [
   "Tout public"
  ],
  "level": "Débutant",
  "prerequisites": "Aucun.",
  "objectives": [
   "Décomposer un problème en étapes simples",
   "Écrire un algorithme clair en pseudo-code",
   "Utiliser les variables, les opérateurs, les conditions, les boucles et les fonctions",
   "Dérouler un algorithme à la main pour vérifier ce qu’il fait",
   "Formuler une demande sans ambiguïté"
  ],
  "program": [
   [
    "D’où vient la programmation",
    "Ada Lovelace et le premier algorithme, le langage machine, compiler ou interpréter."
   ],
   [
    "Penser un algorithme",
    "Ce qu’est un programme, de la recette de cuisine à l’algorithme, et comment l’écrire en pseudo-code."
   ],
   [
    "Les données",
    "Les variables, et les opérateurs mathématiques, de comparaison et logiques."
   ],
   [
    "La logique",
    "Les conditions et les boucles, pour un programme qui s’adapte aux données."
   ],
   [
    "Les fonctions",
    "Les procédures et les fonctions, pour découper un problème en sous-problèmes réutilisables."
   ],
   [
    "Dérouler à la main",
    "Exécuter un algorithme à la place de la machine, et le voir s’animer avec RoboMind."
   ],
   [
    "Demander, c’est spécifier",
    "Décrire précisément ce qu’on attend d’un programme, sans laisser de place à l’interprétation."
   ],
   [
    "Travaux pratiques",
    "Par exemple le jeu du « Plus ou moins », qui mène à la recherche dichotomique, un triangle à classer selon ses côtés ou les nombres pairs à compter, parmi d’autres exercices."
   ]
  ],
  "text": [
   "Avant d’apprendre un langage, il faut apprendre à raisonner : l’algorithmique est l’art de décrire, pas à pas, la solution d’un problème. Ce module s’appuie sur le pseudo-code pour que les apprenants se concentrent sur la logique plutôt que sur la syntaxe. Ce qu’ils y acquièrent leur servira ensuite dans tous les langages."
  ]
 },
 "alpine": {
  "audience": [
   "Étudiants",
   "Développeurs",
   "Chefs de projet technique"
  ],
  "level": "Intermédiaire",
  "prerequisites": "Les bases du HTML, du CSS et de JavaScript.",
  "objectives": [
   "Ajouter de l’interactivité à une page avec les directives",
   "Récupérer et afficher les données d’une API",
   "Partager un état entre composants avec les stores",
   "Étendre Alpine avec ses plugins"
  ],
  "program": [
   [
    "Prise en main",
    "L’environnement et une démonstration."
   ],
   [
    "Les directives",
    "Les données, les événements, l’affichage conditionnel et les boucles, directement dans le HTML."
   ],
   [
    "Les données",
    "Travailler avec une API et partager un état avec les stores."
   ],
   [
    "L’écosystème",
    "Les plugins, et le duo avec Tailwind CSS."
   ],
   [
    "Travaux pratiques",
    "Par exemple un accordéon ou des cartes à retourner, parmi d’autres exercices."
   ]
  ],
  "text": [
   "Alpine est une petite bibliothèque JavaScript qui ajoute du comportement directement dans le HTML : menus, onglets, fenêtres, filtres. Sans compilation ni architecture lourde, c’est la solution légère pour rendre interactive une page qui n’a pas besoin d’un framework complet."
  ]
 },
 "ci-cd": {
  "audience": [
   "Étudiants",
   "Développeurs",
   "Chefs de projet technique"
  ],
  "level": "Intermédiaire",
  "prerequisites": "Les bases de Git et GitHub.",
  "objectives": [
   "Écrire un workflow GitHub Actions",
   "Lancer automatiquement les tests, le linter et le build à chaque modification",
   "N’accepter une pull request que si toutes les vérifications passent",
   "Mettre en ligne automatiquement chaque version fusionnée",
   "Garder les secrets hors du code, et revenir à une version précédente en cas de problème"
  ],
  "program": [
   [
    "Les workflows",
    "Les déclencheurs, comme un push ou une pull request, les jobs et les étapes."
   ],
   [
    "Vérifier le code",
    "Lancer les tests, le linter et le build, et accélérer les workflows avec le cache."
   ],
   [
    "Protéger la branche principale",
    "Une pull request n’est fusionnée que si toutes les vérifications passent."
   ],
   [
    "Héberger une application",
    "La différence entre un site statique et une application avec un serveur, et les hébergeurs qui leur conviennent."
   ],
   [
    "Déployer automatiquement",
    "Relier un dépôt GitHub à Vercel ou à Render, déployer à chaque fusion, prévisualiser chaque pull request et relier un nom de domaine."
   ],
   [
    "Les secrets",
    "Donner à un workflow et à une application en ligne les clés dont ils ont besoin, sans les écrire dans le code."
   ],
   [
    "Surveiller et réparer",
    "Lire les journaux et revenir à une version précédente."
   ],
   [
    "Travaux pratiques",
    "Par exemple le chiffre de César : ses tests Cypress lancés à chaque modification, puis sa mise en ligne sur Vercel à chaque fusion, parmi d’autres exercices."
   ]
  ],
  "text": [
   "Plus une équipe attend pour vérifier son code, plus les erreurs coûtent cher à corriger, et une nouvelle version n’apporte rien tant qu’elle n’est pas en ligne. La CI / CD, c’est-à-dire l’intégration et le déploiement continus, automatise les deux : chaque modification est vérifiée, et chaque version validée est publiée, sans manipulation à la main. Ce module le met en place avec GitHub Actions, Vercel et Render, de la première vérification jusqu’au retour à une version précédente quand une mise en ligne se passe mal."
  ]
 },
 "claude-code": {
  "audience": [
   "Développeurs",
   "Équipes techniques"
  ],
  "level": "Intermédiaire",
  "prerequisites": "Les bases d’un langage de programmation et de Git.",
  "objectives": [
   "Installer et configurer Claude Code dans un projet",
   "Donner le bon contexte : instructions, conventions de l’équipe, mémoire",
   "Confier une tâche, relire et corriger le résultat",
   "Garder la maîtrise : permissions, revue de code et tests"
  ],
  "program": [
   [
    "Prise en main",
    "Installation, premiers échanges, lire et modifier un projet existant."
   ],
   [
    "Le contexte",
    "Les fichiers d’instructions, les conventions de l’équipe, découper une demande."
   ],
   [
    "Le travail au quotidien",
    "Corriger un bug, écrire des tests, refactoriser, documenter."
   ],
   [
    "Garder la maîtrise",
    "Permissions, relecture, revue de code et sécurité des données."
   ],
   [
    "Automatiser",
    "Commandes, agents et intégration dans le flux de travail de l’équipe."
   ],
   [
    "Travaux pratiques",
    "Concevoir une application de zéro avec Claude Code : écrire ses spécifications, la découper en étapes, livrer chaque étape dans une pull request vérifiée par l’intégration continue, et relire le travail de l’assistant comme celui d’un collègue."
   ]
  ],
  "text": [
   "Claude Code est un assistant de programmation qui travaille directement dans le projet. Ce module apprend à vos équipes à s’en servir avec méthode : lui donner le bon contexte, relire ce qu’il produit et garder la main sur la qualité."
  ]
 },
 "css": {
  "audience": [
   "Étudiants",
   "Webmasters",
   "Développeurs",
   "Chefs de projet technique"
  ],
  "level": "Débutant",
  "prerequisites": "Les bases du HTML.",
  "objectives": [
   "Cibler les éléments d’une page avec les sélecteurs",
   "Comprendre le modèle de boîte, la cascade et la spécificité",
   "Agencer une page avec Flexbox et Grid",
   "Adapter une page à tous les écrans"
  ],
  "program": [
   [
    "Les fondations",
    "L’intégration dans une page, les sélecteurs, le modèle de boîte, la cascade et la spécificité."
   ],
   [
    "La console développeur",
    "Voir quelle règle s’applique à un élément et pourquoi, visualiser ses marges et essayer un style en direct."
   ],
   [
    "La mise en forme",
    "Les couleurs, les polices, les unités de mesure et les dégradés."
   ],
   [
    "La mise en page",
    "L’agencement d’une page avec les boîtes flexibles (Flexbox) et la grille (Grid), pour tous les écrans."
   ],
   [
    "Les états et le mouvement",
    "Les pseudo-classes, les pseudo-éléments et les animations."
   ],
   [
    "Les frameworks CSS",
    "Bootstrap et Tailwind, pour comparer deux philosophies : des composants prêts à l’emploi ou des classes utilitaires."
   ],
   [
    "Travaux pratiques",
    "Le carré centré, puis la mise en forme de son propre portfolio, adapté à tous les écrans."
   ]
  ],
  "text": [
   "Le CSS décrit l’apparence d’une page : couleurs, typographie, mise en page. Bien compris, il permet d’adapter une même page à tous les écrans sans la réécrire. Ce module en pose les principes, dont la cascade et la spécificité, souvent sources de confusion, jusqu’aux mises en page modernes avec Flexbox et Grid."
  ]
 },
 "cypress": {
  "audience": [
   "Étudiants",
   "Testeurs",
   "Développeurs",
   "Chefs de projet technique"
  ],
  "level": "Intermédiaire",
  "prerequisites": "Les bases de JavaScript.",
  "objectives": [
   "Installer Cypress dans un projet existant",
   "Cibler les éléments d’une page et simuler les actions d’un utilisateur",
   "Lancer les tests dans l’intégration et le déploiement continus"
  ],
  "program": [
   [
    "Prise en main",
    "L’installation, une démonstration, puis un premier test."
   ],
   [
    "Les commandes",
    "Cibler et récupérer un élément, agir sur la page et vérifier le résultat."
   ],
   [
    "L’intégration et le déploiement continus",
    "Lancer les tests automatiquement à chaque modification, et ne mettre en ligne qu’une version qui les passe."
   ],
   [
    "Travaux pratiques",
    "Tester le chiffre de César et un composant Lightbox."
   ]
  ],
  "text": [
   "Cypress est un framework de tests en JavaScript qui pilote une application web comme le ferait un utilisateur : il clique, remplit les formulaires et vérifie ce qui s’affiche. Des tests automatisés permettent de livrer plus souvent, avec moins de régressions. Ce module apprend à les écrire et à les lancer à chaque modification, avant chaque mise en ligne."
  ]
 },
 "design-patterns": {
  "audience": [
   "Étudiants",
   "Développeurs"
  ],
  "level": "Intermédiaire",
  "prerequisites": "Les bases de la programmation orientée objet.",
  "objectives": [
   "Comprendre à quoi sert un design pattern, et quand ne pas en utiliser",
   "Reconnaître les patterns les plus courants dans un code existant",
   "Appliquer les patterns de création, de structure et de comportement",
   "Organiser une application selon l’architecture MVC"
  ],
  "program": [
   [
    "Créer des objets",
    "Singleton, Factory et Abstract Factory."
   ],
   [
    "Assembler des objets",
    "Adapter, Decorator et Facade."
   ],
   [
    "Faire communiquer des objets",
    "Observer, pour qu’un objet prévienne les autres de ses changements."
   ],
   [
    "L’architecture MVC",
    "Séparer les données, l’affichage et la logique d’une application."
   ],
   [
    "Travaux pratiques",
    "Un exercice court par pattern."
   ]
  ],
  "text": [
   "Les mêmes problèmes de conception reviennent d’un projet à l’autre, et des solutions éprouvées existent pour chacun : les design patterns. Les connaître, c’est gagner du temps, lire plus facilement le code des frameworks et partager un vocabulaire commun avec son équipe. Ce module présente les patterns les plus utiles au quotidien, sans en faire une fin en soi."
  ]
 },
 "django": {
  "audience": [
   "Étudiants",
   "Développeurs",
   "Chefs de projet technique"
  ],
  "level": "Intermédiaire",
  "prerequisites": "Les bases de Python. Des notions de HTML et de SQL sont un plus.",
  "objectives": [
   "Comprendre l’architecture MVT d’un projet Django",
   "Créer les vues et les templates d’une application",
   "Modéliser les données et les manipuler depuis le shell",
   "Gérer le contenu avec le site d’administration"
  ],
  "program": [
   [
    "Prise en main",
    "L’environnement, les projets et les applications, le modèle MVT."
   ],
   [
    "Les pages",
    "Les vues et les templates."
   ],
   [
    "Les données",
    "La base MySQL, les modèles et le shell de Django."
   ],
   [
    "L’administration",
    "Le site d’administration, pour gérer le contenu sans écrire de code."
   ],
   [
    "Travaux pratiques",
    "Par exemple une application CRUD ou une application de sondage, parmi d’autres exercices."
   ]
  ],
  "text": [
   "Django est un framework web Python qui encourage un développement rapide et une conception propre. Il prend en charge une grande partie du travail courant (les formulaires, la base de données, l’administration) pour que l’on se concentre sur l’application, sans réinventer la roue."
  ]
 },
 "git-github": {
  "audience": [
   "Étudiants",
   "Développeurs",
   "Chefs de projet technique"
  ],
  "level": "Débutant",
  "prerequisites": "Aucun.",
  "objectives": [
   "Suivre l’historique d’un projet avec des commits clairs",
   "Travailler en parallèle avec les branches, et résoudre les conflits",
   "Partager un projet sur GitHub et collaborer avec les pull requests et la revue de code",
   "Contribuer à un projet qui n’est pas le sien",
   "Revenir sur une erreur sans perdre son travail"
  ],
  "program": [
   [
    "Versionner",
    "D’où vient Git, le dépôt et ses trois zones, les commits, les messages de commit et l’historique."
   ],
   [
    "Les branches",
    "Créer une branche, fusionner, et résoudre les conflits."
   ],
   [
    "Réparer",
    "Défaire ce qui a été fait, selon que le travail est publié ou non."
   ],
   [
    "GitHub",
    "Le compte et la clé SSH, le dépôt distant, envoyer et recevoir, et rester à jour."
   ],
   [
    "Travailler en équipe",
    "La branche de fonctionnalité, la pull request, la revue de code et les issues."
   ],
   [
    "Contribuer",
    "Le fork et la contribution à un projet extérieur, et un dépôt présentable."
   ],
   [
    "Les outils",
    "La ligne de commande, l’interface de VS Code et GitHub Desktop."
   ],
   [
    "Travaux pratiques",
    "Par exemple Burgit, le site d’un restaurant et son menu, en deux parties : le dépôt local, puis les branches. Ou Pixel Forge, le site d’un studio de jeu monté à deux sur un vrai flux de branches."
   ]
  ],
  "text": [
   "Git garde la trace de chaque modification d’un projet et permet à plusieurs personnes d’y travailler en même temps sans écraser le travail des autres. Avec GitHub, il est devenu l’outil commun de presque toutes les équipes de développement. Ce module apprend à s’en servir au quotidien, en ligne de commande comme avec des interfaces graphiques, jusqu’à la collaboration par pull requests."
  ]
 },
 "html": {
  "audience": [
   "Étudiants",
   "Webmasters",
   "Développeurs",
   "Chefs de projet technique"
  ],
  "level": "Débutant",
  "prerequisites": "Savoir utiliser un ordinateur et un navigateur. Aucune connaissance en programmation.",
  "objectives": [
   "Situer le HTML parmi les langages du web",
   "Structurer une page avec les balises sémantiques",
   "Créer des formulaires et des tableaux lisibles par tous",
   "Intégrer des images, de l’audio et de la vidéo"
  ],
  "program": [
   [
    "Le web et ses langages",
    "Le rôle du HTML, du CSS et du JavaScript, l’environnement de travail et le modèle de départ d’une page."
   ],
   [
    "Les balises",
    "Les balises principales et génériques, puis les balises sémantiques du HTML5."
   ],
   [
    "La console développeur",
    "Inspecter une page dans le navigateur, retrouver une balise dans l’arbre du document et la modifier en direct."
   ],
   [
    "Les formulaires et les tableaux",
    "Recueillir des informations et présenter des données, de façon lisible par tous."
   ],
   [
    "Les médias",
    "Les images, l’audio et la vidéo."
   ],
   [
    "Travaux pratiques",
    "Réaliser son propre portfolio."
   ]
  ],
  "text": [
   "Le HTML est le langage qui structure toutes les pages web. Ce n’est pas un langage de programmation mais un langage de balisage : il donne à chaque contenu son sens (titre, paragraphe, lien, formulaire), ce qui rend une page lisible par les navigateurs, les moteurs de recherche et les technologies d’assistance. C’est le point de départ de tout parcours vers le développement web."
  ]
 },
 "javascript": {
  "audience": [
   "Étudiants",
   "Webmasters",
   "Développeurs",
   "Chefs de projet technique"
  ],
  "level": "Débutant",
  "prerequisites": "Les bases du HTML et du CSS. Aucune connaissance en programmation.",
  "objectives": [
   "Écrire un programme lisible : variables, conditions, boucles et fonctions",
   "Manipuler les tableaux et les objets, et les transformer avec map, filter et reduce",
   "Lire un message d’erreur et suivre un programme pas à pas dans la console"
  ],
  "program": [
   [
    "Les bases du langage",
    "L’environnement, les variables et les constantes."
   ],
   [
    "La console développeur",
    "Tester une ligne de code, afficher une valeur, lire un message d’erreur et suivre un programme pas à pas avec les points d’arrêt."
   ],
   [
    "Les tableaux et les objets",
    "Les ranger, les parcourir, et les décomposer avec la destructuration et le spread."
   ],
   [
    "La logique",
    "Les conditions, les boucles et les fonctions."
   ],
   [
    "Transformer les données",
    "Les fonctions de rappel, et les méthodes map, filter et reduce."
   ],
   [
    "Travaux pratiques",
    "Le chiffre de César."
   ]
  ],
  "text": [
   "JavaScript est le langage qui rend le web interactif. Exécuté par tous les navigateurs, il fonctionne aussi côté serveur avec Node.js : un seul langage pour tout le web, et une étape incontournable pour tout futur développeur. Ce module se concentre sur le langage lui-même, avant de s’en servir pour animer une page."
  ]
 },
 "laravel": {
  "audience": [
   "Étudiants",
   "Développeurs",
   "Chefs de projet technique"
  ],
  "level": "Intermédiaire",
  "prerequisites": "Les bases de PHP et de SQL. La programmation orientée objet est un plus.",
  "objectives": [
   "Comprendre l’architecture MVC d’une application",
   "Créer les routes, les contrôleurs et les vues",
   "Modéliser et manipuler les données avec Eloquent",
   "Construire des pages avec le moteur de templates Blade"
  ],
  "program": [
   [
    "Prise en main",
    "L’environnement, la structure d’un projet et le modèle MVC."
   ],
   [
    "Le routeur",
    "Relier une adresse à une action, avec des paramètres et des noms de routes."
   ],
   [
    "Les données",
    "La base MySQL, les migrations, les factories et les seeders, et l’ORM Eloquent."
   ],
   [
    "Les contrôleurs",
    "Recevoir une requête, interroger les données et renvoyer une réponse."
   ],
   [
    "Les vues",
    "Le moteur de templates Blade : l’affichage des données, les conditions et les boucles, les mises en page et les composants."
   ],
   [
    "Travaux pratiques",
    "Par exemple une application CRUD ou une application de sondage, parmi d’autres exercices."
   ]
  ],
  "text": [
   "Laravel est le framework PHP le plus utilisé pour construire des applications web. Il fournit une structure claire, le modèle MVC, et des outils prêts à l’emploi pour les routes, la base de données et les vues : on se concentre sur l’application elle-même."
  ]
 },
 "machine-learning": {
  "audience": [
   "Étudiants",
   "Développeurs Python"
  ],
  "level": "Intermédiaire",
  "prerequisites": "Les bases de Python.",
  "objectives": [
   "Comprendre ce qu’est le machine learning et quand l’utiliser",
   "Explorer et préparer des données avec pandas et Matplotlib",
   "Entraîner un modèle de régression ou de classification avec scikit-learn",
   "Évaluer un modèle et repérer le surapprentissage"
  ],
  "program": [
   [
    "Comprendre le machine learning",
    "Ce qu’un modèle apprend des données, l’apprentissage supervisé, et les problèmes où il est utile."
   ],
   [
    "Les outils",
    "Jupyter pour expérimenter, pandas pour manipuler les données, Matplotlib pour les visualiser."
   ],
   [
    "Préparer les données",
    "Explorer un jeu de données, le nettoyer et choisir les variables utiles."
   ],
   [
    "Régression et classification",
    "Prédire une valeur ou une catégorie avec scikit-learn."
   ],
   [
    "Évaluer un modèle",
    "Séparer les données d’entraînement et de test, mesurer l’erreur et éviter le surapprentissage."
   ],
   [
    "Travaux pratiques",
    "Par exemple estimer le prix d’un diamant à partir de ses caractéristiques, parmi d’autres exercices."
   ]
  ],
  "text": [
   "Le machine learning permet à un programme d’apprendre à partir d’exemples plutôt que de règles écrites à la main : prédire un prix, classer une demande, repérer une anomalie. Ce module montre, avec les outils de référence de Python, comment passer d’un jeu de données brut à un modèle évalué honnêtement. Les apprenants savent ensuite ce qu’un modèle peut promettre, et ce qu’il ne peut pas."
  ]
 },
 "merise": {
  "audience": [
   "Étudiants",
   "Développeurs",
   "Chefs de projet technique"
  ],
  "level": "Débutant",
  "prerequisites": "Aucun.",
  "objectives": [
   "Traduire un besoin en règles de gestion",
   "Recenser les données dans un dictionnaire de données",
   "Construire un modèle conceptuel des données avec ses cardinalités",
   "Passer du modèle conceptuel au modèle logique, puis au modèle physique",
   "Vérifier un modèle avec les contraintes d’intégrité et les formes normales"
  ],
  "program": [
   [
    "Les données",
    "De la donnée à l’information, la qualité des données et le modèle relationnel."
   ],
   [
    "Analyser le besoin",
    "Recueillir les règles de gestion, choisir une convention de nommage et recenser les données dans un dictionnaire, tenu dans un tableur."
   ],
   [
    "Le modèle conceptuel",
    "Les entités, les identifiants, les associations et les cardinalités, dessinés avec Looping."
   ],
   [
    "Le modèle logique",
    "Les règles de passage du modèle conceptuel aux tables, aux clés primaires et aux clés étrangères."
   ],
   [
    "Vérifier le modèle",
    "Les contraintes d’intégrité et les formes normales."
   ],
   [
    "Les cas particuliers",
    "La propriété portée, l’association réflexive, l’association ternaire et l’héritage."
   ],
   [
    "Le modèle physique",
    "Le schéma de la base, prêt à être créé, avec MySQL Workbench."
   ],
   [
    "Travaux pratiques",
    "Par exemple Spotilike : concevoir la base d’une plateforme de streaming musical, sans cahier des charges, parmi d’autres exercices."
   ]
  ],
  "text": [
   "Une base de données mal pensée se paie tout au long de la vie d’une application : données en double, incohérences, requêtes compliquées. Merise est une méthode éprouvée pour modéliser les données d’un projet avant d’écrire la moindre table. Ce module se concentre sur les données, du besoin exprimé par le client jusqu’au schéma prêt à être créé."
  ]
 },
 "methode-agile": {
  "audience": [
   "Tout public"
  ],
  "level": "Débutant",
  "prerequisites": "Aucun.",
  "objectives": [
   "Comprendre les valeurs et les principes de l’agilité",
   "Connaître les rôles, les événements et les artefacts de Scrum",
   "Écrire des user stories et les estimer en équipe",
   "Mener un projet par sprints, et suivre son avancement"
  ],
  "program": [
   [
    "L’agilité",
    "Les valeurs et les principes du Manifeste agile, et ce qu’ils changent dans un projet."
   ],
   [
    "Les rôles",
    "Le Product Owner, le Scrum Master et les développeurs."
   ],
   [
    "Les artefacts",
    "Le backlog produit, le backlog de sprint et l’incrément."
   ],
   [
    "Les user stories",
    "Les écrire, les ordonner, et les estimer en story points."
   ],
   [
    "Les événements",
    "Le sprint, sa planification, la mêlée quotidienne, la revue et la rétrospective."
   ],
   [
    "Suivre l’avancement",
    "La vélocité, le burndown chart, et un tableau de suivi sur Trello ou GitHub Projects."
   ],
   [
    "Kanban",
    "Une autre façon d’organiser le flux du travail, et ce qui fait échouer l’agilité."
   ],
   [
    "Travaux pratiques",
    "Un projet fil rouge mené en équipe, sprint après sprint : par exemple bâtir une ville en briques de construction pour un client exigeant."
   ]
  ],
  "text": [
   "Les projets changent en cours de route, et les méthodes qui figent tout au départ s’adaptent mal. L’agilité propose d’avancer par petites étapes, en livrant souvent et en ajustant le cap avec le client. Ce module la fait découvrir par la pratique : les apprenants mènent un projet fil rouge avec Scrum, ses rôles et ses rituels, et vivent de l’intérieur ce qui fait une équipe efficace."
  ]
 },
 "mysql": {
  "audience": [
   "Étudiants",
   "Administrateurs de bases de données",
   "Développeurs",
   "Chefs de projet technique"
  ],
  "level": "Débutant",
  "prerequisites": "Aucune connaissance des bases de données. Une première expérience de la programmation est un plus.",
  "objectives": [
   "Créer une base de données à partir de son modèle",
   "Lire, filtrer, trier et regrouper des données en SQL",
   "Reconstituer l’information de plusieurs tables avec les jointures",
   "Ajouter, modifier et supprimer des données sans rien casser",
   "Faire évoluer la structure d’une base"
  ],
  "program": [
   [
    "De la conception à l’exploitation",
    "L’environnement de travail, et le script de création de la base tiré de son modèle physique."
   ],
   [
    "Lire des données",
    "SELECT, le filtre WHERE, trier et limiter les résultats."
   ],
   [
    "Compter et regrouper",
    "Les fonctions d’agrégation et GROUP BY."
   ],
   [
    "Joindre des tables",
    "INNER JOIN, et l’ordre dans lequel une requête s’exécute."
   ],
   [
    "Écrire des données",
    "Insérer, modifier et supprimer des lignes avec INSERT, UPDATE et DELETE."
   ],
   [
    "Altérer la structure",
    "Créer les tables avec CREATE, puis les faire évoluer avec ALTER et DROP."
   ],
   [
    "Travaux pratiques",
    "Par exemple Pixel Arena, la base d’une ligue étudiante de jeux vidéo, ou Base Ares, le journal de bord d’une base sur Mars : d’abord la lire, puis la tenir à jour."
   ]
  ],
  "text": [
   "Les bases de données relationnelles sont au cœur de la plupart des applications, et SQL est le langage pour les interroger. Ce module part d’un modèle déjà conçu pour créer la base, puis apprend à lire, croiser et modifier ses données : les gestes de tous les jours, qui servent ensuite avec n’importe quel moteur."
  ]
 },
 "php": {
  "audience": [
   "Étudiants",
   "Webmasters",
   "Développeurs",
   "Chefs de projet technique"
  ],
  "level": "Débutant",
  "prerequisites": "Les bases du HTML. Une première expérience de la programmation est un plus.",
  "objectives": [
   "Écrire un programme lisible : variables, conditions, boucles et fonctions",
   "Traiter les données d’un formulaire",
   "Reconnaître un visiteur avec la session et les cookies",
   "Construire un gabarit de page dynamique"
  ],
  "program": [
   [
    "Les bases du langage",
    "L’environnement et l’intégration dans une page, les variables, les constantes et les tableaux."
   ],
   [
    "La logique",
    "Les conditions, les boucles et les fonctions."
   ],
   [
    "Le dialogue avec le visiteur",
    "Les variables superglobales, les formulaires, la session et les cookies."
   ],
   [
    "Les fichiers",
    "Lire et écrire des fichiers sur le serveur."
   ],
   [
    "Travaux pratiques",
    "Par exemple un gabarit de page dynamique ou le jeu du « Plus ou moins », parmi d’autres exercices."
   ]
  ],
  "text": [
   "PHP est le langage côté serveur d’une grande partie du web, de WordPress aux applications Laravel. Il permet de traiter un formulaire, de reconnaître un visiteur et de construire une page à partir de données. Ce module se concentre sur les bases du langage, pour comprendre ce qui se passe entre le navigateur et le serveur."
  ]
 },
 "poo": {
  "audience": [
   "Étudiants",
   "Développeurs"
  ],
  "level": "Intermédiaire",
  "prerequisites": "Les bases d’un langage de programmation.",
  "objectives": [
   "Modéliser un problème en classes et en objets",
   "Protéger l’état d’un objet grâce à l’encapsulation",
   "Réutiliser du code avec l’héritage et le polymorphisme",
   "Définir des contrats avec les classes abstraites et les interfaces"
  ],
  "program": [
   [
    "Classes et objets",
    "Les attributs, les méthodes, les constructeurs, et la différence entre une classe et ses instances."
   ],
   [
    "L’encapsulation",
    "La visibilité des membres et les accesseurs, pour qu’un objet garde un état cohérent."
   ],
   [
    "Les membres statiques",
    "Les attributs et les méthodes qui appartiennent à la classe plutôt qu’à ses objets."
   ],
   [
    "L’héritage et le polymorphisme",
    "Spécialiser une classe, redéfinir ses méthodes et traiter des objets différents de la même façon."
   ],
   [
    "Les contrats",
    "Les classes abstraites et les interfaces."
   ],
   [
    "Travaux pratiques",
    "En Python ou en PHP, par exemple un mini RPG : la fiche d’un personnage, puis sa compagnie, puis sa sauvegarde, parmi d’autres exercices."
   ]
  ],
  "text": [
   "La programmation orientée objet (POO) est la façon d’organiser le code de la plupart des applications d’aujourd’hui. Elle découpe un programme en objets qui réunissent des données et les actions sur ces données, pour un code plus clair et plus facile à faire évoluer. Ce module en enseigne les notions en Python ou en PHP : elles se transposent ensuite dans tous les langages objet."
  ]
 },
 "postgresql": {
  "audience": [
   "Étudiants",
   "Administrateurs de bases de données",
   "Développeurs",
   "Chefs de projet technique"
  ],
  "level": "Débutant",
  "prerequisites": "Aucune connaissance des bases de données. Une première expérience de la programmation est un plus.",
  "objectives": [
   "Créer une base PostgreSQL et la lire, l’écrire et la modifier en SQL",
   "Tirer parti des types de PostgreSQL, comme JSONB et les tableaux",
   "Écrire des requêtes plus lisibles avec les sous-requêtes et les CTE",
   "Automatiser avec les vues, les fonctions en PL/pgSQL et les déclencheurs",
   "Protéger les données avec les rôles, les droits et les sauvegardes"
  ],
  "program": [
   [
    "Le modèle relationnel",
    "Les outils, pgAdmin ou DBeaver, l’architecture d’une base, les tables et leurs relations."
   ],
   [
    "Interroger les données",
    "Lire, écrire, modifier et supprimer des données, avec les jointures et les sous-requêtes."
   ],
   [
    "Les forces de PostgreSQL",
    "Les types riches, comme JSONB et les tableaux, et les CTE (WITH) pour découper une requête complexe."
   ],
   [
    "Programmer la base",
    "Les vues, les fonctions en PL/pgSQL et les déclencheurs."
   ],
   [
    "Administrer",
    "Les rôles, les droits et la sauvegarde d’une base."
   ],
   [
    "Travaux pratiques",
    "Par exemple la base de données d’une plateforme de streaming musical, parmi d’autres exercices."
   ]
  ],
  "text": [
   "PostgreSQL est une base de données libre, réputée pour sa fiabilité et sa richesse, de plus en plus choisie par les entreprises et les hébergeurs. Ce module apprend le SQL avec elle, puis montre ce qui la distingue : des types de données plus riches, des requêtes plus expressives et une programmation plus complète de la base."
  ]
 },
 "principes-solid": {
  "audience": [
   "Étudiants",
   "Développeurs"
  ],
  "level": "Intermédiaire",
  "prerequisites": "Les bases de la programmation orientée objet.",
  "objectives": [
   "Reconnaître un code difficile à faire évoluer",
   "Appliquer chacun des cinq principes SOLID",
   "Refactoriser un code existant sans changer son comportement",
   "Situer SOLID parmi les autres principes de conception"
  ],
  "program": [
   [
    "Ce que SOLID essaie de sauver",
    "Le code qui se rigidifie, et le coût de chaque changement."
   ],
   [
    "Responsabilité unique",
    "Une classe, une seule raison de changer."
   ],
   [
    "Ouvert et fermé",
    "Ajouter un comportement sans modifier le code qui fonctionne déjà."
   ],
   [
    "Substitution de Liskov",
    "Des classes filles qui tiennent les promesses de leur classe mère."
   ],
   [
    "Ségrégation des interfaces",
    "Des interfaces petites et précises plutôt qu’une seule qui fait tout."
   ],
   [
    "Inversion des dépendances",
    "Dépendre d’abstractions plutôt que de classes concrètes."
   ],
   [
    "En pratique",
    "Les cinq principes ensemble, ce qui fait mal quand on les applique, et pour aller plus loin DRY, KISS, YAGNI et la loi de Déméter."
   ],
   [
    "Travaux pratiques",
    "Cinq refactorings, pour observer la plus-value de chaque principe."
   ]
  ],
  "text": [
   "Un code qui fonctionne aujourd’hui peut devenir un frein demain, quand chaque modification en casse une autre. Les cinq principes SOLID donnent des repères simples pour organiser un code objet qui reste facile à comprendre, à tester et à faire évoluer. Ce module les présente un par un, chacun avec un exemple qui le viole puis sa correction."
  ]
 },
 "prompt-engineering": {
  "audience": [
   "Tout public"
  ],
  "level": "Débutant",
  "prerequisites": "Aucun.",
  "objectives": [
   "Comprendre comment un modèle de langage produit ses réponses, et pourquoi il se trompe",
   "Écrire une demande claire, avec un rôle, du contexte et des exemples",
   "Obtenir une réponse dans le format attendu",
   "Vérifier une réponse avant de s’en servir"
  ],
  "program": [
   [
    "Comprendre les modèles",
    "Ce que fait un modèle de langage, ses forces, et pourquoi il invente parfois."
   ],
   [
    "Écrire une demande",
    "Donner un rôle, du contexte et des exemples, découper une tâche et imposer un format de réponse."
   ],
   [
    "Itérer et vérifier",
    "Améliorer une demande à partir de la réponse, et faire vérifier un résultat."
   ],
   [
    "Les limites",
    "Les erreurs, les biais et les données à ne jamais confier à un outil en ligne."
   ],
   [
    "Travaux pratiques",
    "Avec ChatGPT, Claude ou Mistral, par exemple améliorer pas à pas un prompt, de la demande vague à la réponse fiable, parmi d’autres exercices."
   ]
  ],
  "text": [
   "Les outils d’IA répondent à tout, mais la qualité de leurs réponses dépend beaucoup de la façon dont on les interroge. Le prompt engineering est l’art de formuler une demande claire, avec le bon contexte, pour obtenir une réponse utile et vérifiable. Ce module donne des méthodes simples, valables quel que soit l’outil, et apprend à garder un regard critique sur ce qu’il produit."
  ]
 },
 "python": {
  "audience": [
   "Étudiants",
   "Data scientists",
   "Développeurs",
   "Chefs de projet technique"
  ],
  "level": "Débutant",
  "prerequisites": "Aucune connaissance en programmation.",
  "objectives": [
   "Écrire un programme lisible : variables, conditions, boucles et fonctions",
   "Choisir la bonne structure de données : listes, tuples, ensembles et dictionnaires",
   "Comprendre la portée des variables",
   "Gérer les erreurs et manipuler des fichiers"
  ],
  "program": [
   [
    "Les bases du langage",
    "L’environnement, afficher et saisir, les variables et leurs types."
   ],
   [
    "La logique",
    "Les conditions, les boucles, les fonctions et la portée des variables."
   ],
   [
    "Les structures de données",
    "Les listes, les tuples, les ensembles et les dictionnaires."
   ],
   [
    "Un programme solide",
    "La gestion des exceptions et la manipulation de fichiers."
   ],
   [
    "Travaux pratiques",
    "Par exemple le jeu du « Plus ou moins », le chiffre de César, le shifumi ou FizzBuzz, parmi d’autres exercices."
   ]
  ],
  "text": [
   "Python est l’un des langages les plus utilisés au monde, du script d’automatisation à l’analyse de données. Sa syntaxe simple en fait un excellent premier langage, et sa polyvalence un outil durable. Ce module en pose les bases, des premières variables jusqu’à un programme qui gère ses erreurs et ses fichiers."
  ]
 },
 "robomind": {
  "audience": [
   "Étudiants"
  ],
  "level": "Débutant",
  "prerequisites": "Aucun.",
  "objectives": [
   "Comprendre ce qu’est un algorithme",
   "Décomposer un problème en instructions simples",
   "Utiliser les conditions et les répétitions",
   "Se préparer à un premier langage de programmation"
  ],
  "program": [
   [
    "L’algorithmique",
    "Ce qu’est un programme, et comment décrire une solution pas à pas."
   ],
   [
    "Le robot",
    "L’installation de RoboMind, les instructions et les capteurs du robot."
   ],
   [
    "La logique",
    "Les conditions et les boucles, pour un robot qui s’adapte à son terrain."
   ],
   [
    "Entraînement",
    "Des cartes de difficulté croissante, du premier trajet aux labyrinthes."
   ],
   [
    "Travaux pratiques",
    "Manipuler le robot."
   ]
  ],
  "text": [
   "RoboMind est un petit environnement où l’on programme un robot virtuel pour le faire avancer, contourner des obstacles et atteindre un but.",
   "Sans syntaxe à mémoriser, les apprenants découvrent en douceur ce qu’est un algorithme : une suite d’instructions, des conditions et des répétitions. Une première marche idéale avant un vrai langage."
  ]
 },
 "uml": {
  "audience": [
   "Étudiants",
   "Développeurs",
   "Chefs de projet technique"
  ],
  "level": "Intermédiaire",
  "prerequisites": "Les bases de la programmation orientée objet.",
  "objectives": [
   "Décrire ce qu’attendent les utilisateurs avec les cas d’utilisation",
   "Représenter la structure d’un logiciel avec les diagrammes de classes et de composants",
   "Décrire un comportement avec les diagrammes de séquence et d’activité",
   "Écrire des diagrammes en texte, à côté du code, pour les tenir à jour"
  ],
  "program": [
   [
    "Les besoins",
    "Les diagrammes de cas d’utilisation, pour s’accorder avec le client sur ce que fait le logiciel."
   ],
   [
    "La structure",
    "Les diagrammes de classes, puis de composants pour la vue d’ensemble."
   ],
   [
    "Le comportement",
    "Les diagrammes de séquence et d’activité."
   ],
   [
    "Les outils",
    "PlantUML et Mermaid pour écrire les diagrammes en texte, et Claude Code pour les générer et les relire."
   ],
   [
    "Travaux pratiques",
    "Par exemple l’application de réservation d’un escape game, des cas d’utilisation jusqu’aux composants, parmi d’autres exercices."
   ]
  ],
  "text": [
   "Un schéma clair évite bien des malentendus entre le client, l’équipe et le code. UML est le langage commun pour dessiner un logiciel : ce qu’il fait, comment il est construit et comment ses parties échangent. Ce module se concentre sur les diagrammes utiles au quotidien, écrits en texte pour vivre avec le code plutôt que dans un document oublié."
  ]
 },
 "vue": {
  "audience": [
   "Étudiants",
   "Développeurs",
   "Chefs de projet technique"
  ],
  "level": "Intermédiaire",
  "prerequisites": "Les bases du HTML, du CSS et de JavaScript.",
  "objectives": [
   "Découper une interface en composants",
   "Relier les données à la page avec la réactivité",
   "Créer une application de plusieurs pages avec Vue Router",
   "Partager l’état de l’application avec Pinia et le relier à une base de données"
  ],
  "program": [
   [
    "Prise en main",
    "L’environnement, une démonstration et la structure d’un projet."
   ],
   [
    "Les fondamentaux",
    "Les composants, les directives, la réactivité et les événements."
   ],
   [
    "Les pages",
    "La navigation entre les pages avec Vue Router."
   ],
   [
    "Les données",
    "L’état partagé de l’application avec Pinia, et une base de données en ligne avec Firebase."
   ],
   [
    "Travaux pratiques",
    "Par exemple une liste de courses ou un forum, parmi d’autres exercices."
   ]
  ],
  "text": [
   "Vue est un framework JavaScript pour construire des interfaces à partir de composants. Il s’appuie sur le HTML, le CSS et le JavaScript que l’on connaît déjà, et rend une interface réactive : quand les données changent, la page suit. Ce module mène jusqu’à une application complète, avec ses pages et ses données partagées."
  ]
 }
};
