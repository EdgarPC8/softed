<?php


Flight::route('GET /getHotel', function () {
    HotelController::getHotel();
});
Flight::route('POST /addHotel', function () {
    HotelController::addHotel();
});

Flight::route('PUT /updateHotel/@id', function ($id) {
    HotelController::updateHotel($id);
});
Flight::route('GET /getOneHotel/@id', function ($id) {
    HotelController::getOneHotel($id);
});