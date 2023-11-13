const popup = document.querySelector(".popup");
const loginNav = document.querySelector(".loginNav")
const signupNav = document.querySelector(".signupNav");

signupNav.addEventListener('click', ()=>{
    popup.classList.add('active');
})

loginNav.addEventListener('click',()=>{
    popup.classList.remove("active");
})


