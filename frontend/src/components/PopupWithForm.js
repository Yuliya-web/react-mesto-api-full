import React from 'react';

export function PopupWithForm(props) {

  const openedPopup = (props.isOpen) ? ' popup_opened' : '';


  return (    
    <section className={`${props.name}popup`+ openedPopup} >
      <form className='popup__container' name={props.name} onSubmit={props.onSubmit} noValidate>
        <button className="popup__close-button" type="button" onClick={props.onClose}></button> 
        <h3 className="popup__title" >{props.title}</h3>
        {props.children}
      <button className="popup__save-button" type="submit" >{props.text}</button> 
      </form>
    </section>    
  )
}