<?php
error_reporting(E_ALL);
ini_set('display_errors','on');

$host = 'localhost';
$password = 'root';
$dbName = 'test';

$link = mysqli_connect();
mysqli_query($link, "SET Names 'utf8'");

$query = "SELECT title FROM pages";
$result = mysqli_query($link, $query) or die(mysqli_error($link));
for ($data = []; $row = mysqli_fetch_assoc($result); $data[] = $row);

foreach ($data as $page){
    $content .= "<tr>
    <td>{$page['title']}</td>
    <td><a href=\"\">edit</a</a></td>
    </tr>";
} 
$content .= '</table>';

