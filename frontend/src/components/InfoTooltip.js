import React from 'react'
import successPic from '../images/green-icon.svg'
import failPic from '../images/union.svg'

export function InfoTooltip(props) {
    return(
        <section className={`popup ${props.isOpen ? 'popup_opened' : ''}`}>
            <form className='popup__container' name='info'>
                <button className='popup__close-button' type="button" onClick={props.onClose}></button>
                <div className="pic-popup__content" style={{backgroundImage: `url(${props.loggedIn ? successPic : failPic})`}} />
                <h3 className="popup__title">{props.loggedIn ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз.'}</h3>
            </form>
        </section>
    )
}
