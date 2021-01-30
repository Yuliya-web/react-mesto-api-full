import React from 'react';
import { Link } from 'react-router-dom';

export function Register(props) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  function handleEmail(evt) {
      setEmail(evt.target.value);
  }

  function handlePassword(evt) {
      setPassword(evt.target.value);
  }

  // отправка формы
  function handleSubmit(evt) {
      evt.preventDefault();
      props.handleRegister(email, password);
  }

  return(
    <>
    
      <form className='popup__container_black' name='register' onSubmit={handleSubmit} noValidate>
        <h3 className="popup__title_white" >Регистрация</h3>
      
        <fieldset className="popup__fieldset">
          <input type="email" className="popup__name-field_black" id="email" name="email" placeholder="Email" minLength="6" maxLength="30" required  value={email} onChange={handleEmail} />
          <input type="password" className="popup__name-field_black" id="password" name="password" placeholder="Пароль" required  value={password} onChange={handlePassword} />
        </fieldset>       
        <button className="popup__save-button_white" type="submit" >Зарегистрироваться</button> 
        <Link className="popup__bottom-text" to="/signin">Уже зарегистрированы? Войти </Link>  

      </form>    
     

    </>
  )
}