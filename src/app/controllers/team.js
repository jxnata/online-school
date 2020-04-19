const express = require('express')
const authMiddlawere = require('../middleware/auth')
const Team = require('../models/team')
const multer = require('multer')
const multerConfig = require('../../config/multer')

const router = express.Router()

router.use(authMiddlawere)

// listar
router.get('/', async (req, res) => {
    try {
        const teams = await Team.paginate()

        return res.send({ teams })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao carregar as aulas.', data: err })
    }
})

// ver
router.get('/:id', async (req, res) => {
    try {
        const team = await Team.findById(req.param.id)

        return res.send({ team })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao carregar a escola.', data: err })
    }
})

// atualizar
router.put('/:id', multer(multerConfig).single('image'), async (req, res) => {
    try {
        const team = await Team.findByIdAndUpdate(req.param.id, {
            ...req.body,
        }, { new: true })
        
        if (req.file){
            team.image = req.file.location
        }
        
        await team.save()

        return res.send({ team })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao atualizar a escola.', data: err })
    }
})

// excluir
router.delete('/:id', async (req, res) => {
    try {
        const team = await Team.findByIdAndDelete(req.param.id)

        return res.send({ team })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao deletar a escola.', data: err })
    }
})

// ativar
router.put('/enable', async (req, res) => {
    try {
        const team = await Team.findByIdAndUpdate(req.query.user_id, {
            nivel: 2,
        }, { new: true })

        return res.send({ team })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao ativar a escola.', data: err })
    }
})

// desativar
router.put('/disable', async (req, res) => {
    try {
        const team = await Team.findByIdAndUpdate(req.query.user_id, {
            nivel: 3,
        }, { new: true })
        
        return res.send({ team })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao desativar a escola.', data: err })
    }
})

module.exports = app => app.use('/teams', router)