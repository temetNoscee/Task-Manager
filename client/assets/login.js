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


const loginBtn = document.querySelector(".loginbtn");
const signupBtn = document.querySelector(".signbtn");

signupBtn.addEventListener('click',async(event)=>{
    event.preventDefault();
    const username = document.querySelector("#s-username").value;
    const email = document.querySelector("#s-email").value;
    const password = document.querySelector("#s-password").value;

    try{
        if(!username || !email || !password){
            throw new Error("Please enter a valid value.")
        }

        const response = await fetch("http://localhost:8000/signup",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
              },
            body: JSON.stringify({ username, email, password }),
        })

        const result = await response.json();
        if(result.err) throw new Error(result.err);
        window.location.href = `tasks/${result.username}`;
        // window.navigation.navigate(`tasks/${result.username}`);
        return;

    }catch(err){
        document.querySelector("#signup-error").innerHTML = err.message;
        document.querySelector("#s-username").value = '';
        document.querySelector("#s-email").value = '';
        document.querySelector("#s-password").value = '';
        console.log(err);
    }

})

loginBtn.addEventListener('click',async(event)=>{
    event.preventDefault();
    const email = document.querySelector("#l-email").value;
    const password = document.querySelector("#l-password").value;
    //console.log(email);
    try{
        if(!email || !password){
            throw new Error("Please enter a valid value.")
        }

        const response = await fetch("http://localhost:8000/login",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
              },
            body: JSON.stringify({email, password }),
        })

        const result = await response.json();
        if(result.err) throw new Error(result.err);
        window.location.href = `tasks/${result.username}`;
        // window.navigation.navigate(`tasks/${result.username}`);
        return;

    }catch(err){
        console.log("err: ", err)
        document.querySelector("#login-error").innerHTML = err.message;
        document.querySelector("#l-email").value = '';
        document.querySelector("#l-password").value = '';
    }
})
    

