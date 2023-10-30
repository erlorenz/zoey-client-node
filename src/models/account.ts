import { boolean, z } from "zod";
import {
  paymentMethodSchema,
  booleanStringSchema,
  stringOrArraySchema,
} from "./core.js";

const accountContactSchema = z.object({
  company_id: z.string(),
  company_location_id: stringOrArraySchema,
  company_location_name: stringOrArraySchema,
  customer_email: z.string(),
  customer_id: z.string(),
  id: z.string(),
  location_id: stringOrArraySchema,
  role_id: stringOrArraySchema.nullable(),
  role_label: stringOrArraySchema.nullable(),
  is_main: booleanStringSchema.optional(),
  is_default_main: booleanStringSchema.optional(),
});

const accountMinContactSchema = accountContactSchema.pick({
  customer_id: true,
  email: true,
});

const accountCustomerSchema = accountContactSchema.omit({
  is_main: true,
  is_default_main: true,
});

const accountNetTermSchema = z.object({
  id: z.string(),
  enabled: booleanStringSchema,
  term: z.string(),
  credit: z.string(),
  detail: z.string().nullable(),
  company_location_id: z.string(),
  disable_past_due: booleanStringSchema,
  disable_past_due_day: z.string().nullable(),
  xy_days: z.string(),
  xy_discount_days: z.string(),
  xy_discount_amount: z.string(),
});

const accountMethodSchema = z.object({
  id: z.string(),
  method: z.string(),
  company_location_id: z.string(),
});

const accountStoreCreditSchema = z.object({
  balance_id: z.string(),
  company_location_id: z.string(),
  is_enabled: booleanStringSchema,
  balance: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

const accountNoteSchema = z.object({
  id: z.string(),
  company_location_id: z.string(),
  user_id: z.string(),
  user_email: z.string(),
  content: z.string(),
  created_at: z.string(),
  updated_at: z.string().nullable(),
  tags: z.array(
    z.object({ type: z.string(), id: z.string(), name: z.string() })
  ),
  user_name: z.string(),
});

const accountAddressSchema = z.object({
  id: z.string(),
  entity_type_id: z.string(),
  attribute_set_id: z.string(),
  address_type: z.string(),
  email: z.string().nullable(),
  prefix: z.string().nullable(),
  firstname: z.string(),
  middlename: z.string().nullable(),
  lastname: z.string(),
  suffix: z.string().nullable(),
  company: z.string().nullable(),
  street: z.array(z.string()),
  city: z.string(),
  region: z.string().nullable(),
  region_id: z.string().nullable(),
  postcode: z.string(),
  country_id: z.string(),
  telephone: z.string(),
  fax: z.string().nullable(),
  zoey_shipping_type: z.string(),
  is_global: booleanStringSchema,
  created_at: z.string(),
  updated_at: z.string(),
  full_address: z.string(),
  company_location_id: z.string(),
  company_id: z.string(),
  company_name: z.string(),
  is_default_billing_address: booleanStringSchema,
  is_default_shipping_address: booleanStringSchema.optional(),

  locations: z.array(
    z.object({ location_id: z.string(), location_name: z.string() })
  ),
});

const accountLocationAddressSchema = z.object({
  id: z.string(),
  entity_type_id: z.string(),
  attribute_set_id: z.string(),
  address_type: z.string(),
  email: z.string().nullable(),
  prefix: z.string().nullable(),
  firstname: z.string(),
  middlename: z.string().nullable(),
  lastname: z.string(),
  suffix: z.null(),
  company: z.string().nullable(),
  street: z.string(),
  city: z.string(),
  region: z.string().nullable(),
  region_id: z.string().nullable(),
  postcode: z.string(),
  country_id: z.string(),
  vat_id: z.string().nullable(),
  telephone: z.string(),
  fax: z.string().nullable(),
  zoey_shipping_type: z.string(),
  is_global: booleanStringSchema,
  validation_state: z.string(),
  validation_detail: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  full_address: z.string(),
  company_location_id: z.string(),
  company_id: z.string(),
  company_name: z.string(),
  location_id: z.string(),
  location_name: z.string(),
  is_default_billing_address: booleanStringSchema.optional(),
  is_default_shipping_address: booleanStringSchema.optional(),
});

const accountLocationSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: booleanStringSchema,
  is_system: booleanStringSchema,
  enable_all_shipping_methods: booleanStringSchema,
  enable_all_payment_methods: booleanStringSchema,
  enable_all_invoice_payment_methods: booleanStringSchema,
  default_billing_address_id: z.string().nullable(),
  default_shipping_address_id: z.string().nullable(),
  external_id: z.string().nullable(),
  // validation_state: z.string(),
  // validation_detail: z.null(),
  company_location_id: z.string(),
  company_id: z.string(),
  company_name: z.string(),
  is_default_location: booleanStringSchema,
  company_status: z.string(),
  addresses: z.array(accountLocationAddressSchema),
  // customers: z.array(z.unknown()),
  // netterm: z.array(z.unknown()),
  payment_methods: z.array(accountMethodSchema),
  invoice_payment_methods: z.array(accountMethodSchema),
  shipping_methods: z.array(accountMethodSchema),
  // storecredit: z.array(z.unknown()),
});

export const accountSchema = z.object({
  id: z.string(),
  type: z.enum(["0", "1", "2"]),
  name: z.string(),
  status: booleanStringSchema,
  customer_group_id: z.string().nullable(),
  fallback_customer_group_id: z.string().nullable(),
  tax_class_id: z.string().nullable(),
  enable_all_shipping_methods: booleanStringSchema,
  enable_all_payment_methods: booleanStringSchema,
  enable_all_invoice_payment_methods: booleanStringSchema,
  default_location_id: z.string().nullable(),
  default_billing_address_id: z.string().nullable(),
  external_id: z.string().nullable(),
  company_location_id: z.string(),
  location_id: z.string(),
  location_name: z.string(),
  global_company_location_id: z.string(),
  customer_count: z.string(),
  main_contacts: z.array(accountMinContactSchema),
  default_main_contact: accountMinContactSchema.nullable(),
  main_contact_names: z.string().nullable(),
  customer_admins: z.array(accountMinContactSchema),
  customer_admin_main_contacts: z.array(accountMinContactSchema),
  total_sales: z.string(),
  total_sales_paid: z.string(),
  last_order_date: z.string().nullable(),
  shipping_methods: z.array(accountMethodSchema).nullable(),
  payment_methods: z.array(accountMethodSchema).nullable(),
  invoice_payment_methods: z.array(accountMethodSchema).nullable(),
  tax_id: z.string().nullable(),
  has_placed_order: booleanStringSchema.nullable(),
  role_id: z.string(),
  sales_reps: z.array(z.string()),
  locations: z.array(accountLocationSchema),
  addresses: z.array(accountAddressSchema),
  customers: z.array(accountCustomerSchema),
  contacts: z.array(accountContactSchema),
  netterm: z.union([accountNetTermSchema, z.array(z.undefined())]),
  storecredit: accountStoreCreditSchema,
  notes: z.array(accountNoteSchema),
});

export const accountListSchema = z.array(accountSchema);

export type ZoeyAccount = z.infer<typeof accountSchema>;
