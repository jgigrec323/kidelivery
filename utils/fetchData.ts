import axios from "axios";
import config from "@/utils/config";
import { AppDispatch } from "@/store";
import { setOrders, clearOrders } from "@/store/slices/orderSlice";
import { setDeliveries, clearDeliveries } from "@/store/slices/deliverySlice";
import { Order, Delivery } from "@/utils/types";

// Function to fetch orders by userId and update Redux store
export const fetchOrders = async (userId: string, dispatch: AppDispatch) => {
  try {
    dispatch(clearOrders()); // Clear old data

    const response = await axios.get<Order[]>(
      `${config.API_BASE_URL}/orders/${userId}`
    );
    dispatch(setOrders(response.data)); // Update state with new orders
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};

// Function to fetch deliveries by userId and update Redux store
export const fetchDeliveries = async (
  userId: string,
  dispatch: AppDispatch
) => {
  try {
    dispatch(clearDeliveries()); // Clear old data

    const response = await axios.get<Delivery[]>(
      `${config.API_BASE_URL}/deliveries/${userId}`
    );
    dispatch(setDeliveries(response.data)); // Update state with new deliveries
  } catch (error) {
    console.error("Error fetching deliveries:", error);
  }
};
