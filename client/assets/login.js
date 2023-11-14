const popup = document.querySelector(".popup");
const loginNav = document.querySelector(".loginNav")
const signupNav = document.querySelector(".signupNav");

const btnPop = document.querySelector("#btnLoginNav");
const closeBtn = document.querySelector(".closeBtn");

const main = document.querySelector(".main");

signupNav.addEventListener('click', ()=>{
    popup.classList.add('active');
})

loginNav.addEventListener('click',()=>{
    popup.classList.remove("active");
})

btnPop.addEventListener('click',()=>{
    popup.classList.add('active-popup');
    main.style.display = 'none';
    popup.style.display = 'flex';
})

closeBtn.addEventListener('click', ()=>{
    popup.classList.remove('active-popup');
    main.style.display='flex';
    popup.style.display='none';

})
