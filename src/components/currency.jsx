import React from 'react'
import { Label } from 'admin-bro'

const Currency = (props) => {
  const { record, property } = props;
  const value = typeof record.params[property.name] == 'undefined' ? ''
  : (record.params[property.name] / 100).toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});

  return (
    <b>{value}</b>
  )
}

export default Currency
