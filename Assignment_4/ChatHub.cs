using Assignment_4.Models;
using Microsoft.AspNetCore.SignalR;

namespace Assignment_4
{
    public class ChatHub:Hub
    {

        public async Task SendAllMessages (string username, string textMessage)
        {
            var message = new Message
            {
                UserName = username,
                TextMessage = textMessage,
                TimeOfMessage = DateTime.Now
            };

            await Clients.All.SendAsync("ReceiveMessage", message.UserName,message.TextMessage, message.TimeOfMessage);
        }

        public override async Task OnConnectedAsync()
        {
            var connectionId = Context.ConnectionId;

            // Store the connection time in the database.
            var connectionTime = DateTime.Now;

            // Send a message to all users that a new user has connected.
            await Clients.All.SendAsync("UserConnected", $"New user has connected ({connectionTime})\n");

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var connectionId = Context.ConnectionId;

            // Store the disconnection time in the database.
            var disconnectionTime = DateTime.Now;

            // Send a message to all users that a user has disconnected.
            await Clients.All.SendAsync("UserDisconnected", $"A user has disconnected ({disconnectionTime})\n");

            await base.OnDisconnectedAsync(exception);
        }

    }
}
