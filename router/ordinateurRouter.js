const ordinateurRouteur = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const authguard = require("../services/auhguard");



// Route pour afficher les ordinateurs disponibles et les employés sans ordinateur
ordinateurRouteur.get("/givecomputeur", authguard, async (req, res) => {
    // Récupérer les employés sans ordinateur
    const employer = await prisma.employer.findMany({
        where: {
            entrepriseId: req.session.entreprise.id,
            computeurID: null, // employer sans ordinateur
        }
    })

    // Récupérer les ordinateurs disponibles
    const ordinateur = await prisma.ordinateur.findMany({
        where: {
            //session : c'est un objet qui stocke les informations de session de l'utilisateur. 
            //La session est un mécanisme qui permet de stocker des 
            //données spécifiques à l'utilisateur pendant une période de temps définie.
            entrepriseID: req.session.entreprise.id,
            employer: { is: null } // ordinateur sans employer
        }
    })

    // Afficher la page de distribution des ordinateurs
    res.render("pages/givecomputeur.twig", {
        entreprise: req.session.entreprise,
        employer: employer,
        ordinateur: ordinateur
    })
})

// Route pour ajouter un nouvel ordinateur
ordinateurRouteur.get("/addcomputeur", authguard, async (req, res) => {
    // Afficher la page d'ajout d'ordinateur
    res.render("pages/addcomputeur.twig", {
        entreprise: req.session.entreprise,
    })
})

ordinateurRouteur.post("/addcomputeur", authguard, async (req, res) => {
    try {
        // Vérifier si l'ordinateur existe déjà avec cette adresse MAC
        const existingOrdinateur = await prisma.ordinateur.findUnique({
            where: { mac: req.body.mac }
        });

        if (existingOrdinateur) {
            // Si l'ordinateur existe déjà, renvoyer une erreur
            return res.render("pages/addcomputeur.twig", {
                error: "Cet ordinateur existe déjà avec cette adresse MAC."
            });
        }

        // Créer l'ordinateur si l'adresse MAC est unique
        const ordinateur = await prisma.ordinateur.create({
            data: {
                modele: req.body.modele,
                mac: req.body.mac,
                entrepriseID: req.session.entreprise.id,
            }
        });
        // Rediriger vers la page d'accueil
        res.redirect("/home");
    } catch (error) {
        console.log(error);
        // Afficher l'erreur sur la page d'ajout d'ordinateur
        res.render("pages/addcomputeur.twig", {
            error: error
        });
    }
});

// Route pour supprimer un ordinateur
ordinateurRouteur.get("/deleteComputer/:id", authguard, async (req, res) => {
    // Supprimer l'ordinateur
    const deleteComputer = await prisma.ordinateur.delete({
        where: {
            id: parseInt(req.params.id),
        },
    });
    // Rediriger vers la page d'accueil
    res.redirect("/home");
});

// Route pour modifier un ordinateur
ordinateurRouteur.get("/updateComputer/:id", authguard, async (req, res) => {
    // Afficher la page de modification d'ordinateur
    res.render("pages/addcomputeur.twig", {
        entreprise: req.session.entreprise,
        ordinateur: await prisma.ordinateur.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        })
    })
})

ordinateurRouteur.post("/updateComputer/:id", authguard, async (req, res) => {
    try {
        // Récupérer l'ordinateur à modifier
        const ordinateur = await prisma.ordinateur.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });
        // Mettre à jour l'ordinateur
        const updateComputer = await prisma.ordinateur.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                modele: req.body.modele,
                mac: req.body.mac,
            }
        });
        // Rediriger vers la page d'accueil
        res.redirect("/home");
    } catch (error) {
        console.log(error);
        // Rediriger vers la page d'accueil avec erreur
        res.redirect("/");
    }
});

// Route pour afficher les ordinateurs attribués
ordinateurRouteur.get("/computers", authguard, async (req, res) => {
    try {
        // Récupérer les ordinateurs attribués
        const entreprise = req.session.entreprise;
        const ordinateurs = await prisma.ordinateur.findMany({
            where: {
                employer: {
                    isNot: null
                },
                entrepriseID: {
                    equals: parseInt(entreprise.id)
                }
            },
            include: {
                employer: true
            }
        });
        // Afficher la page des ordinateurs attribués
        res.render("pages/computers.twig", {
            entreprise,
            ordinateurs
        });
    } catch (error) {
        console.log(error);
    }
});

// Route pour dissocier un ordinateur d'un employé
ordinateurRouteur.get("/removecomputer/:id", authguard, async (req, res) => {
    try {
        // Dissocier l'ordinateur de l'employé
        const ordinateur = await prisma.ordinateur.update({
            where: { id: parseInt(req.params.id) },
            data: { // data met à jours
                employer: {
                    disconnect: true
                }
            }
        });
        // Rediriger vers la page des ordinateurs attribués
        res.redirect("/home");
    } catch (error) {
        console.log(error);
    }
});

module.exports = ordinateurRouteur