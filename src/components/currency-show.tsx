import React from 'react'
import { Label } from 'admin-bro'


const CurrencyInShow = (props) => {
  const { record, property } = props

  const value = typeof record.params[property.name] == 'undefined' ? ''
  : (record.params[property.name] / 100).toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});

  return (
    <div style={{ marginBottom: 30 }}>
      <Label>{property.label}</Label>
      {value}
    </div>
  )
}

export default CurrencyInShow