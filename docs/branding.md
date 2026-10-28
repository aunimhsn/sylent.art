# Branding

The visual identity of sylent.art and every design decision taken with the owner during the mock-up (step 4 of [roadmap.md](../roadmap.md)). The build (steps 6 to 11) implements exactly these tokens and rules, in one place, so that a color or a size changes in one file.

- **Reference**: the mock-up in [docs/mockups/](mockups/) (`python3 docs/mockups/serve.py 8781`, then http://127.0.0.1:8781/docs/mockups/home.html). The wireframes only fixed the first layout; where this file and the mock-up disagree, the mock-up wins and this file is fixed.
- **Status**: home, contact and offer list decided on 2026-10-27 and 2026-10-28; the offer page, the about page and the legal page are still to be designed.
- **Content rules** (audiences, wording, French typography, no rates) are in [specs.md](../specs.md); this file covers the look and the behavior only.

## Principles

1. **Night**: neutral blacks without a blue tint, white as the main accent, sharp corners. Professional and calm, for schools and training organizations.
2. **One signal color**: the orange `--signal` is rare and always means something: what moves, what is aimed at, what succeeds, what is new. It never colors a whole block, a field or a focus ring.
3. **A pedagogue, not a « field developer »**: no monospace labels, no code look, no arrows on the buttons, no tags of technologies on the cards.
4. **Alive but quiet**: white line-art animations, slow, that explain the subject of each domain; nothing blinks for attention, and nothing moves for a visitor who asked to reduce motion.
5. **The former site's signature**: a title over a large faded word for the section headings, the motto « Une vie, mille leçons », the back-to-top square.

## Logo

- The **mark** (three slanted bars forming an S, `logo-sylent.svg` of the charter of sylent-courses) and the **wordmark** « SYLENT » (Montserrat 800, letter spacing -0.195 em), both white on the dark background.
- The wordmark is drawn as an SVG path, so that the site loads no third font for it.
- Header: mark and wordmark side by side, mark 34 px high, gap one third of the mark, letters half of its height.
- Footer: the wordmark alone, large (`clamp(220px, 38vw, 490px)` wide), set astride the edge between the call to action and the footer.

## Colors

Tokens of `:root[data-theme="night"]` (`docs/mockups/shared/site.css`). Contrasts are measured on `--bg`.

| Token | Value | Use | Contrast |
|---|---|---|---|
| `--bg` | `#0a0a0a` | Page background | |
| `--bg-alt` | `#0d0d0d` | Call to action band | |
| `--panel` | `#171717` | Solid panels | |
| `--text` | `#ffffff` | Text, titles, icons | 19.8:1 |
| `--secondary` | `#a3a3a3` | Body text, leads, navigation | 7.9:1 |
| `--dim` | `#858585` | Small labels, footer headings, copyright | 5.4:1 |
| `--highlight` | `#a3a3a3` | The second half of the hero headline | 7.9:1 |
| `--line` | `#262626` | Rules, borders between items | |
| `--line-strong` | `#404040` | Outline buttons, link underlines | |
| `--accent` | `#ffffff` | Main buttons, the « Voir les modules » band | |
| `--on-accent` | `#0a0a0a` | Text on the accent | 19.8:1 |
| `--signal` | `#d3450e` | The orange (see [The orange](#the-orange)) | white on it 4.54:1 |
| `--signal-text` | `#f07a4a` | The same orange, lighter, for text on the backgrounds: « Copiée », the errors under a field | 7.2:1 |
| `--new-bg` / `--new-text` | `--signal` / `#ffffff` | « Nouveau » badge | 4.54:1 |
| `--ghost-word` | `#181818` | The large faded words, opaque so that overlapping letters keep one tone | decorative |
| `--glass` / `--glass-hover` | white at 3.5 % / 6 % | Card background, at rest and under the pointer | |
| `--glass-line` | white at 9 % | Glass border | |
| `--spot` | white at 9 % | The light that follows the pointer on a card | |
| `--grid-line` | white at 5 % | The lines of the grid textures | |
| `--header-bg` | `#0a0a0a` at 72 % | Header once the page scrolls, with a 16 px blur | |
| Field fill | `#050505` | Contact fields, a gray darker than the page (chosen among six) | |

The orange went through `#ff6a00`, then `#d9480f` (chosen by eye), then `#d3450e`, which looks the same and gives its white text the 4.5:1 of WCAG AA. As text on black it reaches only 4.36:1, hence `--signal-text` for small text.

On 2026-10-28 three redder colors were compared, for fear of looking like the brand Orange (`#ff7900`): vermilion `#d63c1c`, tomato `#d4352a`, red `#d42a2a`. The orange was kept: its hue (17°) is already far from the brand Orange (28°) and it is used only in small touches, while in a development course red means an error, a failing test or a deleted line, which would blur the brand in the course materials.

## Typography

- **Titles and interface**: Manrope (SIL Open Font License), weights 200 to 800; titles in 800 with a letter spacing of -0.045 em.
- **Text**: Anaheim medium (500, SIL Open Font License), chosen after comparing Roboto, Open Sans, Google Sans, Alegreya Sans, Roboto Condensed and Anaheim. Anaheim has no italic: the browser slants it.
- **Numerals of the pedagogy**: Bodoni Moda 400 (SIL Open Font License), for the Roman numerals I to IV of the steps (home and about pages), chosen after comparing Manrope, Cinzel, Cormorant Garamond, Instrument Serif and Fraunces: its strong contrast answers the thin and bold Manrope. The one exception to the two fonts: only its letters I, V and X are loaded (`text=IVX` on Google Fonts, a subset of a few kilobytes once self-hosted).
- The fonts are self-hosted by the site (Google Fonts in the mock-up only), loaded with `font-display: block`.

| Role | Font | Size / line height | Notes |
|---|---|---|---|
| Hero headline | Manrope 800 | `clamp(44px, 6.8vw, 92px)` / 0.98 | Balanced lines; its end in `--highlight` |
| Section title | Manrope 800 | `clamp(32px, 5.4vw, 68px)` / 1 | Uppercase, over its faded word, without accents: the mask of its animation would cut them (« DANS LE MEME DOMAINE »); its accessible name keeps them |
| Faded word | Manrope 800 | `clamp(58px, 13vw, 176px)` / 0.8 | Uppercase, -0.06 em, `--ghost-word` |
| Call to action | Manrope 800 | `clamp(38px, 6vw, 76px)` / 1 | Two lines, balanced |
| Lead | Anaheim 500 | 18 px | `--secondary`, at most 58 characters wide |
| Body | Anaheim 500 | 17 px / 1.6 | |
| Card title | Manrope 700 | 21 px / 1.2 | -0.025 em |
| Step numeral | Bodoni Moda 400 | 64 px / 1 | Roman numerals I to IV, decorative (`aria-hidden`) |
| Card text | Anaheim 500 | 15.5 px / 1.55 | `--secondary` |
| Domain of a module | Manrope 600 | 14 px | `--dim`, just under the module name |
| Navigation | Manrope 600 | 15 px | `--secondary`, white on hover |
| Mobile menu | Manrope 800 | 40 px | Uppercase |
| Button | Manrope 700 | 15 px (14 px in the header) | |
| Small heading (footer, « Autres moyens ») | Manrope 800 | 12–13 px | Uppercase, 0.14 em; white in the footer, above its gray links, `--dim` elsewhere |
| Badge « Nouveau » | Manrope 800 | 11 px | Uppercase, 0.1 em |

## Layout and shapes

- Content width 1200 px, side gutter `clamp(20px, 5vw, 80px)`; header 76 px high; sections `clamp(80px, 11vw, 140px)` apart.
- Corners: 0 for buttons and cards, 2 px for the fields, round chips (`999px`).
- Every page works at 390 px wide; the mock-up shows each page at 390 × 844 and 1280 × 800.

## Components

- **Header**: fixed, transparent over the top of the page, then `--header-bg` with a blur and a bottom rule once the page scrolls; it hides while scrolling down and comes back when scrolling up. Navigation: Formations, À propos (Articles after the launch); no Contact link, since the white « Me contacter » button leads there.
- **Mobile menu**: full screen, opened by a circle that grows from the burger; large uppercase links, the button, the motto at the bottom; Escape closes it.
- **Buttons**: white and sharp (`--accent`); outlined variant with `--line-strong`, white border on hover. No glow, no arrow. The main buttons are magnetic under the mouse.
- **Text link**: Manrope 700 with a 1 px underline in `--line-strong`, white on hover.
- **Section heading**: a title over a large faded word, as on the former site. The words: Partenaires / Confiance, Pour qui ? / Collaborer, Formations / Apprendre, Pédagogie / Accompagner, Qui suis-je ? / Transmettre, Contact / Echanger (without its accent, which rose above the title), Dans le même domaine / Explorer (module page), and Echanger behind the call to action.
- **Module page**: a hero over the grid and its fluid; on the left the breadcrumb, the domain in small capitals (with « Nouveau » for a new one), a large title, a paragraph that says what the subject is and why it matters, written for pedagogical teams rather than as a list of notions; for a module of a new domain, a short note under it, with a 3 px left border in `--signal` on an 8 % tint of it (« Une offre nouvelle, centrée sur la méthode… »); and a single outline button « Voir le programme » (« Me contacter » is already in the header and beside the program). No scene in the hero: the grid and its fluid are enough, and the scenes stay on the cards. Then the key facts (public, level, duration, formats) as columns under a rule; the prerequisites, the objectives with a check in an outlined square, and the program in parts without numbers (they are not an order, and the practice comes when it is needed), whose rules draw themselves; a glass card « Organiser ce module » that follows the scroll on a computer; the other modules of the domain under « Dans le même domaine », followed by the card « Un besoin sur mesure ? » that leads to the contact page; the call to action.
- **Motto**: « Une vie, mille leçons » after a 40 px rule, in `--dim`, never in italics (hero, footer, mobile menu).
- **Cards of the domains and modules**: glass, no border, no icon, no tags. A 3:2 animated cover across the top (see [Covers](#animated-covers)), the title, a short sentence that says what the domain or module is for (not a list of the notions of its program; no lone word on its last line), and a white band at the bottom (« Voir les modules » for a domain, « Voir le détail » for a module) that makes the whole card a link. Under the pointer the band grows a little. A module card tilts (7°) and a light follows the pointer. A domain card of the home page turns half a turn instead (0.8 s, one smooth movement, from wherever it stands, also with the keyboard focus) and shows its modules on its back, name and line of program, without any heading: from three modules they scroll up without end over the whole height above the band, as the partners on a phone, repeated as much as needed to loop without a gap; one or two modules are simply listed, centered. The hover is decided by the place of the card in the grid, so that the thin turning card doesn't flicker. The band stays in place on both sides. Touch screens don't turn the cards. Grid: 1, 2 then 4 columns (640 px, 1100 px).
- **Custom card « Un besoin sur mesure ? »**: after the domains of the home page, a band across its own row, without glass or scene; its text sits in a dashed frame (`--line-strong`), open on the side of the white button so that no dashes run over it, that turns white (`--text`) under the pointer; the arrow of its white button moves forward instead of the button growing (no arrow on a phone). From two columns the button is a column on the right, as wide as the cards above it (a subgrid); on a phone it is a band at the bottom. After the modules (module page) it stays a card like the others, glass and scene.
- **Badge « Nouveau »**: white on orange, square, in the top left corner of the cover; for the new domain (IA pour le développement) and its modules.
- **Audiences**: plain columns under a rule, no cards.
- **Pedagogy**: the steps numbered in Roman numerals (Bodoni Moda), a rule that draws itself as the page scrolls, the title and the text. On the home page, with the cycle of a lesson: from 1100 px, the four steps two by two on the left, without background, and the cycle on the right; on a phone, the cycle after the steps. The about page keeps the steps alone.
- **Cycle of a lesson** (home page): a 3D spiral (`spiral` in `shared/covers.js`), chosen after a flat circle and a ring in three blocks. Each turn is a session of theory 20 %, practice 50 % and correction 30 %, marked by small dots; the spiral climbs without end, 10 s a turn: it slides down as the runner climbs, and fades out toward the bottom and in toward the top (a mask on the canvas), where the turns are swapped without seam; the turns done in white, the session under way lit in `--signal` behind the runner, the turns to come faint, the marks of the phases brighter once passed. Under the orange runner, the name of the phase and its share counting up (« Pratique 26 % »), in the style of « Copiée » (Anaheim 15 px, `--signal-text`), shown for the length of its phase. At each new turn, « Séance suivante » comes out of the runner softly (from a slight blur, 0.8 s), above it, rests a moment at full opacity, then fades slowly as it rises (3.2 s in all, ease-in-out). No caption and no legend; a hidden sentence describes the cycle to screen readers. Without motion, the scene stands still on the practice.
- **Partners**: logos traced into white SVG, each sized by 1 / √(width / height) so that wide and square logos look as heavy; one row from 760 px, a vertical reel of three on phones, where each logo moves away toward the back at the top.
- **Call to action**: a band in `--bg-alt` with its faded word, two wide lines (« Un module à confier ? / Parlons de vos apprenants. », or a question of the page) and the button; no promise of a response time.
- **Footer**: the wordmark astride its top edge, a 40 px grid whose first line is the top edge (no border), four columns (motto and line, navigation, contact, information), copyright line. Links turn orange on hover.
- **Back to top**: a 48 px square with a chevron, bottom right, once the first screen is passed; it brings the focus back to the logo.
- **Contact form**: two fields only (email, message), flat, filled with `#050505`, 2 px corners, no panel. No focus ring: a thick white caret (3 px, drawn by the script, native caret on touch screens, while composing and in forced colors) and the label lighting up show the focus. Errors are only a message under the field, in `--signal-text`; the fields themselves don't change. The scrollbar of the message is a thin white bar, square, shown only while scrolling. A failure is a note with an orange left border and the email address in bold, without a final period. A sent message shows a white check in an orange outlined square on black.
- **About page**: a hero over the grid, everything on the left, without portrait, small capitals or motto: the name as large as a module title, the role and two paragraphs of background; the three figures of the home page, larger (up to 72 px), which count up; « Pédagogie » over « Accompagner » with the four steps of the home page; « Partenaires » over « Confiance » with the logos, as on the home page; a glass panel « Informations administratives » (status, SIRET, NDA, the sentence on the agrément, a link to the legal notice); the call to action. The figures, the steps and the partners are shared with the home page (`shared/site.js`).
- **Text pages** (legal notice, privacy policy): a section heading over the grid of the hero (Mentions légales / Informer, Confidentialité / Proteger), a lead and the date of the last update; then sections under thin rules, without numbers, beside a table of contents that follows the scroll on a computer, where the section being read is marked by a short `--signal` line (hidden on a phone). The essentials of the privacy policy as three small glass cards (a title and a sentence), one under the other on a phone, side by side from 760 px. Facts as a label (small capitals, `--dim`) over its value, under rules; a detail still to provide in `--dim` italics; links in white without underline, `--signal` under the pointer.
- **Not-found page**: the grid and its fluid over the window, a heading whose faded word is « 404 », larger than the others (`clamp(150px, 34vw, 420px)`), the title « Oups, perdu dans l’espace » (as on the former site; « Page introuvable » below 640 px, for lack of room) over its lower part, two short sentences, on two lines from 640 px and two buttons, « Retour à l'accueil » (white) and « Voir les formations » (outline).
- **Contact details**: a click on the email address copies it and shows the word « Copiée » in orange, rising then fading (a screen reader hears « Adresse email copiée »); the phone number is a link only on touch screens; LinkedIn and GitHub open in a new tab, announced « [nouvel onglet] ».

## Textures

- **Grid**: 1 px lines in `--grid-line`, every 32 px at the top of the pages (the hero of the home page, the top of the contact and offer list pages), every 40 px in the footer. At the top of the pages it fades out with a mask (radial in the hero, downward elsewhere), before the first content block.
- **Orange fluid**: under the pointer, an orange fluid runs along the lines of each grid. Each crossing holds some energy: the pointer pours it into the crossings around it, more as it moves faster, the energy spreads to the neighbors and fades. On the page tops the fluid lies under the same mask as the grid, so it fades out with it.
- No gradients, no colored lights behind the sections, no turning glows.

## Motion

GSAP (ScrollTrigger, SplitText) and Three.js; the site bundles them.

- **Reveals**: blocks rise 36 px and fade in, in small batches, as they enter the screen.
- **Headings**: the words of a title rise from behind a mask; the faded word slides slowly with the scroll.
- **Hero**: the headline rises line by line, then the text, the buttons and the motto.
- **Hero cube**: a figure or a quality on each face (« Pourquoi ? », « 900+ h », « Patience », « 2021 », « Bienveillance », « 5 »). It presents its faces one after the other, squarely; under the mouse it follows the pointer, then resumes from the nearest face; a drag spins it; the scroll turns it a little more. Around it, a larger shell turns on its own: its edges only, in translucent orange (40 %), so that the cube shows clearly inside.
- **Figures** count up; **pedagogy rules** draw themselves.
- **Reduced motion** (the system setting, or `?motion=off` in the mock-up): nothing moves, every block is shown, the 3D scenes draw one still frame.

## Animated covers

Every domain and every module has a small Three.js scene across the top of its card (`docs/mockups/shared/covers.js`), drawn by one shared renderer and animated only while on screen; a card under the pointer plays faster.

- **Style**: white line art and white dots on a `#101010` cover with a faint 24 px grid; solid shapes are filled with `#151515` and outlined in white; slow movements, a gentle sway of the whole scene.
- **Few elements**: a cover is small, so each scene keeps three to five main elements, large enough to read at the size of a card; an idea that needs more pieces (a client browser before the Laravel route, for example) is told in the course, not in the cover.
- **Each scene shows the subject**: a robot on a grid (initiation, Robomind), the layers of a page (web), live bars (Python and data), a stack of disks (databases), a Git graph (method and tests, Git), a neural network (AI), a Scrum board (project management), a plan drawn line by line that takes shape (software design), modules fitting together (custom request); for the modules, a flowchart (algorithmics), the blocks of a page (HTML), boxes from row to grid (CSS), a click and its waves (JavaScript), a request to a server (PHP), a tree of components (Vue), mountains (Alpine), route-controller-model-view (Laravel), a snake (Python), a form (Django), a line learning a cloud of points (machine learning), entities and association (Merise), a class that produces its objects one after another (object-oriented programming), a class diagram (UML), one class split into small classes under one interface (SOLID), a subject notifying its observers (design patterns), a table scanned row by row (MySQL), a join (PostgreSQL), tests passing (Cypress), a pipeline (continuous integration), a package going up (continuous deployment), a terminal (Claude Code), a conversation (prompt engineering), a core and its orbits (integrating AI), sprint loops (Scrum).
- **Orange in the covers** (approved as « la subtilité que j'attendais »): only a few elements at once, each with a meaning: a trail of fading dots behind what moves, an element that lights up from white to orange when it is reached and then cools down, and small stories (the apple of the Python snake, the flag on the Alpine summit, the well predicted points of the regression, the increment of a sprint). No scene turns a whole object orange.

## The orange

Where `--signal` appears, and nowhere else:

- the « Nouveau » badge;
- the hover of the footer links and of the contact links;
- the word « Copiée » and the errors under a field (`--signal-text`);
- the left border of the failure note and the outline of the sent check;
- the fluid of the grids;
- the touches of the covers and the edges of the shell around the hero cube.

Never for: the focus, the fields, the errors' fields, the buttons, large surfaces.

## Icons and images

- **Icons**: SVG lines, 1.6 px stroke, round caps, in the text color (menu, close, chevrons, check); never text symbols.
- **Partner logos**: white SVG traced from the logos of the former site ([docs/mockups/assets/NOTICE.md](mockups/assets/NOTICE.md)); IGENSIA Tech still to be provided.
- **Photo** of the trainer: to be chosen by the owner (the one of the former site doesn't fit).
- Images in a light format (WebP) at their displayed size, each with an `alt` text.

## Accessibility

- Contrasts: see [Colors](#colors); white on orange reaches 4.54:1.
- Focus: a 2 px white outline, 3 px away (`:focus-visible`), except in the fields, where the caret and the label show it.
- Every action works with the keyboard (menu, Escape, back to top, form); a skip link « Aller au contenu ».
- Reduced motion and forced colors are respected (see [Motion](#motion) and the caret above).

## Open points

- The offer page, the about page, the legal page and the 404 page are still to be designed in this style.

## Set aside

Kept here so that they are not proposed again without a reason: the « Console » style of the course materials (night and mint green), the « Atelier » style (paper, vermilion, Fraunces), Poppins and Roboto for the text, neumorphic fields, an orange caret or orange field glows, a focus ring on the fields, gradients and glows behind the sections, monospace labels, arrows on buttons, icons and technology tags on the cards, a spider chart or pentagon for the partners, a « Fait main à Toulouse » line, a red signal color (it reads as an error in course materials).
