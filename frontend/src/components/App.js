/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import {Header} from './Header.js';
import {Main} from './Main.js';
import {Footer} from './Footer.js';
import {PopupWithForm} from './PopupWithForm.js';
import {EditProfilePopup} from './EditProfilePopup.js';
import {EditAvatarPopup} from './EditAvatarPopup.js';
import {AddPlacePopup} from './AddPlacePopup.js';
import {ImagePopup} from './ImagePopup.js';
import {Login} from './Login.js';
import {Register} from './Register.js';
import {ProtectedRoute} from './ProtectedRoute.js';
import {InfoTooltip} from './InfoTooltip.js';
import {CurrentUserContext} from '../contexts/CurrentUserContext.js';
import * as auth from '../utils/auth';
import * as apiData from '../utils/api.js'

export default function App() {

  const [isEditProfilePopupOpen, checkIsEditProfilePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, checkIsEditAvatarPopupOpen] = React.useState(false); 
  const [isAddPlacePopupOpen, checkIsAddPlacePopupOpen] = React.useState(false);
  const [selectedCard, checkIsSelectedCard] = React.useState(false);
  const [gettingCard, checkGetCard] = React.useState({name: '', link: ''});
  const [currentUser, setCurrentUser] = React.useState({name: '', about: '', avatar: ''});
  const [cards, setCards] = React.useState([]);
  const [loggedIn, setIsLoggedIn] = React.useState(false);
  const [userData, setUserData] = React.useState({});
  const [token, setToken] = React.useState('');
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);
  const history = useHistory();

  // Вход 
 const handleLogin = () => {
    setIsLoggedIn(true);
  }

  // Авторизация
  function handleLoggedIn(email, password) {
    auth.authorize(email, password)
      .then(data => {
        localStorage.setItem('jwt', data.token);
        setToken(data.token);
        handleLogin();
       // setStatus(true);
        history.push('/');
      })
      .catch((err) => {
       // setStatus(false);
       setIsInfoTooltipOpen(true)
        if (err.status === 400) {
          console.log('Не передано одно из полей');
        } else if (err.status === 401) {
          console.log('Пользователь не найден, либо неверно указаны данные.');
        } else {
          console.log(`Ошибка: ${err.status}`);
        }
      })
  }

  // регистрация пользователя
  function handleRegister(email, password) {
    auth.register(email, password)
    .then((res) => {
      if (res) {
        setIsLoggedIn(true)
        handleInfoTooltipOpen()
        history.push('/signin')        
      }
    })
    .catch(() => {
      handleInfoTooltipOpen()
    })
  }

  function handleLogOut() {
    setIsLoggedIn(false)
  }

  function tokenChecking() {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      setToken(jwt)
      auth.tokenCheck(jwt)
      .then((res) => {
        if (res) {
          setUserData({
            id: res._id,
            email: res.email
          });
          setIsLoggedIn(true);
          history.push("/");
        } else {
          localStorage.removeItem("jwt");
        }
      });
    }
  }

  // проверим токен
  React.useEffect(() => {
    tokenChecking()
  }, []);

  // получение информации о юзере
  React.useEffect(() => {
    if (loggedIn) {
    apiData.getUserInfo(token)
    .then((userData) => {  
      setCurrentUser(userData);  
    })
      .catch((err) => console.log(`Что-то пошло не так :( ${err}`))
    }
  }, [loggedIn]);


  // получение массива карточек
  React.useEffect(() => {
    if (loggedIn) {
    apiData.getCardsServer(token)
      .then((data) => { 
        setCards(data.reverse());
      })
      .catch((err) => console.log(`Что-то пошло не так :( ${err}`))
    }
  }, [loggedIn]);

  function handleEditProfileClick () {
    checkIsEditProfilePopupOpen(true)
  } 
  function handleEditAvatarClick() { 
    checkIsEditAvatarPopupOpen(true)
  }
  function handleAddPlaceClick() {
    checkIsAddPlacePopupOpen(true)
  }
  function handleCardClick(data) {
    checkIsSelectedCard(true);
    checkGetCard({name: data.name, link: data.link});
  }

  // функция открытия попапа при регистрации
  function handleInfoTooltipOpen() {
    setIsInfoTooltipOpen(true)
  }

  function closeAllPopups() {
    checkIsEditProfilePopupOpen(false);
    checkIsEditAvatarPopupOpen(false);
    checkIsAddPlacePopupOpen(false);
    checkIsSelectedCard(false)
    setIsInfoTooltipOpen(false)
  }

  function handleUpdateUser({name, about}) {
    apiData.editProf({name, about}, token)
    .then((userData) => {  
      setCurrentUser(userData); 
      closeAllPopups(); 
    })
    .catch((err) => {
      console.log(err);
    })
  }

  function handleUpdateAvatar({avatar}) {
    apiData.editAvatar( {avatar} , token)
    .then((userData) => {  
      setCurrentUser(userData); 
      closeAllPopups(); 
    })
    .catch((err) => {
      console.log(err);
    })
  }

  function handleCardLike (card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    if (!isLiked) {
      apiData.putLikeCardStatus(card._id, token)
        .then(() => {
          apiData.getCardsServer(token)
          .then((data) => { 
            setCards(data.reverse());       
        })})
        .catch((error) => {
          console.log(error);
        });
    } else {
      apiData.delLikeCardStatus(card._id, token)
        .then(() => {
          apiData.getCardsServer(token)
          .then((data) => { 
            setCards(data.reverse());       
        })})
        .catch((error) => {
          console.log(error);
        })
    }
  }

  function handleCardDelete(card) {
    // Отправляем запрос в API и получаем обновлённые данные карточки
    apiData.delMyCard(card._id, token)
      .then(() => {
        apiData.getCardsServer(token)
        .then((data) => { 
          setCards(data.reverse());
      })})
      .catch((error) => {
        console.log(error);
      })
  }

  function handleAddPlaceSubmit({ name, link}) {    
    apiData.addNewCard({ name, link}, token)
    .then((newCard) => {
      setCards([newCard, ...cards])
      apiData.getCardsServer(token)
      .then((data) => { 
        setCards(data.reverse());       
      })
      closeAllPopups();
    })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      })
  } 

  return (         
    <CurrentUserContext.Provider value={currentUser}>
        
      <div className="page">           
        < Header userData = {userData} handleLogOut = {handleLogOut} />

        < Switch >
          < ProtectedRoute exact path="/" 
              loggedIn={loggedIn} 
              component={Main} 
              onEditProfile = {handleEditProfileClick}
              onEditAvatar = {handleEditAvatarClick}
              onAddPlace = {handleAddPlaceClick}
              onCardClick = {handleCardClick}
              cards = {cards}
              onCardLike = {handleCardLike}
              onCardDelete = {handleCardDelete}
          />
          < Route path="/signin">
              <Login
                  handleLoggedIn = {handleLoggedIn}
                  handleInfoTooltipOpen = {handleInfoTooltipOpen}
              />
          </Route>
          < Route path="/signup">
              <Register
                  handleRegister={handleRegister}
              />
          </Route>
          <Route path="/">
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/signin" />}
          </Route>
        </Switch>

        < Footer />            
      </div>  

      < EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />           
      < EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />
      < AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />

      < PopupWithForm title="Вы уверены?" name="delete-" text={"Да"}/>
      < ImagePopup name="pic-" isOpen={selectedCard} onClose={closeAllPopups} card={gettingCard} /> 
      < InfoTooltip loggedIn={loggedIn} isOpen = {isInfoTooltipOpen} onClose = {closeAllPopups} />

    </CurrentUserContext.Provider>    
  );
}
