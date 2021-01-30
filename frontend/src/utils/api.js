const BASE_URL = 'http://localhost:3000';
  
function getResponseData (res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(res);
}

export const getUserInfo = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    // method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
    .then(getResponseData);
}

export const getCardsServer = (token) => {
  return fetch(`${BASE_URL}/cards`, {
    // method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })    
  .then(getResponseData);
}

export const editProf = ({ name, about }, token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      about
    })
  })
  .then(getResponseData);
}

export const addNewCard = ({ name, link }, token) => {
  return fetch(`${BASE_URL}/cards`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      link
    })
  })
  .then(getResponseData);
}

export const delMyCard = (cardId, token) => {
  return fetch(`${BASE_URL}/cards/${cardId}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    })
    .then(getResponseData);
}

export const delLikeCardStatus = (cardId, token) => {
    return fetch(`${BASE_URL}/cards/${cardId}/likes`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(getResponseData);
}
  export const putLikeCardStatus = (cardId, token) => {
    return fetch(`${BASE_URL}/cards/${cardId}/likes`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(getResponseData);
  }


export const editAvatar = ( {avatar}, token) => {
  return fetch(`${BASE_URL}/users/me/avatar`, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      avatar
    })
  })
  .then(getResponseData);
}

