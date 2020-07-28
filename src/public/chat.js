const socket = io('http://localhost:3000');

const button = document.querySelector('#enter');
const messagesbtn = document.querySelector('#send');
var username = '';
button.addEventListener('click', addusername);

function addusername() {
    username = document.querySelector('#name').value;
    socket.emit('newuser', { name: username });
}

function joinRoom(Roomname) {
    socket.emit('joinRoom', Roomname.id);
    document.querySelector('.Roomname').innerHTML = Roomname.id;

    socket.emit('msgToServer', {
        sender: username,
        content: "wellcom",
        Roomname: Roomname.id
    });
    // document.querySelector(".masseges").innerHTML += buildHTML(data) + "<br>";
}

socket.on('MessageToClient', (data) => {
    document.querySelector(".masseges").innerHTML += buildHTML(data);

})



socket.on('check', (data) => {
    if (data.check) {
        let index = document.querySelector('.index');
        let chatApp = document.querySelector('.chatApp');
        chatApp.style.display = "block";
        index.style.display = "none";

    } else {
        document.querySelector('#msg').innerHTML = 'Please choose uniqe name';
    }
});

socket.on('getusers', function(data) {
    document.querySelector('.users').innerHTML = '';
    for (i = 0; i < data.length; i++) {
        const user1 = username;
        const user2 = data[i];
        const result = user1.localeCompare(user2);
        if (result == -1) {
            document.querySelector('.users').innerHTML += `<div class="user" id="${username+data[i]}" onclick="joinRoom(${username+data[i]})">${data[i]}</div>`
        } else {
            document.querySelector('.users').innerHTML += `<div class="user" id="${data[i]+username}" onclick="joinRoom(${data[i]+username})">${data[i]}</div>`
        }

    }

})

socket.on('historyCatchUp', (data) => {
    document.querySelector(".masseges").innerHTML = "";
    data.forEach(msg => {
        document.querySelector(".masseges").innerHTML += buildHTML(msg);
    });

})

messagesbtn.addEventListener('click', sendmessage);

function sendmessage(e) {
    e.preventDefault();
    let content = document.querySelector('#sendMSG').value;
    const Room = document.querySelector('.Roomname').innerHTML;
    socket.emit('msgToServer', {
        sender: username,
        content,
        Roomname: Room
    });
    document.querySelector('#sendMSG') = " ";
}


function buildHTML(msg) {
    //  const convertDate = new Date(msg.time).toLocaleString();
    let newHTML;
    if (msg.sender == username) {

        newHTML = `
        <div class= 'content1'>
        
        <div class="sender">
        <p>${msg.content}</p>
    </div>
    <h5>${msg.sender}</h5>
    </div>`

    } else {

        newHTML = `
        <div class= 'content2'>
       
        <div class="receiver">
        <p>${msg.content}</p>
    </div>
    <h5>${msg.sender}</h5>
    </div>`
    }

    return newHTML;

}