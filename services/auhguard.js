const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const authguard = async (req, res, next) => {
    try {
        if (req.session.entreprise) {
            let entreprise = await prisma.entreprise.findUnique({
                where: {
                    id: req.session.entreprise.id
                }
            })
            if (entreprise) 
                return next()
        }
        
        res.redirect('/login')
    } catch (error) {
        console.error("Erreur dans authguard:", error);
        res.redirect('/login')
    }
}
module.exports = authguard // cette ligne permet d'exporter la fonction 