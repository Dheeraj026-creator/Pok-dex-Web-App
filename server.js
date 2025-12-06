import express from "express";
import path from "path";
import Pokedex from "pokedex-promise-v2";
import { fileURLToPath } from "url";

import passport from "passport";
import session from "express-session";
import "./config/passport.js";   
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const P = new Pokedex();


app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

let cachedPokemon = null;


function ensureAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}

app.get("/", ensureAuth, async (req, res) => {
    try {
        if (!cachedPokemon) {
            const meta = await P.getPokemonsList();
            const total = meta.count;

            const allPokemon = await P.getPokemonsList({ limit: total, offset: 0 });

            cachedPokemon = await Promise.all(
                allPokemon.results.map(async (poke, index) => {
                    try {
                        const details = await P.getPokemonByName(poke.name);
                        return {
                            name: poke.name,
                            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
                            types: details.types.map(t => t.type.name),
                            stats: details.stats.map(s => ({ name: s.stat.name, value: s.base_stat })),
                            abilities: details.abilities.map(a => a.ability.name)
                        };
                    } catch {
                        return {
                            name: poke.name,
                            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
                            types: []
                        };
                    }
                })
            );
        }

        const typesData = await P.getTypesList();
        const types = typesData.results.map(t => t.name);

        res.render("index", { pokemon: cachedPokemon, types, user: req.user });
    } catch (err) {
        console.error(err);
        res.send("Error loading Pokémon.");
    }
});
app.get("/login", (req, res) => {
    if (req.isAuthenticated()) return res.redirect("/"); 
    res.render("login");
});

app.get("/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        res.redirect("/");
    }
);

app.get("/logout", (req, res) => {
    req.logout(() => {
        res.redirect("/login");
    });
});


const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
