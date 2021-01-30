import {PopupWithForm} from './PopupWithForm.js';
import React from 'react';

export function EditAvatarPopup(props) {
  const avaRef = React.useRef('');

  function handleSubmit(evt) {
    // Запрещаем браузеру переходить по адресу формы
    evt.preventDefault();  
    props.onUpdateAvatar({
      avatar: avaRef.current.value
    });
  } 

  return(
  < PopupWithForm title="Обновить аватар" name="avatar-" children=
    {<>
      <fieldset className="popup__fieldset">
        <input ref={avaRef} type="url" className="popup__name-field" id="linkAva" name="linkAva" placeholder="Ссылка на аватар" required />
        <span id="linkAva-error" className="popup__name-field-error"></span>
      </fieldset>
    </>}
    text={"Сохранить"}
    isOpen={props.isOpen}
    onClose={props.onClose}
    onSubmit={handleSubmit}
  />
  )
}