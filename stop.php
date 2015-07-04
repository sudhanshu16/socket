<?php 
$res = shell_exec('ps -x');
$res = str_replace("\n","<br>" , $res);
echo $res;
shell_exec("kill -KILL 4476")
 ?>