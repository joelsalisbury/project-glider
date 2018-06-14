<?php

use Slim\Http\Request;
use Slim\Http\Response;

// Routes

$app->get('/flight', function (Request $request, Response $response, array $args) {


    // Render index view
    return $this->renderer->render($response, 'flight.php', $args);
});

$app->get('/place/{placeId}', function (Request $request, Response $response, array $args) {

    // Render index view
    return $this->renderer->render($response, 'place.php', $args);
});
