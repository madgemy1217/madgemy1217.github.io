<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $fullname = $_POST['fullname'];
    $number = $_POST['number'];
    $to = "sportolympsk@yandex.ru";
    $subject = "New Contact";
    $message .= 'Новая заявка формы
    Номер телефона: ' . $number . '
    Имя человека: ' . $fullname;
    $headers = "From: sportolympsk@yandex.ru";

mail($to, $subject, $message, $headers);
    header("Location: /contacts.html");
}
?>