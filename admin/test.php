<? session_start ();
$how_much = 4;
if($_SESSION['admin'])
{
$info = 'Эта страница - пример!<br>
Если вы видите это текст, значит у вас активирована сессия $_SESSION[\'admin\'] <br>
И у данной сессии есть свои данные. Что были переданы в неё в index.php<br>
Теперь выйдите на странице <a href="index.php" target="_blank">index.php</a> и вернитесь сюда<br>
Здесь данные из $_SESSION[\'admin_example\'] : '.$_SESSION['admin_example'];
}
else
{
	echo '<html> <head> <meta http-equiv="Refresh" content="'.$how_much.'; URL=index.php"><style>	.in {
		left: 50%;
    top: 50%;
    position: absolute;
    transform: translate(-50%,-50%);
    text-transform: uppercase;
    border: 1px solid #b2b2b2;
    text-align: center;
    padding: 26px;
    -webkit-box-shadow: 4px 4px 44px -6px rgb(34 60 80 / 20%);
    -moz-box-shadow: 4px 4px 44px -6px rgba(34, 60, 80, 0.2);
    box-shadow: 4px 4px 44px -6px rgb(34 60 80 / 20%);
		color: #585858;
    font-family: system-ui;
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
	red	{color:red;}
	</style></head> <body><div class=in><red>У вас недостаточно прав для просмотра данной информации!</red><div>Вас переместят через <span id="in">'.$how_much.'</span></div> </div>
	<script>
		setInterval(foo, 1000);
		function foo()
		{
			var peremennaya = document.getElementById("in").innerHTML;
			if(peremennaya)
			{
					document.getElementById("in").innerHTML = peremennaya -1;
			}
			else
			{
				document.getElementById("in").innerHTML =\'перемещение\';
			}
		}
	</script>
	</body> </html>';
	exit;
}
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>тестовая страница</title>
</head>
<body>
	<? echo $info; ?>
</body>
</html>
