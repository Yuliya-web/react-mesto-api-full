import {PopupWithForm} from './PopupWithForm.js';
import React from 'react';

export function AddPlacePopup(props) {
  const [name, changeName] = React.useState('');
  const [link, changeLink] = React.useState('');

  function handleChangeName(evt) {
    changeName(evt.target.value)
  }

  function handleChangeLink(evt) {
    changeLink(evt.target.value)
  }
  function handleSubmit (evt) {
    // Запрещаем браузеру переходить по адресу формы
    evt.preventDefault();  
    props.onAddPlace({
      name: name,
      link: link
    });
  } 

  return(
    < PopupWithForm title="Новое место" name="add-" children=
    {<>
      <fieldset className="popup__fieldset">
        <input type="text" className="popup__name-field" id="namePic" name="namePic" placeholder="Название" minLength="1" maxLength="30" required  value={name} onChange={handleChangeName} />
        <span id="namePic-error" className="popup__name-field-error" ></span>
        <input type="url" className="popup__name-field" id="link" name="linkPic" placeholder="Ссылка на картинку" required  value={link} onChange={handleChangeLink}/>
        <span id="link-error" className="popup__name-field-error"></span>
      </fieldset>
    </>}
    text={"Создать"}
    isOpen={props.isOpen}
    onClose={props.onClose}
    onSubmit={handleSubmit}
  />
  )
}