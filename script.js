document.addEventListener('DOMContentLoaded', function() {
    // Initialize expenses functionality
    if (document.getElementById('expense-list')) {
      initExpenses();
    }
  });
  
  function initExpenses() {
    // Load expenses from localStorage or use sample data
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [
      { id: 1, name: 'Groceries', amount: 1500, date: '2023-06-15', category: 'food' },
      { id: 2, name: 'Fuel', amount: 2800, date: '2023-06-14', category: 'transport' },
      { id: 3, name: 'Movie Tickets', amount: 1200, date: '2023-06-12', category: 'entertainment' }
    ];
  
    // Render expenses
    renderExpenses(expenses);
  
    // Set up event listeners
    document.getElementById('search-expenses').addEventListener('input', filterExpenses);
    document.getElementById('filter-expenses').addEventListener('change', filterExpenses);
  }
  
  function renderExpenses(expenses) {
    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = '';
  
    let total = 0;
  
    expenses.forEach(expense => {
      total += expense.amount;
      
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${expense.name}</td>
        <td>${expense.amount.toLocaleString('en-IN')}.00</td>
        <td>${formatDate(expense.date)}</td>
        <td>${capitalizeFirstLetter(expense.category)}</td>
        <td class="actions">
          <button class="btn-edit" data-id="${expense.id}">Edit</button>
          <button class="btn-delete" data-id="${expense.id}">Delete</button>
        </td>
      `;
      expenseList.appendChild(row);
    });
  
    // Update total
    document.getElementById('total-amount').textContent = total.toLocaleString('en-IN') + '.00';
  
    // Add event listeners to buttons
    document.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', handleEdit);
    });
  
    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', handleDelete);
    });
  }
  
  function filterExpenses() {
    const searchTerm = document.getElementById('search-expenses').value.toLowerCase();
    const categoryFilter = document.getElementById('filter-expenses').value;
    
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const filteredExpenses = expenses.filter(expense => {
      const matchesSearch = expense.name.toLowerCase().includes(searchTerm);
      const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
    
    renderExpenses(filteredExpenses);
  }
  
  function handleEdit(e) {
    const expenseId = parseInt(e.target.getAttribute('data-id'));
    // In a real app, you would redirect to edit page or show a modal
    alert(`Editing expense with ID: ${expenseId}`);
  }
  
  function handleDelete(e) {
    if (confirm('Are you sure you want to delete this expense?')) {
      const expenseId = parseInt(e.target.getAttribute('data-id'));
      let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
      expenses = expenses.filter(expense => expense.id !== expenseId);
      localStorage.setItem('expenses', JSON.stringify(expenses));
      renderExpenses(expenses);
    }
  }
  
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }
  
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

// User management
const users = JSON.parse(localStorage.getItem('users')) || [];

function signup() {
  const user = {
    id: Date.now(),
    name: document.getElementById('signup-name').value,
    email: document.getElementById('signup-email').value,
    password: document.getElementById('signup-password').value
  };

  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
  alert('Account created!');
  window.location.href = 'login.html';
}

function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    window.location.href = 'dashboard.html';
  } else {
    alert('Invalid credentials!');
  }
}

function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
}// User Management
document.addEventListener('DOMContentLoaded', function() {
    // Initialize users array if not exists
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify([]));
    }
  
    // Login Form Handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
      });
    }
  
    // Signup Form Handler
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
      signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleSignup();
      });
    }
  });
  
  function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const users = JSON.parse(localStorage.getItem('users'));
  
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Store current user session
      localStorage.setItem('currentUser', JSON.stringify(user));
      alert('Login successful!');
      window.location.href = 'dashboard.html';
    } else {
      alert('Invalid email or password');
    }
  }
  
  function handleSignup() {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const users = JSON.parse(localStorage.getItem('users'));
  
    // Check if user already exists
    if (users.some(u => u.email === email)) {
      alert('Email already registered');
      return;
    }
  
    const newUser = {
      id: Date.now(),
      name,
      email,
      password, // Note: In production, you should NEVER store plain text passwords
      createdAt: new Date().toISOString()
    };
  
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    alert('Account created successfully!');
    window.location.href = 'index.html';
  }
  
  // Add this to other protected pages (dashboard.html, expenses.html etc.)
  function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      window.location.href = 'index.html';
    }
  }
  
  // Logout function (add to your navbar)
  function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
  }
  // Add Expense Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Highlight current page in navigation
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.navbar a');
    
    navLinks.forEach(link => {
      if (link.href.includes(currentPage)) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  
    // Initialize form if it exists
    const expenseForm = document.getElementById('expense-form');
    if (expenseForm) {
      initExpenseForm();
    }
  });
  
  function initExpenseForm() {
    const form = document.getElementById('expense-form');
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('expense-date').value = today;
  
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (validateForm()) {
        const expense = {
          name: document.getElementById('expense-name').value.trim(),
          amount: parseFloat(document.getElementById('expense-amount').value),
          date: document.getElementById('expense-date').value,
          category: document.getElementById('expense-category').value,
          notes: document.getElementById('expense-notes').value.trim()
        };
  
        saveExpense(expense);
      }
    });
  }
  
  function validateForm() {
    let isValid = true;
    const requiredFields = ['expense-name', 'expense-amount', 'expense-date', 'expense-category'];
  
    // Clear previous errors
    document.querySelectorAll('.error').forEach(el => el.remove());
    document.querySelectorAll('.error-input').forEach(el => el.classList.remove('error-input'));
  
    // Validate required fields
    requiredFields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add('error-input');
        const error = document.createElement('div');
        error.className = 'error';
        error.textContent = 'This field is required';
        field.parentNode.appendChild(error);
      }
    });
    document.addEventListener('DOMContentLoaded', function() {
        // FAQ Data
        const faqs = [
          {
            question: "How do I add an expense?",
            answer: "Navigate to the 'Add Expense' page from the main menu. Fill in the expense details including name, amount, date, and category. Click 'Save' to add the expense to your tracker.",
            category: "getting-started"
          },
          {
            question: "Can I edit or delete an expense?",
            answer: "Yes, you can edit or delete any expense. Go to the 'Expenses' page, find the expense you want to modify, and click the 'Edit' or 'Delete' button.",
            category: "features"
          },
          {
            question: "How do I filter my expenses?",
            answer: "On the Expenses page, use the search box to find expenses by name or use the category dropdown to filter by specific categories.",
            category: "features"
          },
          {
            question: "Where is my data stored?",
            answer: "Your expense data is stored locally in your browser's storage. This means it's only accessible on this device/browser unless you implement cloud sync.",
            category: "features"
          },
          {
            question: "Why can't I see my expenses?",
            answer: "First, check if you're logged in. If you are, try refreshing the page. If the issue persists, clear your browser cache and try again.",
            category: "troubleshooting"
          },
          {
            question: "Is there a mobile app available?",
            answer: "Currently, Budget Buddy is a web application that works on mobile browsers. You can add it to your home screen for app-like access.",
            category: "getting-started"
          }
        ];
      
        // Initialize FAQ
        renderFAQs(faqs);
        setupEventListeners();
      });
      
      function renderFAQs(faqs) {
        const faqList = document.getElementById('faq-list');
        faqList.innerHTML = '';
      
        if (faqs.length === 0) {
          faqList.innerHTML = '<p class="no-results">No FAQs found matching your search.</p>';
          return;
        }
      
        faqs.forEach(faq => {
          const faqItem = document.createElement('div');
          faqItem.className = 'faq-item';
          faqItem.dataset.category = faq.category;
          
          faqItem.innerHTML = `
            <div class="faq-question">
              <span>${faq.question}</span>
              <i class="fas fa-chevron-down"></i>
            </div>
            <div class="faq-answer">
              <div class="faq-answer-content">
                ${faq.answer}
              </div>
            </div>
          `;
          
          faqList.appendChild(faqItem);
        });
      }
      
      function setupEventListeners() {
        // FAQ item toggle
        document.addEventListener('click', function(e) {
          if (e.target.closest('.faq-question')) {
            const faqItem = e.target.closest('.faq-item');
            faqItem.classList.toggle('active');
          }
        });
      
        // Category filtering
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
          btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.dataset.category;
            filterFAQs(category);
          });
        });
      
        // Search functionality
        const searchInput = document.getElementById('faq-search');
        searchInput.addEventListener('input', function() {
          filterFAQs();
        });
      }
      
      function filterFAQs(selectedCategory = 'all') {
        const searchTerm = document.getElementById('faq-search').value.toLowerCase();
        const allFaqItems = document.querySelectorAll('.faq-item');
        let visibleCount = 0;
      
        allFaqItems.forEach(item => {
          const question = item.querySelector('.faq-question span').textContent.toLowerCase();
          const answer = item.querySelector('.faq-answer-content').textContent.toLowerCase();
          const category = item.dataset.category;
          
          const matchesCategory = selectedCategory === 'all' || category === selectedCategory;
          const matchesSearch = !searchTerm || 
                               question.includes(searchTerm) || 
                               answer.includes(searchTerm);
          
          if (matchesCategory && matchesSearch) {
            item.style.display = '';
            visibleCount++;
          } else {
            item.style.display = 'none';
          }
        });
      
        // Show "no results" message if needed
        const noResults = document.querySelector('.no-results');
        if (visibleCount === 0 && !noResults) {
          const faqList = document.getElementById('faq-list');
          faqList.innerHTML = '<p class="no-results">No FAQs found matching your search.</p>';
        } else if (visibleCount > 0 && noResults) {
          noResults.remove();
        }
      }
  
    // Validate amount
    const amountField = document.getElementById('expense-amount');
    if (amountField.value && parseFloat(amountField.value) <= 0) {
      isValid = false;
      amountField.classList.add('error-input');
      const error = document.createElement('div');
      error.className = 'error';
      error.textContent = 'Amount must be greater than 0';
      amountField.parentNode.appendChild(error);
    }
  
    return isValid;
  }
  
  function saveExpense(expense) {
    // In a real app, you would send this to your backend API
    console.log('Saving expense:', expense);
    
    // For demo purposes, we'll store in localStorage
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.push({
      id: Date.now(),
      ...expense
    });
    localStorage.setItem('expenses', JSON.stringify(expenses));
    
    alert('Expense added successfully!');
    document.getElementById('expense-form').reset();
    
    // Redirect to expenses page after 1 second
    setTimeout(() => {
      window.location.href = 'expenses.html';
    }, 1000);
  }
  document.addEventListener('DOMContentLoaded', function() {
    // Hide dashboard link when on dashboard page
    const currentPage = window.location.pathname.split('/').pop();
    const dashboardLink = document.getElementById('dashboardLink');
    
    if (currentPage === 'dashboard.html') {
      dashboardLink.style.display = 'none';
    }
    
    // Highlight current page in navbar
    const navLinks = document.querySelectorAll('.navbar a');
    navLinks.forEach(link => {
      if (link.href.includes(currentPage)) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
    
    // Logout functionality
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        logout();
      });
    }
  });
  
  function logout() {
    // Clear user session data
    localStorage.removeItem('userToken');
    sessionStorage.removeItem('userSession');
    
    // Redirect to login page
    window.location.href = 'index.html';
    
    // For demonstration, we'll just show an alert
    alert('You have been logged out successfully.');
    console.log('User logged out');
  }
  document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Basic validation
        if (!name || !email || !message) {
          alert('Please fill in all fields');
          return;
        }
        
        // Validate email format
        if (!validateEmail(email)) {
          alert('Please enter a valid email address');
          return;
        }
        
        // In a real application, you would send this data to your server
        console.log('Form submitted:', { name, email, message });
        
        // Show success message
        alert('Thank you for your message! We will get back to you soon.');
        
        // Reset form
        contactForm.reset();
      });
    }
    
    function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
  });