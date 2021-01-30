export const savingText = (isLoading, button, buttonText) => {
  if(isLoading){
    button.textContent = 'Сохранение...';
  } else {
    button.textContent = buttonText;
  }
}