const socket = io();
const messageForm = document.querySelector("#message-form");
const messageInput = document.querySelector("#message");
const messageSubmit = document.querySelector("#submit");
const messages = document.querySelector("#messages");
const sidebar = document.querySelector("#sidebar");


const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-message-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

const {username,room} = Qs.parse(location.search,{ ignoreQueryPrefix: true})

autoscroll = () => {
    const newMessage = messages.lastElementChild

    const newMessageStyle = getComputedStyle(newMessage);
    const newMessageMargin = parseInt(newMessageStyle.marginBottom)
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin

    const visibleHeight = messages.offsetHeight

    const containerHeight = messages.scrollHeight
    const scrollOffset = messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
        messages.scrollTop = messages.scrollHeight
    }

    console.log(newMessageMargin);
}

socket.on("message", (message) => {
    console.log(message); 
    const html = Mustache.render(messageTemplate,{
        "username": message.username,
        "message":message.text,
        "createdAt": moment(message.createdAt).format('h:mm a')
    });
    messages.insertAdjacentHTML('beforeend',html);
    autoscroll();
})

socket.on("locationMessage",(message) => {
    console.log(message); 
    const html = Mustache.render(locationTemplate,{
        "username":message.username,
        "url": message.url,
        "createdAt": moment(message.createdAt).format('h:mm a')
    });
    messages.insertAdjacentHTML('beforeend',html);
    autoscroll();
})

socket.on("roomData",({room, users}) => {
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    });
    sidebar.innerHTML = html;
})

messageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    messageSubmit.setAttribute("disabled","disabled")
    const message = event.target.elements.message.value;
    socket.emit("sendMessage",message,(error) => {
        messageSubmit.removeAttribute("disabled");
        messageInput.value = "";
        messageInput.focus();
        if(error){
            return console.log(error);
        }
        console.log("the message was delivered! ");
    });
})

document.querySelector("#location").addEventListener("click",() => {
    document.querySelector("#location").setAttribute("disabled","disabled");
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit("sendLocation", {
            'latitude': position.coords.latitude,
            'longitude': position.coords.longitude
        },() => {
            document.querySelector("#location").removeAttribute("disabled");
            console.log("Location shared");
        })
    })
})

socket.emit("join",{username,room},(error) => {
    if(error){
        alert(error)
        location.href = "/"
    }
})