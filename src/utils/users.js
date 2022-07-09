const users = [];

const addUser = ({id,username,room}) => {
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    if(!username || !room){
        return{
            error: "Username and Room are required"
        }
    }

    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    if(existingUser){
        return {
            error: "Username is in use"
        }
    }

    const user = {id, username, room}
    users.push(user);
    return {users};
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUserInRoom = (room) => {
    room = room.trim().toLowerCase();
    return users.filter((user) => user.room === room)
}

module.exports = {
    addUser,
    getUser,
    getUserInRoom,
    removeUser
}

// addUser({
//     id: 33,
//     username: "uttam",
//     room: "abc"
// });

// addUser({
//     id: 3,
//     username: "ram",
//     room: "abc"
// });

// addUser({
//     id: 34,
//     username: "shyam",
//     room: "dfdf"
// });

// const user = getUser(3);
// console.log(users);
// const userRoom = getUserInRoom("fhghh");
// console.log(userRoom);
// ;
// const remove = removeUser(33);
// console.log(remove);

// const res = addUser({
//     id: 33,
//     username: "",
//     room: "abc"
// })
// console.log(res);
