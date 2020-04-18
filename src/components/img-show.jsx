import React from 'react'
import { Label } from 'admin-bro'

const ImgShow = (props) => {
  const { record, property } = props
  
  var images = [];

  for (let index = 0; index < 10; index++) {
    const element = record.populated[`${property.name}.${index}`];

    if (typeof element != 'undefined') {
      images.push(element.params.url)
    }
  }
  
  if (images.length == 0) {
    if (typeof record.populated[`${property.name}`].params.url != 'undefined') {
      images.push(record.populated[`${property.name}`].params.url)
    }
  }

  return (
    <div style={{ marginBottom: 30 }}>
      <Label>{property.label}</Label>
      {images.map(url => (
        <a key={url} href={url} target='_blank' style={{ marginRight: 10 }}>
          <img src={url} width='128' height='128' />
        </a>
      ))}
      
    </div>
  )
}

export default ImgShow
