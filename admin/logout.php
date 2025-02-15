<?php

session_start();

if ($_SESSION['auth']) {
    unset($_SESSION['auth']);
}

header('Location: ./login.php');