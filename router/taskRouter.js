const taskRouter = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const authguard = require("../services/auhguard")



taskRouter.get("/addtask", authguard, async (req, res) => {

  try {
    const employer = await prisma.employer.findMany({
      where: {
        entrepriseId: req.session.entreprise.id,

      }
    })
    res.render('pages/addtask.twig', {
      entreprise: req.session.entreprise,
      employer: employer,
    })
  } catch (error) {
    console.log(error);

  }
})

taskRouter.post("/addtask", authguard, async (req, res) => {
  try {
    const entreprise = parseInt(req.params.id);
    const dueDate = new Date(req.body.dueDate);
    const isoDueDate = dueDate.toISOString();
    const assignerId = parseInt(req.params.id);
    const addTask = await prisma.task.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        dueDate: isoDueDate,
        assigner: {
          connect: { id: parseInt(assignerId) }
        },
        entreprise: parseInt(entreprise),
        status: req.body.status
      }
    });
    console.log(addTask);
    res.redirect("/home");
  } catch (error) {
    console.log(error);
  }
});


module.exports = taskRouter 