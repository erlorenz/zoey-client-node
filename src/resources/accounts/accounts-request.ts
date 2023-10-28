import type { ZoeyPaymentMethodCode } from "../../models/core.js";
import type { ZoeyBooleanNumber, ZoeyResourceId } from "../../types.js";

export type CreateAccountRequestBody = {
  companyData: {
    name: string;
    external_id: string;
    status?: ZoeyBooleanNumber;
    sales_rep_user_ids?: ZoeyResourceId[];
    customer_group_id?: ZoeyResourceId;
    enable_all_shipping_methods: ZoeyBooleanNumber;
    enable_all_payment_methods: ZoeyBooleanNumber;
    addresses: AccountAddress[];
    locations: AccountLocation[];
    customers: AccountCustomer[];
    shipping_methods: string[];
    payment_methods: ZoeyPaymentMethodCode[];
  };
};

type AccountAddress = {
  firstname: string;
  lastname: string;
  telephone: string;
  address_type: "billing" | "shipping" | "billing,shipping";
  is_default_billing_address: ZoeyBooleanNumber;
  is_default_shipping_address?: ZoeyBooleanNumber;
  street: string[];
  city: string;
  region: string;
  postcode: string;
  country_id: string;
  location_ids?: ZoeyResourceId[];
};

type AccountLocation = {
  id: ZoeyResourceId;
  status: ZoeyBooleanNumber;
  name: string;
  is_default_location: ZoeyBooleanNumber;
  enable_all_shipping_methods: ZoeyBooleanNumber;
  enable_all_payment_methods: ZoeyBooleanNumber;
};

type AccountCustomer = {
  customer_id: ZoeyResourceId;
  is_main: ZoeyBooleanNumber;
  role_id: ZoeyResourceId;
  is_default_main: ZoeyBooleanNumber;
};
