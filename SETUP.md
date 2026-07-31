# Setup Checklist (for the client)

This takes about 10 minutes and only needs to happen once. Send this doc to the client, or walk through it together.

## 1. Create a GitHub account
- Go to https://github.com/signup
- Free plan is all you need.

## 2. Create your site's repository from the template
- Go to the starter template: https://github.com/ryanpsheridan/client-site-starter
- Click the green **"Use this template"** button → **"Create a new repository"**
- Make sure **you** (the client) are selected as the owner, not the template's original account
- Name it whatever you like (e.g. `my-business-site`)
- It can be public or private — your choice
- Click **Create repository**

## 3. Add your developer as a collaborator
- In your new repository, go to **Settings → Collaborators**
- Click **Add people**, search their GitHub username, and invite them
- They'll need to accept the invite from their end

## 4. Create a Vercel account
- Go to https://vercel.com/signup
- Sign up using **"Continue with GitHub"** — this links the two automatically
- Free (Hobby) plan is all you need

## 5. Import your repository into Vercel
- From the Vercel dashboard, click **Add New → Project**
- Select your repository from the list
- Click **Deploy** — Vercel auto-detects Astro and handles the rest
- Your site is now live at a `*.vercel.app` address (a custom domain can be added later)

## 6. Check Deployment Protection is off
- In your Vercel project, go to **Settings → Deployment Protection**
- Make sure it's set to **Off** (this is the default) — this keeps preview links viewable without anyone needing to log in

## Done

That's the entire one-time setup. From here, your developer handles building the site — you shouldn't need to touch GitHub or Vercel again unless you want to connect a custom domain or add a new third-party service later (a form, scheduling, or payments account), and those steps will be sent to you individually if/when needed.
