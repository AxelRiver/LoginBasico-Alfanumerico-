document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const usernameError = document.getElementById('usernameError');
  const passwordError = document.getElementById('passwordError');

  const CORRECT_USER = "riveraandre412@gmail.com";
  const CORRECT_PASS = "A1umn0S_2026";

  const validateUsername = () => usernameInput.value.trim() === CORRECT_USER;
  const validatePassword = () => passwordInput.value === CORRECT_PASS;

  const setValidation = (input, errorEl, isValid, msg = '') => {
    input.classList.toggle('is-valid', isValid);
    input.classList.toggle('is-invalid', !isValid);
    if (errorEl) errorEl.textContent = isValid ? '' : msg;
  };

  // Validación en tiempo real
  usernameInput.addEventListener('input', () => {
    setValidation(usernameInput, usernameError, validateUsername(), 'Usuario incorrecto');
  });

  passwordInput.addEventListener('input', () => {
    setValidation(passwordInput, passwordError, validatePassword(), 'Contraseña incorrecta');
  });

  // Envío del formulario
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const userValid = validateUsername();
    const passValid = validatePassword();

    setValidation(usernameInput, usernameError, userValid, 'Usuario incorrecto');
    setValidation(passwordInput, passwordError, passValid, 'Contraseña incorrecta');

    if (!userValid || !passValid) {
      alert('Credenciales incorrectas');
      return;
    }

    // Éxito → registrar en Firebase (opcional) y redirigir
    if (window.database) {
      window.database.ref('logins').push({
        username: usernameInput.value.trim(),
        timestamp: new Date().toISOString(),
        status: 'success'
      }).catch(err => console.error("Error al guardar en Firebase:", err));
    }

    alert('✅ Login exitoso');
    window.location.href = "universidades.html";
  });
});