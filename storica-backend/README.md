# Storica Architects — Backend

A small Node.js + Express server for the Storica Architects site.

## What it does
- Serves your existing site (index.html, gallery.html, about.html, contact.html, styles, main.js, images) as static files
- Handles the contact form for real: POST /api/contact validates and saves each submission to data/messages.json
- GET /api/messages lets you view everything submitted so far

## Setup
1. Install Node.js if you don't have it: https://nodejs.org (LTS version)
2. Open a terminal in this folder
3. Run:
   npm install
4. Then start the server:
   npm start
5. Open your browser to:
   http://localhost:3000

Your site now runs through this server instead of Live Server. The contact form on /contact.html actually saves messages now — check data/messages.json after submitting one, or visit http://localhost:3000/api/messages

## Folder structure
storica-backend/
  server.js            the Express server
  package.json         dependencies (just Express)
  data/
    messages.json       where contact form submissions get saved
  public/               your actual website files
    index.html
    gallery.html
    about.html
    contact.html
    main.js
    styles/styles.css
    images/              put your real project photos in here

## Next steps (once you learn more backend)
- Add a login-protected admin page to view messages instead of the open /api/messages route
- Swap messages.json for a real database (MongoDB, PostgreSQL, etc.)
- Add email sending (e.g. with Nodemailer) so you get notified when someone submits the form
