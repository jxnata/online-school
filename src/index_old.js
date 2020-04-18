require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan')
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const Categoria = require('./app/models/categoria');
const Produto = require('./app/models/produto');
const User = require('./app/models/user');
const Atributo = require('./app/models/atributo');
const Cliente = require('./app/models/cliente');
const Fornecedor = require('./app/models/fornecedor');
const Funcionario = require('./app/models/funcionario');
const Img = require('./app/models/img');
const Item = require('./app/models/item');
const Venda = require('./app/models/venda');

const AdminBro = require('admin-bro')
const AdminBroExpressjs = require('admin-bro-expressjs')
AdminBro.registerAdapter(require('admin-bro-mongoose'))


const app = express();

const canAccess = ({ currentAdmin, record }) => {
return currentAdmin && (
    currentAdmin.nivel === 1 || currentAdmin._id === record.param('user')
    )
}

const isAdmin = ({ currentAdmin }) => {
    return currentAdmin && currentAdmin.nivel === 1
}
            
// Pass all configuration settings to AdminBro
const adminBro = new AdminBro({
    resources: [
        {
            resource: User,
            options: {
                name: 'Usuários',
                sort: { sortBy: 'created_at', direction: 'desc' },
                properties: {
                    nome: { isTitle: true },
                    foto: {
                        label: 'Foto',
                        components: {
                            list: AdminBro.bundle('./components/img-list'),
                            show: AdminBro.bundle('./components/img-show')
                        }
                    },
                    user: { isVisible: { edit: false, show: false, list: false, filter: false } },
                    stripeSubscription: { label: 'Stripe' },
                    created_at: { label: 'Cadastro', isVisible: { edit: false, show: false, list: false, filter: false } }
                },
                listProperties: ['foto', 'nome', 'email', 'stripeSubscription', 'created_at'],
                filterProperties: ['_id', 'nome', 'email', 'doc'],
                actions: {
                    new: { isAccessible: false },
                    show: { isAccessible: canAccess, label: 'Ver' },
                    edit: { isAccessible: canAccess, label: 'Editar' },
                    delete: { isAccessible: canAccess, label: 'Remover', guard: 'Deseja realmente excluir o item?' },
                    list: { isVisible: isAdmin, label: 'Usuários' },
                    mensagem: {
                        actionType: 'record',
                        label: 'Mensagem',
                        icon: 'fas fa-comment',
                        isVisible: true,
                        handler: async (request, response, data) => {
                            return { record: data.record.toJSON() }
                        },
                        component: AdminBro.bundle('./components/enviar-msg'),
                    },
                }
            }
        },
        {
            resource: Categoria,
            options: {
                name: 'Categorias',
                properties: {
                    titulo: { isTitle: true },
                    user: { isVisible: { edit: false, show: false, list: false, filter: false } },
                    created_at: { isVisible: { edit: false, show: false, list: false, filter: false } }
                },
                listProperties: ['titulo', 'descricao', 'user'],
                filterProperties: ['_id', 'titulo', 'descricao', 'user'],
                actions: {
                    edit: { isAccessible: canAccess, label: 'Editar' },
                    delete: { isAccessible: canAccess, label: 'Remover' },
                    new: {
                        label: 'Adicionar',
                        before: async (request, { currentAdmin }) => {
                            request.payload.record = {
                            ...request.payload.record,
                            user: currentAdmin._id,
                            }
                            return request
                        },
                    },
                    list: {
                        label: 'Categorias',
                        before: async (request, { currentAdmin }) => {
                            if (isAdmin) {
                                return {...request, query: {...request.query}}
                            }
                            return {
                                ...request,
                                query: {
                                ...request.query,
                                'filters.user': currentAdmin._id
                                }
                            }
                        },
                    }
                }
            }
        },
        {
            resource: Produto,
            options: {
                name: 'Produtos',
                properties: {
                    nome: { isTitle: true },
                    images: {
                        label: 'Imagens',
                        components: {
                            list: AdminBro.bundle('./components/img-list'),
                            show: AdminBro.bundle('./components/img-show')
                        }
                    },
                    preco: {
                        label: 'Preço',
                        components: {
                            list: AdminBro.bundle('./components/currency'),
                            show: AdminBro.bundle('./components/currency-show')
                        }
                    },
                    preco_custo: {
                        label: 'Preço de Custo',
                        components: {
                            list: AdminBro.bundle('./components/currency'),
                            show: AdminBro.bundle('./components/currency-show')
                        }
                    },
                    user: { isVisible: { edit: false, show: false, list: isAdmin, filter: false } },
                    estoque: { isVisible: { edit: true, show: true, list: !isAdmin, filter: true } },
                    created_at: { isVisible: { edit: false, show: false, list: false, filter: false } }
                },
                listProperties: ['images', 'nome', 'preco', 'estoque', 'user'],
                filterProperties: ['_id', 'nome', 'descricao', 'tipo', 'fornecedores', 'user'],
                actions: {
                    edit: { isAccessible: canAccess, label: 'Editar' },
                    delete: { isAccessible: canAccess, label: 'Remover' },
                    new: {
                        label: 'Adicionar',
                        before: async (request, { currentAdmin }) => {
                            request.payload.record = {
                            ...request.payload.record,
                            user: currentAdmin._id,
                            }
                            return request
                        },
                    },
                    list: {
                        label: 'Produtos',
                        before: async (request, { currentAdmin }) => {
                            if (isAdmin) {
                                return {...request, query: {...request.query}}
                            }
                            return {
                                ...request,
                                query: {
                                ...request.query,
                                'filters.user': currentAdmin._id
                                }
                            }
                        },
                    }
                }
            }
        },
        {
            resource: Atributo,
            options: {
                name: 'Atributos',
                properties: {
                    valor: { isTitle: true },
                    user: { isVisible: { edit: false, show: false, list: isAdmin, filter: isAdmin } },
                    created_at: { isVisible: { edit: false, show: false, list: false, filter: false } }
                },
                listProperties: ['nome', 'valor', 'user'],
                filterProperties: ['_id', 'nome', 'valor', 'user'],
                actions: {
                    edit: { isAccessible: canAccess, label: 'Editar' },
                    delete: { isAccessible: canAccess, label: 'Remover' },
                    new: {
                        label: 'Adicionar',
                        before: async (request, { currentAdmin }) => {
                            request.payload.record = {
                            ...request.payload.record,
                            user: currentAdmin._id,
                            }
                            return request
                        },
                    },
                    list: {
                        label: 'Atributos',
                        before: async (request, { currentAdmin }) => {
                            if (isAdmin) {
                                return {...request, query: {...request.query}}
                            }
                            return {
                                ...request,
                                query: {
                                ...request.query,
                                'filters.user': currentAdmin._id
                                }
                            }
                        },
                    }
                }
            }
        },
        {
            resource: Cliente,
            options: {
                name: 'Clientes',
                properties: {
                    nome: { isTitle: true },
                    user: { isVisible: { edit: false, show: false, list: isAdmin, filter: isAdmin } },
                    created_at: { isVisible: { edit: false, show: false, list: false, filter: false } }
                },
                listProperties: ['nome', 'email', 'codigo', 'tipo', 'user'],
                filterProperties: ['_id', 'nome', 'email', 'doc', 'codigo', 'user'],
                actions: {
                    edit: { isAccessible: canAccess, label: 'Editar' },
                    delete: { isAccessible: canAccess, label: 'Remover' },
                    new: {
                        label: 'Adicionar',
                        before: async (request, { currentAdmin }) => {
                            request.payload.record = {
                            ...request.payload.record,
                            user: currentAdmin._id,
                            }
                            return request
                        },
                    },
                    list: {
                        label: 'Clientes',
                        before: async (request, { currentAdmin }) => {
                            if (isAdmin) {
                                return {...request, query: {...request.query}}
                            }
                            return {
                                ...request,
                                query: {
                                ...request.query,
                                'filters.user': currentAdmin._id
                                }
                            }
                        },
                    }
                }
            }
        },
        {
            resource: Fornecedor,
            options: {
                name: 'Fornecedores',
                properties: {
                    nome: { isTitle: true },
                    user: { isVisible: { edit: false, show: false, list: isAdmin, filter: isAdmin } },
                    created_at: { isVisible: { edit: false, show: false, list: false, filter: false } }
                },
                listProperties: ['nome', 'email', 'telefone', 'tipo', 'user'],
                filterProperties: ['_id', 'nome', 'email', 'telefone', 'doc', 'user'],
                actions: {
                    edit: { isAccessible: canAccess, label: 'Editar' },
                    delete: { isAccessible: canAccess, label: 'Remover' },
                    new: {
                        label: 'Adicionar',
                        before: async (request, { currentAdmin }) => {
                            request.payload.record = {
                            ...request.payload.record,
                            user: currentAdmin._id,
                            }
                            return request
                        },
                    },
                    list: {
                        label: 'Fornecedores',
                        before: async (request, { currentAdmin }) => {
                            if (isAdmin) {
                                return {...request, query: {...request.query}}
                            }
                            return {
                                ...request,
                                query: {
                                ...request.query,
                                'filters.user': currentAdmin._id
                                }
                            }
                        },
                    }
                }
            }
        },
        {
            resource: Funcionario,
            options: {
                name: 'Funcionários',
                properties: {
                    nome: { isTitle: true },
                    user: { isVisible: { edit: false, show: false, list: isAdmin, filter: isAdmin } },
                    created_at: { isVisible: { edit: false, show: false, list: false, filter: false } }
                },
                listProperties: ['nome', 'email', 'user'],
                filterProperties: ['_id', 'nome', 'email', 'user'],
                actions: {
                    edit: { isAccessible: canAccess, label: 'Editar' },
                    delete: { isAccessible: canAccess, label: 'Remover' },
                    new: {
                        label: 'Adicionar',
                        before: async (request, { currentAdmin }) => {
                            request.payload.record = {
                            ...request.payload.record,
                            user: currentAdmin._id,
                            }
                            return request
                        },
                    },
                    list: {
                        label: 'Funcionários',
                        before: async (request, { currentAdmin }) => {
                            if (isAdmin) {
                                return {...request, query: {...request.query}}
                            }
                            return {
                                ...request,
                                query: {
                                ...request.query,
                                'filters.user': currentAdmin._id
                                }
                            }
                        },
                    }
                }
            }
        },
        {
            resource: Img,
            options: {
                properties: {
                    url: { isTitle: true },
                    user: { isVisible: { edit: false, show: false, list: false, filter: false } },
                    created_at: { isVisible: { edit: false, show: false, list: false, filter: false } }
                },
                actions: {
                    edit: { isAccessible: canAccess, label: 'Editar' },
                    delete: { isAccessible: canAccess, label: 'Remover' },
                    new: {
                        label: 'Adicionar',
                        before: async (request, { currentAdmin }) => {
                            request.payload.record = {
                            ...request.payload.record,
                            user: currentAdmin._id,
                            }
                            return request
                        },
                    },
                    list: { isVisible: false }
                }
            }
        },
        {
            resource: Item,
            options: {
                properties: {
                    nome: { isTitle: true },
                    user: { isVisible: { edit: false, show: false, list: false, filter: false } },
                    created_at: { isVisible: { edit: false, show: false, list: false, filter: false } }
                },
                actions: {
                    edit: { isAccessible: canAccess, label: 'Editar' },
                    delete: { isAccessible: canAccess, label: 'Remover' },
                    new: {
                        label: 'Adicionar',
                        before: async (request, { currentAdmin }) => {
                            request.payload.record = {
                            ...request.payload.record,
                            user: currentAdmin._id,
                            }
                            return request
                        },
                    },
                    list: { isVisible: false }
                }
            }
        },
        {
            resource: Venda,
            options: {
                name: 'Vendas',
                properties: {
                    identificador: { isTitle: true },
                    desconto: {
                        components: {
                            list: AdminBro.bundle('./components/currency'),
                            show: AdminBro.bundle('./components/currency-show')
                        }
                    },
                    total: {
                        components: {
                            list: AdminBro.bundle('./components/currency'),
                            show: AdminBro.bundle('./components/currency-show')
                        }
                    },
                    subtotal: {
                        components: {
                            list: AdminBro.bundle('./components/currency'),
                            show: AdminBro.bundle('./components/currency-show')
                        }
                    },
                    valor_pago: {
                        components: {
                            list: AdminBro.bundle('./components/currency'),
                            show: AdminBro.bundle('./components/currency-show')
                        }
                    },
                    user: { isVisible: { edit: false, show: false, list: isAdmin, filter: isAdmin } },
                    created_at: { isVisible: { edit: false, show: false, list: false, filter: false } }
                },
                listProperties: ['identificador', 'total', 'pagamento', 'status', 'user'],
                filterProperties: ['identificador', 'pagamento', 'status', 'user'],
                actions: {
                    edit: { isAccessible: canAccess, label: 'Editar' },
                    delete: { isAccessible: canAccess, label: 'Remover' },
                    new: {
                        label: 'Adicionar',
                        before: async (request, { currentAdmin }) => {
                            request.payload.record = {
                            ...request.payload.record,
                            user: currentAdmin._id,
                            }
                            return request
                        },
                    },
                    list: {
                        label: 'Vendas',
                        before: async (request, { currentAdmin }) => {
                            if (isAdmin) {
                                return {...request, query: {...request.query}}
                            }
                            return {
                                ...request,
                                query: {
                                ...request.query,
                                'filters.user': currentAdmin._id
                                }
                            }
                        },
                    }
                },
            }
        },
    ],
    rootPath: '/admin',
    branding: {
        companyName: 'Syscobra',
        logo: 'https://syscobra.com.br/assets/images/about-logo.png',
        favicon: 'https://syscobra.com.br/assets/images/about-logo.png',
        softwareBrothers: false,
    },
    dashboard: {
        handler: async (request, response, data) => {
            return {
                usersCount: await User.countDocuments(),
                produtosCount: await Produto.countDocuments(),
                funcionariosCount: await Funcionario.countDocuments(),
            }
        },
        component: AdminBro.bundle('./components/dashboard'),
    },
})

// Build and use a router which will handle all AdminBro routes
const router = AdminBroExpressjs.buildAuthenticatedRouter(adminBro, {
    authenticate: async (email, password) => {
        const user = await User.findOne({ email }).select('+senha')
        if (user) {
            const matched = await bcrypt.compare(password, user.senha)
            if (matched) {
                return user
            }
        }
        return false
    },
    cookiePassword: 'some-secret-password-used-to-secure-cookie',
})

app.use(adminBro.options.rootPath, router)
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/files", 
    express.static(path.resolve(__dirname, "..","img","uploads"))
)
app.use(morgan('dev'))
require('./app/controllers/index')(app);

// Running the server
const run = async () => {
    await mongoose.connect(`${process.env.MONGO_DB}`, { useNewUrlParser: true, useUnifiedTopology: true });
    await app.listen(process.env.PORT || 3000, () => console.log(`App listening on port 3000!`))
}
  
run()