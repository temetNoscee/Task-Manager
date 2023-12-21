const expendedArea = document.querySelector('#new-task-input');
const addTaskBtn = document.querySelector('#new-task-submit');


expendedArea.addEventListener('input', function () {
    this.style.height = 'auto'; // Yüksekliği sıfırla
    this.style.height = (this.scrollHeight) + 'px'; // Yazıya göre yüksekliği ayarla
});
/****************************Add New Task****************************************/ 
addTaskBtn.addEventListener('click',async(e)=>{
    e.preventDefault();
    //console.log("Button clicked");
    const user  = window.location.pathname.split('/')[2];
    const task = document.querySelector('#new-task-input').value;
    console.log(task)
    try{
        if(!task){
            throw new Error("Tasks cannot be left empty.");
        }
    
        const response = await fetch("http://localhost:8000/addNewTask",{
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({user, task})
        })

        const result = await response.json();
        console.log(result);

        location.reload();
        

    }catch(err){
        document.querySelector("#error").innerHTML = err.message;
    }
})

/*******************SHOW TASKS*********************************/

document.addEventListener('DOMContentLoaded', async()=>{
    const user  = window.location.pathname.split('/')[2];
    document.querySelector("#username").innerHTML = `Hi ${user[0].toUpperCase()}${user.substring(1)}`;
    const response = await fetch("http://localhost:8000/showTasks",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user }),
    })

    const result = await response.json();
    console.log("result:", result);
    if(result[0]){
        const taskList = document.querySelector("#tasks");
        taskList.classList.add(`${result[0].username}`)
        result.forEach(element => {
            taskList.innerHTML += `<div class="task" id="${element.task_id}">
            <div class="task-content">
                
                <textarea class="text" readonly>${element.task}</textarea>
            </div>
            <div class="actions">
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            </div>
        </div>` 
        });

    }

/***********************DELETE TASK*****************************************/
    document.querySelectorAll('#tasks .delete').forEach(button => {
        button.addEventListener('click', async()=> {
            const user  = window.location.pathname.split('/')[2];
            const parentNode = button.parentNode.parentNode;
            const taskId = parentNode.id
            try{
                const response = await fetch("http://localhost:8000/deleteTask",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user,taskId }),
            })
            }catch(err){
                console.log(err);
            }

            location.reload();
        
        });
    });

/***********************EDIT TASK*****************************************/
    document.querySelectorAll('#tasks .edit').forEach(button =>{
        button.addEventListener('click', async()=>{
            const input = button.parentElement.parentElement.querySelector('.text');
            const taskId = button.parentNode.parentNode.id;
            if(button.innerHTML.toLowerCase() == "edit"){
                input.removeAttribute("readonly");
                input.focus();
                button.innerHTML = "Save";
                adjustTextareaHeight(input);
            }else{
                input.setAttribute("readonly", "readonly");
                const newTask = input.value;
                button.innerHTML = "Edit";
                try{
                    console.log("aaaaaaaa");
                    const response = await fetch("http://localhost:8000/editTask",{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ newTask,taskId }),
                    })
                    
                    
                    location.reload();

                }catch(err){
                    console.log(err);
                }

                console.log("aabaaaaaa");
            }

        })
    })


    /****************************DENEME************************/
    function adjustTextareaHeight(textarea) {
        textarea.style.height = 'auto'; 
        textarea.style.height = textarea.scrollHeight + 'px'; 
    }

    const textareas = document.querySelectorAll('.text');
    textareas.forEach(textarea => {
        // Listen for input changes within specific tasks and adjust height accordingly
        textarea.addEventListener('input', () => {
            adjustTextareaHeight(textarea);
        });
    });
    
})

/****************************LOG OUT ***************************************/

const logoutButton = document.getElementById('logoutButton');

    logoutButton.addEventListener('click', async()=> {
        console.log("first click")
        try{
            const response = await fetch("http://localhost:8000/logout",{
                method: "GET",
            });
            
            window.location.href = '/'; // Log out URL'si
            console.log('Logged out!');
        }
        catch(err){
            console.log(err);
        }

    });


