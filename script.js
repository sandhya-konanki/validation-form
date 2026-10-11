
 // ==========================================
 // SMART REGISTRATION PORTAL
 // Validation, password strength and themes
 // ==========================================

 // 1. Select the form and input fields.

const form = document.getElementById("registration-form");

const fields = {
  fullName: document.getElementById("fullName"),
  age: document.getElementById("age"),
  email: document.getElementById("email"),
  mobile: document.getElementById("mobile"),
  password: document.getElementById("password"),
  confirmPassword: document.getElementById("confirmPassword")
};

const successMessage = document.getElementById("success-message");
const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");
const progressTrack = document.getElementById("progress-track");


 // 2. Theme toggle: light and dark mode.

const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const themeLabel = document.getElementById("theme-label");

function applyTheme(theme) {
  const isDark = theme === "dark";

  document.body.dataset.theme = isDark ? "dark" : "light";

  themeIcon.textContent = isDark ? "☀" : "☾";
  themeLabel.textContent = isDark ? "Light mode" : "Dark mode";

  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Switch to light mode" : "Switch to dark mode"
  );

  themeToggle.setAttribute("aria-pressed", String(isDark));
}

function saveTheme(theme) {
  try {
    localStorage.setItem("registration-theme", theme);
  } catch (error) {
    // Theme switching still works if storage is unavailable.
  }
}

let initialTheme = "light";

try {
  const savedTheme = localStorage.getItem("registration-theme");

  if (savedTheme === "dark" || savedTheme === "light") {
    initialTheme = savedTheme;
  }
} catch (error) {
  // Use light theme if storage is unavailable.
}

applyTheme(initialTheme);

themeToggle.addEventListener("click", () => {
  const nextTheme =
    document.body.dataset.theme === "dark" ? "light" : "dark";

  applyTheme(nextTheme);
  saveTheme(nextTheme);
});


 // 3. Display an error below the corresponding field.

function showError(field, message) {
  const errorElement = document.getElementById(
    `${field.id}-error`
  );

  errorElement.textContent = message;

  field.classList.add("invalid");
  field.classList.remove("valid");

  field.setAttribute("aria-invalid", "true");
}


 // 4. Clear a field's error.

function clearError(field) {
  const errorElement = document.getElementById(
    `${field.id}-error`
  );

  errorElement.textContent = "";

  field.classList.remove("invalid");
  field.removeAttribute("aria-invalid");
}


 // 5. Validate each field.

function validateField(field) {
  const value = field.value.trim();

  if (value === "") {
    showError(field, "This field is required.");
    return false;
  }

  // Full name

  if (field.id === "fullName") {
    if (value.replace(/\s/g, "").length < 2) {
      showError(field, "Please enter a valid name.");
      return false;
    }
  }

  // Age: 18 to 100

  if (field.id === "age") {
    const age = Number(value);

    if (!Number.isInteger(age) || age < 18 || age > 100) {
      showError(
        field,
        "Age must be a whole number between 18 and 100."
      );
      return false;
    }
  }

  // Email

  if (field.id === "email") {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(value)) {
      showError(field, "Please enter a valid email address.");
      return false;
    }
  }

  // Indian mobile number

  if (field.id === "mobile") {
    const mobilePattern = /^[6-9]\d{9}$/;

    if (!mobilePattern.test(value)) {
      showError(
        field,
        "Enter a valid 10-digit Indian mobile number."
      );
      return false;
    }
  }

  // Password: minimum 8 characters, uppercase,
  // lowercase, number and special character.

  if (field.id === "password") {
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])\S{8,}$/;

    if (!passwordPattern.test(value)) {
      showError(
        field,
        "Use 8+ characters with uppercase, lowercase, a number and a special character."
      );
      return false;
    }
  }

  // Confirm password

  if (field.id === "confirmPassword") {
    if (value !== fields.password.value) {
      showError(field, "Passwords do not match.");
      return false;
    }
  }

  clearError(field);
  field.classList.add("valid");

  return true;
}


 // 6. Update progress bar.

function updateProgress() {
  const allFields = Object.values(fields);

  const completedFields = allFields.filter(
    field => field.value.trim() !== ""
  ).length;

  const percentage = Math.round(
    (completedFields / allFields.length) * 100
  );

  progressText.textContent = `${percentage}%`;
  progressFill.style.width = `${percentage}%`;

  progressTrack.setAttribute("aria-valuenow", percentage);
}


 // 7. Validate while typing and when leaving a field.

Object.values(fields).forEach(field => {
  field.addEventListener("input", () => {
    successMessage.hidden = true;

    clearError(field);

    if (field.value.trim() !== "") {
      validateField(field);
    }

    // Revalidate confirmation when the password changes.

    if (
      field.id === "password" &&
      fields.confirmPassword.value !== ""
    ) {
      validateField(fields.confirmPassword);
    }

    updateProgress();
  });

  field.addEventListener("blur", () => {
    validateField(field);
  });
});


 // 8. Show or hide passwords.

document.querySelectorAll(".toggle-password").forEach(button => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.target);

    const showPassword = target.type === "password";

    target.type = showPassword ? "text" : "password";

    button.textContent = showPassword ? "Hide" : "Show";

    button.setAttribute("aria-pressed", String(showPassword));

    button.setAttribute(
      "aria-label",
      showPassword ? "Hide password" : "Show password"
    );
  });
});


 // 9. Password strength indicator.

fields.password.addEventListener("input", () => {
  const password = fields.password.value;
  const strengthFill = document.getElementById("strength-fill");
  const strengthText = document.getElementById("password-strength");

  let score = 0;

  if (password.length >= 8) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9\s]/.test(password)) score++;

  let label = "No password entered";
  let width = "0%";
  let color = "transparent";

  if (password.length > 0) {
    if (score <= 2) {
      label = "Weak password";
      width = "33%";
      color = "#dc2626";
    } else if (score <= 4) {
      label = "Medium password";
      width = "66%";
      color = "#d99000";
    } else {
      label = "Strong password";
      width = "100%";
      color = "#15803d";
    }
  }

  strengthFill.style.width = width;
  strengthFill.style.backgroundColor = color;
  strengthText.textContent = label;
});


 // 10. Handle form submission.

form.addEventListener("submit", event => {
  event.preventDefault();

  successMessage.hidden = true;

  const allValid = Object.values(fields).every(
    field => validateField(field)
  );

  if (!allValid) {
    const firstInvalidField = Object.values(fields).find(
      field => field.getAttribute("aria-invalid") === "true"
    );

    if (firstInvalidField) {
      firstInvalidField.focus();
    }

    return;
  }

  successMessage.textContent =
    "✓ Success! All fields have been validated successfully.";

  successMessage.hidden = false;

  successMessage.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });
});


 // 11. Initialize the progress bar.

updateProgress();
