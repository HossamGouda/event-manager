class EventManager {
  constructor() {
    this.events = JSON.parse(localStorage.getItem("events")) || [];
    this.setMinDate();
    this.displayEvents();
    setInterval(() => this.displayEvents(), 1000);
  }

  setMinDate() {
    const today = new Date().toISOString().split("T")[0];
    const eventDate = document.querySelector(".event-date");
    eventDate.min = today;
    eventDate.addEventListener("input", () => {
      if (eventDate.value < today) eventDate.value = today;
    });
  }

  addEvent() {
    const eventName = document.querySelector(".event-name").value;
    const eventDate = document.querySelector(".event-date").value;
    const eventOrganizer = document.querySelector(".organizer").value;

    if (eventName && eventDate && eventOrganizer) {
      const newEvent = {
        name: eventName,
        date: eventDate,
        organizer: eventOrganizer,
        timeStamp: new Date(eventDate).getTime(),
      };

      this.events.push(newEvent);
      localStorage.setItem("events", JSON.stringify(this.events));

      // Clear input fields
      const inputs = document.querySelectorAll("input");
      inputs.forEach((input) => (input.value = ""));

      this.displayEvents();

      // Show success alert
      Swal.fire({
        title: "Success!",
        text: "Event added successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
    } else {
      // Show error alert
      Swal.fire({
        title: "Error!",
        text: "Please fill all fields.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }

  displayEvents() {
    const eventsList = document.getElementById("eventsList");
    eventsList.innerHTML = ""; // Clear previous events
    this.events.forEach((event, index) => {
      const now = new Date().getTime();
      const timeLeft = event.timeStamp - now;
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      const countdown = `${days}d ${hours}h ${minutes}m ${seconds}s`;

      eventsList.innerHTML += `
            <div class="col-md-4 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${event.name}</h5>
                        <p class="card-text"><strong>By:</strong> ${event.organizer}</p>
                        <p class="card-text"><strong>On:</strong> ${event.date}</p>
                        <p class="card-text"><strong>Time Left:</strong> ${countdown}</p>
                        <button class="btn btn-danger" onclick="eventManager.deleteEvent(${index})">Delete</button>
                    </div>
                </div>
            </div>
        `;
    });
  }

  // deleteEvent(index) {
  //   this.events.splice(index, 1);
  //   localStorage.setItem("events", JSON.stringify(this.events));
  //   this.displayEvents();
  // }
  deleteEvent(index) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.events.splice(index, 1); // Delete the event
        localStorage.setItem("events", JSON.stringify(this.events));
        this.displayEvents(); // Refresh the events list

        Swal.fire("Deleted!", "Your event has been deleted.", "success");
      }
    });
  }
}

// Instantiate the EventManager class
const eventManager = new EventManager();

// Add an event listener for the Add Event button
document
  .querySelector(".add")
  .addEventListener("click", () => eventManager.addEvent());
