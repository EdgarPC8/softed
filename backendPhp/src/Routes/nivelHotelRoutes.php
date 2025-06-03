<?php


Flight::route('GET /getNivel', function () {
    NivelHotelController::getNivel();
});
Flight::route('POST /addNivel', function () {
    NivelHotelController::addNivel();
});

Flight::route('PUT /updateNivel/@id', function ($id) {
    NivelHotelController::updateNivel($id);
});
Flight::route('GET /getOneNivel/@id', function ($id) {
    NivelHotelController::getOneNivel($id);
});
Flight::route('DELETE /deleteNivel/@id', function ($id) {
    NivelHotelController::deleteNivel($id);
});