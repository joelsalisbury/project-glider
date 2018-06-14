<?php

function getPartMarkup($path) {
	$file = "parts/".$partID."/index.html";
	if(file_exists($file)) {
		return $file_get_contents($file);
	}
}