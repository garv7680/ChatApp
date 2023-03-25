document.addEventListener('DOMContentLoaded', () => {
    const messageForm = document.getElementById('send-message-form');
    const messageInput = document.getElementById('message');
    const usernameInput = document.getElementById('username');
    const messagesContainer = document.getElementById('messages');

    const connection = new signalR.HubConnectionBuilder()
        .withUrl('/chat', { accessTokenFactory: () => usernameInput.value }) // Pass the username as a query parameter
        .configureLogging(signalR.LogLevel.Information)
        .build();


    connection.on('ReceiveMessage', (username, message, timeOfMessage) => {
        const formattedMessage = `${moment(timeOfMessage).format('h:mm A')}: ${username}: ${message}`;
        const messageIndex = messagesContainer.childElementCount;
        const messageElement = document.createElement('span');
        messageElement.classList.add('message', messageIndex % 2 === 0 ? 'message-even' : 'message-odd');
        messageElement.innerText = formattedMessage;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
    connection.on('UserConnected', (connectionMessage) => {
        const messageElement = document.createElement('span');
        messageElement.innerText = connectionMessage;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
    connection.on('UserDisconnected', (disconnectionMessage) => {
        const messageElement = document.createElement('span');
        messageElement.innerText = disconnectionMessage;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });


    connection.start().catch(err => console.error(err.toString()));

    messageForm.addEventListener('submit', event => {
        event.preventDefault();

        const username = usernameInput.value.trim();
        const message = messageInput.value.trim();

        if (!username || !message) {
            console.log("Invalid name or message");
            return;
        }
        if (username.length > 14) {
            console.log("Invalid username. Usernames must not exceed 14 characters and cannot contain numbers.");
            return;
        }
        if (message.length >= 180) {
            console.log("Message too long. Must be 180 characters or less");
            return;
        }

        connection.invoke('SendAllMessages', username, message).catch(err => console.error(err.toString()));
        messageInput.value = ''; //resets message after someone sends something
    });

});
