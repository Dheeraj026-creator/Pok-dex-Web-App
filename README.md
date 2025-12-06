This is a Pokédex web application built with Node.js, Express, EJS, and Google OAuth 2.0 authentication.
It fetches Pokémon data from the PokéAPI, caches it for performance, and displays Pokémon, their types, stats, and abilities.
Users can access the Pokédex only after signing up with Google.

Live Demo:
https://pokedex-web-app-tu3i.onrender.com

Features

Google OAuth Sign-up/Login

Secure authentication using Passport.js

Pokédex with Pokémon images, types, stats, and abilities

Caching mechanism to avoid unnecessary API calls

Clean UI with Google Sign-In button

User navbar showing Google profile image and name

Protected routes (only logged-in users can access the main page)

Installation & Setup
1. Clone the Project
git clone <your_repo_url_here>
cd your_project_folder

2. Install Dependencies
npm install


Dependencies include:

express

ejs

pokedex-promise-v2

passport

passport-google-oauth20

express-session

dotenv

3. Create .env File

Create a file named .env in the project root:

GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

SESSION_SECRET=someRandomSecretKey

4. Set Up Google OAuth Credentials

Visit:
https://console.cloud.google.com/apis/credentials

Steps:

Create a project

Enable “Google Identity Services”

Create OAuth 2.0 credentials

Add the authorized redirect URI:

http://localhost:3000/auth/google/callback


Copy your Client ID and Secret into the .env file.

5. Run the App
node server.js


or using nodemon:

nodemon server.js


Open in browser:

http://localhost:3000/


If you're not logged in, you will be redirected to /login.

Technologies & Libraries Used
1. Node.js + Express

Used to build backend routes, server logic, and render pages.

2. EJS

Lightweight templating engine for dynamic pages.

3. Passport.js

Handles Google OAuth authentication.
Chosen because it provides clean, secure, and easy OAuth integration.

4. Google OAuth 2.0

Allows users to sign up/login via Google without creating passwords.

5. express-session

Stores the user's login session.
Even without a database, it keeps req.user available during the session.

6. pokedex-promise-v2

Promise-based wrapper for PokéAPI.

7. dotenv

Securely loads environment variables.

8. PokéAPI

Public Pokémon API used to fetch all Pokémon data.

How req.user Works Without a Database

Even without a database, Passport stores the Google profile in the session.

Process:

User logs in using Google OAuth.

Passport receives the Google profile.

serializeUser() saves the profile into the session.

On every request, Passport restores it into req.user.

This means:

The app works fine without a database

User stays logged in through session cookies

Restarting the server clears all sessions

A database is only required if you want permanent user storage.

Challenges Faced & Solutions
1. Google OAuth not redirecting

Cause: Incorrect redirect URI
Solution: Added correct redirect URI:

http://localhost:3000/auth/google/callback

2. req.user was undefined

Cause: Incorrect middleware order
Solution: Correct order:

app.use(session(...));
app.use(passport.initialize());
app.use(passport.session());

3. Slow Pokémon loading

Cause: PokéAPI was called on every page load
Solution: Added caching:

let cachedPokemon = null;

4. Protected routes

Needed to block access to home page unless logged in
Solution: Added middleware:

function ensureAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}

5. Showing user info

Solved by storing Google profile in session instead of a database.

Future Improvements

Add MongoDB for permanent user storage

Add Pokémon favorites/team feature

Add search, filtering, and sorting

Improve UI and animations

Deploy on Render/Vercel with environment variables

Conclusion

This application demonstrates how to build a complete authentication-protected Pokédex using Google OAuth, Passport.js, Express, EJS, and PokéAPI.
It includes caching, protected routes, and dynamic UI rendering.
