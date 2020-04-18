import React from 'react'

import { ApiClient, ViewHelpers } from 'admin-bro'
import { Label, Table, Columns, Column, WrapperBox, ValueBlock, StyledButton } from 'admin-bro/components'
import { colors } from 'admin-bro/style'

import DashboardHeader from './dashboard-header'

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.h = new ViewHelpers()
    this.state = {
      data: {
        produtosCount: 0,
        usersCount: 0,
        funcionariosCount: 0,
      }
    }
  }

  componentDidMount() {
    const api = new ApiClient()
    api.getDashboard({test: 1}).then((response) => {
      this.setState({ data: response.data })
    })
  }

  render() {
    const { produtosCount, funcionariosCount, usersCount } = this.state.data

    return (
      <React.Fragment>
        <DashboardHeader />
        <WrapperBox style={{ marginTop: '-100px', zIndex: 2 }}>
          <Columns>
            <Column width={12}>
              <Columns>
                <Column width={4}>
                  <ValueBlock
                    value={usersCount}
                    icon="fas fa-user"
                    color={colors.primary}
                    href={this.h.listUrl({ resourceId: 'User' })}
                    label="Usuários"
                  />
                </Column>
                <Column width={4}>
                  <ValueBlock
                    value={produtosCount}
                    icon="fas fa-th-large"
                    color={colors.primary}
                    href={this.h.listUrl({ resourceId: 'Produto' })}
                    label="Produtos"
                  />
                </Column>
                <Column width={4}>
                  <ValueBlock
                    value={funcionariosCount}
                    icon="fas fa-tags"
                    color={colors.primary}
                    href={this.h.listUrl({ resourceId: 'Funcionario' })}
                    label="Funcionários"
                  />
                </Column>
              </Columns>
            </Column>
          </Columns>
        </WrapperBox>
      </React.Fragment>
    )
  }
}
