# External services

The external services of the site, their limits and terms of use, and the risks the owner accepts, with their date. Checked on 2026-10-27; check again before relying on a figure, since the terms change.

## GitHub Pages (hosting)

Source: [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).

| Limit | Value |
|---|---|
| Published site size | 1 GB maximum |
| Source repository | 1 GB recommended |
| Bandwidth | 100 GB per month (soft limit) |
| Builds | 10 per hour (soft limit), not applied to a custom GitHub Actions workflow |
| Deployment | Times out after 10 minutes |

- No server-side code and no server-side redirects: the redirects are static pages (see `specs.md`).
- Not for sensitive transactions (passwords, credit card numbers). The site has none.
- **Accepted risk (2026-10-27): commercial use.** GitHub Pages « is not intended for or allowed to be used as a free web-hosting service to run your online business, e-commerce site, or any other website that is primarily directed at either facilitating commercial transactions or providing commercial software as a service (SaaS) ». A freelancer's showcase site with no sale and no payment is a gray area, tolerated in practice. If GitHub ever suspended the site, the static build moves to Cloudflare Pages or Netlify (free plans that allow commercial use) in a few minutes, then the DNS records change.

## Formspree (contact form)

Sources: [plans](https://formspree.io/plans), [privacy policy](https://formspree.io/legal/privacy-policy/).

| Free plan | Value |
|---|---|
| Submissions | 50 per month |
| Spam protection | Automatic filtering (Formshield) and the honeypot field; reCAPTCHA available but not used (Google cookies) |
| Archive | 30 days in the Formspree dashboard; each submission is also sent by e-mail to the owner |
| Next plan | Personal, 10 $/month billed yearly (120 $/year) |

- 50 requests a month is far above the expected volume of a freelance trainer. Past the limit, the visitor sees the error message and the e-mail fallback (see `specs.md`).
- Personal data: the form fields are processed by Formspree, Inc. in the United States. Its privacy policy names no transfer mechanism (no Standard Contractual Clauses or Data Privacy Framework mentioned). The privacy policy of the site states this transfer.
- Setup of the form: reCAPTCHA is on by default, and would show a Google page, with its cookies, to a visitor without JavaScript after sending; it is turned off in the settings of the form (Spam protection), which every plan allows ([reCAPTCHA settings](https://help.formspree.io/articles/form-and-project-settings/recaptcha-settings/)). The site sends the form with `fetch` and `Accept: application/json`; without JavaScript, Formspree shows its own thank-you page. A robot that fills the honeypot `_gotcha` is silently ignored ([honeypot](https://help.formspree.io/hc/en-us/articles/360013580813-Honeypot-spam-filtering)).
- The address of the form (`https://formspree.io/f/<id>`) is public by nature, in the HTML of the page: it lives in `src/data/contact.json`.
- Rejected: Web3Forms (250 submissions a month, but its own documentation contradicts itself on whether submissions are stored).
- Chosen by the owner on 2026-10-27.

## GoatCounter (audience measurement)

Sources: [home page](https://www.goatcounter.com/), [GDPR](https://www.goatcounter.com/help/gdpr), [privacy](https://www.goatcounter.com/help/privacy).

- Free « for reasonable public usage »; « running your personal website or small-to-medium business on it is fine ».
- No cookie and nothing stored in the visitor's browser; no IP address, full User-Agent or tracker ID stored. Only aggregated counts (pages, referrers, browsers, systems, screen sizes, countries).
- Data hosted by Hetzner in Finland and Germany (European Union).
- Consent banner: « probably » not required according to GoatCounter, since no personal data is stored and the owner has a legitimate interest; the site mentions it in its privacy policy and shows no banner.
- Rejected: Google Analytics, which needs a consent banner in France (cookies, transfer to the United States).
- Chosen by the owner on 2026-10-27. Account `sylent` created on 2026-10-30: the layout loads `https://gc.zgo.at/count.js` with `data-goatcounter="https://sylent.goatcounter.com/count"`.
- **Only sylent.art is counted** (decided by the owner on 2026-10-30): the script is left out of the github.io preview and of the development server, so that the counts start at the launch; `count.js` itself [ignores `localhost` and the private networks](https://www.goatcounter.com/help/skip-dev), where the checks serve the build.
- **Source of a visit**: the apps of LinkedIn and Facebook often hide the site a visitor comes from, who then shows as a direct visit. [GoatCounter reads the source](https://www.goatcounter.com/help/campaigns) from `?ref=`, `?utm_source=`, `?src=` or `?source=`, and the campaign from `?utm_campaign=` or `?campaign=`: the launch posts link to `https://sylent.art/?ref=linkedin` and `https://sylent.art/?ref=facebook` (agreed with the owner on 2026-10-30). The canonical links of the pages leave the parameter out.
- **The owner's own visits**: after the launch, the owner opens `https://sylent.art/#toggle-goatcounter` once in each of their browsers, which stops `count.js` from counting that browser ([skip-dev](https://www.goatcounter.com/help/skip-dev)); this mark is stored in the owner's browser only, at their request. *Settings → Tracking → Ignore IPs* does the same for a fixed address.

## Legal notice

- **Accepted risk (2026-10-27): no home address.** For a professional in their own name, article 6 of the LCEN requires the name, the home address and the phone number in the legal notice; the penalty can reach one year of imprisonment and a 75 000 € fine, although it is rarely enforced for a showcase site. For the owner's safety, the site shows the name, the status, the SIRET, the e-mail address, the phone number and the NDA, but never the home address. A domiciliation address can be added later if the owner wants to comply fully.
- **Phone number of the host** (checked on 2026-10-30): article 6 of the LCEN asks for the name, address and phone number of the host. GitHub's own pages publish no phone number: its [privacy statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement) gives only the address of GitHub, Inc. (88 Colin P. Kelly Jr. Street, San Francisco, CA 94107), and its contact page leads to a support form. The legal notice keeps +1 877 448 4820, the number given for GitHub by third-party records ([datarequests.org](https://www.datarequests.org/db/github.json), its sales team): public, but without an official source. Accepted by the owner on 2026-10-30.
- The NDA is always followed by « Cet enregistrement ne vaut pas agrément de l'État » (Code du travail).

## Partner logos

- The logos of YNOV, IGENSIA Tech, EPSI, CESI and OpenClassrooms are trademarks. They are shown only as factual references of current clients, as is usual for a trainer, and removed if a partner asks or once the trainer no longer works with them.
