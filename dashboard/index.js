const loginpPage = document.querySelector('.loginPage')
const registerPage = document.querySelector('.registerPage')
const mainContent = document.querySelector('.mainContent')

const closeIcons = document.querySelectorAll('.closeIcon')
function moveHome(){
    registerPage.style.display = 'none';
    loginpPage.style.display = 'none';
    mainContent.style.display = 'block';
    
}
closeIcons.forEach(closeIcon => closeIcon.addEventListener('click', moveHome))




const loginBtns = document.querySelectorAll('.login_Btn')
const registerBtns = document.querySelectorAll('.register_Btn')

loginBtns.forEach(loginBtn => {
    loginBtn.addEventListener('click', function(){
        mainContent.style.display =  'none';
        registerPage.style.display = 'none'
        loginpPage.style.display = 'flex';
    })
})

registerBtns.forEach(registerBtn => {
    registerBtn.addEventListener('click', function(){
        mainContent.style.display =  'none';
        loginpPage.style.display = 'none';
        registerPage.style.display = 'flex';
    })
})





