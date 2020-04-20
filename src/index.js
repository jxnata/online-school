require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const pt_br = require('./locales/pt-br');

const AdminBro = require('admin-bro')
const AdminBroExpressjs = require('admin-bro-expressjs')

AdminBro.registerAdapter(require('admin-bro-mongoose'))

const Discipline = require('./app/models/discipline')
const Lesson = require('./app/models/lesson')
const School = require('./app/models/school')
const Student = require('./app/models/student')
const Teacher = require('./app/models/teacher')
const Team = require('./app/models/team')

const app = express()

const canAccess = ({ currentAdmin, record }) => {
    return (currentAdmin && (currentAdmin._id === record.param('school')) || currentAdmin && currentAdmin.type === 'admin')
}

const isAdmin = ({ currentAdmin, record }) => {
    return currentAdmin && currentAdmin.type === 'admin'
}

const menu = { name: 'Principal', icon: 'Application' }

AdminBro.ACTIONS.list.before = async (request, { currentAdmin }) => {
    if (currentAdmin && currentAdmin.type === 'admin')
        return request

    request.query = {
        ...request.query,
        'filters.school': currentAdmin._id
    }
    return request
}

AdminBro.ACTIONS.new.before = async (request, { currentAdmin }) => {
    if (currentAdmin && currentAdmin.type === 'admin')
        return request

    request.payload = {
        ...request.payload,
        school: currentAdmin._id,
    }
    return request
}

AdminBro.ACTIONS.show.isAccessible = ({ currentAdmin, resource, record }) => {
    return (currentAdmin && (currentAdmin._id === record.param('school')) || currentAdmin && currentAdmin.type === 'admin')
}

const adminBro = new AdminBro({
    resources: [
        {
            resource: Discipline,
            options: {
                parent: menu,
                properties: {
                    _id: { isVisible: false },
                    name: { isTitle: true },
                    school: { isVisible: isAdmin },
                    created_at: { isVisible: { edit: false, show: false, list: false, filter: false } }
                },
                listProperties: ['name', 'description', 'created_at'],
                filterProperties: ['name', 'description'],
            },
        },
        {
            resource: Lesson,
            options: {
                parent: menu,
                properties: {
                    _id: { isVisible: false },
                    name: { isTitle: true },
                    school: { isVisible: { edit: false, show: isAdmin, list: isAdmin, filter: isAdmin } },
                    created_at: { isVisible: { edit: false, show: false, list: false, filter: false } }
                },
                listProperties: ['title', 'teacher', 'discipline', 'team', 'created_at'],
                filterProperties: ['title', 'description', 'teacher', 'discipline', 'team', 'type'],
            },
        },
        {
            resource: School,
            options: {
                isAccessible: false,
                parent: menu,
                properties: {
                    _id: { isVisible: false },
                    player_id: { isVisible: false },
                    enabled: { isVisible: false },
                    type: { isVisible: false },
                    password_reset_token: { isVisible: false },
                    password_reset_expires: { isVisible: false },
                    name: { isTitle: true },
                    school: { isVisible: { edit: false, show: isAdmin, list: isAdmin, filter: isAdmin } },
                    created_at: { isVisible: { edit: false, show: false, list: false, filter: false } }
                },
                actions: {
                    list: { isAccessible: false }
                },
                listProperties: ['name', 'email', 'document', 'created_at'],
                filterProperties: ['name', 'description', 'document', 'enabled'],
            },
        },
        {
            resource: Student,
            options: {
                parent: menu,
                properties: {
                    _id: { isVisible: false },
                    player_id: { isVisible: false },
                    enabled: { isVisible: false },
                    type: { isVisible: false },
                    password_reset_token: { isVisible: false },
                    password_reset_expires: { isVisible: false },
                    name: { isTitle: true },
                    school: { isVisible: { edit: false, show: isAdmin, list: isAdmin, filter: isAdmin } },
                    created_at: { isVisible: { edit: false, show: true, list: false, filter: false } }
                },
                listProperties: ['name', 'email', 'document', 'created_at'],
                filterProperties: ['name', 'email', 'document'],
            },
        },
        {
            resource: Teacher,
            options: {
                parent: menu,
                properties: {
                    _id: { isVisible: false },
                    player_id: { isVisible: false },
                    enabled: { isVisible: false },
                    type: { isVisible: false },
                    password_reset_token: { isVisible: false },
                    password_reset_expires: { isVisible: false },
                    name: { isTitle: true },
                    school: { isVisible: { edit: false, show: isAdmin, list: isAdmin, filter: isAdmin } },
                    created_at: { isVisible: { edit: false, show: false, list: false, filter: false } }
                },
                listProperties: ['name', 'email', 'document', 'created_at'],
                filterProperties: ['name', 'email', 'document'],
            },
        },
        {
            resource: Team,
            options: {
                parent: menu,
                properties: {
                    _id: { isVisible: false },
                    name: { isTitle: true },
                    school: { isVisible: { edit: false, show: isAdmin, list: isAdmin, filter: isAdmin } },
                    created_at: { isVisible: { edit: false, show: false, list: false, filter: false } }
                },
                listProperties: ['name', 'description', 'created_at'],
                filterProperties: ['name', 'description'],
            },
        }
    ],
    branding: {
        companyName: 'Escola Online',
        logo: 'https://escolaonline.s3.amazonaws.com/Escola_Online_Wisteria.png',
        favicon: 'https://escolaonline.s3.amazonaws.com/Escola_Online_Wisteria.png',
        softwareBrothers: false,
        theme: require('./theme')
    },
    rootPath: '/admin',
    locale: pt_br
})

// Build and use a router which will handle all AdminBro routes
const router = AdminBroExpressjs.buildAuthenticatedRouter(adminBro, {
    authenticate: async (email, password) => {
        const school = await School.findOne({ email }).select('+password')
        if (school) {
            const matched = await bcrypt.compare(password, school.password)
            if (matched) {
                return school
            }
        }
        return false
    },
    cookiePassword: 'escola-online-jxnata',
})

app.use(adminBro.options.rootPath, router)
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
require('./app/controllers/index')(app)

// Running the server
const run = async () => {
    await mongoose.connect(`${process.env.MONGO_DB}`, { useNewUrlParser: true, useUnifiedTopology: true });
    await app.listen(process.env.PORT || 3000, () => console.log(`App listening on port 3000!`))
}

run()