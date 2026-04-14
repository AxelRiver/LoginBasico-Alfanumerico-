document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const usernameError = document.getElementById('usernameError');
  const passwordError = document.getElementById('passwordError');

  // Variables para guardar el dato sugerido
  let suggestedId = null;
  let suggestedName = null;

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

  // ====================== NUEVO: SUGERIDOR DE USUARIOS ======================
  const suggestBtn = document.getElementById('suggestBtn');
  suggestBtn.addEventListener('click', async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!response.ok) throw new Error('Error en la API');

      const users = await response.json();
      const randomUser = users[Math.floor(Math.random() * users.length)];

      // Insertar el nombre directamente en el input
      usernameInput.value = randomUser.name;

      // Guardar dato sugerido + ID único
      suggestedName = randomUser.name;
      suggestedId = randomUser.id;

      // Limpiar error y mostrar que es válido temporalmente
      setValidation(usernameInput, usernameError, true);

      console.log(`✅ Nombre sugerido: ${randomUser.name} (ID: ${randomUser.id})`);
    } catch (error) {
      console.error('Error al sugerir nombre:', error);
      alert('⚠️ No se pudo obtener un nombre. Inténtalo de nuevo.');
    }
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

    // Éxito → registrar en Firebase (con dato sugerido + ID si se usó)
    if (window.database) {
      const loginData = {
        username: usernameInput.value.trim(),
        timestamp: new Date().toISOString(),
        status: 'success'
      };

      // Si se usó el sugeridor, guardamos también el nombre y el ID único
      if (suggestedId !== null) {
        loginData.suggestedName = suggestedName;
        loginData.suggestedId = suggestedId;
      }

      window.database.ref('logins').push(loginData)
        .catch(err => console.error("Error al guardar en Firebase:", err));
    }

    alert('✅ Login exitoso');
    window.location.href = "universidades.html";
  });
});
