import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Signal, Download, Upload, Clock } from 'lucide-react-native';
import { ReactNode } from 'react';

type StatusType = 'excellent' | 'good' | 'fair' | 'poor' | 'unknown';

interface StatusCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: 'signal' | 'download' | 'upload' | 'clock';
  status: StatusType;
  lowerIsBetter?: boolean;
}

export function StatusCard({ 
  title, 
  value, 
  unit, 
  icon, 
  status,
  lowerIsBetter = false
}: StatusCardProps) {
  const { colors } = useTheme();
  
  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case 'excellent':
        return colors.success;
      case 'good':
        return colors.primary;
      case 'fair':
        return colors.warning;
      case 'poor':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };
  
  const getIcon = (): ReactNode => {
    const color = getStatusColor(status);
    const size = 20;
    
    switch (icon) {
      case 'signal':
        return <Signal size={size} color={color} />;
      case 'download':
        return <Download size={size} color={color} />;
      case 'upload':
        return <Upload size={size} color={color} />;
      case 'clock':
        return <Clock size={size} color={color} />;
      default:
        return null;
    }
  };
  
  const getStatusText = (status: StatusType) => {
    const qualityText = lowerIsBetter 
      ? {
          excellent: 'Very Low',
          good: 'Low',
          fair: 'Moderate',
          poor: 'High',
        }
      : {
          excellent: 'Excellent',
          good: 'Good',
          fair: 'Fair',
          poor: 'Poor',
        };
    
    return status !== 'unknown' ? qualityText[status] : 'Unknown';
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.headerRow}>
        {getIcon()}
        <Text style={[styles.title, { color: colors.textSecondary }]}>
          {title}
        </Text>
      </View>
      
      <View style={styles.valueContainer}>
        <Text style={[styles.value, { color: colors.text }]}>
          {value}
          {unit && <Text style={styles.unit}>{unit}</Text>}
        </Text>
        <Text style={[styles.status, { color: getStatusColor(status) }]}>
          {getStatusText(status)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    marginLeft: 8,
  },
  valueContainer: {
    
  },
  value: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  unit: {
    fontSize: 14,
    fontWeight: '400',
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
  },
});