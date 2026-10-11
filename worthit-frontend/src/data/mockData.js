/**
 * Seed data for WorthIt client-side interactive state.
 * Allows full evaluation of UX flows prior to Session 2-5 backend endpoint delivery.
 */

export const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "MacBook Air M2 (13.6-inch)",
    category: "Electronics",
    brand: "Apple",
    price: 99900,
    purchaseDate: "2024-03-15",
    warrantyPeriod: 12, // months
    expiryDate: "2025-03-15", // Expired
    status: "EXPIRED",
    invoiceFileName: "apple_invoice_2024.pdf",
    repairs: [
      {
        id: 101,
        serviceCenter: "Apple Authorised Service (Imagine)",
        cost: 4500,
        repairDate: "2024-11-10",
        description: "USB-C charging port inspection and cleaning",
      }
    ],
    documents: [
      { id: 201, fileName: "apple_invoice_2024.pdf", type: "INVOICE", uploadedAt: "2024-03-15" }
    ]
  },
  {
    id: 2,
    name: "Samsung 55\" Crystal 4K UHD Smart TV",
    category: "Home Appliances",
    brand: "Samsung",
    price: 48990,
    purchaseDate: "2025-11-01",
    warrantyPeriod: 12,
    expiryDate: "2026-11-01", // Active, expiring soon (under 30 days based on 2026-10-10)
    status: "EXPIRING_SOON",
    invoiceFileName: "samsung_tv_bill.pdf",
    repairs: [],
    documents: [
      { id: 202, fileName: "samsung_tv_bill.pdf", type: "INVOICE", uploadedAt: "2025-11-01" },
      { id: 203, fileName: "extended_warranty_card.pdf", type: "WARRANTY", uploadedAt: "2025-11-05" }
    ]
  },
  {
    id: 3,
    name: "LG Inverter Direct Drive Front Load 8kg",
    category: "Home Appliances",
    brand: "LG",
    price: 38500,
    purchaseDate: "2026-02-20",
    warrantyPeriod: 24,
    expiryDate: "2028-02-20", // Active
    status: "ACTIVE",
    invoiceFileName: "lg_washing_machine_croma.pdf",
    repairs: [
      {
        id: 102,
        serviceCenter: "LG Official Care",
        cost: 1200,
        repairDate: "2026-08-14",
        description: "Water inlet valve filter replacement and routine descaling",
      }
    ],
    documents: [
      { id: 204, fileName: "lg_washing_machine_croma.pdf", type: "INVOICE", uploadedAt: "2026-02-20" }
    ]
  },
  {
    id: 4,
    name: "Sony WH-1000XM5 Wireless Headphones",
    category: "Electronics",
    brand: "Sony",
    price: 26990,
    purchaseDate: "2026-09-01",
    warrantyPeriod: 12,
    expiryDate: "2027-09-01", // Active
    status: "ACTIVE",
    invoiceFileName: "sony_xm5_amazon.pdf",
    repairs: [],
    documents: [
      { id: 205, fileName: "sony_xm5_amazon.pdf", type: "INVOICE", uploadedAt: "2026-09-01" }
    ]
  },
  {
    id: 5,
    name: "Dyson V12 Detect Slim Cordless Vacuum",
    category: "Home Appliances",
    brand: "Dyson",
    price: 49900,
    purchaseDate: "2025-05-10",
    warrantyPeriod: 24,
    expiryDate: "2027-05-10", // Active
    status: "ACTIVE",
    invoiceFileName: "dyson_store_invoice.pdf",
    repairs: [
      {
        id: 103,
        serviceCenter: "Dyson Direct Service Hub",
        cost: 3200,
        repairDate: "2026-04-12",
        description: "Battery pack sensor reset and motor head filter refresh",
      }
    ],
    documents: [
      { id: 206, fileName: "dyson_store_invoice.pdf", type: "INVOICE", uploadedAt: "2025-05-10" }
    ]
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    productId: 2,
    productName: "Samsung 55\" Crystal 4K UHD Smart TV",
    type: "WARRANTY_EXPIRING",
    message: "Warranty expiring in 22 days (November 1, 2026). Schedule inspection or check warranty renewal.",
    sentAt: "2026-10-08 09:00",
    isRead: false,
  },
  {
    id: 2,
    productId: 3,
    productName: "LG Inverter Direct Drive Front Load 8kg",
    type: "SERVICE_DUE",
    message: "6-month preventive drum sanitation service recommended by LG care guide.",
    sentAt: "2026-10-01 10:30",
    isRead: false,
  },
  {
    id: 3,
    productId: 1,
    productName: "MacBook Air M2 (13.6-inch)",
    type: "WARRANTY_EXPIRED",
    message: "Standard Apple 1-Year Limited Warranty has expired. Log any new repairs directly into WorthIt.",
    sentAt: "2025-03-16 00:00",
    isRead: true,
  }
];

export const DEMO_USER = {
  id: 1,
  name: "Aditya Verma",
  email: "aditya.verma@college.edu",
  joinedDate: "October 2026",
  avatar: "AV",
};
