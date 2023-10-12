import dotenv from "dotenv";
import fetch from "node-fetch";
import passport from "passport";
import GitHubStrategy from "passport-github2";
import GoogleStrategy from "passport-google-oauth20";
import { UserModel } from "../DAO/models/users.model.js";
import { CartsService } from "../services/carts.service.js";
import { UserDao } from "../DAO/classes/users.dao.js";
dotenv.config();

const CartService = new CartsService();
const userDao = new UserDao();

export function iniPassport() {
    passport.use(
        "github",
        new GitHubStrategy(
            {
                clientID: process.env.CLIENTIDGITHUB,
                clientSecret: process.env.CLIENTSECRET,
                callbackURL: process.env.CALLBACKURLGITHUB,
            },
            async (accesToken, _, profile, done) => {
                console.log(profile);
                try {
                    const res = await fetch("https://api.github.com/user/emails", {
                        headers: {
                            Accept: "application/vnd.github+json",
                            Authorization: "Bearer " + accesToken,
                            "X-Github-Api-Version": "2022-11-28",
                        },
                    });
                    const emails = await res.json();
                    const emailDetail = emails.find((email) => email.verified == true);

                    if (!emailDetail) {
                        return done(new Error("cannot get a valid email for this user"));
                    }
                    profile.email = emailDetail.email;

                    let user = await UserModel.findOne({ email: profile.email });
                    if (!user) {
                        const newCart = await CartService.createOne();
                        const newUser = {
                            email: profile.email,
                            firstName: profile._json.name || profile._json.login || "noname",
                            lastName: "nolast",
                            isAdmin: false,
                            pass: "nopass",
                            role: process.env.DEFAULTROLE,
                            cart: newCart._id,
                        };
                        let userCreated = await UserModel.create(newUser);
                        // console.log("User Registration succesful");
                        return done(null, userCreated);
                    } else {
                        // console.log("User already exists");
                        userDao.updateLastLogin(user._id); // call the updateLastLogin function
                        return done(null, user);
                    }
                } catch (e) {
                    // console.log("Error en auth github");
                    // console.log(e);
                    return done(e);
                }
            }
        )
    );

    passport.use(
        new GoogleStrategy(
            {
                name: "google",
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALL_BACK,
                // passReqToCallback: true,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    console.log(profile);
                    // Aquí puedes procesar el perfil del usuario que ha iniciado sesión.
                    // Por ejemplo, puedes guardar el perfil en la base de datos.

                    // Supongamos que necesitas el correo electrónico verificado del usuario
                    const email = profile.emails.find((email) => email.verified);

                    if (!email) {
                        return done(new Error("Cannot get a valid email for this user"));
                    }

                    // Buscar si el usuario ya existe en la base de datos
                    let user = await UserModel.findOne({ email: email.value });

                    if (!user) {
                        // Si el usuario no existe, puedes crear uno nuevo y guardar en la base de datos
                        const newCart = await CartService.createOne();
                        const newUser = {
                            email: email.value,
                            firstName: profile.name.givenName || profile.displayName || "noname",
                            lastName: profile.name.familyName || "nolast",
                            isAdmin: false,
                            pass: "nopass",
                            role: process.env.DEFAULTROLE,
                            cart: newCart._id,
                        };
                        let userCreated = await UserModel.create(newUser);
                        // console.log("User Registration successful");
                        return done(null, userCreated);
                    } else {
                        // console.log("User already exists");
                        userDao.updateLastLogin(user._id); // call the updateLastLogin function
                        return done(null, user);
                    }
                } catch (error) {
                    // console.log("Error in Google authentication");
                    // console.log(error);
                    return done(error);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
        // done(null, user);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById(id);
        done(null, user);
    });
}
