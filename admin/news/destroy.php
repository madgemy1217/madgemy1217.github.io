<?php 
session_start();

require './../../config/db.php';

if (!isset($_SESSION['auth']) || !$_SESSION['auth']) {
    header('Location: ./../login.php');
}

if (!isset($_GET['id'])) {
    header('Location: ./index.php');
}

$sql = "SELECT*FROM news WHERE id = :id";

$statement = $pdo->prepare($sql);
$statement->bindParam(':id', $_GET['id']);
$statement->execute();
$post = $statement->fetch(PDO::FETCH_ASSOC);

$filePath = './../../img' . $post['image'];

if ($post) {
    if (file_exists($filePath)) {
        unlink($filePath);
    }

    $sql = "DELETE FROM news WHERE id = :id";
    $statement = $pdo->prepare($sql);
    $statement->bindParam(':id', $post['id']);
    $statement->execute();
}

header('Location: ./index.php');