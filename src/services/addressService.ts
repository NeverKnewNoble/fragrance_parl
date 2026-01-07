import { supabase } from '@/lib/supabase/client';
import { Address, CreateAddressInput, UpdateAddressInput } from '@/types/address';

//!! Get user addresses
export const getUserAddresses = async (userId: string): Promise<Address[]> => {
  try {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error getting user addresses:', error);
    throw error;
  }
};

//!! Get default address
export const getDefaultAddress = async (userId: string): Promise<Address | null> => {
  try {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .eq('is_default', true)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error getting default address:', error);
    return null;
  }
};

//!! Create address
export const createAddress = async (userId: string, input: CreateAddressInput): Promise<Address> => {
  try {
    // If setting as default, unset other default addresses first
    if (input.is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', userId);
    }

    const { data, error } = await supabase
      .from('addresses')
      .insert({
        user_id: userId,
        ...input
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error creating address:', error);
    throw error;
  }
};

//!! Update address
export const updateAddress = async (addressId: string, userId: string, input: UpdateAddressInput): Promise<Address> => {
  try {
    // If setting as default, unset other default addresses first
    if (input.is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', userId);
    }

    const { data, error } = await supabase
      .from('addresses')
      .update(input)
      .eq('id', addressId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error updating address:', error);
    throw error;
  }
};

//!! Delete address
export const deleteAddress = async (addressId: string, userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', addressId)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting address:', error);
    throw error;
  }
};

//!! Set default address
export const setDefaultAddress = async (addressId: string, userId: string): Promise<Address> => {
  try {
    // Unset all other default addresses
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', userId);

    // Set new default
    const { data, error } = await supabase
      .from('addresses')
      .update({ is_default: true })
      .eq('id', addressId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error setting default address:', error);
    throw error;
  }
};
