<?php

Flight::route('POST /login', function () {
    Sesiones::setSession();
});

Flight::route('GET /getSession', function () {
    Sesiones::getAuthorizedUserData();
});

Flight::route('GET /closeSession', function () {
    Sesiones::closeSession();
});
