import {PopupWithForm} from './PopupWithForm.js';
import React from 'react';
import {CurrentUserContext} from '../contexts/CurrentUserContext.js';

export function EditProfilePopup(props) {
  const currentUser = React.useContext(CurrentUserContext);
  const [name, changeName] = React.useState('');
  const [description, changeDescription] = React.useState('');

  React.useEffect(() => {
    changeName(currentUser.name);
    changeDescription(currentUser.about)
  }, [currentUser] )

  function handleChangeName(evt) {
    changeName(evt.target.value)
  }

  function handleChangeDescription(evt) {
    changeDescription(evt.target.value)
  }

  function handleSubmit(evt) {
    // Запрещаем браузеру переходить по адресу формы
    evt.preventDefault();  
    // Передаём значения управляемых компонентов во внешний обработчик
    props.onUpdateUser({
      name: name,
      about: description,
    });
  } 

  return(
    < PopupWithForm 
      title="Редактировать профиль" name="" children=
        {<>
          <fieldset className="popup__fieldset">
            <input type="text" className="popup__name-field" id="Name" name="nameInput" placeholder="Имя" minLength="2" maxLength="40" required value={name} onChange={handleChangeName}/>
            <span id="Name-error" className="popup__name-field-error"></span>
            <input type="text" className="popup__name-field" id="About" name="jobInput" placeholder="О себе" minLength="2" maxLength="200" required value={description} onChange={handleChangeDescription}/>
            <span id="About-error" className="popup__name-field-error"></span>
          </fieldset>
        </>}
      text={"Сохранить"}
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    /> 
  )
}
