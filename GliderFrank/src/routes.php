<?php

use Slim\Http\Request;
use Slim\Http\Response;

// Routes

$app->get('/flight', function (Request $request, Response $response, array $args) {
    // Sample log message

    // Render index view
    return $this->renderer->render($response, 'flight.php', $args);
});
