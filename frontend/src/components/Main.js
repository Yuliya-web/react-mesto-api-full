import {Card} from './Card.js';
import React from 'react';
import {CurrentUserContext} from '../contexts/CurrentUserContext.js';

export function Main(props) {
  
  const currentUser = React.useContext(CurrentUserContext);

  return(
    <main className="content">      
      <section className="profile">
        <div className="profile__info">
          <img className="profile__avatar" alt="Аватар" src={currentUser.avatar} />
          <button className="profile__edit-avatar" onClick={props.onEditAvatar} type="button"></button>
          <div className="profile__person">
            <div className="profile__title-and-edit">
              <h1 className="profile__title">{currentUser.name}</h1>
              <button className="profile__edit-button" onClick={props.onEditProfile} type="button"></button>
            </div>
            <p className="profile__subtitle">{currentUser.about}</p>              
          </div>                      
        </div>
        <button className="profile__add-button" onClick={props.onAddPlace} type="button"></button>         
      </section>     
  
      <section className="elements">    
        {props.cards.map((card) => ( <Card             
            card={card}  
            name={card.name}
            link={card.link}  
            key={card._id}
            owner={card.owner}
            likes={card.likes}       
            onCardClick={props.onCardClick}
            onCardLike={props.onCardLike}
            onCardDelete={props.onCardDelete}
            /> 
          
        ))}
      </section> 
    </main>  
  )
}
