// Sample array of courses
const courses = ['Ανάλυση Ι', 'Αρχιτεκτονική Υπολογιστών Ι', 'Δομές Δεδομένων και Τεχνικές Προγραμματισμού', 'Εφαρμοσμένα Μαθηματικά', 'Ηλεκτρομαγνητισμός - Οπτική και Σύγχρονη Φυσική',
'Ανάλυση ΙΙ', 'Αντικειμενοστραφής Προγραμματισμός', 'Πιθανότητες και Στατιστική', 'Σήματα και Συστήματα', 'Αλγόριθμοι και Πολυπλοκότητα', 'Δίκυτα Επικοινωνιών Ι', 'Εργαστήριο Δικύων Επικοινωνιών Ι', 'Συστήματα Επικοινωνιών Ι', 'Σχεδίαση και Χρήση Βάσεων Δεδομένων'];
const selectedCourses = new Set();
let isReadOnly = false;

const contentDiv = document.querySelector('.content');

// Create a new div element
const additionalContentDiv = document.createElement('div');
additionalContentDiv.classList.add('additional-content');

failedGrades = JSON.parse(sessionStorage.getItem("failedCourses"));
failedDiv = document.getElementById("failedPlaceholder");
if (failedGrades && failedGrades.length > 0) {
    createFailedButton(failedGrades);
}
function createFailedButton(failedGrades) {
    const failedButton = document.createElement('button');
    failedButton.textContent = 'Πρόσθεσε τα χρωστούμενα';
    const successMessageDiv = document.createElement('div');
    successMessageDiv.style.color = 'green'; // Set the color of the success message

    failedButton.addEventListener('click', () => {
        failedGrades.forEach(failedCourseObj => {
            const failedCourseName = Object.keys(failedCourseObj)[0]; // Get the course name
            if (!selectedCourses.has(failedCourseName))
                addCourseToTable(failedCourseName);
        });
        successMessageDiv.textContent = 'Τα χρωστούμενα προστέθηκαν επιτυχώς!';
    });

    // Append the button to the failedDiv
    failedDiv.appendChild(failedButton);
    failedDiv.appendChild(successMessageDiv)
}


// Event listener for input changes
document.getElementById('search').addEventListener('input', function () {
    const searchTerm = this.value;
    if (searchTerm==="") {
        const coursesList = document.getElementById('courses-list');
        coursesList.innerHTML = '';
        
        return;
    }
    updateDisplayedCourses(searchTerm);
});

document.getElementById('save-button').addEventListener('click', saveToSessionStorage);
document.getElementById('submit-button').addEventListener('click', saveToLocalStorage);

loadFromSessionStorage();

// Set the content of the new div
var message;
if (sessionStorage.getItem("isReadOnly")!== null){
    message = 'Η δήλωση έχει υποβληθεί οριστικά.';}
else
    {message = '<p>Μπορείς να δηλώσεις ακόμα ' + eval(8-selectedCourses.size) + ' μαθήματα.</p>';}

additionalContentDiv.innerHTML = message;

// Append the new div to the existing content
contentDiv.appendChild(additionalContentDiv);

// Function to filter courses based on user input
function filterCourses(searchTerm) {
    return courses.filter(course => course.toLowerCase().includes(searchTerm.toLowerCase()));
}

// Function to update the displayed courses
function updateDisplayedCourses(searchTerm) {
    const filteredCourses = filterCourses(searchTerm);
    const coursesList = document.getElementById('courses-list');

    // Clear previous results
    coursesList.innerHTML = '';

    // Display the filtered courses
    filteredCourses.forEach(course => {
        if (coursesList.childNodes.length>5) {return;}
        if (!selectedCourses.has(course)) {
            const listItem = document.createElement('li');
            listItem.textContent = course;

            // Add a click event listener to the course item
            listItem.addEventListener('click', () => {
                if(!isReadOnly && !(selectedCourses.has(course)) ){
                    addCourseToTable(course);
                }
            });

            coursesList.appendChild(listItem);
        }
    });
}

function addCourseToTable(course) {
    if (selectedCourses.size>=8) {
        alert("Έφτασες το μέγιστο αριθμό μαθημάτων!")
        return;
    }
    selectedCourses.add(course);

    const tableBody = document.querySelector('#selected-courses tbody');
    const newRow = tableBody.insertRow();

    const cell = newRow.insertCell();
    cell.textContent = course;

    const cell2 = newRow.insertCell();
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => {
        removeCourseFromTable(course, newRow);
    });
    cell2.appendChild(removeButton);
    message = '<p>Μπορείς να δηλώσεις ακόμα ' + eval(8-selectedCourses.size) + ' μαθήματα.</p>';
    additionalContentDiv.innerHTML = message;
    
}

function removeCourseFromTable(course, row) {
    selectedCourses.delete(course);
    row.remove();
    message = '<p>Μπορείς να δηλώσεις ακόμα ' + eval(8-selectedCourses.size) + ' μαθήματα.</p>';
    additionalContentDiv.innerHTML = message;
}
function saveToSessionStorage() {
    // Check if the login object exists
    if (!sessionStorage.getItem('login')) {
        alert('Απαιτείται σύνδεση. Μεταφέρεστε στην σελίδα σύνδεσης.');
        window.location.href = 'login.html'; // Redirect to the login page
        return;
    }
    else {
        alert("Αποθηκεύτηκε Επιτυχώς.")
    }
    sessionStorage.setItem('selectedCourses', JSON.stringify(Array.from(selectedCourses)));
    sessionStorage.setItem('isReadOnly', JSON.stringify(isReadOnly)); // Save isReadOnly flag
}

function saveToLocalStorage() {
    // Check if the login object exists
    if (!sessionStorage.getItem('login')) {
        alert('Απαιτείται σύνδεση. Μεταφέρεστε στην σελίδα σύνδεσης.');
        window.location.href = 'login.html'; // Redirect to the login page
        return;
    }
    else {
        // alert("Υποβλήθηκε επιτυχώς.")
        var isConfirmed = window.confirm("Θέλετε σίγουρα να υποβάλετε οριστικά την δήλωση;");
        if (!isConfirmed) return;

    }
    sessionStorage.setItem('selectedCourses', JSON.stringify(Array.from(selectedCourses)));
    localStorage.setItem('selectedCourses', JSON.stringify(Array.from(selectedCourses)));
    isReadOnly = true; // Make the table read-only after submission
    sessionStorage.setItem('isReadOnly', JSON.stringify(isReadOnly)); // Save isReadOnly flag

    disableRemoveButtons();
    disableSubmitButton();
}

function loadFromSessionStorage() {
    const savedCourses = sessionStorage.getItem('selectedCourses');
    const savedIsReadOnly = sessionStorage.getItem('isReadOnly');
    if (savedCourses) {
        const parsedCourses = JSON.parse(savedCourses);
        parsedCourses.forEach(course => {
            addCourseToTable(course);
            selectedCourses.add(course);
        });
    }
    if (savedIsReadOnly==="true") {
        isReadOnly = JSON.parse(savedIsReadOnly); // Set isReadOnly from sessionStorage
        disableRemoveButtons();
        disableSubmitButton();
    }
}

function disableRemoveButtons() {
    const removeButtons = document.querySelectorAll('#selected-courses tbody button');
    removeButtons.forEach(button => {
        button.disabled = true;
    });
}

function disableSubmitButton() {
    document.getElementById('submit-button').disabled = true;
    document.getElementById('save-button').disabled = true;
}

