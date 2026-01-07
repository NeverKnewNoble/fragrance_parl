//!! Address from database (addresses table)
export interface Address {
  id: string;
  user_id: string;
  address_line: string;
  city: string;
  region: string;
  instructions?: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

//!! Create address input
export type CreateAddressInput = {
  address_line: string;
  city: string;
  region: string;
  instructions?: string;
  is_default?: boolean;
};

//!! Update address input
export type UpdateAddressInput = {
  address_line?: string;
  city?: string;
  region?: string;
  instructions?: string;
  is_default?: boolean;
};
