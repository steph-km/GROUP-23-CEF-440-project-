import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SendHorizontal } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Feedback categories
const FEEDBACK_CATEGORIES = [
  'Call Quality',
  'Internet Speed',
  'Signal Strength',
  'App Experience',
  'Customer Service',
  'Other'
];

// Buea locations with coordinates
const BUEA_LOCATIONS = [
  { label: 'Molyko', value: 'Molyko', lat: 4.152, lng: 9.312 },
  { label: 'Tarred Malingo', value: 'Tarred Malingo', lat: 4.160, lng: 9.309 },
  { label: 'Untarred Malingo', value: 'Untarred Malingo', lat: 4.158, lng: 9.307 },
  { label: 'South', value: 'South', lat: 4.148, lng: 9.314 },
  { label: 'Bonduma', value: 'Bonduma', lat: 4.135, lng: 9.296 },
  { label: 'Check Point', value: 'Check Point', lat: 4.150, lng: 9.300 },
  { label: 'Wotolo', value: 'Wotolo', lat: 4.139, lng: 9.302 },
  { label: 'Sandpit', value: 'Sandpit', lat: 4.155, lng: 9.310 },
  { label: 'Great Soppo', value: 'Great Soppo', lat: 4.124, lng: 9.290 },
  { label: 'Clerks Quarters', value: 'Clerks Quarters', lat: 4.134, lng: 9.304 },
  { label: 'Bokwango', value: 'Bokwango', lat: 4.120, lng: 9.285 },
  { label: 'Mile 16', value: 'Mile 16', lat: 4.110, lng: 9.270 },
  { label: 'Mile 18', value: 'Mile 18', lat: 4.100, lng: 9.265 },
  { label: 'Buea Town', value: 'Buea Town', lat: 4.120, lng: 9.320 },
  { label: 'Bakweri Town', value: 'Bakweri Town', lat: 4.125, lng: 9.327 },
  { label: 'Dschang Quarter', value: 'Dschang Quarter', lat: 4.130, lng: 9.315 },
];

export default function FeedbackScreen() {
  const { colors } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState(0);

  const handleSubmitFeedback = async () => {
    if (!selectedCategory || !selectedLocation || (!feedbackText.trim() && rating === 0)) {
      Alert.alert("Missing Information", "Please complete all required fields.");
      return;
    }

    const locationData = BUEA_LOCATIONS.find(loc => loc.value === selectedLocation);

    const newFeedback = {
      category: selectedCategory,
      text: feedbackText.trim(),
      rating,
      location: {
        name: selectedLocation,
        lat: locationData?.lat,
        lng: locationData?.lng
      },
      timestamp: new Date().toISOString(),
    };

    // Log feedback to console
    console.log('📬 New Feedback Submitted:', JSON.stringify(newFeedback, null, 2));

    try {
      const existing = await AsyncStorage.getItem('feedbacks');
      const parsed = existing ? JSON.parse(existing) : [];
      const updatedFeedbacks = [...parsed, newFeedback];
      await AsyncStorage.setItem('feedbacks', JSON.stringify(updatedFeedbacks));
      Alert.alert("Thank You!", "Your feedback has been submitted.", [{ text: "OK", onPress: resetForm }]);
    } catch (error) {
      console.error('❌ Failed to store feedback:', error);
    }
  };

  const resetForm = () => {
    setSelectedCategory('');
    setSelectedLocation('');
    setFeedbackText('');
    setRating(0);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Provide Feedback" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Rate your network experience (1–10)
        </Text>
        <View style={styles.ratingBar}>
          {[...Array(10)].map((_, i) => {
            const value = i + 1;
            return (
              <TouchableOpacity
                key={value}
                style={[
                  styles.ratingCircle,
                  {
                    backgroundColor: value <= rating ? colors.primary : colors.card,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setRating(value)}
              >
                <Text style={{ color: value <= rating ? 'white' : colors.text }}>{value}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>
          Select Feedback Category
        </Text>
        <View style={styles.categoriesContainer}>
          {FEEDBACK_CATEGORIES.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: selectedCategory === category ? colors.primary : colors.card,
                  borderColor: colors.border,
                }
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={{ color: selectedCategory === category ? 'white' : colors.text }}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>
          Select Location
        </Text>
        <RNPickerSelect
          value={selectedLocation}
          onValueChange={setSelectedLocation}
          items={BUEA_LOCATIONS.map(({ label, value }) => ({ label, value }))}
          placeholder={{ label: 'Choose your location...', value: null }}
          style={{
            inputIOS: {
              padding: 12,
              backgroundColor: colors.card,
              color: colors.text,
              borderWidth: 1,
              borderRadius: 8,
              borderColor: colors.border,
              marginBottom: 16
            },
            inputAndroid: {
              padding: 12,
              backgroundColor: colors.card,
              color: colors.text,
              borderWidth: 1,
              borderRadius: 8,
              borderColor: colors.border,
              marginBottom: 16
            }
          }}
        />

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Additional Comments
        </Text>
        <View style={[styles.textInputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TextInput
            style={[styles.textInput, { color: colors.text }]}
            placeholder="Describe your experience..."
            placeholderTextColor={colors.textSecondary}
            multiline
            value={feedbackText}
            onChangeText={setFeedbackText}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: colors.primary }]}
          onPress={handleSubmitFeedback}
        >
          <Text style={styles.submitButtonText}>Submit Feedback</Text>
          <SendHorizontal size={20} color="#FFFFFF" style={styles.submitIcon} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  categoriesContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  textInputContainer: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    marginBottom: 24,
  },
  textInput: {
    fontSize: 16,
    textAlignVertical: 'top',
    height: 120,
  },
  ratingBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  ratingCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  submitIcon: {
    marginLeft: 8,
  },
});
