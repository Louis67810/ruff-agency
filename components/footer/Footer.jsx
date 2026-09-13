"use client";
import React, { useEffect, useState } from "react";
import heroStyles from "../sections/HeroOptimized/HeroOptimized.module.css";
import { locations, locationRoute } from "../../lib/data/locations";
import { localizeHref } from "../../lib/i18n";
import "./Footer.css";

const LOTTIE_PLAYER_SRC =
  "https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.js";
const AVAILABILITY_LOTTIE =
  "https://framerusercontent.com/assets/7Us0KKzHO2n8Jsf36VlImXFCQQ.json";

export const DECOR_SVG =
  '<svg width="1578" height="2104" viewBox="-75 -75 1578 2104" fill="none" xmlns="http://www.w3.org/2000/svg">\n<path d="M316.78 185.701L656.237 396.965L892.48 551.955C1001.92 623.751 1034.41 769.562 965.806 881.029L602.489 1471.38C577.068 1512.69 525.851 1530.06 480.544 1512.74C459.264 1504.61 441.363 1489.51 429.755 1469.91L407.16 1431.75C385.74 1395.58 378.804 1352.64 387.745 1311.57C414.801 1187.28 565.639 1138.07 660.787 1222.49L669.256 1230C677.849 1237.62 685.661 1246.08 692.577 1255.26L749.182 1330.32C774.841 1364.35 791.056 1404.56 796.184 1446.87L810.223 1562.7C816.142 1611.53 807.032 1661.02 784.106 1704.54L670.387 1920.46" stroke="url(#paint0_linear_915_460)" stroke-opacity="0.05" stroke-width="148.009"/>\n<defs>\n<linearGradient id="paint0_linear_915_460" x1="1036.45" y1="909.756" x2="573.586" y2="524.554" gradientUnits="userSpaceOnUse">\n<stop offset="0.0398851" stop-color="white"/>\n<stop offset="1" stop-color="white" stop-opacity="0"/>\n</linearGradient>\n</defs>\n</svg>\n';
const LOGO_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 69 42.446" overflow="visible"><g><path d="M 0 13.465 C 0 11.075 1.754 9.046 4.12 8.701 L 63.492 0.05 C 64.875 -0.151 66.278 0.258 67.335 1.173 C 68.392 2.087 69 3.416 69 4.813 L 69 37.631 C 69 38.999 68.419 40.301 67.401 41.215 C 66.383 42.128 65.025 42.565 63.666 42.417 L 4.294 35.964 C 1.85 35.699 -0.001 33.635 0 31.177 Z" fill="rgba(255,255,255,0.25)"></path><path d="M 50.982 22.241 L 51.025 35.978 L 53.695 36.336 L 56.37 36.696 L 56.37 26.798 L 56.399 24.927 L 62.371 24.927 L 62.371 20.167 L 59.415 20.139 L 56.443 20.097 L 56.399 19.067 L 56.369 11.623 C 56.369 11.623 58.519 11.219 59.901 10.987 C 61.083 10.789 62.932 10.51 62.932 10.51 L 63.25 10.47 L 63.25 6 L 56.953 6.847 L 50.983 7.648 L 50.983 22.241 Z M 37.451 21.444 L 37.451 34.156 L 40.122 34.514 L 42.838 34.879 L 42.838 26 L 42.868 24.13 L 48.839 24.13 L 48.839 19.37 L 45.882 19.341 L 42.91 19.299 L 42.866 18.269 L 42.837 12.563 L 46.371 11.957 L 49.379 11.409 L 49.718 11.346 L 49.718 7.82 L 43.55 8.648 L 37.423 9.471 L 37.45 21.443 Z M 21.753 11.577 L 21.753 27.703 C 21.753 29.914 23.13 32.214 24.552 32.423 L 31.255 33.323 C 34.625 33.776 35.665 30.233 35.665 27.923 L 35.665 9.708 L 33.287 10.027 L 30.614 10.386 L 30.658 19.724 L 30.658 27.527 C 30.389 28.757 27.481 28.723 26.948 27.527 C 26.891 27.391 26.859 19.654 26.859 19.654 L 26.859 10.891 L 24.728 11.177 Z M 6 21.874 L 6 29.931 L 8.59 30.278 L 10.558 30.542 L 10.558 24.984 L 11.64 24.984 C 12.252 24.944 12.476 24.984 12.971 25.479 C 13.377 25.881 13.298 26.062 13.81 27.415 L 14.64 31.091 L 17.421 31.464 L 20.682 31.902 L 19.304 28.182 L 17.929 25.196 L 17.421 24.206 L 18.043 23.556 C 19.23 22.341 19.739 20.503 19.442 18.553 C 19.074 16.037 17.642 12.997 15.169 12.46 L 10.187 13.129 L 6 13.69 Z M 13.686 17.952 C 14.145 18.412 14.096 19.825 13.686 20.334 C 13.446 20.631 13.032 20.73 12.043 20.772 L 10.558 20.772 L 10.558 17.476 L 12.043 17.476 C 12.876 17.476 13.421 17.687 13.686 17.952 Z" fill="rgb(35,38,48)"></path></g></svg>';
const X_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 12.929 12.067" overflow="visible"><path d="M 10.182 0 L 12.164 0 L 7.833 5.111 L 12.929 12.067 L 8.939 12.067 L 5.814 7.848 L 2.239 12.067 L 0.255 12.067 L 4.888 6.6 L 0 0 L 4.091 0 L 6.915 3.856 Z M 9.486 10.841 L 10.585 10.841 L 3.494 1.161 L 2.315 1.161 L 9.486 10.841 Z" fill="rgb(0, 0, 0)"></path></svg>';
const WHATSAPP_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 15 15" overflow="visible"><g><path d="M 7.498 0 C 3.363 0 0 3.364 0 7.5 C -0.002 9.08 0.498 10.619 1.428 11.896 L 0.493 14.682 L 3.376 13.761 C 4.599 14.572 6.035 15.003 7.502 15 C 11.637 15 15 11.636 15 7.5 C 15 3.364 11.637 0 7.502 0 L 7.498 0 Z" fill="rgb(254,254,254)"></path><path d="M 5.34 3.86 C 5.194 3.511 5.084 3.498 4.863 3.489 C 4.78 3.484 4.696 3.481 4.612 3.481 C 4.326 3.481 4.026 3.564 3.845 3.749 C 3.625 3.974 3.078 4.499 3.078 5.575 C 3.078 6.651 3.863 7.691 3.969 7.837 C 4.079 7.982 5.498 10.222 7.702 11.135 C 9.426 11.849 9.937 11.783 10.329 11.699 C 10.902 11.576 11.621 11.152 11.802 10.641 C 11.982 10.129 11.982 9.693 11.929 9.6 C 11.876 9.508 11.731 9.455 11.511 9.344 C 11.29 9.234 10.219 8.705 10.016 8.635 C 9.818 8.56 9.628 8.586 9.479 8.798 C 9.267 9.093 9.06 9.393 8.892 9.574 C 8.76 9.715 8.544 9.732 8.363 9.657 C 8.12 9.556 7.442 9.318 6.605 8.573 C 5.956 7.995 5.516 7.277 5.388 7.061 C 5.26 6.84 5.374 6.713 5.476 6.593 C 5.586 6.457 5.692 6.359 5.802 6.232 C 5.912 6.104 5.974 6.038 6.045 5.888 C 6.12 5.742 6.067 5.592 6.014 5.482 C 5.961 5.372 5.52 4.296 5.339 3.86 Z" fill="rgb(37,211,102)"></path></g></svg>';
const LINKEDIN_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 18 18" overflow="visible"><g><path d="M 0 0 L 18 0 L 18 18 L 0 18 Z" fill="transparent"></path><path d="M 16.671 0 L 1.329 0 C 0.595 0 0 0.595 0 1.329 L 0 16.671 C 0 17.405 0.595 18 1.329 18 L 16.671 18 C 17.405 18 18 17.405 18 16.671 L 18 1.329 C 18 0.595 17.405 0 16.671 0 Z M 5.365 15.334 L 2.659 15.334 L 2.659 6.737 L 5.365 6.737 Z M 4.01 5.546 C 3.153 5.542 2.461 4.844 2.465 3.986 C 2.468 3.129 3.165 2.436 4.022 2.438 C 4.88 2.44 5.573 3.136 5.572 3.994 C 5.578 4.409 5.415 4.809 5.121 5.101 C 4.826 5.394 4.425 5.555 4.01 5.546 Z M 15.34 15.341 L 12.635 15.341 L 12.635 10.645 C 12.635 9.26 12.046 8.833 11.286 8.833 C 10.483 8.833 9.696 9.437 9.696 10.68 L 9.696 15.341 L 6.99 15.341 L 6.99 6.744 L 9.592 6.744 L 9.592 7.935 L 9.628 7.935 C 9.889 7.406 10.804 6.502 12.2 6.502 C 13.71 6.502 15.341 7.399 15.341 10.024 Z" fill="rgb(255, 255, 255)"></path></g></svg>';

const columnOne = [
  [
    "https://framerusercontent.com/images/rTvF1TiC5rdBQO5rhpOFd8ldXY.png?lossless=1&width=1030&height=641",
    "https://framerusercontent.com/images/rTvF1TiC5rdBQO5rhpOFd8ldXY.png?scale-down-to=512&lossless=1&width=1030&height=641 512w,https://framerusercontent.com/images/rTvF1TiC5rdBQO5rhpOFd8ldXY.png?scale-down-to=1024&lossless=1&width=1030&height=641 1024w,https://framerusercontent.com/images/rTvF1TiC5rdBQO5rhpOFd8ldXY.png?lossless=1&width=1030&height=641 1030w",
    "Hero section du site en dark mode pour un graphiste indépendant",
  ],
  [
    "https://framerusercontent.com/images/R4LWb6dE5ErAebka0CNaIoZjo.png?lossless=1&width=1171&height=789",
    "https://framerusercontent.com/images/R4LWb6dE5ErAebka0CNaIoZjo.png?scale-down-to=512&lossless=1&width=1171&height=789 512w,https://framerusercontent.com/images/R4LWb6dE5ErAebka0CNaIoZjo.png?scale-down-to=1024&lossless=1&width=1171&height=789 1024w,https://framerusercontent.com/images/R4LWb6dE5ErAebka0CNaIoZjo.png?lossless=1&width=1171&height=789 1171w",
    "Section bénéfices du site de Clovarex",
  ],
  [
    "https://framerusercontent.com/images/CmsLlF9YmPoYwvIFmopIp4vh1hg.png?lossless=1&width=1738&height=944",
    "https://framerusercontent.com/images/CmsLlF9YmPoYwvIFmopIp4vh1hg.png?scale-down-to=512&lossless=1&width=1738&height=944 512w,https://framerusercontent.com/images/CmsLlF9YmPoYwvIFmopIp4vh1hg.png?scale-down-to=1024&lossless=1&width=1738&height=944 1024w,https://framerusercontent.com/images/CmsLlF9YmPoYwvIFmopIp4vh1hg.png?lossless=1&width=1738&height=944 1738w",
    "Hero section du site du cabinet Zorgniotti",
  ],
  [
    "https://framerusercontent.com/images/mZi5uW5TqqOtcd6GTIpxOqG5YV0.png?lossless=1&width=1453&height=844",
    "https://framerusercontent.com/images/mZi5uW5TqqOtcd6GTIpxOqG5YV0.png?scale-down-to=512&lossless=1&width=1453&height=844 512w,https://framerusercontent.com/images/mZi5uW5TqqOtcd6GTIpxOqG5YV0.png?scale-down-to=1024&lossless=1&width=1453&height=844 1024w,https://framerusercontent.com/images/mZi5uW5TqqOtcd6GTIpxOqG5YV0.png?lossless=1&width=1453&height=844 1453w",
    "Section bénéfices de la landing page de Getly",
  ],
  [
    "https://framerusercontent.com/images/PauMxxIjUOEjHHSctJbfraiS0.png?lossless=1&width=1606&height=842",
    "https://framerusercontent.com/images/PauMxxIjUOEjHHSctJbfraiS0.png?scale-down-to=512&lossless=1&width=1606&height=842 512w,https://framerusercontent.com/images/PauMxxIjUOEjHHSctJbfraiS0.png?scale-down-to=1024&lossless=1&width=1606&height=842 1024w,https://framerusercontent.com/images/PauMxxIjUOEjHHSctJbfraiS0.png?lossless=1&width=1606&height=842 1606w",
    "Hero section du site de Getly",
  ],
  [
    "https://framerusercontent.com/images/F34W82YeZYoBqjCTLkxVy7nmNvk.png?lossless=1&width=960&height=712",
    "https://framerusercontent.com/images/F34W82YeZYoBqjCTLkxVy7nmNvk.png?scale-down-to=512&lossless=1&width=960&height=712 512w,https://framerusercontent.com/images/F34W82YeZYoBqjCTLkxVy7nmNvk.png?lossless=1&width=960&height=712 960w",
    "Hero section du site de Rentala",
  ],
  [
    "https://framerusercontent.com/images/SiK3fQPYogzIG7grYAldVD64TA.png?lossless=1&width=1508&height=937",
    "https://framerusercontent.com/images/SiK3fQPYogzIG7grYAldVD64TA.png?scale-down-to=512&lossless=1&width=1508&height=937 512w,https://framerusercontent.com/images/SiK3fQPYogzIG7grYAldVD64TA.png?scale-down-to=1024&lossless=1&width=1508&height=937 1024w,https://framerusercontent.com/images/SiK3fQPYogzIG7grYAldVD64TA.png?lossless=1&width=1508&height=937 1508w",
    "Hero section du site : Clovarex",
  ],
  [
    "https://framerusercontent.com/images/5FyecC7dlLNReB31V8xUm6RsI.png?lossless=1&width=1896&height=918",
    "https://framerusercontent.com/images/5FyecC7dlLNReB31V8xUm6RsI.png?scale-down-to=512&lossless=1&width=1896&height=918 512w,https://framerusercontent.com/images/5FyecC7dlLNReB31V8xUm6RsI.png?scale-down-to=1024&lossless=1&width=1896&height=918 1024w,https://framerusercontent.com/images/5FyecC7dlLNReB31V8xUm6RsI.png?lossless=1&width=1896&height=918 1896w",
    "Hero section du site de keyframe agency",
  ],
  [
    "https://framerusercontent.com/images/3y1Az3QkXv41MdvFclgAnW2GLqY.png?lossless=1&width=975&height=621",
    "https://framerusercontent.com/images/3y1Az3QkXv41MdvFclgAnW2GLqY.png?scale-down-to=512&lossless=1&width=975&height=621 512w,https://framerusercontent.com/images/3y1Az3QkXv41MdvFclgAnW2GLqY.png?lossless=1&width=975&height=621 975w",
    "Hero section du site en light mode pour un graphiste indépendant",
  ],
  [
    "https://framerusercontent.com/images/idGSnJrKDelTSe3XIVZnyeY7Tw.jpg?lossless=1&width=6400&height=4060",
    "https://framerusercontent.com/images/idGSnJrKDelTSe3XIVZnyeY7Tw.jpg?scale-down-to=512&lossless=1&width=6400&height=4060 512w,https://framerusercontent.com/images/idGSnJrKDelTSe3XIVZnyeY7Tw.jpg?scale-down-to=1024&lossless=1&width=6400&height=4060 1024w,https://framerusercontent.com/images/idGSnJrKDelTSe3XIVZnyeY7Tw.jpg?scale-down-to=2048&lossless=1&width=6400&height=4060 2048w,https://framerusercontent.com/images/idGSnJrKDelTSe3XIVZnyeY7Tw.jpg?scale-down-to=4096&lossless=1&width=6400&height=4060 4096w,https://framerusercontent.com/images/idGSnJrKDelTSe3XIVZnyeY7Tw.jpg?lossless=1&width=6400&height=4060 6400w",
    "Design d'un concept de hero section",
  ],
];
const columnTwo = [
  [
    "https://framerusercontent.com/images/idGSnJrKDelTSe3XIVZnyeY7Tw.jpg?lossless=1&width=6400&height=4060",
    "https://framerusercontent.com/images/idGSnJrKDelTSe3XIVZnyeY7Tw.jpg?scale-down-to=512&lossless=1&width=6400&height=4060 512w,https://framerusercontent.com/images/idGSnJrKDelTSe3XIVZnyeY7Tw.jpg?scale-down-to=1024&lossless=1&width=6400&height=4060 1024w,https://framerusercontent.com/images/idGSnJrKDelTSe3XIVZnyeY7Tw.jpg?scale-down-to=2048&lossless=1&width=6400&height=4060 2048w,https://framerusercontent.com/images/idGSnJrKDelTSe3XIVZnyeY7Tw.jpg?scale-down-to=4096&lossless=1&width=6400&height=4060 4096w,https://framerusercontent.com/images/idGSnJrKDelTSe3XIVZnyeY7Tw.jpg?lossless=1&width=6400&height=4060 6400w",
    "Design d'un concept de hero section",
  ],
  [
    "https://framerusercontent.com/images/3y1Az3QkXv41MdvFclgAnW2GLqY.png?lossless=1&width=975&height=621",
    "https://framerusercontent.com/images/3y1Az3QkXv41MdvFclgAnW2GLqY.png?scale-down-to=512&lossless=1&width=975&height=621 512w,https://framerusercontent.com/images/3y1Az3QkXv41MdvFclgAnW2GLqY.png?lossless=1&width=975&height=621 975w",
    "Hero section du site en light mode pour un graphiste indépendant",
  ],
  [
    "https://framerusercontent.com/images/5FyecC7dlLNReB31V8xUm6RsI.png?lossless=1&width=1896&height=918",
    "https://framerusercontent.com/images/5FyecC7dlLNReB31V8xUm6RsI.png?scale-down-to=512&lossless=1&width=1896&height=918 512w,https://framerusercontent.com/images/5FyecC7dlLNReB31V8xUm6RsI.png?scale-down-to=1024&lossless=1&width=1896&height=918 1024w,https://framerusercontent.com/images/5FyecC7dlLNReB31V8xUm6RsI.png?lossless=1&width=1896&height=918 1896w",
    "Hero section du site de keyframe agency",
  ],
  [
    "https://framerusercontent.com/images/SiK3fQPYogzIG7grYAldVD64TA.png?lossless=1&width=1508&height=937",
    "https://framerusercontent.com/images/SiK3fQPYogzIG7grYAldVD64TA.png?scale-down-to=512&lossless=1&width=1508&height=937 512w,https://framerusercontent.com/images/SiK3fQPYogzIG7grYAldVD64TA.png?scale-down-to=1024&lossless=1&width=1508&height=937 1024w,https://framerusercontent.com/images/SiK3fQPYogzIG7grYAldVD64TA.png?lossless=1&width=1508&height=937 1508w",
    "Hero section du site : Clovarex",
  ],
  [
    "https://framerusercontent.com/images/rTvF1TiC5rdBQO5rhpOFd8ldXY.png?lossless=1&width=1030&height=641",
    "https://framerusercontent.com/images/rTvF1TiC5rdBQO5rhpOFd8ldXY.png?scale-down-to=512&lossless=1&width=1030&height=641 512w,https://framerusercontent.com/images/rTvF1TiC5rdBQO5rhpOFd8ldXY.png?scale-down-to=1024&lossless=1&width=1030&height=641 1024w,https://framerusercontent.com/images/rTvF1TiC5rdBQO5rhpOFd8ldXY.png?lossless=1&width=1030&height=641 1030w",
    "Hero section du site en dark mode pour un graphiste indépendant",
  ],
  [
    "https://framerusercontent.com/images/R4LWb6dE5ErAebka0CNaIoZjo.png?lossless=1&width=1171&height=789",
    "https://framerusercontent.com/images/R4LWb6dE5ErAebka0CNaIoZjo.png?scale-down-to=512&lossless=1&width=1171&height=789 512w,https://framerusercontent.com/images/R4LWb6dE5ErAebka0CNaIoZjo.png?scale-down-to=1024&lossless=1&width=1171&height=789 1024w,https://framerusercontent.com/images/R4LWb6dE5ErAebka0CNaIoZjo.png?lossless=1&width=1171&height=789 1171w",
    "Section bénéfices du site de Clovarex",
  ],
  [
    "https://framerusercontent.com/images/PauMxxIjUOEjHHSctJbfraiS0.png?lossless=1&width=1606&height=842",
    "https://framerusercontent.com/images/PauMxxIjUOEjHHSctJbfraiS0.png?scale-down-to=512&lossless=1&width=1606&height=842 512w,https://framerusercontent.com/images/PauMxxIjUOEjHHSctJbfraiS0.png?scale-down-to=1024&lossless=1&width=1606&height=842 1024w,https://framerusercontent.com/images/PauMxxIjUOEjHHSctJbfraiS0.png?lossless=1&width=1606&height=842 1606w",
    "Hero section du site de Getly",
  ],
  [
    "https://framerusercontent.com/images/F34W82YeZYoBqjCTLkxVy7nmNvk.png?lossless=1&width=960&height=712",
    "https://framerusercontent.com/images/F34W82YeZYoBqjCTLkxVy7nmNvk.png?scale-down-to=512&lossless=1&width=960&height=712 512w,https://framerusercontent.com/images/F34W82YeZYoBqjCTLkxVy7nmNvk.png?lossless=1&width=960&height=712 960w",
    "Hero section du site de Rentala",
  ],
  [
    "https://framerusercontent.com/images/CmsLlF9YmPoYwvIFmopIp4vh1hg.png?lossless=1&width=1738&height=944",
    "https://framerusercontent.com/images/CmsLlF9YmPoYwvIFmopIp4vh1hg.png?scale-down-to=512&lossless=1&width=1738&height=944 512w,https://framerusercontent.com/images/CmsLlF9YmPoYwvIFmopIp4vh1hg.png?scale-down-to=1024&lossless=1&width=1738&height=944 1024w,https://framerusercontent.com/images/CmsLlF9YmPoYwvIFmopIp4vh1hg.png?lossless=1&width=1738&height=944 1738w",
    "Hero section du site du cabinet Zorgniotti",
  ],
  [
    "https://framerusercontent.com/images/mZi5uW5TqqOtcd6GTIpxOqG5YV0.png?lossless=1&width=1453&height=844",
    "https://framerusercontent.com/images/mZi5uW5TqqOtcd6GTIpxOqG5YV0.png?scale-down-to=512&lossless=1&width=1453&height=844 512w,https://framerusercontent.com/images/mZi5uW5TqqOtcd6GTIpxOqG5YV0.png?scale-down-to=1024&lossless=1&width=1453&height=844 1024w,https://framerusercontent.com/images/mZi5uW5TqqOtcd6GTIpxOqG5YV0.png?lossless=1&width=1453&height=844 1453w",
    "Section bénéfices de la landing page de Getly",
  ],
];
const phoneCards = [
  [
    "framer-q2l8kr-container",
    "https://framerusercontent.com/images/uuaFUZpL3fVhRaGlSV5bBUBCapU.png?width=2206&height=1223",
    "https://framerusercontent.com/images/uuaFUZpL3fVhRaGlSV5bBUBCapU.png?scale-down-to=512&width=2206&height=1223 512w,https://framerusercontent.com/images/uuaFUZpL3fVhRaGlSV5bBUBCapU.png?scale-down-to=1024&width=2206&height=1223 1024w,https://framerusercontent.com/images/uuaFUZpL3fVhRaGlSV5bBUBCapU.png?scale-down-to=2048&width=2206&height=1223 2048w,https://framerusercontent.com/images/uuaFUZpL3fVhRaGlSV5bBUBCapU.png?width=2206&height=1223 2206w",
    "Hero section du site : Clovarex",
  ],
  [
    "framer-1levxt8-container",
    "https://framerusercontent.com/images/RyWM4bax5mzqIS95PvmCIH54M.png?width=1071&height=854",
    "https://framerusercontent.com/images/RyWM4bax5mzqIS95PvmCIH54M.png?scale-down-to=512&width=1071&height=854 512w,https://framerusercontent.com/images/RyWM4bax5mzqIS95PvmCIH54M.png?scale-down-to=1024&width=1071&height=854 1024w,https://framerusercontent.com/images/RyWM4bax5mzqIS95PvmCIH54M.png?width=1071&height=854 1071w",
    "Section processus du site de Spreak",
  ],
  [
    "framer-nf1gxb-container",
    "https://framerusercontent.com/images/87MpF94DhPdyYmKVnC6zXJuEFgc.png?width=2288&height=1189",
    "https://framerusercontent.com/images/87MpF94DhPdyYmKVnC6zXJuEFgc.png?scale-down-to=512&width=2288&height=1189 512w,https://framerusercontent.com/images/87MpF94DhPdyYmKVnC6zXJuEFgc.png?scale-down-to=1024&width=2288&height=1189 1024w,https://framerusercontent.com/images/87MpF94DhPdyYmKVnC6zXJuEFgc.png?scale-down-to=2048&width=2288&height=1189 2048w,https://framerusercontent.com/images/87MpF94DhPdyYmKVnC6zXJuEFgc.png?width=2288&height=1189 2288w",
    "Hero section du site de keyframe agency",
  ],
  [
    "framer-1txb3zx-container",
    "https://framerusercontent.com/images/aONP6DTlxxTAGxNKuzFV84mvpA.png?width=1331&height=884",
    "https://framerusercontent.com/images/aONP6DTlxxTAGxNKuzFV84mvpA.png?scale-down-to=512&width=1331&height=884 512w,https://framerusercontent.com/images/aONP6DTlxxTAGxNKuzFV84mvpA.png?scale-down-to=1024&width=1331&height=884 1024w,https://framerusercontent.com/images/aONP6DTlxxTAGxNKuzFV84mvpA.png?width=1331&height=884 1331w",
    "Hero section du site de keyframe agency",
  ],
  [
    "framer-4v2sb5-container",
    "https://framerusercontent.com/images/nNEynNmBhmT1N7UdbSGrSZVXC4.png?width=1650&height=922",
    "https://framerusercontent.com/images/nNEynNmBhmT1N7UdbSGrSZVXC4.png?scale-down-to=512&width=1650&height=922 512w,https://framerusercontent.com/images/nNEynNmBhmT1N7UdbSGrSZVXC4.png?scale-down-to=1024&width=1650&height=922 1024w,https://framerusercontent.com/images/nNEynNmBhmT1N7UdbSGrSZVXC4.png?width=1650&height=922 1650w",
    "Hero section du site de keyframe agency",
  ],
  [
    "framer-102hbmu-container",
    "https://framerusercontent.com/images/bCPuRQA1Qd2O5OzVFGenHbW2gt4.png?width=2355&height=1126",
    "https://framerusercontent.com/images/bCPuRQA1Qd2O5OzVFGenHbW2gt4.png?scale-down-to=512&width=2355&height=1126 512w,https://framerusercontent.com/images/bCPuRQA1Qd2O5OzVFGenHbW2gt4.png?scale-down-to=1024&width=2355&height=1126 1024w,https://framerusercontent.com/images/bCPuRQA1Qd2O5OzVFGenHbW2gt4.png?scale-down-to=2048&width=2355&height=1126 2048w,https://framerusercontent.com/images/bCPuRQA1Qd2O5OzVFGenHbW2gt4.png?width=2355&height=1126 2355w",
    "Hero section du site de Getly",
  ],
  [
    "framer-opdwvr-container",
    "https://framerusercontent.com/images/wOfEwcZxQ4z81VQslBCNK1V9Q2s.png?width=1346&height=716",
    "",
    "Hero section du site de Rentala",
  ],
  [
    "framer-396lgw-container",
    "https://framerusercontent.com/images/sQTv5J42VPuoBjGNWLqLWTNAT6k.png?width=1252&height=862",
    "https://framerusercontent.com/images/sQTv5J42VPuoBjGNWLqLWTNAT6k.png?scale-down-to=512&width=1252&height=862 512w,https://framerusercontent.com/images/sQTv5J42VPuoBjGNWLqLWTNAT6k.png?scale-down-to=1024&width=1252&height=862 1024w,https://framerusercontent.com/images/sQTv5J42VPuoBjGNWLqLWTNAT6k.png?width=1252&height=862 1252w",
    "Section problèmes du site de Spreak",
  ],
  [
    "framer-tsyydg-container",
    "https://framerusercontent.com/images/OGFuWWnH5m3pxtWVxDD98Iy9wI.jpg?width=1600&height=1015",
    "https://framerusercontent.com/images/OGFuWWnH5m3pxtWVxDD98Iy9wI.jpg?scale-down-to=512&width=1600&height=1015 512w,https://framerusercontent.com/images/OGFuWWnH5m3pxtWVxDD98Iy9wI.jpg?scale-down-to=1024&width=1600&height=1015 1024w,https://framerusercontent.com/images/OGFuWWnH5m3pxtWVxDD98Iy9wI.jpg?width=1600&height=1015 1600w",
    "Design d'un concept de hero section",
  ],
  [
    "framer-1iqzjcs-container",
    "https://framerusercontent.com/images/ed7YUU8EBDlbwFigwv3N0cFQ.png?width=2335&height=1137",
    "",
    "Hero section du site en dark mode pour un graphiste indépendant",
  ],
  [
    "framer-5faj1r-container",
    "https://framerusercontent.com/images/5VTG0ey1sYXgrBXyTylalHaGtU.jpg?width=6064&height=4060",
    "https://framerusercontent.com/images/5VTG0ey1sYXgrBXyTylalHaGtU.jpg?scale-down-to=512&width=6064&height=4060 512w,https://framerusercontent.com/images/5VTG0ey1sYXgrBXyTylalHaGtU.jpg?scale-down-to=1024&width=6064&height=4060 1024w,https://framerusercontent.com/images/5VTG0ey1sYXgrBXyTylalHaGtU.jpg?scale-down-to=2048&width=6064&height=4060 2048w,https://framerusercontent.com/images/5VTG0ey1sYXgrBXyTylalHaGtU.jpg?scale-down-to=4096&width=6064&height=4060 4096w,https://framerusercontent.com/images/5VTG0ey1sYXgrBXyTylalHaGtU.jpg?width=6064&height=4060 6064w",
    "Hero section du site de Initly",
  ],
];

const internalIds = {
  home: "augiA20Il",
  services: "Go1pQxwXE",
  work: "Rcvq3kAWw",
  resources: "N3oetzVX3",
  freeTools: "F9i34IMsU",
  guide: "c7SV5b5op",
  tool: "U0XPDav6h",
  about: "e32wCt7sG",
  booking: "XvvJHap2q",
  leadMagnet: "IDTyZFhsh",
  landingPage: "KoxMagRVR",
  website: "Tb6Nt7U8B",
  serviceLeadMagnet: "CRNiHLUsm",
};

const navItems = [
  ["Accueil", "home"],
  ["Réalisations", "work"],
  ["Ressources", "resources"],
  ["Outils gratuits", "freeTools"],
  ["Guide", "guide"],
  ["Outil", "tool"],
  ["A propos", "about"],
  ["30-min", "booking"],
  ["Lead magnet", "leadMagnet", true],
];
const legacyServiceItems = [
  ["Landing Page", "landingPage"],
  ["Site Internet", "website"],
  ["Développement web", "website"],
  ["Lead magnet", "serviceLeadMagnet", true],
  ["Lead magnet", "leadMagnet", true],
];
const serviceItems = [
  ["Landing Page", "landingPage"],
  ["Site Internet", "website"],
  ["Branding", "branding"],
  ["Product design", "productDesign"],
  ["SEO / GEO", "seoGeo"],
  ["Optimisation conversion", "conversionOptimisation"],
  ["Copywriting", "copywriting"],
  ["Développement Framer", "developpementFramer"],
  ["Développement code (React)", "developpementWeb"],
];
const cities = locations;

function SvgMarkup({ markup, className = "" }) {
  return (
    <span
      className={className}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}

function Availability({ english = false }) {
  const [month, setMonth] = useState("");
  const [remaining, setRemaining] = useState(6);
  const [lottieReady, setLottieReady] = useState(false);

  useEffect(() => {
    const date = new Date();
    const totalDays = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0,
    ).getDate();

    setMonth(
      date.toLocaleDateString(english ? "en-US" : "fr-FR", { month: "long" }),
    );
    setRemaining(Math.ceil(6 - ((date.getDate() - 1) / totalDays) * 5));

    const ready = () => setLottieReady(true);
    let script = null;
    const loadPlayer = () => {
      if (customElements.get("dotlottie-player")) {
        ready();
        return;
      }
      script = document.querySelector(`script[src="${LOTTIE_PLAYER_SRC}"]`);
      if (!script) {
        script = document.createElement("script");
        script.src = LOTTIE_PLAYER_SRC;
        script.type = "module";
        script.async = true;
        document.head.appendChild(script);
      }
      script.addEventListener("load", ready, { once: true });
    };

    window.addEventListener("pointerdown", loadPlayer, { once: true, passive: true });
    window.addEventListener("keydown", loadPlayer, { once: true });
    return () => {
      window.removeEventListener("pointerdown", loadPlayer);
      window.removeEventListener("keydown", loadPlayer);
      script?.removeEventListener("load", ready);
    };
  }, [english]);

  return (
    <div className={heroStyles.availability}>
      <div className={heroStyles.availabilityIcon} aria-hidden="true">
        {lottieReady ? (
          React.createElement("dotlottie-player", {
            src: AVAILABILITY_LOTTIE,
            autoplay: true,
            loop: true,
            speed: 1,
            background: "transparent",
            renderConfig: { autoResize: false },
          })
        ) : (
          <span className={heroStyles.availabilityFallback} />
        )}
      </div>
      <div className={heroStyles.availabilityText}>
        <span className={heroStyles.availabilityNumber}>{remaining}</span>
        <span>
          {english
            ? `spots left for ${month}`
            : `places restantes pour ${month}`}
        </span>
      </div>
    </div>
  );
}

function Cta({ href, english = false }) {
  return (
    <a
      className="footer-cta"
      href={href || "#"}
      onClick={href ? undefined : (e) => e.preventDefault()}
    >
      <span className="footer-cta-inner">
        <span className="footer-cta-text">
          {english ? "Book a call" : "Réserver un appel"}
        </span>
      </span>
    </a>
  );
}

function VerticalTicker({ items, direction, containerClass }) {
  const doubled = [...items, ...items];
  return (
    <div className={containerClass}>
      <div className="footer-vertical-ticker">
        <div className={`footer-vertical-track ${direction}`}>
          {doubled.map(([src, srcSet, alt], i) => (
            <div className="footer-small-hero" key={`${src}-${i}`}>
              <img
                src={src}
                srcSet={srcSet || undefined}
                sizes="382px"
                alt={alt}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PhoneTicker() {
  const doubled = [...phoneCards, ...phoneCards];
  return (
    <div className="framer-1ajmnex">
      <div className="framer-1cfhev1">
        <div className="footer-phone-track">
          {doubled.map(([cls, src, srcSet, alt], i) => (
            <div
              className={`${cls} footer-realisation-card`}
              key={`${src}-${i}`}
            >
              <img
                src={src}
                srcSet={srcSet || undefined}
                sizes="297px"
                alt={alt}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FooterLink({ label, idKey, links, ghost = false, locale = "fr" }) {
  const href = localizeHref(links?.[idKey], locale) || "#";
  return (
    <p className="footer-links">
      <a
        className={ghost ? "footer-link footer-link--ghost" : "footer-link"}
        href={href}
        onClick={href === "#" ? (e) => e.preventDefault() : undefined}
      >
        {label}
      </a>
    </p>
  );
}

function SocialRow({ kind, label, href, svg }) {
  return (
    <div
      className={
        kind === "x"
          ? "framer-1un4xf3"
          : kind === "wa"
            ? "framer-8ld06r"
            : "framer-1l5pyzt"
      }
    >
      <span
        className={`footer-social-icon footer-social-icon--${kind} ${kind === "x" ? "framer-ga2ues" : kind === "wa" ? "framer-7kuc86" : "framer-1c9he38"}`}
      >
        <span className="footer-social-art">
          <SvgMarkup markup={svg} />
        </span>
      </span>
      <p className="footer-social-label">
        <a className="footer-link" href={href} target="_blank" rel="noreferrer">
          {label}
        </a>
      </p>
    </div>
  );
}

export default function Footer({
  padding = "500px 48px 64px 48px",
  visible = true,
  bookingHref,
  links = {},
  className = "",
  style,
  locale = "fr",
}) {
  const t = (fr, en) => (locale === "en" ? en : fr);
  const localizedNavItems = navItems.map(([label, key, ghost]) => [
    t(
      label,
      {
        Accueil: "Home",
        Réalisations: "Our work",
        Ressources: "Resources",
        "Outils gratuits": "Free tools",
        Guide: "Guide",
        Outil: "Tool",
        "A propos": "About us",
        "30-min": "30 min",
        "Lead magnet": "Lead magnet",
      }[label] || label,
    ),
    key,
    ghost,
  ]);
  const localizedServiceItems = serviceItems.map(([label, key, ghost]) => [
    t(
      label,
      {
        "Site Internet": "Website",
        "Développement web": "Web development",
        "Développement Framer": "Framer development",
        "Développement code (React)": "React development",
        "Optimisation conversion": "Conversion optimization",
      }[label] || label,
    ),
    key,
    ghost,
  ]);
  return (
    <footer
      className={`footer-reset framer-M7Fsn framer-1e9n470 ${visible ? "footer--with-cta" : ""} ${className}`}
      style={{
        "--th1ufy": padding,
        "--ink": "#fff",
        backgroundColor: "rgb(35, 38, 48)",
        ...style,
      }}
    >
      {visible && (
        <div
          className="framer-1noh2n"
          style={{
            background:
              "linear-gradient(270deg, rgb(1, 69, 248) 0%, rgb(65, 114, 250) 100%)",
            borderRadius: 64,
            boxShadow:
              "0px 45px 98px 0px rgba(0, 0, 0, 0.05), 0px 178px 178px 0px rgba(0, 0, 0, 0.04), 0px 401px 240px 0px rgba(0, 0, 0, 0.03), 0px 712px 250px 0px rgba(0, 0, 0, 0.01), 0px 1113px 250px 0px rgba(0, 0, 0, 0), inset 0px 3px 0px 0px rgba(255, 255, 255, 0.25)",
          }}
        >
          <div className="framer-1ysvm1q">
            <div className="framer-11kxznf-container">
              <Availability english={locale === "en"} />
            </div>
            <div className="framer-p3ugz3">
              <h2>
                {t(
                  "On crée des landing pages et des sites World-class",
                  "We create world-class landing pages and websites",
                )}
              </h2>
            </div>
            <div className="framer-19eo595-container">
              <Cta
                href={localizeHref(bookingHref || links.booking, locale)}
                english={locale === "en"}
              />
            </div>
          </div>
          <div className="framer-17souuh">
            <div className="framer-14bnp4h">
              <VerticalTicker
                items={columnOne}
                direction="up"
                containerClass="framer-7vwjbd-container"
              />
              <VerticalTicker
                items={columnTwo}
                direction="down"
                containerClass="framer-h2w1tj-container"
              />
            </div>
          </div>
          <div
            className="framer-1n0nolh"
            style={{
              backgroundColor: "rgba(255,255,255,.08)",
              borderRadius: "100%",
              filter: "blur(143.5500030517578px)",
            }}
          />
          <div className="framer-1sx0yih">
            <SvgMarkup markup={DECOR_SVG} className="footer-svg" />
          </div>
          <PhoneTicker />
        </div>
      )}

      <div className="framer-1sjspef">
        <div className="framer-1jh4d2h">
          <div className="framer-1d3n5xr">
            <p className="framer-dsquaq">
              {t(
                "Le mélange parfait entre conversion et design.",
                "The perfect blend of conversion and design.",
              )}
            </p>
            <a
              className="framer-1c40f2t"
              href={localizeHref(links.home, locale) || "#"}
              onClick={links.home ? undefined : (e) => e.preventDefault()}
            >
              <SvgMarkup markup={LOGO_SVG} className="footer-logo-svg" />
              <p className="framer-1oioa2n">.agency</p>
            </a>
          </div>
          <div className="framer-eoh0es">
            <div className="framer-wqmu2g">
              <p className="footer-heading">Navigation</p>
              <div className="framer-1q9fhly">
                {localizedNavItems.map(([label, key, ghost]) => (
                  <FooterLink
                    key={label}
                    label={label}
                    idKey={key}
                    links={links}
                    ghost={ghost}
                    locale={locale}
                  />
                ))}
              </div>
            </div>
            <div className="framer-ngd2e7">
              <p className="footer-heading">Services</p>
              <div className="framer-19q5j0w">
                {localizedServiceItems.map(([label, key, ghost], i) => (
                  <FooterLink
                    key={`${label}-${i}`}
                    label={label}
                    idKey={key}
                    links={links}
                    ghost={ghost}
                    locale={locale}
                  />
                ))}
              </div>
            </div>
            <div className="framer-1g1y9mg">
              <p className="footer-heading">
                {t("Mes réseaux", "My social networks")}
              </p>
              <div className="framer-18ssb44">
                <SocialRow
                  kind="x"
                  label="X"
                  href="https://x.com/Louis67810"
                  svg={X_SVG}
                />
                <SocialRow
                  kind="wa"
                  label="WhatsApp"
                  href="https://api.whatsapp.com/send/?phone=33636465091&text=Bonjour%2C+je+vous+contacte+par+rapport+%C3%A0+vos+landing+pages.&type=phone_number&app_absent=0"
                  svg={WHATSAPP_SVG}
                />
                <SocialRow
                  kind="in"
                  label="LinkedIn"
                  href="https://www.linkedin.com/in/louis-staub-a49062332/"
                  svg={LINKEDIN_SVG}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="framer-1j04v13">
          <p className="footer-heading">{t("Nos lieux :", "Our locations:")}</p>
          <div className="framer-1pgssps">
            {cities.map((location) => (
              <p className="footer-place" key={location.citySlug}>
                <a
                  className="footer-link"
                  href={localizeHref(locationRoute(location), locale)}
                >
                  {location.cityName}
                </a>
              </p>
            ))}
          </div>
        </div>
        <div
          className="framer-1l04fa9"
          style={{ backgroundColor: "rgba(255,255,255,.13)" }}
        />
        <p className="framer-1b5zpj footer-copyright">
          Ruff Agency {t("tous droits réservés", "all rights reserved")}
        </p>
      </div>
    </footer>
  );
}

export { Footer, internalIds };
