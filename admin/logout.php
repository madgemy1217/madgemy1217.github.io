<? session_start ();  ?>
<html>
<head>
<title>Выход</title>
<meta http-equiv='Refresh' content='3; URL=index.php'>
<meta charset="utf-8">
<style>	.in {
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
</style>
</head>
<body>
<?
if(!$_SESSION['admin'])
{
	echo '<div class=in>Для того, чтобы выйти – надо сперва войти!</div>';
}
else
{
	unset($_SESSION['admin']);
	if(!$_SESSION['admin']) {echo '<div class=in>Вы вышли</div>';}
}
?>
</body>
</html>
