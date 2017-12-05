<?php
define('ROOT_DIRECTORY', str_replace(basename($_SERVER['SCRIPT_NAME']), '', $_SERVER['SCRIPT_NAME']));
$init_script = 'init.js';
$files = glob(__DIR__ . '/*/' . $init_script);

$games = array();
foreach ($files as $i => $filepath) {
	$filepath = str_replace(realpath(__DIR__ . '/../') . '/', '', realpath($filepath));
	$relativepath = str_replace('/' . $init_script, '', $filepath);
	$bn = basename($relativepath);
	$games[$bn] = array('path' => $relativepath, 'file' => $init_script);
}
echo json_encode($games);

?>