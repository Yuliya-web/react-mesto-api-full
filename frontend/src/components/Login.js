import React, { useState } from 'react';

export function Login(props) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailInput = (evt) => setEmail(evt.target.value);
  const handlePasswordInput = (evt) => setPassword(evt.target.value);

  function handleLogin(evt) {
    evt.preventDefault()
    props.handleLoggedIn(email, password)
}

  return(
    <form className='popup__container_black' name='login' onSubmit={handleLogin} noValidate>
      <h3 className='popup__title_white' >Вход</h3>
    
      <fieldset className="popup__fieldset">
          <input type="email" className="popup__name-field_black" id="email" name="email" placeholder="Email" minLength="6" maxLength="30" required  value={email} onChange={handleEmailInput} />
          <input type="password" className="popup__name-field_black" id="password" name="password" placeholder="Пароль" required  value={password} onChange={handlePasswordInput} />
      </fieldset>
      <button className="popup__save-button_white" type="submit" >Войти</button> 

    </form> 
  
  )
}
