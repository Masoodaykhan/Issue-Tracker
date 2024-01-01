const addIssueBtn = document.getElementById('addIssueBtn');
const modal = document.getElementById('modal');
const closeBtn = document.getElementsByClassName('close')[0];
const issueForm = document.getElementById('issueForm');
const issueList = document.getElementById('issueList');
let editing = false;
let issues = [];
let issueToEdit;

// Load issues from localStorage on page load
window.addEventListener('load', () => {
  const storedIssues = localStorage.getItem('issues');
  if (storedIssues) {
    issues = JSON.parse(storedIssues);
    displayIssues();
  }
});

addIssueBtn.addEventListener('click', () => {
  editing = false;
  openModal();
});

closeBtn.addEventListener('click', closeModal);

issueForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const userNameInput = document.getElementById('User Name');
  const issueTitleInput = document.getElementById('issueTitle');
  const issueDescriptionInput = document.getElementById('issueDescription');

  if (editing) {
    const editedIssue = {
      id: issueToEdit.id,
      userName: userNameInput.value,
      issueTitle: issueTitleInput.value,
      issueDescription: issueDescriptionInput.value,
    };

    const index = issues.findIndex(issue => issue.id === editedIssue.id);
    if (index !== -1) {
      issues[index] = editedIssue;
      saveIssuesToLocalStorage();
      displayIssues();
    }
  } else {
    const newIssue = {
      id: generateUniqueId(),
      userName: userNameInput.value,
      issueTitle: issueTitleInput.value,
      issueDescription: issueDescriptionInput.value,
    };

    issues.push(newIssue);
    saveIssuesToLocalStorage();
    displayIssues();
  }

  closeModal();
});

function openModal() {
  modal.style.display = 'block';
}

function closeModal() {
  modal.style.display = 'none';
  issueForm.reset();
}

function displayIssues() {
  issueList.innerHTML = '';

  issues.forEach((issue) => {
    const issueElement = createIssueElement(issue);
    issueList.appendChild(issueElement);
  });

  addIssueListeners();
}

function createIssueElement(issue) {
  const issueElement = document.createElement('div');
  issueElement.classList.add('issue');
  issueElement.setAttribute('data-id', issue.id);
  issueElement.innerHTML = `
    <h3>${issue.userName}</h3>
    <p><strong>Issue Title:</strong> ${issue.issueTitle}</p>
    <p><strong>Issue Description:</strong> ${issue.issueDescription}</p>
    <button class="editBtn">Edit</button>
    <button class="deleteBtn">Delete</button>
  `;
  return issueElement;
}

function addIssueListeners() {
  const editButtons = document.querySelectorAll('.editBtn');
  const deleteButtons = document.querySelectorAll('.deleteBtn');

  editButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      editing = true;
      openModal();
      const issueId = e.target.parentElement.getAttribute('data-id');
      issueToEdit = issues.find((issue) => issue.id === issueId);
      populateForm(issueToEdit);
    });
  });

  deleteButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const issueId = e.target.parentElement.getAttribute('data-id');
      issues = issues.filter((issue) => issue.id !== issueId);
      saveIssuesToLocalStorage();
      displayIssues();
    });
  });
}

function populateForm(issue) {
  const userNameInput = document.getElementById('User Name');
  const issueTitleInput = document.getElementById('issueTitle');
  const issueDescriptionInput = document.getElementById('issueDescription');

  userNameInput.value = issue.userName;
  issueTitleInput.value = issue.issueTitle;
  issueDescriptionInput.value = issue.issueDescription;
}

function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function saveIssuesToLocalStorage() {
  localStorage.setItem('issues', JSON.stringify(issues));
}

// Fetch issues from localStorage when the page loads
window.addEventListener('load', () => {
  const storedIssues = localStorage.getItem('issues');
  if (storedIssues) {
    issues = JSON.parse(storedIssues);
    displayIssues();
  }
});