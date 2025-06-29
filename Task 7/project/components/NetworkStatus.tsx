import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react-native';
import { getCurrentNetworkType } from '@/utils/networkUtils';

export function NetworkStatus() {
  const { colors } = useTheme();
  const [networkType, setNetworkType] = useState<string>('unknown');
  const [isConnected, setIsConnected] = useState<boolean>(true);
  
  useEffect(() => {
    // In a real app, this would use NetInfo to detect network changes
    async function checkNetworkStatus() {
      try {
        const type = await getCurrentNetworkType();
        setNetworkType(type);
        setIsConnected(type !== 'none');
      } catch (error) {
        console.error('Failed to get network type:', error);
        setIsConnected(false);
      }
    }
    
    checkNetworkStatus();
    
    // Set up a timer to simulate network checks
    const timer = setInterval(checkNetworkStatus, 10000);
    
    return () => clearInterval(timer);
  }, []);
  
  const getStatusColor = () => {
    if (!isConnected) return colors.error;
    
    switch (networkType) {
      case 'wifi':
        return colors.success;
      case 'cellular':
        return colors.primary;
      case '5g':
        return colors.secondary;
      case '4g':
        return colors.primary;
      case '3g':
        return colors.warning;
      case '2g':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };
  
  const getNetworkTypeName = () => {
    if (!isConnected) return 'Offline';
    
    switch (networkType) {
      case 'wifi':
        return 'Wi-Fi';
      case 'cellular':
        return 'Cellular';
      case '5g':
        return '5G';
      case '4g':
        return '4G LTE';
      case '3g':
        return '3G';
      case '2g':
        return '2G';
      default:
        return 'Connected';
    }
  };
  
  return (
    <View 
      style={[
        styles.container,
        { 
          backgroundColor: colors.card,
          borderColor: getStatusColor()
        }
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: getStatusColor() }]}>
        {isConnected ? (
          <Wifi color={colors.white} size={20} />
        ) : (
          <WifiOff color={colors.white} size={20} />
        )}
      </View>
      
      <View style={styles.textContainer}>
        <Text style={[styles.networkType, { color: getStatusColor() }]}>
          {getNetworkTypeName()}
        </Text>
        <Text style={[styles.statusText, { color: colors.textSecondary }]}>
          {isConnected 
            ? `Connected to ${networkType === 'wifi' ? 'Wi-Fi' : 'Mobile Data'}`
            : 'No internet connection'
          }
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginVertical: 12,
    borderLeftWidth: 4,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  networkType: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  statusText: {
    fontSize: 14,
  },
});