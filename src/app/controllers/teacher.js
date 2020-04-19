const express = require('express')
const authMiddlawere = require('../middleware/auth')
const Teacher = require('../models/teacher')
const multer = require('multer')
const multerConfig = require('../../config/multer')

const router = express.Router()

router.use(authMiddlawere)

// listar
router.get('/', async (req, res) => {
    try {
        const teachers = await Teacher.paginate()

        return res.send({ teachers })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao carregar os professores.', data: err })
    }
})

// ver
router.get('/:id', async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.param.id).populate(['image'])

        return res.send({ teacher })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao carregar o professor.', data: err })
    }
})

// atualizar
router.put('/:id', multer(multerConfig).single('image'), async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndUpdate(req.param.id, {
            ...req.body,
        }, { new: true })
        
        if (req.file){
            teacher.image = req.file.location
        }
        
        await teacher.save()

        return res.send({ teacher })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao atualizar o professor.', data: err })
    }
})

// excluir
router.delete('/:id', async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndDelete(req.param.id)

        return res.send({ teacher })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao deletar o professor.', data: err })
    }
})

// ativar push
router.put('/enable_push', async (req, res) => {
    const { player_id } = req.query
    try {
        const teacher = await Teacher.findByIdAndUpdate(req.user_id, { player_id }, { new: true })

        return res.send({ teacher })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao ativar as notificações, tente novamente.', data: err })
    }
})

// desativar push
router.put('/disable_push', async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndUpdate(req.user_id, { player_id: '' }, { new: true })

        return res.send({ teacher })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao desativar as notificações, tente novamente.', data: err })
    }
})

// ativar
router.put('/enable', async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndUpdate(req.query.user_id, {
            nivel: 2,
        }, { new: true })

        return res.send({ teacher })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao ativar o professor.', data: err })
    }
})

// desativar
router.put('/disable', async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndUpdate(req.query.user_id, {
            nivel: 3,
        }, { new: true })
        
        return res.send({ teacher })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao desativar o professor.', data: err })
    }
})

//sair
router.get('/logout', async(req, res) => {
    try {
        await Teacher.findByIdAndUpdate(req.user_id, { player_id: '' }, { new: true })

        if (req.user_id !== undefined) {
            delete req.user_id
            delete req.type
        }

        return res.send()

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao sair.', data: err })
    }
})

//verificar se está logado
router.get('/logged', async(req, res) => {
    try {
        if(!req.user_id){
            return res.status(400).send({ error: 'Professor desconectado.' })
        }

        const teacher = await Teacher.findById(req.user_id).populate(['image'])

        return res.send({ teacher })

    } catch(err) {
        return res.status(400).send({ error: 'Erro ao verificar o professor.', data: err })
    }
})

module.exports = app => app.use('/teachers', router)