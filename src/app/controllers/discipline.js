const express = require('express')
const authMiddlawere = require('../middleware/auth')
const Discipline = require('../models/discipline')
const multer = require('multer')
const multerConfig = require('../../config/multer')

const router = express.Router()

router.use(authMiddlawere)

// listar
router.get('/', async (req, res) => {
    try {
        const disciplines = await Discipline.paginate()

        return res.send({ disciplines })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao carregar as disciplinas.', data: err })
    }
})

// ver
router.get('/:id', async (req, res) => {
    try {
        const discipline = await Discipline.findById(req.param.id)

        return res.send({ discipline })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao carregar a disciplina.', data: err })
    }
})

// atualizar
router.put('/:id', multer(multerConfig).single('image'), async (req, res) => {
    try {
        const discipline = await Discipline.findByIdAndUpdate(req.param.id, {
            ...req.body,
        }, { new: true })
        
        if (req.file){
            discipline.image = req.file.location
        }
        
        await discipline.save()

        return res.send({ discipline })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao atualizar a disciplina.', data: err })
    }
})

// excluir
router.delete('/:id', async (req, res) => {
    try {
        const discipline = await Discipline.findByIdAndDelete(req.param.id)

        return res.send({ discipline })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao deletar a disciplina.', data: err })
    }
})

// ativar
router.patch('/enable/:id', async (req, res) => {
    try {
        const discipline = await Discipline.findByIdAndUpdate(req.param.id, {
            nivel: 2,
        }, { new: true })

        return res.send({ discipline })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao ativar a disciplina.', data: err })
    }
})

// desativar
router.patch('/disable/:id', async (req, res) => {
    try {
        const discipline = await Discipline.findByIdAndUpdate(req.param.id, {
            nivel: 3,
        }, { new: true })
        
        return res.send({ discipline })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao desativar a disciplina.', data: err })
    }
})

module.exports = app => app.use('/disciplines', router)