const form = document.getElementById('loginForm')

form.addEventListener('submit', evt => {
    evt.preventDefault();
    let data = new FormData(form);
    let user = {};
    data.forEach((value, key) => user[key] = value);
    fetch('/login', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': "application/json"
        }
    })
})


const changeregister= document.getElementById('singup')
changeregister.addEventListener('click',evt=>{ 
    window.location.href = "/register";
}) 

