<?php 

require_once './../config/db.php';

session_start();

if (!isset($_POST['email'])) {
    $_SESSION['errors']['email'] = 'Поле email обязательно';
} else if (!isset($_POST['password'])) {
    $_SESSION['errors']['password'] = 'Поле пароль обязательно';
}

$email = $_POST['email'];
$password = $_POST['password'];

$sql = "SELECT*FROM users WHERE email = '$email'";

$statement = $pdo->prepare($sql);

$statement->execute();

$user = $statement->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    $_SESSION['errors']['email'] = 'Неправильный логин или пароль';
    header('Location: ./login.php');
}

if (password_verify($password, $user['password'])) {
    $_SESSION['auth'] = $user;
    header('Location: ./news/index.php');
} else {
    $_SESSION['errors']['email'] = 'Неправильный логин или пароль';
    header('Location: ./login.php');
}