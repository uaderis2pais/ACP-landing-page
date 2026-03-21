import { menuData, reviewsData } from '../data/data';

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getProducts = async () => {
  await delay(800);
  return menuData;
};

export const getReviews = async () => {
  await delay(500);
  return reviewsData;
};

export const submitOrder = async (orderData) => {
  await delay(1500);
  // Simulate API response
  return {
    success: true,
    message: "Pedido recibido con éxito. Nos pondremos en contacto a la brevedad.",
    orderId: "CMD-" + Math.floor(Math.random() * 1000000)
  };
};
