export enum Role {
  CUSTOMER = "CUSTOMER",
  SELLER = "SELLER",
  DELIVERY_AGENT = "DELIVERY_AGENT",
  ADMIN = "ADMIN",
}

export interface User {
  id: string;
  name: string;
  phoneNumber: string;
  role: Role;
  shops: Shop[];
  deliveries: Delivery[];
  createdAt: Date;
  updatedAt: Date;
  orders: Order[];
}

export interface Shop {
  id: string;
  name: string;
  userId: string;
  commune: string;
  quartier: string;
  address: string;
  parcels: Parcel[];
  createdAt: Date;
  updatedAt: Date;
  user: User;
}

export enum ParcelType {
  SINGLE = "SINGLE",
  MULTIPLE = "MULTIPLE",
  CARGO = "CARGO",
}

export enum ParcelStatus {
  PENDING = "PENDING",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED",
  RETURNED = "RETURNED",
}

export interface Parcel {
  id: string;
  trackingNumber: string;
  name: string;
  description: string;
  parcelType: ParcelType;
  senderCommune: string;
  senderQuartier: string;
  recipientName: string; // New field for recipient name
  recipientPhone: string; // New field for recipient phone number
  pickupDate: Date;
  pickupTime: string;
  deliveryCommune: string;
  deliveryQuartier: string;
  dropoffDate: Date;
  dropoffTime: string;
  isFeeAtDoor: boolean;
  feeAtDoor?: number;
  parcelsInMultiple: ParcelInMultiple[];
  delivery?: Delivery;
  shopId: string;
  status: ParcelStatus;
  createdAt: Date;
  updatedAt: Date;
  shop: Shop;
}

export interface ParcelInMultiple {
  id: string;
  parcelId: string;
  commune: string;
  quartier: string;
  recipientName: string; // New field for recipient name
  recipientPhone: string; // New field for recipient phone number
  isFeeAtDoor: boolean;
  feeAtDoor?: number;
  parcel: Parcel;
}

export enum DeliveryStatus {
  PENDING = "PENDING",
  IN_TRANSIT = "IN_TRANSIT",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface Delivery {
  id: string;
  userId: string;
  parcelId: string;
  status: DeliveryStatus;
  pickupDate: Date;
  estimatedArrival: Date;
  isDelivered: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  parcel: Parcel;
  orders: Order[];
}

export enum OrderStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
}

export interface Order {
  id: string;
  amount: number;
  status: OrderStatus;
  userId: string;
  deliveryId: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  delivery: Delivery;
}
