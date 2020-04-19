const express = require('express')
const authMiddlawere = require('../middleware/auth')
const Student = require('../models/student')
const multer = require('multer')
const multerConfig = require('../../config/multer')

const router = express.Router()

router.use(authMiddlawere)

// listar
router.get('/', async (req, res) => {
    try {
        const students = await Student.paginate()

        return res.send({ students })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao carregar os alunos.', data: err })
    }
})

// ver
router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.param.id).populate(['image'])

        return res.send({ student })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao carregar o aluno.', data: err })
    }
})

// atualizar
router.put('/:id', multer(multerConfig).single('image'), async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.param.id, {
            ...req.body,
        }, { new: true })
        
        if (req.file){
            student.image = req.file.location
        }
        
        await student.save()

        return res.send({ student })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao atualizar o aluno.', data: err })
    }
})

// excluir
router.delete('/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.param.id)

        return res.send({ student })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao deletar o aluno.', data: err })
    }
})

// ativar push
router.put('/enable_push', async (req, res) => {
    const { player_id } = req.query
    try {
        const student = await Student.findByIdAndUpdate(req.user_id, { player_id }, { new: true })

        return res.send({ student })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao ativar as notificações, tente novamente.', data: err })
    }
})

// desativar push
router.put('/disable_push', async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.user_id, { player_id: '' }, { new: true })

        return res.send({ student })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao desativar as notificações, tente novamente.', data: err })
    }
})

// ativar
router.put('/enable', async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.query.user_id, {
            nivel: 2,
        }, { new: true })

        return res.send({ student })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao ativar o aluno.', data: err })
    }
})

// desativar
router.put('/disable', async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.query.user_id, {
            nivel: 3,
        }, { new: true })
        
        return res.send({ student })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao desativar o aluno.', data: err })
    }
})

//sair
router.get('/logout', async(req, res) => {
    try {
        await Student.findByIdAndUpdate(req.user_id, { player_id: '' }, { new: true })

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
            return res.status(400).send({ error: 'Estudante desconectado.' })
        }

        const student = await Student.findById(req.user_id).populate(['image'])

        return res.send({ student })

    } catch(err) {
        return res.status(400).send({ error: 'Erro ao verificar o aluno.', data: err })
    }
})

module.exports = app => app.use('/students', router)