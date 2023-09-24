import { ZoeyBooleanNumber, ZoeyResourceId } from "../zoey/types";

export type CreateAccountRequestBody = {
  companyData: {
    name: string;
    external_id: string;
    status?: ZoeyBooleanNumber;
    sales_rep_user_ids?: string[];
    customer_group_id?: string;
    enable_all_shipping_methods: ZoeyBooleanNumber;
    enable_all_payment_methods: ZoeyBooleanNumber;
    addresses: AccountAddress[];
    locations: AccountLocation[];
    customers: AccountCustomer[];
    shipping_methods: string[];
    payment_methods: string[];
  };
};

type AccountAddress = {
  firstname: string;
  lastname: string;
  telephone: string;
  address_type: string;
  is_default_billing_address?: ZoeyBooleanNumber;
  street: string[];
  city: string;
  region: string;
  postcode: string;
  country_id: string;
  is_default_shipping_address?: string;
  location_ids?: string[];
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
  role_id: string;
  is_default_main: ZoeyBooleanNumber;
};
