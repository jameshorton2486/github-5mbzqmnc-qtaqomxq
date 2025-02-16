import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import type { Database } from '../database.types';

type Deposition = Database['public']['Tables']['depositions']['Row'];

interface UseDepositionsOptions {
  limit?: number;
  orderBy?: {
    column: keyof Deposition;
    ascending?: boolean;
  };
  filter?: {
    column: keyof Deposition;
    value: any;
  };
}

export function useDepositions(options: UseDepositionsOptions = {}) {
  const [depositions, setDepositions] = useState<Deposition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDepositions = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('depositions')
        .select('*');

      if (options.filter) {
        query = query.eq(options.filter.column, options.filter.value);
      }

      if (options.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending ?? false
        });
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;
      setDepositions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch depositions'));
    } finally {
      setLoading(false);
    }
  }, [options]);

  useEffect(() => {
    fetchDepositions();
  }, [fetchDepositions]);

  const addDeposition = async (deposition: Omit<Deposition, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('depositions')
        .insert([deposition])
        .select()
        .single();

      if (error) throw error;
      setDepositions(prev => [...prev, data]);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add deposition');
    }
  };

  const updateDeposition = async (id: string, updates: Partial<Deposition>) => {
    try {
      const { data, error } = await supabase
        .from('depositions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setDepositions(prev => prev.map(d => d.id === id ? data : d));
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update deposition');
    }
  };

  const deleteDeposition = async (id: string) => {
    try {
      const { error } = await supabase
        .from('depositions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setDepositions(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete deposition');
    }
  };

  return {
    depositions,
    loading,
    error,
    refresh: fetchDepositions,
    addDeposition,
    updateDeposition,
    deleteDeposition,
  };
}