# Aman Sharma — Personal Portfolio

Single-page portfolio website for Aman Sharma, MBA candidate in Marketing & Sales at
Lovely Professional University (Mittal School of Business).

Built with **plain HTML, CSS and JavaScript** — no frameworks, no build step.
Hosted on **GitHub Pages**.

## Structure

```
index.html        All content lives here (one file, clearly commented sections)
css/style.css     All styling
js/script.js      Menu, lightbox, scroll effects, contact form
images/           Compressed photos (headshot, OXERA project, trophies, certificate, logos)
favicon.svg       Browser tab icon
.nojekyll         Tells GitHub Pages to serve files as-is
```

## Contact form (Web3Forms)

The contact form emails submissions to **sharmakaman2545@gmail.com** via the free
Web3Forms service. If it has not been set up yet, do this once:

1. Go to <https://web3forms.com>
2. Enter `sharmakaman2545@gmail.com` and click **Get your Access Key**
3. Check that inbox and confirm/verify the email
4. Copy the access key
5. Open `index.html`, find this line (search for `YOUR_WEB3FORMS_ACCESS_KEY`):
   ```html
   <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY">
   ```
6. Replace the placeholder with your real key and commit the change.

That's it — the form starts working immediately. Spam protection is already
built in (a hidden "honeypot" field that bots fill and humans never see).

## Editing content

Open `index.html` — every section (hero, about, experience, projects, education,
skills, certifications, achievements, contact) is marked with a comment like
`<!-- ============ ABOUT ============ -->`. Text can be edited directly;
images live in `/images`.

## Local preview

Just open `index.html` in any browser — no server or build required.

## Deployment

GitHub Pages serves this repository directly from the `main` branch, root
folder. Push changes to `main` and the live site updates within a minute:
<https://github.com/pages>
