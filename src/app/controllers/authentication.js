const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const multer = require('multer')
const multerConfig = require('../../config/multer')
const authConfig = require('../../config/auth')
const School = require('../models/school')

const router = express.Router()

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret)
}

function welcome_mail(email) {
    try {
        var smtpConfig = {
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass:process.env.MAIL_PASS
            }
        }
        var transporter = nodemailer.createTransport(smtpConfig)
        
        var mailOptions = {
            from: `"Escola Online" <${process.env.MAIL_USER}>`,
            to: email,
            cc: 'jonata.96ol@gmail.com',
            subject: "Bem Vindo(a) a Escola Online",
            text: 'Bem vindo a Escola Online! Seu cadastro foi concuído, agora você pode fazer login no sistema.',
            html: '<h3>Bem vindo a Escola Online!</h3><p>Seu cadastro foi concuído, agora você pode fazer login no sistema.</p>'
        }
        
        transporter.sendMail(mailOptions)

    } catch (err) {
        console.log(err)
    }
}

router.post('/register', multer(multerConfig).single('image'), async  (req, res) => {
    try {
        const { email, document } = req.body
    
        if (await School.findOne({ email }))
            return res.status(400).send({ error: 'Email já registrado.' })

        if (await School.findOne({ document }))
            return res.status(400).send({ error: 'CPF/CNPJ já registrado.' })

        const school = new School({
            ...req.body,
            nivel: 2,
        })
        
        if (req.file){
            school.image = req.file.location
        }

        await school.save()
        school.password = undefined

        welcome_mail(school.email)

        return res.send({ 
            school,
            token: generateToken({ id: school.id }),
        })
    } catch (err) {
        return res.status(400).send({ error: 'Falha ao registrar o usuário. Tente novamente mais tarde.', data: err })
    }
})

router.post('/school_login', async (req, res) => {
    
    const { email, password } = req.body

    var school = await School.findOne({ email }).select('+password').populate(['image'])

    if (!school )
        return res.status(404).send({ error: 'Usuário não encontrado. Tem certeza que informou o e-mail correto?' })

    if (!bcrypt.compareSync(password, school.password))
        return res.status(400).send({ error: 'Senha incorreta.' })
    
    school.password = undefined
    
    res.send({ school,  token: generateToken({ id: school.id }) })
})

router.post('/forgot_password', async (req, res) => {
    const { email } = req.body

    try {
        const school = await School.findOne({ email })

        if (!school)
            return res.status(404).send({ error: 'Email não encontrado.' })

        const token = Math.random(6).toString(36).substring(7).toUpperCase()
        
        const now = new Date()
        now.setHours(now.getHours() + 2 )

        await  School.findByIdAndUpdate(school.id, {
            '$set': {
                password_reset_token: token,
                password_reset_expires: now,
            }
        })

        var smtpConfig = {
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass:process.env.MAIL_PASS
            }
        }
        
        var transporter = nodemailer.createTransport(smtpConfig)
        
        var mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: "Recuperação de senha - Escola Online",
            text: `Sua senha do Escola Online pode ser redefinida com o código abaixo. Se você não solicitou uma nova senha, ignore este e-mail. seu código é ${token} `,
            html: `<p>Sua senha do Escola Online pode ser redefinida com o código abaixo. Se você não solicitou uma nova senha, ignore este e-mail. seu código é <b>${token}</b></p>`
        }
        
        transporter.sendMail(mailOptions, function(error){
            if (error){
                return res.status(400).send({ error: 'Não foi possivel resetar sua senha... Tente novamente!', data: error })
            }
            return res.status(200).send(`Enviamos um e-mail para ${email} com o seu código de recuperação.`)
        })
        
    } catch (err) {
        return res.status(400).send({ error: 'Erro ao recuperar a senha, tente novamente mais tarde.', data: err })
    }
})

router.post('/reset_password', async (req, res) => {
    const { email, password } = req.body
    const {token}= req.query
   
    try {
        const school = await School.findOne({ email })
        .select('+password_reset_token password_reset_expires')

        if (!school)
            return res.status(404).send({ error: 'Email não existe' })

        if (token !== school.password_reset_token)
            return res.status(401).send({ error: 'Token invalido' })
        
        const now = new Date()

        if (now > school.password_reset_expires)
            return res.status(403).send({ error: 'Token expirado, tente novamente.' })

        school.password = password

        await school.save()

        res.send()

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao recuperar a senha, tente novamente mais tarde.', data: err })
    }
})

module.exports = app => app.use('/authentication', router)