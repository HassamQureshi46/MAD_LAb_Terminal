import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getAllPrayerData } from '../utils/Storage';
import CustomButton from '../components/CustomButton';

const Reports = () => {
    const [prayerData, setPrayerData] = useState({});
    const [filteredData, setFilteredData] = useState({});
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [selectedRange, setSelectedRange] = useState('week');
    const [scaleAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllPrayerData();
            setPrayerData(data);
            applyRangeFilter('week', data);
        };
        fetchData();

        Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
        }).start();
    }, []);

    const applyRangeFilter = (range, data = prayerData) => {
        setSelectedRange(range);
        if (range === 'week') filterDataForCurrentWeek(data);
        else if (range === 'month') filterDataForCurrentMonth(data);
    };

    const filterDataForCurrentWeek = (data) => {
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const endOfWeek = new Date(now.setDate(startOfWeek.getDate() + 6));
        const filtered = filterDataByDateRange(data, startOfWeek, endOfWeek);
        setFilteredData(filtered);
    };

    const filterDataForCurrentMonth = (data) => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const filtered = filterDataByDateRange(data, startOfMonth, endOfMonth);
        setFilteredData(filtered);
    };

    const filterDataByDateRange = (data, start, end) => {
        setStartDate(start);
        setEndDate(end);
        const filtered = {};
        Object.keys(data).forEach((date) => {
            const prayerDate = new Date(date);
            if (prayerDate >= start && prayerDate <= end) filtered[date] = data[date];
        });
        return filtered;
    };

    const calculateStatistics = (data) => {
        let performed = 0;
        let missed = 0;
        let withJamat = 0;

        Object.values(data).forEach((day) => {
            Object.values(day).forEach((prayer) => {
                if (prayer.performed) {
                    performed++;
                    if (prayer.withJamat) withJamat++;
                } else missed++;
            });
        });

        const total = performed + missed;
        const performedPercentage = total > 0 ? (performed / total) * 100 : 0;
        const jamatPercentage = performed > 0 ? (withJamat / performed) * 100 : 0;

        return { performed, missed, withJamat, total, performedPercentage, jamatPercentage };
    };

    const applyCustomFilter = () => {
        setSelectedRange('custom');
        const filtered = filterDataByDateRange(prayerData, startDate, endDate);
        setFilteredData(filtered);
    };

    const stats = calculateStatistics(filteredData);

    return (
        <LinearGradient colors={['#0a0e27', '#1a1f3a', '#0a0e27']} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.decorativeTop}>
                        <View style={styles.decorativeDot} />
                        <View style={styles.decorativeLine} />
                        <View style={styles.decorativeDot} />
                    </View>
                    <Text style={styles.title}>Prayer Reports</Text>
                    <Text style={styles.subtitle}>Track Your Spiritual Growth</Text>
                </View>

                {/* Date Range Display */}
                <View style={styles.dateRangeCard}>
                    <Text style={styles.dateRangeIcon}>📅</Text>
                    <View style={styles.dateRangeContent}>
                        <Text style={styles.dateRangeLabel}>Selected Period</Text>
                        <Text style={styles.dateRangeText}>
                            {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                        </Text>
                    </View>
                </View>

                {/* Filter Options */}
                <View style={styles.filterSection}>
                    <Text style={styles.sectionTitle}>Time Range</Text>
                    <View style={styles.filterButtons}>
                        <FilterButton
                            label="This Week"
                            icon="📆"
                            selected={selectedRange === 'week'}
                            onPress={() => applyRangeFilter('week')}
                        />
                        <FilterButton
                            label="This Month"
                            icon="🗓️"
                            selected={selectedRange === 'month'}
                            onPress={() => applyRangeFilter('month')}
                        />
                        <FilterButton
                            label="Custom"
                            icon="⚙️"
                            selected={selectedRange === 'custom'}
                            onPress={() => setSelectedRange('custom')}
                        />
                    </View>
                </View>

                {/* Custom Date Picker */}
                {selectedRange === 'custom' && (
                    <View style={styles.customDateSection}>
                        <LinearGradient
                            colors={['rgba(56, 189, 248, 0.1)', 'rgba(99, 102, 241, 0.05)']}
                            style={styles.datePickerCard}
                        >
                            <View style={styles.datePickerRow}>
                                <Text style={styles.datePickerLabel}>Start Date</Text>
                                <CustomButton
                                    title={startDate.toLocaleDateString()}
                                    onPress={() => setShowStartPicker(true)}
                                />
                            </View>
                            {showStartPicker && (
                                <DateTimePicker
                                    value={startDate}
                                    mode="date"
                                    display="default"
                                    themeVariant="dark"
                                    onChange={(event, selectedDate) => {
                                        setShowStartPicker(false);
                                        if (selectedDate) setStartDate(selectedDate);
                                    }}
                                />
                            )}

                            <View style={styles.datePickerRow}>
                                <Text style={styles.datePickerLabel}>End Date</Text>
                                <CustomButton
                                    title={endDate.toLocaleDateString()}
                                    onPress={() => setShowEndPicker(true)}
                                />
                            </View>
                            {showEndPicker && (
                                <DateTimePicker
                                    value={endDate}
                                    mode="date"
                                    display="default"
                                    themeVariant="dark"
                                    onChange={(event, selectedDate) => {
                                        setShowEndPicker(false);
                                        if (selectedDate) setEndDate(selectedDate);
                                    }}
                                />
                            )}

                            <CustomButton title="Apply Custom Filter" onPress={applyCustomFilter} />
                        </LinearGradient>
                    </View>
                )}

                {/* Statistics Cards */}
                <Animated.View style={[styles.statsContainer, { transform: [{ scale: scaleAnim }] }]}>
                    <Text style={styles.sectionTitle}>Overview</Text>
                    
                    {/* Main Stats Grid */}
                    <View style={styles.statsGrid}>
                        <StatCard
                            icon="✅"
                            value={stats.performed}
                            label="Performed"
                            percentage={stats.performedPercentage}
                            color="#22c55e"
                        />
                        <StatCard
                            icon="❌"
                            value={stats.missed}
                            label="Missed"
                            percentage={100 - stats.performedPercentage}
                            color="#ef4444"
                        />
                        <StatCard
                            icon="🕌"
                            value={stats.withJamat}
                            label="With Jamat"
                            percentage={stats.jamatPercentage}
                            color="#3b82f6"
                        />
                        <StatCard
                            icon="📊"
                            value={stats.total}
                            label="Total"
                            percentage={100}
                            color="#8b5cf6"
                        />
                    </View>

                    {/* Performance Indicator */}
                    <LinearGradient
                        colors={['rgba(56, 189, 248, 0.1)', 'rgba(99, 102, 241, 0.05)']}
                        style={styles.performanceCard}
                    >
                        <View style={styles.performanceHeader}>
                            <Text style={styles.performanceTitle}>Prayer Consistency</Text>
                            <Text style={styles.performancePercentage}>
                                {Math.round(stats.performedPercentage)}%
                            </Text>
                        </View>
                        <View style={styles.progressBarContainer}>
                            <LinearGradient
                                colors={['#22c55e', '#3b82f6']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={[
                                    styles.progressBar,
                                    { width: `${stats.performedPercentage}%` },
                                ]}
                            />
                        </View>
                        <Text style={styles.performanceSubtext}>
                            {stats.performedPercentage >= 80
                                ? 'Excellent! Keep up the great work! 🌟'
                                : stats.performedPercentage >= 60
                                ? 'Good progress! Stay consistent! 💪'
                                : 'Keep trying, every effort counts! 🤲'}
                        </Text>
                    </LinearGradient>
                </Animated.View>
            </ScrollView>
        </LinearGradient>
    );
};

const FilterButton = ({ label, icon, selected, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.filterButton}>
        <LinearGradient
            colors={
                selected
                    ? ['rgba(56, 189, 248, 0.3)', 'rgba(99, 102, 241, 0.2)']
                    : ['rgba(51, 65, 85, 0.3)', 'rgba(30, 41, 59, 0.2)']
            }
            style={[styles.filterButtonGradient, selected && styles.filterButtonSelected]}
        >
            <Text style={styles.filterButtonIcon}>{icon}</Text>
            <Text style={[styles.filterButtonText, selected && styles.filterButtonTextSelected]}>
                {label}
            </Text>
        </LinearGradient>
    </TouchableOpacity>
);

const StatCard = ({ icon, value, label, percentage, color }) => (
    <LinearGradient
        colors={['rgba(15, 23, 42, 0.6)', 'rgba(30, 41, 59, 0.4)']}
        style={styles.statCard}
    >
        <Text style={styles.statIcon}>{icon}</Text>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
        <View style={styles.miniProgressContainer}>
            <View style={[styles.miniProgress, { width: `${percentage}%`, backgroundColor: color }]} />
        </View>
    </LinearGradient>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingTop: 50,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    decorativeTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    decorativeLine: {
        width: 40,
        height: 2,
        backgroundColor: '#38bdf8',
        borderRadius: 1,
    },
    decorativeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#38bdf8',
    },
    title: {
        fontSize: 34,
        fontWeight: '800',
        color: '#f1f5f9',
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 15,
        color: '#94a3b8',
        marginTop: 4,
        fontStyle: 'italic',
    },
    dateRangeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(56, 189, 248, 0.2)',
        marginBottom: 24,
        gap: 12,
    },
    dateRangeIcon: {
        fontSize: 28,
    },
    dateRangeContent: {
        flex: 1,
    },
    dateRangeLabel: {
        fontSize: 13,
        color: '#94a3b8',
        marginBottom: 4,
    },
    dateRangeText: {
        fontSize: 15,
        color: '#e2e8f0',
        fontWeight: '600',
    },
    filterSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#f1f5f9',
        marginBottom: 12,
    },
    filterButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    filterButton: {
        flex: 1,
    },
    filterButtonGradient: {
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(56, 189, 248, 0.1)',
    },
    filterButtonSelected: {
        borderColor: 'rgba(56, 189, 248, 0.4)',
    },
    filterButtonIcon: {
        fontSize: 20,
        marginBottom: 4,
    },
    filterButtonText: {
        fontSize: 13,
        color: '#94a3b8',
        fontWeight: '600',
    },
    filterButtonTextSelected: {
        color: '#38bdf8',
    },
    customDateSection: {
        marginBottom: 24,
    },
    datePickerCard: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(56, 189, 248, 0.2)',
        gap: 12,
    },
    datePickerRow: {
        gap: 8,
    },
    datePickerLabel: {
        fontSize: 14,
        color: '#e2e8f0',
        fontWeight: '600',
        marginBottom: 4,
    },
    statsContainer: {
        gap: 20,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    statCard: {
        width: '48%',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(56, 189, 248, 0.15)',
    },
    statIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    statValue: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 13,
        color: '#94a3b8',
        fontWeight: '600',
        marginBottom: 8,
    },
    miniProgressContainer: {
        width: '100%',
        height: 4,
        backgroundColor: 'rgba(51, 65, 85, 0.5)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    miniProgress: {
        height: '100%',
        borderRadius: 2,
    },
    performanceCard: {
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(56, 189, 248, 0.2)',
    },
    performanceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    performanceTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#e2e8f0',
    },
    performancePercentage: {
        fontSize: 28,
        fontWeight: '800',
        color: '#38bdf8',
    },
    progressBarContainer: {
        height: 10,
        backgroundColor: 'rgba(51, 65, 85, 0.5)',
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 12,
    },
    progressBar: {
        height: '100%',
        borderRadius: 5,
    },
    performanceSubtext: {
        fontSize: 13,
        color: '#94a3b8',
        textAlign: 'center',
        fontStyle: 'italic',
    },
});

export default Reports;
