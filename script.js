const reminders = [];

// Function to set a reminder
function setReminder() {
  const day = document.getElementById("day").value;
  const time = document.getElementById("time").value;
  const activity = document.getElementById("activity").value;

  if (!day || !time || !activity) {
    showCustomAlert("Please fill in all fields.");
    return;
  }

  const [hours, minutes] = time.split(":").map(Number);
  const now = new Date();
  let reminderTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes
  );

  // If the reminder time is in the past for today, set it for the next occurrence of that time
  if (reminderTime <= now) {
    reminderTime.setDate(reminderTime.getDate() + 1);
  }

  const timeDifference = reminderTime - now;

  reminders.push({ day, time, activity, reminderTime });

  // Set a timeout to play the sound and show the alert at the right time
  setTimeout(() => {
    playSound();
    showCustomAlert(`Time for ${activity}`);
  }, timeDifference);

  addReminderToList(day, time, activity, reminderTime);

  showCustomAlert(`Reminder set for ${activity} on ${day} at ${time}`);
}

// Function to add a reminder to the list
function addReminderToList(day, time, activity, reminderTime) {
  const reminderList = document.getElementById("reminderList");
  const listItem = document.createElement("li");
  listItem.dataset.reminderTime = reminderTime.toISOString(); // Store reminderTime

  listItem.innerHTML = `
        <span>${activity} on ${day} at ${time}</span>
        <button class="remove-button">Remove</button>
        <button class="update-button">Update</button>
    `;

  // Add event listeners for remove and update buttons
  listItem.querySelector(".remove-button").onclick = () => {
    removeReminder(listItem);
  };

  listItem.querySelector(".update-button").onclick = () => {
    showUpdateForm(listItem);
  };

  reminderList.appendChild(listItem);
}

// Function to remove a reminder from the list
function removeReminder(listItem) {
  listItem.remove();

  // Remove the reminder from the reminders array
  const reminderTime = new Date(listItem.dataset.reminderTime);
  const index = reminders.findIndex(
    (r) => r.reminderTime.getTime() === reminderTime.getTime()
  );
  if (index > -1) {
    reminders.splice(index, 1);
  }
}

// Function to show the update form with pre-filled values
function showUpdateForm(listItem) {
  const reminderTime = new Date(listItem.dataset.reminderTime);
  const day = reminderTime.toLocaleDateString("en-US", { weekday: "long" });
  const time = reminderTime.toTimeString().slice(0, 5);
  const activity = listItem.querySelector("span").textContent.split(" ")[0];

  document.getElementById("day").value = day;
  document.getElementById("time").value = time;
  document.getElementById("activity").value = activity;

  // Update the button to save changes
  const updateButton = document.createElement("button");
  updateButton.textContent = "Save Changes";
  updateButton.onclick = () => {
    updateReminder(listItem);
  };

  const form = document.querySelector("form");
  form.appendChild(updateButton);
}

// Function to update a reminder
function updateReminder(listItem) {
  const day = document.getElementById("day").value;
  const time = document.getElementById("time").value;
  const activity = document.getElementById("activity").value;

  if (!day || !time || !activity) {
    showCustomAlert("Please fill in all fields.");
    return;
  }

  const [hours, minutes] = time.split(":").map(Number);
  const reminderTime = new Date();
  reminderTime.setFullYear(
    reminderTime.getFullYear(),
    reminderTime.getMonth(),
    reminderTime.getDate()
  );
  reminderTime.setHours(hours, minutes);

  if (reminderTime <= new Date()) {
    reminderTime.setDate(reminderTime.getDate() + 1);
  }

  const timeDifference = reminderTime - new Date();

  // Remove previous reminder (if any) and add a new one
  listItem.remove();
  const previousReminderIndex = reminders.findIndex(
    (r) =>
      r.reminderTime.getTime() ===
      new Date(listItem.dataset.reminderTime).getTime()
  );
  if (previousReminderIndex > -1) {
    reminders.splice(previousReminderIndex, 1);
  }

  reminders.push({ day, time, activity, reminderTime });

  // Set a new timeout to play the sound and show the alert at the right time
  setTimeout(() => {
    playSound();
    showCustomAlert(`Time for ${activity}`);
  }, timeDifference);

  addReminderToList(day, time, activity, reminderTime);

  // Remove the save changes button
  const form = document.querySelector("form");
  const updateButton = form.querySelector("button");
  if (updateButton) {
    updateButton.remove();
  }

  showCustomAlert(`Reminder updated to ${activity} on ${day} at ${time}`);
}

// Function to play the reminder sound
function playSound() {
  const audio = document.getElementById("chime");
  audio.currentTime = 0; // Rewind to the beginning of the sound
  audio.play(); // Play the sound
}

// Function to show the custom alert dialog
function showCustomAlert(message) {
  const customAlert = document.getElementById("customAlert");
  const alertMessage = document.getElementById("alertMessage");
  const overlay = document.getElementById("overlay");

  alertMessage.textContent = message;
  customAlert.style.display = "block";
  overlay.style.display = "block";
}

// Function to close the custom alert dialog
function closeCustomAlert() {
  const customAlert = document.getElementById("customAlert");
  const overlay = document.getElementById("overlay");

  customAlert.style.display = "none";
  overlay.style.display = "none";
}

// Event listener for the form submission
document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
  setReminder();
});
