const express = require('express');
const authMiddlawere = require('../middleware/auth');
const School = require('../models/school');
const multer = require('multer');
const multerConfig = require('../../config/multer');

const router = express.Router();

router.use(authMiddlawere);

// listar
router.get('/', async (req, res) => {
    try {
        const schools = await School.paginate()

        return res.send({ schools })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao carregar as escolas.', data: err })
    }
});

// ver
router.get('/:id', async (req, res) => {
    try {
        const school = await School.findById(req.param.id).populate(['image'])

        return res.send({ school })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao carregar a escola.', data: err })
    }
});

// atualizar
router.put('/:id', multer(multerConfig).single('image'), async (req, res) => {
    try {
        const school = await School.findByIdAndUpdate(req.param.id, {
            ...req.body,
        }, { new: true })
        
        if (req.file){
            school.image = req.file.location
        }
        
        await school.save()

        return res.send({ school })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao atualizar a escola', data: err })
    }
});

// excluir
router.delete('/:id', async (req, res) => {
    try {
        const school = await School.findByIdAndDelete(req.param.id)

        return res.send({ school })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao deletar a escola', data: err })
    }
});

// ativar push
router.put('/enable_push', async (req, res) => {
    const { player_id } = req.query;
    try {
        const school = await School.findByIdAndUpdate(req.user_id, { player_id }, { new: true })

        return res.send({ school })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao ativar as notificações, tente novamente', data: err })
    }
});

// desativar push
router.put('/disable_push', async (req, res) => {
    try {
        const school = await School.findByIdAndUpdate(req.user_id, { player_id: '' }, { new: true })

        return res.send({ school })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao desativar as notificações, tente novamente', data: err })
    }
});

// ativar
router.put('/enable', async (req, res) => {
    try {
        const school = await School.findByIdAndUpdate(req.query.user_id, {
            nivel: 2,
        }, { new: true })

        return res.send({ school })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao ativar a escola.', data: err })
    }
});

// desativar
router.put('/disable', async (req, res) => {
    try {
        const school = await School.findByIdAndUpdate(req.query.user_id, {
            nivel: 3,
        }, { new: true })
        
        return res.send({ school })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao desativar a escola.', data: err })
    }
});

//sair
router.get('/logout', async(req, res) => {
    try {
        await School.findByIdAndUpdate(req.user_id, { player_id: '' }, { new: true })

        if (req.user_id !== undefined) {
            delete req.user_id
            delete req.type
        }

        return res.send()

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao sair', data: err });
    }
})

//verificar se está logado
router.get('/logged', async(req, res) => {
    try {
        if(!req.user_id){
            return res.status(400).send({ error: 'Escola desconectada.' })
        }

        const school = await School.findById(req.user_id).populate(['image'])

        return res.send({ school })

    } catch(err) {
        return res.status(400).send({ error: 'Erro ao verificar a escola.', data: err });
    }
})

module.exports = app => app.use('/schools', router);