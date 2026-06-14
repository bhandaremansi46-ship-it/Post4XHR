const c1 = console.log
const cardcontainer = document.getElementById('cardcontainer')
const inputform = document.getElementById('inputform')
const titlecontrol = document.getElementById('title')
const bodycontrol = document.getElementById('body')
const userIdcontrol = document.getElementById('userId')
const addpost = document.getElementById('addpost')
const updatepost = document.getElementById('updatepost')
const spinner = document.getElementById('spinner')



let Base_url = 'https://jsonplaceholder.typicode.com'
let postArr=[]

function snackbar(msg,icon){
    Swal.fire({
        title : msg,
        icon : icon,
        timer : 3000
    })
}

function fetchproducts(){
    spinner.classList.remove('d-none')
   
    let xhr = new XMLHttpRequest()

    let Post_Url = `${Base_url}/posts`

    xhr.open('GET',Post_Url)

    xhr.send(null)

    xhr.onload = function(){
        postArr= JSON.parse(xhr.response)
        c1(postArr)
        createposts(postArr.reverse())
        
    }
}
fetchproducts()

function createposts(arr){
    let result =''
    arr.forEach(ele=>{
        result += ` <div class="col-md-3 my-4" id="${ele.id}">
            <div class="card h-100">
                <div class="card-header">
                    <h2>${ele.title}</h2>
                </div>
                <div class="card-body">
                    <p>${ele.body}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-primary btn-sm" id="editbtn" onclick="onEdit(this)" >Edit</button>
                    <button class="btn btn-danger btn-sm" id="deletebtn" onclick="onRemove(this)" >Remove</button>

                </div>
            </div>
        </div>`
    })

    cardcontainer.innerHTML=result
  spinner.classList.add('d-none')
}

function onsubmit(eve){
    spinner.classList.remove('d-none')
    eve.preventDefault()

    let NEW_OBJ = {
        title:titlecontrol.value,
        body:bodycontrol.value,
        userId:userIdcontrol,
    }

    let Post_Url = `${Base_url}/posts`

    let xhr = new XMLHttpRequest()

    xhr.open('POST',Post_Url)
    xhr.send(JSON.stringify(NEW_OBJ))

    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            let res = JSON.parse(xhr.response)

            addnewCard(NEW_OBJ,res)
        }
    }
}

function addnewCard(NEW_OBJ,res){
    let Post_OBJ ={
        title:titlecontrol.value,
        body:bodycontrol.value,
        userId:userIdcontrol.value,
        id:res.id
    };

    postArr.unshift(Post_OBJ)

    let div = document.createElement('div');
    div.className = 'col-md-3 my-4';
    div.id = res.id;
    div.innerHTML =`
     <div class="card h-100">
                <div class="card-header">
                    <h2>${NEW_OBJ.title}</h2>
                </div>
                <div class="card-body">
                    <p>${NEW_OBJ.body}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-primary btn-sm" id="editbtn" onclick="onEdit(this)" >Edit</button>
                    <button class="btn btn-danger btn-sm" id="deletebtn" onclick="onRemove(this)" >Remove</button>

                </div>
            </div>
           `

           cardcontainer.prepend(div);

           inputform.reset();
           spinner.classList.add('d-none')

           snackbar(
            `The New Post ID ${res.id} is added successfully!!`,
            'success'
           );
}

function onEdit(ele){
    let EDIT_ID = Number(ele.closest('.col-md-3').id);

    localStorage.setItem('EDIT_ID', EDIT_ID);

    let EDIT_OBJ = postArr.find(post => post.id === EDIT_ID);

    if(EDIT_OBJ){
        titlecontrol.value = EDIT_OBJ.title;
        bodycontrol.value = EDIT_OBJ.body;
        userIdcontrol.value = EDIT_OBJ.userId;

        addpost.classList.add('d-none');
        updatepost.classList.remove('d-none');
    }
}

function onupdate(){
    let UPDATE_ID = localStorage.getItem('EDIT_ID')
    spinner.classList.remove('d-none')

    let UPDATE_OBJ = {
        title : titlecontrol.value,
        body : bodycontrol.value,
        userId : userIdcontrol.value,
        id : userIdcontrol
    }
    let PUT_URL = `${Base_url}/posts/${UPDATE_ID}`
    let xhr = new XMLHttpRequest()

    xhr.open('PUT',PUT_URL)

    xhr.send(UPDATE_OBJ)

    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            let div = document.getElementById(UPDATE_ID)
            let h2 = div.querySelector('.card-header h2')

            h2.innerText = UPDATE_OBJ.title

            let p = div.querySelector('.card-body p')
            p.innerText = UPDATE_OBJ.body

            snackbar(`The Post ID ${UPDATE_OBJ} is Updated Successfully !!!` , 'success')

            addpost.classList.remove('d-none')
            updatepost.classList.add('d-none')
            spinner.classList.add('d-none')
            inputform.reset()

        }else{
            let err = xhr.response
            snackbar(err,'error')
        }
    }
    spinner.classList.add('d-none')
}

function onRemove(ele){
    let REMOVE_ID = ele.closest('.col-md-3').id
    spinner.classList.remove('d-none')

    Swal.fire({
        title: "Are You sure ?",
        text : "You won't be able to revert this !",
        icon : "warning",
        showCancelButton : true,
        confirmButtonColor : "#619ec5",
        confirmButtonColor :  "#d63030",
        confirmButtonText : "Yes, Delete It!"
    }).then((result)=>{
        if(result.isConfirmed){
            let REMOVE_URL =`${Base_url}/posts/${REMOVE_ID}`

            let xhr = new XMLHttpRequest()
            
            xhr.open('DELETE',REMOVE_URL)

            xhr.send(null)

            xhr.onload = function(){
                ele.closest('.col-md-3').remove();

                snackbar(`the card ID ${REMOVE_ID} is removed SUccessFully!!!` , 'success')

                     
            }

         
        }
      spinner.classList.add('d-none')
    });
  
}

inputform.addEventListener('submit',onsubmit)
updatepost.addEventListener('click',onupdate)