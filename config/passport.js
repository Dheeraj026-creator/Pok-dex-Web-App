import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

if (process.env.NODE_ENV !== "production") {
    import('dotenv').then(module => {
        module.config();
    });
}
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
clientSecret: process.env.GOOGLE_CLIENT_SECRET,
callbackURL: process.env.GOOGLE_CALLBACK_URL

        },
        async (accessToken, refreshToken, profile, done) => {
            // You can save user to DB here if needed
            const user = {
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails?.[0]?.value,
                photo: profile.photos?.[0]?.value,
            };
            done(null, user);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});
