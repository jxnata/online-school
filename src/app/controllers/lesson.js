const express = require('express')
const authMiddlawere = require('../middleware/auth')
const Lesson = require('../models/lesson')
const multer = require('multer')
const multerConfig = require('../../config/multer')

const router = express.Router()

router.use(authMiddlawere)

// listar
router.get('/', async (req, res) => {
    try {
        const lessons = await Lesson.paginate()

        return res.send({ lessons })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao carregar as aulas.', data: err })
    }
})

// ver
router.get('/:id', async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.param.id)

        return res.send({ lesson })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao carregar a escola.', data: err })
    }
})

// atualizar
router.put('/:id', multer(multerConfig).single('image'), async (req, res) => {
    try {
        const lesson = await Lesson.findByIdAndUpdate(req.param.id, {
            ...req.body,
        }, { new: true })
        
        if (req.file){
            lesson.image = req.file.location
        }
        
        await lesson.save()

        return res.send({ lesson })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao atualizar a escola.', data: err })
    }
})

// excluir
router.delete('/:id', async (req, res) => {
    try {
        const lesson = await Lesson.findByIdAndDelete(req.param.id)

        return res.send({ lesson })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao deletar a escola.', data: err })
    }
})

// ativar
router.put('/enable', async (req, res) => {
    try {
        const lesson = await Lesson.findByIdAndUpdate(req.query.user_id, {
            nivel: 2,
        }, { new: true })

        return res.send({ lesson })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao ativar a escola.', data: err })
    }
})

// desativar
router.put('/disable', async (req, res) => {
    try {
        const lesson = await Lesson.findByIdAndUpdate(req.query.user_id, {
            nivel: 3,
        }, { new: true })
        
        return res.send({ lesson })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao desativar a escola.', data: err })
    }
})

module.exports = app => app.use('/lessons', router)