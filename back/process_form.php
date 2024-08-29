<?php
include 'database.php';

function contienePalabrasPeligrosas($input) {
    $palabrasPeligrosas = [
        'DATABASE', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'TRUNCATE', 'SELECT', 'ALTER', 'SCRIPT', 'GRANT', 'REVOKE'
    ];
    
    $inputUpper = strtoupper($input);
    
    foreach ($palabrasPeligrosas as $palabra) {
        if (strpos($inputUpper, $palabra) !== false) {
            return true;
        }
    }
    
    return false;
}

header('Content-Type: application/json');

$response = ['type' => 'success', 'message' => ''];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = trim($_POST['nombre']);
    $apellidos = trim($_POST['apellidos']);
    $direccion = trim($_POST['direccion']);
    $ciudad = trim($_POST['ciudad']);
    $pais = trim($_POST['pais']);
    $telefono = trim($_POST['telefono']);
    $email = trim($_POST['email']);

    $errors = [];
    $campos = [
        'nombre' => $nombre, 
        'apellidos' => $apellidos, 
        'direccion' => $direccion, 
        'ciudad' => $ciudad, 
        'pais' => $pais, 
        'telefono' => $telefono, 
        'email' => $email
    ];

    foreach ($campos as $campo => $valor) {
        if (contienePalabrasPeligrosas($valor)) {
            $errors[] = "El campo $campo contiene palabras no permitidas.";
        }
    }

    if (empty($nombre)) {
        $errors[] = "El campo nombre es obligatorio.";
    } elseif (!preg_match("/^[a-zA-ZÁÉÍÓÚáéíóú\s]+$/", $nombre)) {
        $errors[] = "El nombre contiene caracteres no permitidos.";
    }

    if (empty($apellidos)) {
        $errors[] = "El campo apellidos es obligatorio.";
    } elseif (!preg_match("/^[a-zA-ZÁÉÍÓÚáéíóú\s]+$/", $apellidos)) {
        $errors[] = "El apellido contiene caracteres no permitidos.";
    }

    if (empty($direccion)) {
        $errors[] = "El campo dirección es obligatorio.";
    } elseif (!preg_match("/^[a-zA-Z0-9\s,.()-\/]+$/", $direccion)) {
        $errors[] = "La dirección contiene caracteres no permitidos.";
    }

    if (empty($ciudad)) {
        $errors[] = "El campo ciudad es obligatorio.";
    } elseif (!preg_match("/^[a-zA-ZÁÉÍÓÚáéíóú\s,.]+$/", $ciudad)) {
        $errors[] = "La ciudad contiene caracteres no permitidos.";
    }

    if (empty($pais)) {
        $errors[] = "El campo país es obligatorio.";
    } elseif (!preg_match("/^[a-zA-ZÁÉÍÓÚáéíóú\s]+$/", $pais)) {
        $errors[] = "El país contiene caracteres no permitidos.";
    }

    if (empty($telefono)) {
        $errors[] = "El campo teléfono es obligatorio.";
    } elseif (!preg_match("/^\d+$/", $telefono)) {
        $errors[] = "El teléfono solo puede contener números.";
    } elseif (!preg_match("/^\d{10}$/", $telefono)) {
        $errors[] = "El teléfono debe contener exactamente 10 dígitos.";
    }

    if (empty($email)) {
        $errors[] = "El campo email es obligatorio.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Por favor, ingrese un email válido.";
    }

    // Validar que el email sea único
    if (empty($errors)) {
        $sqlCheckEmail = "SELECT COUNT(*) FROM usuarios WHERE email = :email";
        $stmtCheckEmail = $pdo->prepare($sqlCheckEmail);
        $stmtCheckEmail->bindParam(':email', $email);
        $stmtCheckEmail->execute();
        if ($stmtCheckEmail->fetchColumn() > 0) {
            $errors[] = "ERROR: El email ya está registrado.";
        }
    }

    if (count($errors) > 0) {
        $response['type'] = 'error';
        $response['message'] = implode("<br>", $errors);
    } else {
        try {
            $sql = "INSERT INTO usuarios (nombre, apellidos, direccion, ciudad, pais, telefono, email) 
                    VALUES (:nombre, :apellidos, :direccion, :ciudad, :pais, :telefono, :email)";

            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':nombre', $nombre);
            $stmt->bindParam(':apellidos', $apellidos);
            $stmt->bindParam(':direccion', $direccion);
            $stmt->bindParam(':ciudad', $ciudad);
            $stmt->bindParam(':pais', $pais);
            $stmt->bindParam(':telefono', $telefono);
            $stmt->bindParam(':email', $email);

            $stmt->execute();

            $response['message'] = "Formulario enviado correctamente.";
        } catch (PDOException $e) {
            $response['type'] = 'error';
            $response['message'] = "Error al enviar el formulario: " . $e->getMessage();
        }
    }
} else {
    $response['type'] = 'error';
    $response['message'] = 'No se ha enviado el formulario.';
}

echo json_encode($response);
