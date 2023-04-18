<? session_start ();
$salt 	= '89fe766db2985e1ecc1972c25577ddbf'; // нужно изменить...
$name 	= md5(strip_tags($_POST['name']).$salt); echo $name.'<br>';
$pas 	= md5(strip_tags($_POST['pas']).$salt);  echo $pas.'<br>';

if($_SESSION['admin'])
{
	echo '<meta charset="UTF-8"><style> .in { width: 200px; left: 50%; top: 50%; position: absolute; transform: translate(-50%,-50%); } </style> <div class="in">Вы уже авторизованы
	 <a href="logout.php" target="_blank">Выйти</a>
	</div>';
	echo '<html> <head> <meta http-equiv="Refresh" content="2; URL=test.php"> </head> <body> </body> </html>';
	exit;
}
else
{
	if($_POST['send'])
	{
		if(($name == 'ad09c4b8063246e3036e072d5230b587') && ($pas == '6440370c5272f5e6fbcda3dd2f999581'))
		{
			$echo = 'Все верно';
			@setcookie("_um_fl", '' , time()+60000000);
			$_SESSION['admin'] = 'здесь какие-то данные -пофиг какие...';
			echo '<html> <head> <meta http-equiv="Refresh" content="2; URL=test.php"> </head> <body> </body> </html>';
		}
		else
		{
			$echo = 'Данные не верны';
			if($_COOKIE['_um_fl'] == '')  { $metka = '1'; $info  = '2 попытки осталось';}
			if($_COOKIE['_um_fl'] == '1') { $metka = '2'; $info  = '1 попытка осталась';}
			if($_COOKIE['_um_fl'] == '2') {  exit ('<meta http-equiv="Refresh" content="0; URL=index.php">'); } else{ @setcookie("_um_fl", $metka ,time()+60000000); }
		}
	}
}
 
if($_COOKIE['_um_fl'] >= '2') {exit('<meta charset="UTF-8"><style>.in { width: 158px; left: 50%; top: 50%; position: absolute; transform: translate(-50%,-50%); text-transform: uppercase; color: red; border: 1px solid; text-align: center; padding: 12px; -webkit-box-shadow: 4px 4px 44px -6px rgb(34 60 80 / 20%); -moz-box-shadow: 4px 4px 44px -6px rgba(34, 60, 80, 0.2); box-shadow: 4px 4px 44px -6px rgb(34 60 80 / 20%);}</style> <div class="in">заблокировано</div>');}
if($info) { $info =  '<div style="color:red;font-size: 11px;text-align: center;padding: 6px;">'.$info .'</div>' ; }
?>
<!DOCTYPE html>
<html lang="ru">
<head>
	<meta charset="UTF-8">
	<title>Вход</title>
	<style>
	input[type="checkbox"] {
	    width: 33px;
	}
		body, input,button  {
	    font-family: system-ui;
	    font-size: 16px;
	}
	body::before {
	    content: "";
	    position: fixed;
	    left: -50px;
	    right: -50px;
	    top: -10px;
	    bottom: 0px;
	    z-index: -1;
	    background: url(back.png)center/cover no-repeat;
	    filter: blur(10px);
	    height: 110%;
	    opacity: 0.5;
	}
	form  {
	    position: absolute;
	    display: inline-grid;
	    top: 50%;
	    left: 50%;
	    width: 320px;
	    border: 1px solid #cecece;
	    padding: 50px;
	    transform: translate(-50%,-50%);    background-color: #fafafa;
	    opacity: 0.7;
			-webkit-box-shadow: 4px 4px 44px -6px rgba(34, 60, 80, 0.2);
      -moz-box-shadow: 4px 4px 44px -6px rgba(34, 60, 80, 0.2);
      box-shadow: 4px 4px 44px -6px rgba(34, 60, 80, 0.2);
	}
	* { margin: 0px; padding: 0px;}
	button { padding: 10px; border: 1px solid #cecece; cursor: pointer; transition: 1s; text-transform: uppercase;     margin: 10px 0;}
  button:hover{
     background: red;
     color: white;
     border: 1px solid red;
	}
	input {
	    border-bottom: 1px solid #e2e2e2;
	    border-top: 0px;
	    border-left: 0px;
	    border-right: 0px;
	    outline: none;
	    display: block;
	    width: 100%;
	    margin: 10px 0;
	    padding: 10px;
	    box-sizing: border-box;
	}
	form h2 {
	    font-family: system-ui;
	    font-size: 22px;
	    text-align: center;
	    border-bottom: 1px solid #d4d4d4;
	    color: #7e7e7e;
	    font-weight: 100;
	    text-shadow: 4px 4px 4px #aaa;
			padding-bottom: 12px;
	}
	</style>
</head>
<body>
	<div class="form">
		<form action="" method="post">
			<h2><? if($echo) { echo  $echo ; } else  {echo  "Войти" ; } ?> </h2>
			<? if($info) { echo  $info ; } ?>
			<input type="text" name="name" placeholder="Имя" required>
			<input type="password" name="pas" placeholder="Пароль" required>
			<button type="submit" name="send" value="1">Войти</button>
		</form>
	</div>
</body>
</html>
