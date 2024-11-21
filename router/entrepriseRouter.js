const entrepriseRouter = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const hashPasswordExtension = require("../services/extensions/ hashPasswordExtensions");
const prisma = new PrismaClient().$extends(hashPasswordExtension);
const bcrypt = require('bcrypt')
const authguard = require("../services/auhguard")



// Route GET pour afficher la page de souscription
entrepriseRouter.get("/subscribe", (req, res) => {
    res.render('pages/subscribe.twig')
})

// Route POST pour gérer la soumission du formulaire de souscription
entrepriseRouter.post("/subscribe", async (req, res) => {
    try {
        if (req.body.password === req.body.confirm_password) {
            const entreprise = await prisma.entreprise.create({
                data: {
                    siret: req.body.siret,
                    raison_social: req.body.raison_social,
                    password: req.body.password,
                }
            })
            res.redirect("/login") // Redirection vers la page de connexion après création
        } else {
            throw ({ confirm_password: "Vos mots de passe ne correspondent pas" }) // Erreur si les mots de passe ne correspondent pas
        }
    } catch (error) {
        if (error.code === "P2002") error = { email: "Cet email existe déjà" }
        res.render("pages/subscribe.twig", { error: error }) // Rendu de la page avec erreurs
    }
})

// Route GET pour afficher la page de connexion
entrepriseRouter.get("/login", (req, res) => {
    res.render('pages/login.twig')
})

// Route POST pour gérer la soumission du formulaire de connexion
entrepriseRouter.post('/login', async (req, res) => {
    try {
        const entreprise = await prisma.entreprise.findUnique({
            where: { siret: req.body.siret }
        });
        if (!entreprise) {
            return res.render("pages/login.twig", {
                error: { siret: "Utilisateur non enregistré" }
            });
        }
        if (!(await bcrypt.compare(req.body.password, entreprise.password))) {
            return res.render("pages/login.twig", {
                error: { password: "Mauvais mot de passe" }
            });
        }
        req.session.entreprise = entreprise;
        res.redirect("/home"); // Redirection vers la page d'accueil après connexion
    } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        res.render("pages/login.twig", {
            error: { general: "Une erreur est survenue lors de la connexion" }
        });
    }
});

// Route GET pour afficher la page d'accueil
entrepriseRouter.get("/", authguard, async (req, res) => {
    try {
        const entreprise = await prisma.entreprise.findUnique({
            where: {
                id: req.session.entreprise.id
            }
        })
        res.render("pages/home.twig", {
            entreprise: req.session.entreprise,
        });
    } catch (error) {
        console.error("Erreur dans /home:", error);
        res.redirect("/login");
    }
})

// Route GET pour afficher la page d'accueil avec des données supplémentaires
entrepriseRouter.get("/home", authguard, async (req, res) => {
    try {
        const entreprise = await prisma.entreprise.findUnique({
            where: {
                id: req.session.entreprise.id
            },
            include: {
                employes: {
                  include: {
                    computeur: true 
                  }
                },
                ordinateurs: {
                  include: {
                    employer: true
                  }
                },
              }
        })
        res.render("pages/home.twig", {
            entreprise: entreprise,
        });
    } catch (error) {
        console.error("Erreur dans /home:", error);
        res.redirect("/login");
    }
}); 

// Route GET pour gérer la déconnexion
entrepriseRouter.get("/logout", (req, res) => {
    req.session.destroy()
    res.redirect("/login")
})

// Route POST pour assigner un ordinateur à un employé
entrepriseRouter.post("/givecomputeur", authguard, async (req, res) => {
    try {
        const updateEmploye = await prisma.employer.update({
            where: {
                id: parseInt(req.body.employerID)
            },
            data: {
                computeurID: parseInt(req.body.ordinateurID)
            }
        })
        console.log(updateEmploye);
        res.redirect("/home");
    } catch (error) {
        console.log(error);
        res.redirect("/givecomputeur")
    }
})

module.exports = entrepriseRouter
