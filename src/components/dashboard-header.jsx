import React from 'react'
import { Columns, Column, DashboardHeader, WrapperBox, ValueBlock, StyledButton } from 'admin-bro/components'

const Header = (props) => {
  return (
    <DashboardHeader style={ {paddingBottom: '100px'} }>
      <Columns>
        <Column width={8}>
          <h1>Bem Vindo!</h1>
          <p>
            Aqui você pode controlar os dados do aplicativo Syscobra PDV.
          </p><p>
            Em breve teremos mais novidades e atualizações. Para dúvida ou sugestões, encontre em contato pelo e-mail <a href='mailto:contato@jonataoliveira.com.br'>contato@jonataoliveira.com.br</a>
          </p>
        </Column>
      </Columns>
    </DashboardHeader>
  )
}

export default Header
