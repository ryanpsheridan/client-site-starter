# Setup Guide (for the client)

This explains what happens on your end as your site gets built and goes live. In most cases you won't need to touch anything until you've approved the site from a preview link — from that point on, this walks through what's next.

## How this usually works

Your developer builds your site first, in their own accounts, and sends you a link to preview it before anything is in your name. Once you approve the site, ownership of everything transfers to you. You'll create a few free accounts along the way — always with your own email, never your developer's — so nothing is ever locked to someone else's login.

## 1. Approve the preview

Your developer will send a link to a live preview of your site. Look it over, request changes, and once you're happy with it, let them know you approve — that's the signal to start the handoff below.

## 2. Receiving the GitHub repository
- Your developer transfers the site's code repository to your GitHub account (sign up free at https://github.com/signup if you don't have one already).
- Accept the transfer invite from your email or GitHub notifications.
- Your developer will ask to be re-added as a collaborator so they can keep working on the site — **Settings → Collaborators → Add people**.

## 3. Receiving the Vercel project
- Vercel (https://vercel.com/signup, sign up with "Continue with GitHub") is what hosts your site and auto-deploys it any time code changes.
- Your developer transfers the Vercel project to your account/team. Accept the transfer from your email or the Vercel dashboard.
- Check **Settings → Deployment Protection** is **Off**, so preview links stay viewable without anyone needing to log in.

## 4. Any other accounts your site needs

Depending on what your site uses, your developer will help you set up (always under your own email — you type in your own info, especially anything financial, even during an assisted call or screen-share):
- **Formspree** — contact form submissions land in your inbox
- **Calendly** — scheduling
- **Stripe** — payments
- **Google Search Console** — so your site shows up in Google search

You'll get these steps individually, either on a call or written out, as each one becomes relevant — nothing above needs to happen all at once. Use your own recovery email, phone number, and 2FA on each account, so you're never locked out of something that's yours.

## 5. Your domain

If you already own a domain, your developer will help you point it at your Vercel project. If you don't, they'll help you register one — under your own account, since it's yours to keep.

## 6. If you want to edit the site yourself

This is optional — most clients don't. If you told your developer you'd like to make changes yourself going forward, there are two ways:
- **Claude Code** — plain-English editing of any part of the site, using your own Claude account (Pro or Max).
- **A content editor (Decap CMS)** — a simple form for editing things like blog posts, no coding involved.

Your developer will set this up and walk you through it if you opted in.

## Prefer to set up your own accounts from the start?

Some clients would rather create their own GitHub and Vercel accounts before any code is written, instead of receiving a transfer later. If that's you, let your developer know and follow these steps instead of waiting for a transfer — everything else in this guide (forms, scheduling, payments, domain, Search Console, self-editing) proceeds the same either way:

1. Create a free GitHub account at https://github.com/signup.
2. Go to the starter template your developer is using and click the green **"Use this template"** button → **"Create a new repository"** — make sure **you** are selected as the owner, not your developer's account.
3. Add your developer as a collaborator: **Settings → Collaborators → Add people**, search their GitHub username, and invite them.
4. Create a free Vercel account at https://vercel.com/signup, signing up with **"Continue with GitHub"**.
5. Import your repository into Vercel: **Add New → Project** → select your repository → **Deploy**.
6. Check **Settings → Deployment Protection** is **Off**.
