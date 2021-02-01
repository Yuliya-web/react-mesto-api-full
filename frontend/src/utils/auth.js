//const BASE_URL = 'http://localhost:3000';
//const BASE_URL = 'https://auth.nomoreparties.co';
const BASE_URL = 'https://api.mesto1.students.nomoredomains.rocks';

export const authorize = (email, password) => {
    return fetch(`${BASE_URL}/signin`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    })
    .then(res => {
        if (res.status === 400) {
            throw new Error('Не передано одно из полей')
        } else if (res.status === 401) {
            throw new Error('Некорректный email или пароль')
        } else if (res.status === 409) {
            throw new Error('Такой email уже был зарегистрирован!')
        } else
        return res.json()
    })
    .then((data) => {
        if (data.token){
          localStorage.setItem('jwt', data.token);
          return data;
        }
      })
    .catch((err) => console.log(err))
}

export const register = (email, password) => {
    return fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(res => {
        if (res.status === 400) {throw new Error('Некорректно заполнено одно из полей')} 
        else if (res.status === 409) {throw new Error('Такой email уже был зарегистрирован!')}        
        else return res.json()
    })
    .then(res => res)
}
export const tokenCheck = (token) => {
    return fetch(`${BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })
    .then(res => {
        if (res.status === 400) {
            throw new Error('Не передано одно из полей')
        } else if (res.status === 401) {
            throw new Error('Некорректный email или пароль')
        } else
        return res.json()
    })
    .then(res => res)
}