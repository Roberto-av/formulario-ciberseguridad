<?php
require_once 'back/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once 'back/process_form.php';
} else {
    include 'front/index.html';
}
