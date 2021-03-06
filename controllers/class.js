// DEPENDENCIES
// ======================================================
const db = require("../models");
const router = require("express").Router();


// All USER routes are prefixed by: '/API/users/'
// All CLASS routes are prefixed by: '/API/classes/'
// All SHOPPING routes are prefixed by: '/shop/'


// ROUTES
// ======================================================
// GET ALL CLASSES INFO
router.get("/getAll", async (req, res) => {
    try {
        const classData = await db.item.findAll()
        res.json(classData)
    }

    catch (err) {
        console.error(err)
        res.status(500).end()
    }
})

// GETS A SINGLE CLASS' INFO
router.get("/:id", async ({ params: { id } } = req, res) => {
    try {
        const classData = await db.item.findOne({ where: { id: id }, include: [db.user] })
        res.json(classData)
    }

    catch (err) {
        console.error(err)
        res.status(500).end()
    }
})

// CREATES A CLASS
router.post("/create", async ({ body } = req, res) => {
    try {
        const classData = await db.item.create(body)
        const classWithRoster = await db.item.findOne({ where: { id: classData.id }, include: db.user })
        res.json(classWithRoster)
    }

    catch (err) {
        console.error(err)
        res.status(500).end()
    }
})

// ADD A USER TO A CLASS' ROSTER
router.post("/addStudent", async ({ body: { itemId, userId } } = req, res) => {
    try {
        await db.roster.create({ itemId: itemId, userId: userId })
        const classRosterData = await db.item.findOne({ where: { id: itemId }, include: [db.user] })
        res.json(classRosterData);
    }

    catch (err) {
        console.error(err)
        res.status(500).end()
    }
})

// UPDATE A CLASS
router.put("/update/:id", async ({ body, params: { id } } = req, res) => {
    try {
        await db.item.update(body, { where: { id: id } })
        const classData = await db.item.findOne({ where: { id: id } })
        res.json(classData)
    }

    catch (err) {
        console.error(err)
        res.status(500).end()
    }
})

// DELETE A CLASS
router.delete('/delete/:id', async ({ params: { id } } = req, res) => {
    try {
        const classData = await db.item.destroy({ where: { id: id } })
        res.json(classData)
    }

    catch (err) {
        console.error(err)
        res.status(500).end()
    }
})

// REMOVE A STUDENT
router.delete("/removeStudent/:itemId/:userId", async ({ params: { itemId, userId } } = req, res) => {
    try {
        await db.roster.destroy({ where: { userId: userId } })
        const classRosterData = await db.item.findOne({ where: { id: itemId }, include: [db.user] })
        res.json(classRosterData);
    }

    catch (err) {
        console.error(err)
        res.status(500).end()
    }
})


// EXPORT
// ======================================================
module.exports = router;