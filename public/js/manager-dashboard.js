const socket = io();

const activityList = document.getElementById('bot-activity');

socket.on('connect', () => {
    console.log('Connected to live Discord activity updates.');
});

socket.on('connect_error', error => {
    console.error('Socket.IO connection failed:', error.message);
});

socket.on('botActivity', activity => {
    if (!activityList) {
        return;
    }

    // Remove the waiting message when the first event arrives.
    const waitingMessage = document.getElementById('no-activity');

    if (waitingMessage) {
        waitingMessage.remove();
    }

    // Create a new activity entry safely.
    const item = document.createElement('li');
    const heading = document.createElement('strong');
    const details = document.createElement('p');
    const time = document.createElement('small');

    heading.textContent = activity.command;
    details.textContent =
        `Game: ${activity.title} | Status: ${activity.status}`;

    time.textContent = `Received at ${activity.timestamp}`;

    item.appendChild(heading);
    item.appendChild(details);
    item.appendChild(time);

    // Display the newest activity first.
    activityList.prepend(item);

    // Keep the dashboard from accumulating too many entries.
    while (activityList.children.length > 10) {
        activityList.lastElementChild.remove();
    }
});