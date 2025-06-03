<?php
Flight::route('POST /users', function () {
    UserController::addUser();
});


Flight::route('GET /users', function () {
    UserController::getUsers();
});

Flight::route('GET /users/@dni', function ($dni) {
    UserController::getOneUser($dni);
});

Flight::route('PUT /users/@dni', function ($dni) {
    UserController::updateUser($dni);
});

Flight::route('DELETE /users/@dni', function ($dni) {
    UserController::deleteUser($dni);
});


Flight::route("POST /users/photo", function () {
    UserController::addPhoto();
});


Flight::route("PUT /users/photo/@dni", function ($dni) {
    UserController::updatePhoto($dni);
    // var_dump("hola");
});