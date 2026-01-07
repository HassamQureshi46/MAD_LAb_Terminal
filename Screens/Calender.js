import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const CalendarViewScreen = () => {
  const navigation = useNavigation();

  const handleDateSelect = (day) => {
    navigation.navigate('DailyPrayers', {
      selectedDate: day.dateString,
    });
  };

  return (
    <LinearGradient
      colors={['#0a0e27', '#1a1f3a', '#0a0e27']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with Islamic pattern decoration */}
        <View style={styles.headerWrapper}>
          <View style={styles.decorativeLine} />
          <Text style={styles.headerTitle}>Prayer Calendar</Text>
          <Text style={styles.headerSubtitle}>Track Your Spiritual Journey</Text>
          <View style={styles.decorativeLine} />
        </View>

        {/* Calendar Card with Glass Effect */}
        <View style={styles.calendarCard}>
          <LinearGradient
            colors={['rgba(56, 189, 248, 0.1)', 'rgba(99, 102, 241, 0.05)']}
            style={styles.glassEffect}
          >
            <Calendar
              onDayPress={handleDateSelect}
              style={styles.calendar}
              theme={{
                backgroundColor: 'transparent',
                calendarBackground: 'transparent',
                
                textSectionTitleColor: '#38bdf8',
                textSectionTitleDisabledColor: '#475569',
                
                selectedDayBackgroundColor: '#38bdf8',
                selectedDayTextColor: '#0a0e27',
                
                todayTextColor: '#fbbf24',
                todayBackgroundColor: 'rgba(251, 191, 36, 0.2)',
                
                dayTextColor: '#e2e8f0',
                textDisabledColor: '#475569',
                
                arrowColor: '#38bdf8',
                monthTextColor: '#f1f5f9',
                
                textMonthFontSize: 24,
                textMonthFontWeight: '700',
                
                textDayFontSize: 16,
                textDayHeaderFontSize: 13,
                
                'stylesheet.calendar.header': {
                  week: {
                    marginTop: 12,
                    marginBottom: 8,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  },
                },
              }}
              markedDates={{
                [new Date().toISOString().split('T')[0]]: {
                  selected: false,
                  marked: true,
                  dotColor: '#fbbf24',
                },
              }}
            />
          </LinearGradient>
        </View>

        {/* Info Cards */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>📅</Text>
            </View>
            <Text style={styles.infoTitle}>Select a Date</Text>
            <Text style={styles.infoDescription}>
              Tap any date to view and manage your daily prayers
            </Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>🕌</Text>
            </View>
            <Text style={styles.infoTitle}>Track Progress</Text>
            <Text style={styles.infoDescription}>
              Monitor your prayer consistency and growth
            </Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default CalendarViewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 50,
  },
  headerWrapper: {
    alignItems: 'center',
    marginBottom: 30,
  },
  decorativeLine: {
    width: 60,
    height: 3,
    backgroundColor: '#38bdf8',
    borderRadius: 2,
    marginVertical: 8,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#f1f5f9',
    marginTop: 8,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#94a3b8',
    marginTop: 4,
    fontStyle: 'italic',
  },
  calendarCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    elevation: 8,
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  glassEffect: {
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
    borderRadius: 24,
  },
  calendar: {
    borderRadius: 20,
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  infoCard: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.1)',
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconText: {
    fontSize: 24,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#38bdf8',
    marginBottom: 6,
    textAlign: 'center',
  },
  infoDescription: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 16,
  },
});
