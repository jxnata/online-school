import React from 'react'

import { WrapperBox, StyledButton, Columns, Column, PropertyInEdit } from 'admin-bro/components'

export default class EnviarMsg extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      assunto: 'Precisa de ajuda?',
      mensagem: 'Olá! Obrigado por baixar o Syscobra PDV! Ví que você não concluiu o cadastro, precisa de alguma ajuda ou ficou com dúvidas? Posso te ajudar se precisar.',
    }
  }

  render() {
    const { record } = this.props;

    const sendMail = () => {
      try {
          var smtpConfig = {
              host: process.env.MAIL_HOST,
              port: process.env.MAIL_PORT,
              secure: true,
              auth: {
                  user: process.env.MAIL_USER,
                  pass:process.env.MAIL_PASS
              }
          };
          var transporter = nodemailer.createTransport(smtpConfig);
          
          var mailOptions = {
            from: `"Syscobra PDV" <${process.env.MAIL_USER}>`,
            to: record.params.email,
            subject: this.state.assunto,
            text: this.state.mensagem,
            html: `<p>${this.state.mensagem}<p>`
          }
          
          transporter.sendMail(mailOptions);
  
      } catch (err) {
          console.log(err);
      }
  };

    return (
      <WrapperBox border className="content">
        <PropertyInEdit property={{label: 'Assunto', name: 'assunto'}}>
          <input className="input" onChange={e => this.setState({ assunto: e.target.value })} value={this.state.assunto} />
        </PropertyInEdit>
        <PropertyInEdit property={{label: 'Mensagem', name: 'mensagem'}}>
          <input className="input" onChange={e => this.setState({ mensagem: e.target.value })} value={this.state.mensagem} />
        </PropertyInEdit>
        <Columns>
          <Column width={12}>
            <Columns>
              <Column width={2}>
                <StyledButton
                  primary
                  as='a'
                  href={`https://wa.me/55${record.params.celular}?text=${this.state.mensagem}`}
                  target='_blank'
                >
                  <i className="fab fa-whatsapp" />Enviar whatsapp
                </StyledButton>
              </Column>
              <Column width={2}>
                <StyledButton
                  primary
                  as='a'
                  href={`mailto:${record.params.email}?subject=${this.state.assunto}&body=${this.state.mensagem}`}
                  target='_blank'
                >
                  <i className="fas fa-envelope" />Enviar e-mail
                </StyledButton>
              </Column>
            </Columns>
          </Column>
        </Columns>
      </WrapperBox>
    )
  }
}
