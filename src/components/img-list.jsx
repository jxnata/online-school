import React from 'react'

const ImgList = (props) => {
  const { record, property } = props

  
  const populated = record.populated[`${property.name}.0`];
  var value = '';
  var style = {};
    
  if (typeof populated == 'undefined') {
    if (typeof record.populated[`${property.name}`].params.url != 'undefined') {
      value = record.populated[`${property.name}`].params.url;
      style = { borderRadius: 32 };
    } else {
      value = 'https://i.ibb.co/K9JS49L/no-image-default.png';
    }
  } else {
    value = populated.params.url;
  }

  return (
    <a href={value} target='_blank'>
      <img src={value} width='48' height='48' style={style} />
    </a>
  )
}

export default ImgList
