import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { ScreenHeader } from '@/components/ScreenHeader';
import { QuickFeedbackButtons } from '@/components/QuickFeedbackButtons';
import { SendHorizontal } from 'lucide-react-native';

const FEEDBACK_CATEGORIES = [
  'Call Quality',
  'Internet Speed',
  'Signal Strength',
  'App Experience',
  'Customer Service',
  'Other'
];

export default function FeedbackScreen() {
  const { colors } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState(0);
  
  const handleSubmitFeedback = () => {
    if (!selectedCategory) {
      Alert.alert("Missing Information", "Please select a category for your feedback.");
      return;
    }
    
    if (!feedbackText.trim() && rating === 0) {
      Alert.alert("Missing Information", "Please provide some feedback or a rating.");
      return;
    }
    
    // Here we would send the feedback to the backend
    Alert.alert(
      "Thank You!",
      "Your feedback has been submitted successfully and will help us improve our service.",
      [{ text: "OK", onPress: () => resetForm() }]
    );
  };
  
  const resetForm = () => {
    setSelectedCategory('');
    setFeedbackText('');
    setRating(0);
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScreenHeader title="Provide Feedback" />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          How is your experience today?
        </Text>
        
        <QuickFeedbackButtons 
          rating={rating}
          onRatingChange={setRating}
        />
        
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>
          What area would you like to provide feedback on?
        </Text>
        
        <View style={styles.categoriesContainer}>
          {FEEDBACK_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                { 
                  backgroundColor: selectedCategory === category ? colors.primary : colors.card,
                  borderColor: selectedCategory === category ? colors.primary : colors.border,
                }
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  { color: selectedCategory === category ? colors.white : colors.text }
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>
          Tell us more
        </Text>
        
        <View style={[styles.textInputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TextInput
            style={[styles.textInput, { color: colors.text }]}
            placeholder="Describe your experience..."
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={6}
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
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
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