export function ImagePopup(props) {
  const isOpen = (props.isOpen) ? ' popup_opened' : '';
  return (
    <section className={`${props.name}popup`+isOpen}>
      <div className="pic-popup__container">
        <button className="pic-popup__close-button" type="button" onClick={props.onClose}></button> 
        <figure className="pic-popup__content-and-name">
          <img className="pic-popup__content" alt="Фото в полном размере" src={props.card.link}/>          
          <figcaption className="pic-popup__name">{props.card.name}</figcaption>
        </figure>          
      </div>
    </section>
  )
}