module.exports = {
  translations: {
    actions: {
      new: 'Adicionar',
      edit: 'Editar',
      show: 'Ver',
      delete: 'Remover',
      bulkDelete: 'Remover todos',
      list: 'Listar',
    },
    buttons: {
      save: 'Salvar',
      filter: 'Filtrar',
      applyChanges: 'Aplicar',
      resetFilter: 'Desfazer',
      confirmRemovalMany: 'Confirme a remoção de {{count}} registros',
      confirmRemovalMany_plural: 'Confirme a remoção de {{count}} registros',
      login: 'Entrar',
      logout: 'Sair',
      seeTheDocumentation: 'Veja: <1>the documentation</1>',
      createFirstRecord: 'Criar primeiro registro',
      from: 'De',
      to: 'Até',
    },
    labels: {
      navigation: 'Administração',
      pages: 'Páginas',
      selectedRecords: 'Selecionados ({{selected}})',
      filters: 'Filtros',
      adminVersion: 'Admin: {{version}}',
      appVersion: 'App: {{version}}',
      loginWelcome: 'Bem Vindo!',
      Discipline: 'Disciplinas',
      Lesson: 'Aulas',
      School: 'Escolas',
      Student: 'Alunos',
      Teacher: 'Professores',
      Team: 'Classes',
    },
    properties: {
      name: 'Nome',
      description: 'Descrição',
      title: 'Título',
      email: 'E-mail',
      password: 'Senha',
      image: 'Imagem',
      created_at: 'Criado em',
      document: 'CNPJ',
      mobile_phone: 'Celular',
      phone: 'Telefone',
      address: 'Endereço',
      number: 'Número',
      district: 'Bairro',
      city: 'Cidade',
      state: 'Estado',
      zipcode: 'CEP',
      enabled: 'Ativo',
      url: 'Link do conteúdo',
      birth_date: 'Data de Nascimento',
      discipline: 'Disciplina(s)',
      lesson: 'Aula',
      school: 'Escola',
      student: 'Aluno',
      teacher: 'Professor',
      team: 'Classe(s)',
    },
    resources: {
      Student: {
        properties: {
          document: 'CPF',
        },
        actions: {
          disable: 'Ativar/Desativar.'
        }
      },
      Teacher: {
        properties: {
          document: 'CPF',
        },
        actions: {
          disable: 'Ativar/Desativar.'
        }
      },
    },
    messages: {
      successfullyBulkDeleted: '{{count}} registro removido com sucesso!',
      successfullyBulkDeleted_plural: '{{count}} registros removidos com sucesso!',
      successfullyDeleted: 'Registro excluído com sucesso!',
      successfullyUpdated: 'Registro atualizado com sucesso!',
      thereWereValidationErrors: 'Existem erros de validação - confira abaixo',
      successfullyCreated: 'Novo registro criado com sucesso!',
      bulkDeleteError: 'Ocorreu um erro ao excluir registros. Confira o console para ver mais informações',
      errorFetchingRecords: 'Ocorreu um erro ao buscar registros. Confira o console para ver mais informações',
      errorFetchingRecord: 'Ocorreu um erro ao buscar o registro, Confira o console para ver mais informações',
      noRecordsSelected: 'Você não selecionou nenhum registro',
      theseRecordsWillBeRemoved: 'O registro a seguir será removido',
      theseRecordsWillBeRemoved_plural: 'Os seguintes registros serão removidos',
      pickSomeFirstToRemove: 'Para remover registros, você deve selecioná-los primeiro',
      error404Resource: 'O recurso do ID fornecido: {{resourceId}} não pode ser encontrado',
      error404Action: 'O recurso do ID fornecido: {{resourceId}} não possui uma ação com o nome: {{actionName}}',
      error404Record: 'O recurso do ID fornecido: {{resourceId}} não possui um registro com o ID: {{recordId}}',
      seeConsoleForMore: 'Consulte o console de desenvolvimento para obter mais detalhes ...',
      noActionComponent: 'Você precisa implementar o componente de ação para sua ação',
      noRecordsInResource: 'Nenhum registro cadastrado',
      confirmDelete: 'DESEJA MESMO REMOVER ESTE ITEM?',
      welcomeOnBoard_title: 'Bem Vindo!',
      welcomeOnBoard_subtitle: 'Aqui você pode controlar os dados do aplicativo Escola Online. Fique sempre atento às denúncias para se necessário, remover anúncios mal intencionados.',
      loginWelcome: 'Faça login com seu e-mail e senha para gerenciar a aplicação.',
      invalidCredentials: 'E-mail ou senha incorretos.',
      ultimasDenuncias: 'Últimas denúncias',
      anunciosSuspeitos: 'Anúncios Suspeitos',
    }
  },
}