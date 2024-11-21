const { PrismaClient } = require("@prisma/client");
const authguard = require("../services/auhguard");
const employerRouter = require("express").Router();

const hashPasswordExtension = require("../services/extensions/ hashPasswordExtensions");
const prisma = new PrismaClient().$extends(hashPasswordExtension);
const bcrypt = require('bcrypt')

// Route GET pour afficher la page d'ajout d'un employé
employerRouter.get("/addemployer", authguard, async (req, res) => {
    res.render("pages/addemployer.twig", {
        entreprise: req.session.entreprise
    })
})

// Route POST pour gérer la soumission du formulaire d'ajout d'un employé
employerRouter.post("/addemployer", authguard, async (req, res) => {
    try {
        // Vérifie si les mots de passe correspondent
        if (req.body.password === req.body.confirm_password) {  
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const employer = await prisma.employer.create({
                data: {
                    gender: req.body.gender,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    age: parseInt(req.body.age),
                    mail: req.body.mail,
                    password_employer: hashedPassword, // Hache le mot de passe avant de le stocker
                    entrepriseId: req.session.entreprise.id
                }
            }) 
            res.redirect("/home") // Redirige vers la page d'accueil après la création
        } else {
            throw ({ confirm_password: "Vos mots de passe ne correspondent pas" }) // Lance une erreur si les mots de passe ne correspondent pas
        }
    } catch (error) {
        console.log(error);
        res.render("pages/addemployer.twig", {
            error: error // Rendu de la page avec les erreurs
        })
    }
})

// Route GET pour supprimer un employé par ID
employerRouter.get("/deleteEmployer/:id", authguard, async (req, res) => {
    try {
        const deleteEmployer = await prisma.employer.delete({
            where: {
                id: parseInt(req.params.id),
            },
        });
        res.redirect("/home"); // Redirige vers la page d'accueil après suppression
    } catch (error) {
        res.redirect("/"); // Redirige vers la page d'accueil en cas d'erreur
    }
});

// Route GET pour afficher la page de mise à jour d'un employé par ID
employerRouter.get("/updateEmployer/:id", authguard, async (req, res) => {
    res.render("pages/addemployer.twig", {
        entreprise: req.session.entreprise,
        employer: await prisma.employer.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        })
    })
})

// Route POST pour gérer la soumission du formulaire de mise à jour d'un employé
employerRouter.post("/updateEmployer/:id", authguard, async (req, res) => {
    try {
        let hashedPassword;
        if (req.body.password) {
            // Hash le nouveau mot de passe seulement s'il est fourni
            hashedPassword = await bcrypt.hash(req.body.password, 10);
        }

        const employer = await prisma.employer.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });

        if (!employer) {
            return res.status(404).send("Employé non trouvé"); // Renvoie une erreur 404 si l'employé n'est pas trouvé
        }

        // Mise à jour des données de l'employé
        const updateEmploye = await prisma.employer.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                gender: req.body.gender,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                mail: req.body.mail,
                password_employer: hashedPassword || employer.password_employer, // Utilise le mot de passe haché ou garde l'ancien
                age: parseInt(req.body.age),
            }
        });

        res.redirect("/home"); // Redirige vers la page d'accueil après mise à jour
    } catch (error) {
        console.log(error);
        res.redirect("/"); // Redirige vers la page d'accueil en cas d'erreur
    }
});

module.exports = employerRouter
