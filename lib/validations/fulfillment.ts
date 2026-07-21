import { z } from "zod";

export const markShipmentSchema = z.object({
  orderId: z.string().min(1),
  carrier: z.string().min(1, "Transporteur requis").max(100),
  trackingNumber: z.string().min(1, "Numero de suivi requis").max(200),
});

export const requestReturnSchema = z.object({
  orderItemId: z.string().min(1),
  reason: z
    .string()
    .min(10, "Merci de detailler la raison (10 caracteres minimum)")
    .max(1000),
});
