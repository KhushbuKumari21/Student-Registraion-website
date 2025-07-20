// Store references to the registration form and the tbody element where student data rows will be displayed
const form = document.getElementById("registrationForm");
const studentTable = document.getElementById("studentData");

// When the page finishes loading, load students from localStorage and display them
document.addEventListener("DOMContentLoaded", loadStudents);

// Listen for the form submission event and handle adding a new student record
form.addEventListener("submit", function (event) {
  event.preventDefault();
  addStudent();
});

// Function to validate inputs and add a new student record to localStorage and table
function addStudent() {
  // Extract form input elements once for cleaner code
  const nameInput = document.getElementById("studentName");
  const classInput = document.getElementById("studentClass");
  const addressInput = document.getElementById("studentAddress");
  const idInput = document.getElementById("studentID");
  const emailInput = document.getElementById("email");
  const contactInput = document.getElementById("contact");

  // Retrieve and trim input values to remove extra whitespace
  const name = nameInput.value.trim();
  const studentClass = classInput.value.trim();
  const address = addressInput.value.trim();
  const id = idInput.value.trim();
  const email = emailInput.value.trim();
  const contact = contactInput.value.trim();

  // Validation: Ensure no input is empty, to prevent adding empty rows
  if (!name || !studentClass || !address || !id || !email || !contact) {
    alert("Please fill all fields.");
    return;
  }

  // Validate student name contains only letters (a-z, A-Z) and spaces
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    alert("Student name must contain only letters.");
    return;
  }

  // Validate student ID is numeric (only digits)
  if (!/^\d+$/.test(id)) {
    alert("Student ID must be numeric.");
    return;
  }

  // Validate contact number is exactly 10 digits long
  if (!/^\d{10}$/.test(contact)) {
    alert("Contact number must be a 10-digit number.");
    return;
  }

  // Validate email address with basic regex for correct format
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    alert("Enter a valid email.");
    return;
  }

  // Construct a student object with the validated data
  const newStudent = { name, class: studentClass, address, id, email, contact };

  // Fetch existing students array from localStorage, or create an empty one if none found
  const students = JSON.parse(localStorage.getItem("students")) || [];

  // Add the new student record to the array
  students.push(newStudent);

  // Save the updated students array back to localStorage as a JSON string
  localStorage.setItem("students", JSON.stringify(students));

  // Refresh the displayed student list to include the newly added student
  loadStudents();

  // Clear the form fields to prepare for the next input
  form.reset();
}

// Function to load student records from localStorage and populate the table on the page
function loadStudents() {
  // Retrieve students array or empty array if nothing is stored
  const students = JSON.parse(localStorage.getItem("students")) || [];

  // Clear current table rows to avoid duplication before re-adding
  studentTable.innerHTML = "";

  // Loop through each student object and create a table row for it
  students.forEach((student, index) => {
    // Create a new table row element
    const row = document.createElement("tr");

    // Fill the row with student details and action buttons for editing and deleting
    row.innerHTML = `
      <td>${student.name}</td>
      <td>${student.class}</td>
      <td>${student.address}</td>
      <td>${student.id}</td>
      <td>${student.email}</td>
      <td>${student.contact}</td>
      <td class="actions">
        <button class="edit" onclick="editStudent(${index})">Edit</button>
        <button class="delete" onclick="deleteStudent(${index})">Delete</button>
      </td>
    `;

    // Append the created row to the table body element
    studentTable.appendChild(row);
  });
}

// Function to load a student's data into the form for editing, then remove old entry temporarily
function editStudent(index) {
  // Get the current list of students from localStorage
  const students = JSON.parse(localStorage.getItem("students")) || [];

  // Select the student object to be edited by its index
  const student = students[index];

  // Populate the form fields with the selected student's current data
  document.getElementById("studentName").value = student.name;
  document.getElementById("studentClass").value = student.class;
  document.getElementById("studentAddress").value = student.address;
  document.getElementById("studentID").value = student.id;
  document.getElementById("email").value = student.email;
  document.getElementById("contact").value = student.contact;

  // Remove the student record from array to prevent duplicates after update
  students.splice(index, 1);

  // Save the updated array back to localStorage after removal
  localStorage.setItem("students", JSON.stringify(students));

  // Reload the student table to reflect removal of the record being edited
  loadStudents();
}

// Function to delete a student record from localStorage and update the display table
function deleteStudent(index) {
  // Load current students from localStorage
  const students = JSON.parse(localStorage.getItem("students")) || [];

  // Ask for confirmation before deleting
  if (confirm("Are you sure you want to delete this student?")) {
    // Remove student at the specified index
    students.splice(index, 1);

    // Save the new list back to localStorage
    localStorage.setItem("students", JSON.stringify(students));

    // Refresh the displayed list to remove deleted student from the table
    loadStudents();
  }
}
