# How to Make Your Portfolio Live

You have two main options. Pick one.

---

## Option 1: GitHub Pages (simplest, free)

**Best for:** Getting the site online quickly. Contact form will need a free external service (see below).

### Steps

1. **Create a GitHub account** (if you don’t have one): [github.com](https://github.com)

2. **Create a new repository**
   - Click **New repository**
   - Name it e.g. `portfolio` or `kushvinder-singh`
   - Public, no need to add README
   - Create

3. **Push your project**
   - In your portfolio folder, open terminal and run:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your GitHub username and repo name.

4. **Enable GitHub Pages**
   - In the repo: **Settings** → **Pages**
   - Under **Source** choose **Deploy from a branch**
   - Branch: **main**, folder: **/ (root)**
   - Save. In 1–2 minutes the site will be at:
   - **https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/**

**Contact form on GitHub Pages:** GitHub Pages only serves static files (no Node server). To keep the form working you can use [Formspree](https://formspree.io) (free): sign up, create a form, get the form endpoint, and change the form in `index.html` to post to that URL (or use the Formspree embed). I can give exact HTML/JS changes if you want.

---

## Option 2: Render (free, keeps your Node server + contact form)

**Best for:** Keeping your current contact form and `server.js` as-is.

### Steps

1. **Push your project to GitHub** (same as Option 1, steps 1–3).

2. **Go to [render.com](https://render.com)** and sign up (e.g. with GitHub).

3. **New Web Service**
   - **Connect** your GitHub repo (the one with this portfolio).
   - **Name:** e.g. `portfolio`
   - **Environment:** **Node**
   - **Build command:** `npm install`
   - **Start command:** `npm start`
   - **Plan:** Free. Click **Create Web Service**.

4. **Wait for deploy.** When it’s done you’ll get a URL like:
   - **https://portfolio-xxxx.onrender.com**

5. **Optional – custom domain**  
   In the Render dashboard you can add your own domain under the service’s **Settings**.

**Note:** On the free plan, the app may “sleep” after some inactivity; the first visit after that can take 30–60 seconds to wake up.

---

## Checklist before you deploy

- [ ] Replace any test/placeholder content.
- [ ] Ensure `ks cv.pdf` is in the project so “Download CV” works.
- [ ] If using GitHub Pages, either switch the contact form to Formspree (or similar) or remove it / show only your email.

---

## Quick comparison

|                | GitHub Pages     | Render            |
|----------------|------------------|-------------------|
| Cost           | Free             | Free tier         |
| Contact form   | Use Formspree etc| Works with your server |
| Custom domain  | Yes              | Yes               |
| Setup          | Easiest          | Still easy        |

If you tell me which option you want (GitHub Pages or Render), I can give you the exact commands and any code changes (e.g. for Formspree) step by step.
