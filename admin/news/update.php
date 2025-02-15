<?php

require './../../config/db.php';

session_start(); // Start session if not started already

if (!isset($_GET['id'])) {
    header('Location: ./index.php');
    exit; // Add exit after redirection
}

$id = $_GET['id'];

if (!isset($_POST['title']) || empty($_POST['title'])) {
    $_SESSION['errors']['title'] = 'Поле заголовок обязательно';
    header('Location: ./edit.php?id=' . $id);
    exit; // Add exit after redirection
} elseif (!isset($_POST['content']) || empty($_POST['content'])) {
    $_SESSION['errors']['content'] = 'Поле контент обязательно';
    header('Location: ./edit.php?id=' . $id);
    exit; // Add exit after redirection
} elseif (!isset($_POST['date']) || empty($_POST['date'])) {
    $_SESSION['errors']['date'] = 'Поле дата обязательно';
    header('Location: ./edit.php?id=' . $id);
    exit; // Add exit after redirection
}

$title = $_POST['title'];
$content = $_POST['content'];
$date = $_POST['date'];

$sql = "SELECT * FROM news WHERE id = :id"; // Corrected SQL query
$statement = $pdo->prepare($sql);
$statement->bindParam(':id', $id);
$statement->execute();
$post = $statement->fetch(PDO::FETCH_ASSOC);

if ($post) {
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) { // Check if file upload is successful
        $image = $_FILES['image'];
        $fileExtension = pathinfo($image['name'], PATHINFO_EXTENSION);
        $allowedExtensions = array("jpg", "jpeg", "png", "gif");

        if (!in_array(strtolower($fileExtension), $allowedExtensions)) {
            $_SESSION['errors']['image'] = 'Недопустимый формат изображения';
            header('Location: ./edit.php?id=' . $id);
            exit; // Add exit after redirection
        }

        $filePath = '/news/' . md5(uniqid(mt_rand(), true)) . '.' . $fileExtension;
        $targetFile = './../../img' . $filePath;

        if (move_uploaded_file($image['tmp_name'], $targetFile)) {
            if (file_exists($targetFile)) {
                unlink('./../../img' . $post['image']); // Remove previous image if exists
            }
        } else {
            $_SESSION['errors']['image'] = 'Ошибка при загрузке изображения';
            header('Location: ./edit.php?id=' . $id);
            exit; // Add exit after redirection
        }
    } else {
        $filePath = $post['image']; // Keep the existing image path if no new image uploaded
    }

    $sql = "UPDATE news SET title = :title, content = :content, image = :image, date = :date WHERE id = :id"; // Corrected SQL query
    $statement = $pdo->prepare($sql);
    $statement->bindParam(':id', $id);
    $statement->bindParam(':title', $title);
    $statement->bindParam(':date', $date);
    $statement->bindParam(':content', $content);
    $statement->bindParam(':image', $filePath);

    if ($statement->execute()) {
        header('Location: ./index.php');
        exit; // Add exit after redirection
    }
} else {
    $_SESSION['errors']['id'] = 'Неверный идентификатор новости';
    header('Location: ./index.php');
    exit; // Add exit after redirection
}

// Redirect only if execution doesn't reach any of the above redirection points
header('Location: ./edit.php?id=' . $id);
exit;
