import { Router } from "express";
import passport from "passport";
import { userModel } from "../models/user.model.js";
import { createHash } from "../configurations/bcrypt.js";
import jwt from 'jsonwebtoken';
import { secret } from "../configurations/consts.js";

const sessionRoutes = Router();

sessionRoutes.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/fail-register" }),
  (req, res) => {
    res.render("user-created-success");
  }
);

sessionRoutes.post(
  "/login",
  (req, res) => {
    const {email} = req.body;
    const token = jwt.sign({email, role: 'user'}, secret, {expiresIn: '24h'});
    res.cookie('coderCookieToken', token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true
  }).send({token});
  }
);


sessionRoutes.post("/logout", (req, res) => {
    req.session.user = null;
    res.redirect('/login');
});

sessionRoutes.post("/recovery", async (req, res) => {
    const {email, password} = req.body;
    const user = await userModel.findOne({email});
    if(!user){
        return res.status(400).send({message: 'Error'});
    }
    user.password = createHash(password);
    user.save();
    res.send({message: 'Password changed'});
});

export default sessionRoutes;