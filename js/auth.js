/* ============================================================
   STACKLY AI — Authentication JavaScript
   Version: 1.0.0
   Features: Login, Signup, Password Toggle, Social Login,
   Remember Me, Toast System, Real-time Validation
   ============================================================ */

'use strict';

/* ---------------------------------------------------------------
   6. TOAST ALERT SYSTEM  (defined first so other modules can use it)
   --------------------------------------------------------------- */
function showToast(message, type = 'info', duration = 4000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.classList.add('toast-container');
    container.style.cssText = `
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      pointer-events: none;
    `;
    document.body.appendChild(container);
  }

  const icons = {
    success: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm-1 15l-5-5 1.41-1.41L9 12.17l6.59-6.59L17 7l-8 8z" fill="currentColor"/></svg>',
    error: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm5 13.59L13.59 15 10 11.41 6.41 15 5 13.59 8.59 10 5 6.41 6.41 5 10 8.59 13.59 5 15 6.41 11.41 10 15 13.59z" fill="currentColor"/></svg>',
    info: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9V9h2v6zm0-8H9V5h2v2z" fill="currentColor"/></svg>'
  };

  const bgColors = {
    success: 'linear-gradient(135deg, #065F46, #064E3B)',
    error: 'linear-gradient(135deg, #7F1D1D, #991B1B)',
    info: 'linear-gradient(135deg, #1E3A5F, #1E40AF)'
  };

  const borderColors = {
    success: '#22C55E',
    error: '#EF4444',
    info: '#3B82F6'
  };

  const iconColors = {
    success: '#22C55E',
    error: '#EF4444',
    info: '#3B82F6'
  };

  const toast = document.createElement('div');
  toast.classList.add('toast', `toast-${type}`);
  toast.style.cssText = `
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    background: ${bgColors[type] || bgColors.info};
    border-left: 4px solid ${borderColors[type] || borderColors.info};
    border-radius: 10px;
    color: #F1F5F9;
    font-family: 'Inter', 'Segoe UI', sans-serif;
    font-size: 14px;
    font-weight: 500;
    min-width: 320px;
    max-width: 440px;
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.4);
    transform: translateX(120%);
    transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease;
    pointer-events: all;
    opacity: 1;
  `;

  const iconWrapper = document.createElement('span');
  iconWrapper.style.cssText = `color: ${iconColors[type] || iconColors.info}; flex-shrink: 0; display: flex; align-items: center;`;
  iconWrapper.innerHTML = icons[type] || icons.info;

  const textWrapper = document.createElement('span');
  textWrapper.style.cssText = 'flex: 1; line-height: 1.5;';
  textWrapper.textContent = message;

  const closeBtn = document.createElement('button');
  closeBtn.setAttribute('aria-label', 'Close notification');
  closeBtn.style.cssText = `
    background: none; border: none; color: #94A3B8; cursor: pointer;
    font-size: 20px; padding: 0 0 0 8px; line-height: 1; flex-shrink: 0;
    transition: color 0.2s;
  `;
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('mouseenter', () => { closeBtn.style.color = '#fff'; });
  closeBtn.addEventListener('mouseleave', () => { closeBtn.style.color = '#94A3B8'; });
  closeBtn.addEventListener('click', () => dismissToast(toast));

  toast.appendChild(iconWrapper);
  toast.appendChild(textWrapper);
  toast.appendChild(closeBtn);
  container.appendChild(toast);

  // Slide in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
    });
  });

  // Auto-dismiss
  let dismissTimer = setTimeout(() => dismissToast(toast), duration);

  // Pause auto-dismiss on hover
  toast.addEventListener('mouseenter', () => clearTimeout(dismissTimer));
  toast.addEventListener('mouseleave', () => {
    dismissTimer = setTimeout(() => dismissToast(toast), 2000);
  });

  function dismissToast(el) {
    el.style.transform = 'translateX(120%)';
    el.style.opacity = '0';
    el.addEventListener('transitionend', () => {
      if (el.parentNode) el.remove();
    }, { once: true });
    // Fallback removal
    setTimeout(() => {
      if (el.parentNode) el.remove();
    }, 600);
  }
}

// Make showToast globally available
window.showToast = showToast;

/* ---------------------------------------------------------------
   7. REAL-TIME FIELD VALIDATION HELPERS
   --------------------------------------------------------------- */
function setFieldError(field, message) {
  const group = field.closest('.auth-field');
  if (!group) return;
  group.classList.add('error');
  group.classList.remove('valid');
  let errorEl = group.querySelector('.form-error');
  if (!errorEl) {
    errorEl = document.createElement('span');
    errorEl.classList.add('form-error');
    group.appendChild(errorEl);
  }
  errorEl.textContent = message;
  errorEl.style.display = 'block';
}

function clearFieldError(field) {
  const group = field.closest('.auth-field');
  if (!group) return;
  group.classList.remove('error');
  const errorEl = group.querySelector('.form-error');
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.style.display = 'none';
  }
}

function setFieldValid(field) {
  const group = field.closest('.auth-field');
  if (!group) return;
  group.classList.remove('error');
  group.classList.add('valid');
  const errorEl = group.querySelector('.form-error');
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.style.display = 'none';
  }
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s\-+()]{10,}$/;

/* ---------------------------------------------------------------
   1. LOGIN FORM VALIDATION
   --------------------------------------------------------------- */
function initLoginForm() {
  const form = document.querySelector('.login-form, #login-form, #loginForm');
  if (!form) return;

  const emailField = form.querySelector('[name="email"], #login-email, #email, #loginEmail');
  const passwordField = form.querySelector('[name="password"], #login-password, #password, #loginPassword');
  const roleField = form.querySelector('[name="role"], #login-role, #role, #loginRole');
  const submitBtn = form.querySelector('button[type="submit"], .login-btn, #loginBtn');

  // Real-time validation for login fields
  if (emailField) {
    emailField.addEventListener('blur', () => validateLoginEmail(emailField));
    emailField.addEventListener('input', () => {
      if (emailField.closest('.auth-field')?.classList.contains('error')) {
        validateLoginEmail(emailField);
      }
    });
  }

  if (passwordField) {
    passwordField.addEventListener('blur', () => validateLoginPassword(passwordField));
    passwordField.addEventListener('input', () => {
      if (passwordField.closest('.auth-field')?.classList.contains('error')) {
        validateLoginPassword(passwordField);
      }
    });
  }

  function validateLoginEmail(field) {
    const value = field.value.trim();
    if (!value) {
      setFieldError(field, 'Email is required');
      return false;
    }
    if (!EMAIL_REGEX.test(value)) {
      setFieldError(field, 'Please enter a valid email');
      return false;
    }
    setFieldValid(field);
    return true;
  }

  function validateLoginPassword(field) {
    const value = field.value;
    if (!value) {
      setFieldError(field, 'Password is required');
      return false;
    }
    if (value.length < 8) {
      setFieldError(field, 'Password must be at least 8 characters');
      return false;
    }
    setFieldValid(field);
    return true;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailValid = emailField ? validateLoginEmail(emailField) : true;
    const passwordValid = passwordField ? validateLoginPassword(passwordField) : true;
    const roleValid = roleField ? (roleField.value !== '') : true;

    if (!roleField || roleField.value === '') {
        if(roleField) setFieldError(roleField, 'Please select a role');
    } else {
        if(roleField) setFieldValid(roleField);
    }

    if (!emailValid || !passwordValid || !roleValid) {
      showToast('Please fix the errors before submitting.', 'error');
      return;
    }

    // Handle Remember Me
    const rememberMe = form.querySelector('#remember-me, [name="remember"], #rememberMe');
    if (rememberMe && rememberMe.checked && emailField) {
      localStorage.setItem('stackly_remembered_email', emailField.value.trim());
    } else {
      localStorage.removeItem('stackly_remembered_email');
    }

    // Show loading state
    if (submitBtn) {
      submitBtn.classList.add('btn-loading');
      submitBtn.disabled = true;
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="spinner"></span> Signing in...';

      // Simulate API call
      setTimeout(() => {
        const email = emailField.value.trim();

        // Store login state
        localStorage.setItem('stackly_logged_in', 'true');
        localStorage.setItem('stackly_user_email', email);

        showToast('Login successful! Redirecting...', 'success');

        // Determine redirect based on role or email
        let redirectPage = 'dashboard-customer.html';
        const role = roleField ? roleField.value : 'customer';
        
        if (role === 'admin' || email === 'admin@stackly.ai') {
          redirectPage = 'dashboard-admin.html';
        } else if (role === 'developer' || email === 'dev@stackly.ai') {
          redirectPage = 'dashboard-developer.html';
        } else if (role === 'business' || role === 'manager' || email === 'biz@stackly.ai') {
          redirectPage = 'dashboard-business.html';
        } else if (role === 'user') {
          redirectPage = 'dashboard-customer.html';
        }

        setTimeout(() => {
          window.location.href = redirectPage;
        }, 1000);
      }, 2000);
    }
  });
}

/* ---------------------------------------------------------------
   2. SIGNUP FORM VALIDATION
   --------------------------------------------------------------- */
function initSignupForm() {
  const form = document.querySelector('.signup-form, #signup-form, #signupForm');
  if (!form) return;

  const nameField = form.querySelector('[name="fullname"], [name="name"], #signup-name, #firstName, #lastName, #signupName');
  const emailField = form.querySelector('[name="email"], #signup-email, #email, #signupEmail');
  const phoneField = form.querySelector('[name="phone"], #signup-phone, #signupPhone');
  const passwordField = form.querySelector('[name="password"], #signup-password, #password, #signupPassword');
  const confirmField = form.querySelector('[name="confirm-password"], [name="confirmPassword"], #signup-confirm, #signupConfirm');
  const roleField = form.querySelector('[name="role"], #signup-role, #role, #signupRole');
  const termsField = form.querySelector('[name="terms"], #signup-terms, #terms');
  const submitBtn = form.querySelector('button[type="submit"], .signup-btn, #signupBtn');

  // Password Strength Meter
  const strengthBar = form.querySelector('.password-strength-bar');
  const strengthLabel = form.querySelector('.password-strength-label, .strength-text');

  function checkPasswordStrength(password) {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };

    Object.values(checks).forEach(passed => { if (passed) score++; });

    let strength = { label: '', color: '', width: '0%' };

    if (password.length === 0) {
      strength = { label: '', color: 'transparent', width: '0%' };
    } else if (score <= 2) {
      strength = { label: 'Weak', color: '#EF4444', width: '33%' };
    } else if (score <= 3) {
      strength = { label: 'Medium', color: '#F59E0B', width: '66%' };
    } else {
      strength = { label: 'Strong', color: '#22C55E', width: '100%' };
    }

    if (strengthBar) {
      const segments = strengthBar.querySelectorAll('.strength-segment');
      if (segments.length > 0) {
        strengthBar.style.display = password.length > 0 ? 'block' : 'none';
        segments.forEach((seg, i) => {
          seg.style.backgroundColor = (password.length > 0 && i < score) ? strength.color : '#e0e5ef';
        });
      } else {
        strengthBar.style.width = strength.width;
        strengthBar.style.backgroundColor = strength.color;
        strengthBar.style.transition = 'width 0.3s ease, background-color 0.3s ease';
      }
    }
    if (strengthLabel) {
      strengthLabel.textContent = strength.label;
      strengthLabel.style.color = strength.color;
    }

    return score;
  }

  // --- Individual field validators ---
  function validateName() {
    if (!nameField) return true;
    const value = nameField.value.trim();
    if (!value) { setFieldError(nameField, 'Full name is required'); return false; }
    if (value.length < 3) { setFieldError(nameField, 'Name must be at least 3 characters'); return false; }
    setFieldValid(nameField);
    return true;
  }

  function validateEmail() {
    if (!emailField) return true;
    const value = emailField.value.trim();
    if (!value) { setFieldError(emailField, 'Email is required'); return false; }
    if (!EMAIL_REGEX.test(value)) { setFieldError(emailField, 'Please enter a valid email'); return false; }
    setFieldValid(emailField);
    return true;
  }

  function validatePhone() {
    if (!phoneField) return true;
    const value = phoneField.value.trim();
    if (!value) { setFieldError(phoneField, 'Phone number is required'); return false; }
    if (!PHONE_REGEX.test(value)) { setFieldError(phoneField, 'Please enter a valid phone number (10+ digits)'); return false; }
    setFieldValid(phoneField);
    return true;
  }

  function validatePassword() {
    if (!passwordField) return true;
    const value = passwordField.value;
    if (!value) { setFieldError(passwordField, 'Password is required'); return false; }
    if (value.length < 8) { setFieldError(passwordField, 'Password must be at least 8 characters'); return false; }
    setFieldValid(passwordField);
    return true;
  }

  function validateConfirmPassword() {
    if (!confirmField) return true;
    const value = confirmField.value;
    if (!value) { setFieldError(confirmField, 'Please confirm your password'); return false; }
    if (passwordField && value !== passwordField.value) {
      setFieldError(confirmField, 'Passwords do not match');
      return false;
    }
    setFieldValid(confirmField);
    return true;
  }

  function validateRole() {
    if (!roleField) return true;
    const value = roleField.value;
    if (!value) { setFieldError(roleField, 'Please select a role'); return false; }
    setFieldValid(roleField);
    return true;
  }

  function validateTerms() {
    if (!termsField) return true;
    if (!termsField.checked) {
      setFieldError(termsField, 'You must accept the terms and conditions');
      return false;
    }
    clearFieldError(termsField);
    return true;
  }

  // --- Real-time validation bindings ---
  function bindRealTime(field, validator) {
    if (!field) return;
    field.addEventListener('blur', validator);
    field.addEventListener('input', () => {
      if (field.closest('.auth-field')?.classList.contains('error')) {
        validator();
      }
    });
  }

  bindRealTime(nameField, validateName);
  bindRealTime(emailField, validateEmail);
  bindRealTime(phoneField, validatePhone);
  bindRealTime(passwordField, () => {
    validatePassword();
    if (passwordField) checkPasswordStrength(passwordField.value);
    // Re-validate confirm password if it has a value
    if (confirmField && confirmField.value) validateConfirmPassword();
  });
  bindRealTime(confirmField, validateConfirmPassword);
  bindRealTime(roleField, validateRole);

  if (termsField) {
    termsField.addEventListener('change', validateTerms);
  }

  // Password strength on input
  if (passwordField) {
    passwordField.addEventListener('input', () => {
      checkPasswordStrength(passwordField.value);
    });
  }

  // --- Form submission ---
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const validations = [
      validateName(),
      validateEmail(),
      validatePhone(),
      validatePassword(),
      validateConfirmPassword(),
      validateRole(),
      validateTerms()
    ];

    const allValid = validations.every(v => v === true);

    if (!allValid) {
      showToast('Please fix the errors before submitting.', 'error');
      return;
    }

    // Show loading state
    if (submitBtn) {
      submitBtn.classList.add('btn-loading');
      submitBtn.disabled = true;
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="spinner"></span> Creating account...';

      // Simulate API call
      setTimeout(() => {
        showToast('Account created successfully! Redirecting to login...', 'success');
        submitBtn.innerHTML = originalText;
        submitBtn.classList.remove('btn-loading');
        submitBtn.disabled = false;
        form.reset();

        // Reset strength meter
        if (strengthBar) {
          strengthBar.style.width = '0%';
          strengthBar.style.backgroundColor = 'transparent';
        }
        if (strengthLabel) strengthLabel.textContent = '';

        // Clear all validation states
        form.querySelectorAll('.auth-field').forEach(g => {
          g.classList.remove('error', 'valid');
        });

        // Redirect to login page
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 2000);
      }, 2000);
    }
  });
}

/* ---------------------------------------------------------------
   3. SHOW / HIDE PASSWORD TOGGLE
   --------------------------------------------------------------- */
function initPasswordToggles() {
  const toggles = document.querySelectorAll('.password-toggle');
  if (!toggles.length) return;

  const eyeOpenSVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
  const eyeClosedSVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';

  toggles.forEach(toggle => {
    // Set initial icon
    toggle.innerHTML = eyeClosedSVG;

    toggle.addEventListener('click', () => {
      const input = toggle.closest('.auth-field, .form-group, .input-group, .password-wrapper')
        ?.querySelector('input[type="password"], input[type="text"]');
      if (!input) return;

      if (input.type === 'password') {
        input.type = 'text';
        toggle.innerHTML = eyeOpenSVG;
        toggle.setAttribute('aria-label', 'Hide password');
      } else {
        input.type = 'password';
        toggle.innerHTML = eyeClosedSVG;
        toggle.setAttribute('aria-label', 'Show password');
      }
    });
  });
}

/* ---------------------------------------------------------------
   4. SOCIAL LOGIN BUTTONS
   --------------------------------------------------------------- */
function initSocialLogin() {
  const socialBtns = document.querySelectorAll(
    '.social-login-btn, .btn-google, .btn-github, .btn-facebook, .btn-twitter, .social-btn'
  );
  if (!socialBtns.length) return;

  socialBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Social login coming soon! Please use email login.', 'info');
    });
  });
}

/* ---------------------------------------------------------------
   5. REMEMBER ME
   --------------------------------------------------------------- */
function initRememberMe() {
  const emailField = document.querySelector(
    '.login-form [name="email"], #login-email, #loginEmail'
  );
  const rememberCheckbox = document.querySelector('#remember-me, [name="remember"], #rememberMe');

  if (!emailField) return;

  // On page load, populate saved email
  const savedEmail = localStorage.getItem('stackly_remembered_email');
  if (savedEmail) {
    emailField.value = savedEmail;
    if (rememberCheckbox) {
      rememberCheckbox.checked = true;
    }
  }
}

/* ---------------------------------------------------------------
   INITIALIZE ALL AUTH FEATURES
   --------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initLoginForm();
  initSignupForm();
  initPasswordToggles();
  initSocialLogin();
  initRememberMe();
});
