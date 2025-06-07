import { TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { SlidersHorizontal } from 'lucide-react-native';

interface FilterButtonProps {
  onPress: () => void;
  active?: boolean;
}

export function FilterButton({ onPress, active = false }: FilterButtonProps) {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { 
          backgroundColor: active ? colors.primary : colors.card,
          borderColor: active ? colors.primary : colors.border,
        }
      ]}
      onPress={onPress}
    >
      <SlidersHorizontal 
        size={20} 
        color={active ? colors.white : colors.text}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});