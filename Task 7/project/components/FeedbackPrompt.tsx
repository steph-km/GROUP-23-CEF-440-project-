import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react-native';
import { useState } from 'react';
import { router } from 'expo-router';

export function FeedbackPrompt() {
  const { colors } = useTheme();
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  
  const handleQuickFeedback = (isPositive: boolean) => {
    // Here you would send the feedback to your backend
    setFeedbackGiven(true);
    
    // After a delay, reset the component to allow more feedback
    setTimeout(() => {
      setFeedbackGiven(false);
    }, 5000);
  };
  
  const navigateToFeedback = () => {
    router.navigate('/feedback'); // Adjust the path as needed for your app 
  };
  
  if (feedbackGiven) {
    return (
      <View style={[styles.container, { backgroundColor: colors.successBackground }]}>
        <Text style={[styles.thankYouText, { color: colors.success }]}>
          Thank you for your feedback!
        </Text>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.iconTextContainer}>
        <MessageSquare size={20} color={colors.primary} />
        <Text style={[styles.promptText, { color: colors.text }]}>
          How is your network experience today?
        </Text>
      </View>
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.feedbackButton, { borderColor: colors.success }]}
          onPress={() => handleQuickFeedback(true)}
        >
          <ThumbsUp size={16} color={colors.success} />
          <Text style={[styles.feedbackButtonText, { color: colors.success }]}>
            Good
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.feedbackButton, { borderColor: colors.error }]}
          onPress={() => handleQuickFeedback(false)}
        >
          <ThumbsDown size={16} color={colors.error} />
          <Text style={[styles.feedbackButtonText, { color: colors.error }]}>
            Poor
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.detailedButton, { backgroundColor: colors.primary }]}
          onPress={navigateToFeedback}
        >
          <Text style={styles.detailedButtonText}>
            Details
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  promptText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    width: '30%',
  },
  feedbackButtonText: {
    marginLeft: 6,
    fontWeight: '500',
  },
  detailedButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
  },
  detailedButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  thankYouText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    paddingVertical: 12,
  },
});