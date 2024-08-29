document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registration-form");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Ocultar todos los mensajes de error antes de realizar nuevas validaciones
    const errorMessages = document.querySelectorAll(".error-message");
    errorMessages.forEach(function (element) {
      element.style.display = "none";
    });

    // Ocultar mensajes del servidor
    const serverErrors = document.getElementById("server-errors");
    const serverSuccess = document.getElementById("server-success");
    serverErrors.innerHTML = "";
    serverErrors.style.display = "none";
    serverSuccess.innerHTML = "";
    serverSuccess.style.display = "none";

    // Bandera para determinar si el formulario puede enviarse
    let canSubmit = true;

    // Función para validar un campo de texto
    function validateField(
      fieldId,
      errorId,
      requiredMessage,
      customValidation,
      invalidMessage
    ) {
      const field = document.getElementById(fieldId);
      const error = document.getElementById(errorId);
      const value = field.value.trim();

      if (value === "") {
        error.textContent = requiredMessage;
        error.style.display = "block";
        canSubmit = false;
      } else if (customValidation && !customValidation(value)) {
        error.textContent = invalidMessage;
        error.style.display = "block";
        canSubmit = false;
      } else {
        error.style.display = "none";
      }
    }

    // Validaciones de los campos
    validateField(
      "nombre",
      "error-nombre",
      "Campo requerido",
      (value) => /^[a-zA-ZÁÉÍÓÚáéíóú\s]+$/.test(value),
      "El nombre contiene caracteres no permitidos."
    );

    validateField(
      "apellidos",
      "error-apellidos",
      "Campo requerido",
      (value) => /^[a-zA-ZÁÉÍÓÚáéíóú\s]+$/.test(value),
      "El apellido contiene caracteres no permitidos."
    );

    validateField(
      "direccion",
      "error-direccion",
      "Campo requerido",
      (value) => /^[a-zA-Z0-9\s,.()-\/]+$/.test(value),
      "La dirección contiene caracteres no permitidos."
    );

    validateField(
      "ciudad",
      "error-ciudad",
      "Campo requerido",
      (value) => /^[a-zA-ZÁÉÍÓÚáéíóú\s,.]+$/.test(value),
      "La ciudad contiene caracteres no permitidos."
    );

    validateField(
      "pais",
      "error-pais",
      "Campo requerido",
      (value) => /^[a-zA-ZÁÉÍÓÚáéíóú\s]+$/.test(value),
      "El país contiene caracteres no permitidos."
    );

    const telefono = document.getElementById("telefono");
    const errorTelefono = document.getElementById("error-telefono");
    const phonePattern = /^\d+$/;
    const phoneLengthPattern = /^\d{10}$/;

    if (telefono.value.trim() === "") {
      errorTelefono.textContent = "Campo requerido";
      errorTelefono.style.display = "block";
      canSubmit = false;
    } else if (!phonePattern.test(telefono.value.trim())) {
      errorTelefono.textContent = "Solo se permiten números.";
      errorTelefono.style.display = "block";
      canSubmit = false;
    } else if (!phoneLengthPattern.test(telefono.value.trim())) {
      errorTelefono.textContent = "El teléfono debe contener 10 dígitos.";
      errorTelefono.style.display = "block";
      canSubmit = false;
    } else {
      errorTelefono.style.display = "none";
    }

    const email = document.getElementById("email");
    const errorEmail = document.getElementById("error-email");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value.trim() === "") {
      errorEmail.textContent = "Campo requerido";
      errorEmail.style.display = "block";
      canSubmit = false;
    } else if (!emailPattern.test(email.value.trim())) {
      errorEmail.textContent = "Por favor, ingrese un email válido.";
      errorEmail.style.display = "block";
      canSubmit = false;
    } else {
      errorEmail.style.display = "none";
    }

    // Si no hay errores, se puede enviar el formulario
    if (canSubmit) {
      // Recopilar datos del formulario
      const formData = new FormData(form);

      // Enviar datos al servidor
      fetch("../back/process_form.php", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((result) => {
          // Mostrar los mensajes del servidor
          if (result.type === "error") {
            // Mostrar mensajes de error
            serverErrors.innerHTML = result.message;
            serverErrors.style.display = "block";
            setTimeout(() => {
              serverErrors.style.display = "none";
            }, 6000);
          } else if (result.type === "success") {
            // Mostrar mensaje de éxito
            serverSuccess.innerHTML = result.message;
            serverSuccess.style.display = "block";

            setTimeout(() => {
              serverSuccess.style.display = "none";
            }, 6000);


            // Limpiar el formulario si no hay errores
            form.reset();
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          serverErrors.innerHTML = "Hubo un problema al procesar la solicitud.";
          serverErrors.style.display = "block";
        });
    }
  });

  // Añadir eventos para mostrar y ocultar errores en tiempo real
  const fields = [
    "nombre",
    "apellidos",
    "direccion",
    "ciudad",
    "pais",
    "telefono",
    "email",
  ];

  fields.forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    field.addEventListener("input", function () {
      const error = document.getElementById(`error-${fieldId}`);
      error.style.display = "none";
    });
  });
});
