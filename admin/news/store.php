<?php 
session_start();

require './../../config/db.php';

if (!isset($_SESSION['auth']) || !$_SESSION['auth']) {
    header('Location: ./../login.php');
}

if (!isset($_POST['title']) && $_POST['title']){
    $_SESSION['errors']['title'] = 'Поле заголовок обязательно';
    header('Location: ./create.php');
} else if (!isset($_FILES['image']) && $_FILES['image']) {
    $_SESSION['errors']['image'] = 'Поле картинка обязательно';
    header('Location: ./create.php');
} else if (!isset($_POST['content']) && $_POST['content']){
    $_SESSION['errors']['content'] = 'Поле контент обязательно';
    header('Location: ./create.php');
} else if (!isset($_POST['date']) && $_POST['date']){
    $_SESSION['errors']['date'] = 'Поле дата обязательно';
    header('Location: ./create.php');
}

$title = $_POST['title'];
$content = $_POST['content'];
$date = $_POST['date'];
$image = $_FILES['image'];

$type = '';

if ($image['type'] === 'image/jpeg') {
    $type = '.jpg';
} elseif ($image['type'] === 'image/png') {
    $type = '.png';
} elseif ($image['type'] === 'image/bmp') {
    $type = '.bmp';
} elseif ($image['type'] === 'image/webp') {
    $type = '.webp';
} else {
    $_SESSION['errors']['image'] = 'Данный тип изображения не поддерживается';
    header('Location: ./create.php');
}

$filePath = 
    '/news/'
    . md5(
        md5(random_int(0, 99999999) . microtime(true)) 
        . microtime(true) 
        . random_int(0, 999)
    ) 
    . random_int(0, 999999)
    . $type;

$targetFile =
    './../../img'
    . $filePath;

move_uploaded_file($image['tmp_name'], $targetFile);

$sql = "INSERT INTO news (title, content, image, date) VALUES (:title, :content, :filePath, :date)";

$statement = $pdo->prepare($sql);

$statement->bindParam(':title', $title);
$statement->bindParam(':content', $content);
$statement->bindParam(':filePath', $filePath);
$statement->bindParam(':date', $date);

if ($statement->execute()) {
    header('Location: ./index.php');
} else {
    $_SESSION['errors']['title'] = 'Что-то пошло не так. Попробуйте пожалуста снова.';
    header('Location: ./create.php');
}