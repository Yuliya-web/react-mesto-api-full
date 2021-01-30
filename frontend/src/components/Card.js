import {CurrentUserContext} from '../contexts/CurrentUserContext.js';
import React from 'react';

export function Card(props) {

  const currentUser = React.useContext(CurrentUserContext);

  // Определяем, являемся ли мы владельцем текущей карточки
  const isOwn = props.card.owner._id === currentUser._id;

  // Создаём переменную, которую после зададим в `className` для кнопки удаления
  const cardDeleteButtonClassName = (
    isOwn ? 'element__delete-card' : 'element__delete-card_non-visible'
  ); 

    // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
  const isLiked = props.card.likes.some(i => i._id === currentUser._id);

  // Создаём переменную, которую после зададим в `className` для кнопки лайка
  const cardLikeButtonClassName = (
   `element__like ${isLiked ? 'element__like_active' : 'element__like'}`
  ); 

  function handleCardClick() {
    props.onCardClick(props.card)    
  }

  function handleLikeClick() {
    props.onCardLike(props.card)    
  }

  function handleDeleteClick() {
    props.onCardDelete(props.card) 
  }
  return (
    <>
      <div className="element" >
        <img className="element__image" alt={props.card.name} src={props.card.link} onClick={handleCardClick}/>
        <button  className={cardDeleteButtonClassName} type="button" id="delete" onClick={handleDeleteClick}></button>
        <div className="element__text-and-button">         
          <p className="element__title">{props.card.name}</p>
          <div className="element__like-block">
          <button className={cardLikeButtonClassName} type="button" id="like" onClick={handleLikeClick} ></button>
          <p className="element__like-counter">{props.card.likes.length}</p>
          </div>
        </div>  
      </div>  
    </>
  );
}
