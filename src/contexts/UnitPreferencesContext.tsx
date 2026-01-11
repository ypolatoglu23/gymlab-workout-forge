import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

type WeightUnit = 'kg' | 'lbs';
type HeightUnit = 'cm' | 'ft';

interface UnitPreferencesContextType {
  weightUnit: WeightUnit;
  heightUnit: HeightUnit;
  setWeightUnit: (unit: WeightUnit) => Promise<void>;
  setHeightUnit: (unit: HeightUnit) => Promise<void>;
  loading: boolean;
  formatWeight: (kg: number | null | undefined) => string;
  formatHeight: (cm: number | null | undefined) => string;
}

const UnitPreferencesContext = createContext<UnitPreferencesContextType | undefined>(undefined);

export const useUnitPreferences = () => {
  const context = useContext(UnitPreferencesContext);
  if (context === undefined) {
    throw new Error('useUnitPreferences must be used within a UnitPreferencesProvider');
  }
  return context;
};

export const UnitPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [weightUnit, setWeightUnitState] = useState<WeightUnit>('kg');
  const [heightUnit, setHeightUnitState] = useState<HeightUnit>('cm');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPreferences();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchPreferences = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('weight_unit, height_unit')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!error && data) {
      setWeightUnitState((data.weight_unit as WeightUnit) || 'kg');
      setHeightUnitState((data.height_unit as HeightUnit) || 'cm');
    }
    setLoading(false);
  };

  const setWeightUnit = async (unit: WeightUnit) => {
    if (!user) return;
    
    setWeightUnitState(unit);
    await supabase
      .from('profiles')
      .update({ weight_unit: unit })
      .eq('user_id', user.id);
  };

  const setHeightUnit = async (unit: HeightUnit) => {
    if (!user) return;
    
    setHeightUnitState(unit);
    await supabase
      .from('profiles')
      .update({ height_unit: unit })
      .eq('user_id', user.id);
  };

  const formatWeight = (kg: number | null | undefined): string => {
    if (kg === null || kg === undefined) return '--';
    if (weightUnit === 'lbs') {
      return `${Math.round(kg * 2.20462)} lbs`;
    }
    return `${kg} kg`;
  };

  const formatHeight = (cm: number | null | undefined): string => {
    if (cm === null || cm === undefined) return '--';
    if (heightUnit === 'ft') {
      const totalInches = cm / 2.54;
      const feet = Math.floor(totalInches / 12);
      const inches = Math.round(totalInches % 12);
      return `${feet}'${inches}"`;
    }
    return `${cm} cm`;
  };

  return (
    <UnitPreferencesContext.Provider value={{
      weightUnit,
      heightUnit,
      setWeightUnit,
      setHeightUnit,
      loading,
      formatWeight,
      formatHeight
    }}>
      {children}
    </UnitPreferencesContext.Provider>
  );
};
