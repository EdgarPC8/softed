import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Container,
  Button,
  MobileStepper,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "../slidercoverflow.css";
import { Pagination, EffectCoverflow } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/pagination";
import { useAuth } from "../context/AuthContext";

const images = [
  {
    label: "San Francisco – Oakland Bay Bridge, United States",
    imgPath: "https://swiperjs.com/demos/images/nature-1.jpg",
  },
  {
    label: "Bird",
    imgPath: "https://swiperjs.com/demos/images/nature-2.jpg",
  },
  {
    label: "Bali, Indonesia",
    imgPath: "https://swiperjs.com/demos/images/nature-4.jpg",
  },
  {
    label: "Goč, Serbia",
    imgPath: "https://swiperjs.com/demos/images/nature-5.jpg",
  },
];

function Home() {
  const theme = useTheme();
  const { isAuthenticated } = useAuth();

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Typography variant="h4" component="h4" sx={{ mt: 3 }}>
        {!isAuthenticated
          ? "¡Que tal! Es un gusto tenerte de vuelta"
          : "Bienvenido"}
      </Typography>
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        initialSlide={2}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={true}
        modules={[EffectCoverflow, Pagination]}
      >
        {images.map((step, index) => (
          // <div key={step.label}>
          <SwiperSlide key={index}>
            <Box
              component="img"
              src={step.imgPath}
              sx={{ width: "100%" }}
              alt={step.label}
            />
          </SwiperSlide>
          // </div>
        ))}
      </Swiper>
    </Container>
  );
}

export default Home;
