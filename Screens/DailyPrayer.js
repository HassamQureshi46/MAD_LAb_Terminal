import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Switch, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getPrayerData, setPrayerData } from '../utils/Storage';

const DailyPrayers = ({ route }) => {
    const selectedDate = route.params.selectedDate;
    const [prayerData, setPrayerDataState] = useState({});
    const [animatedValue] = useState(new Animated.Value(0));

    useEffect(() => {
        const fetchPrayerData = async () => {
            const data = await getPrayerData(selectedDate);
            setPrayerDataState(data);
        };
        fetchPrayerData();

        Animated.timing(animatedValue, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();
    }, [selectedDate]);

    const updatePrayerStatus = async (prayerName, performed, withJamat) => {
        await setPrayerData(selectedDate, prayerName, performed, withJamat);
        const updatedData = await getPrayerData(selectedDate);
        setPrayerDataState(updatedData);
    };

    const getPrayerEmoji = (name) => {
        const emojis = {
            Fajr: '🌅',
            Dhuhr: '☀️',
            Asr: '🌤️',
            Maghrib: '🌆',
            Isha: '🌙',
        };
        return emojis[name] || '🕌';
    };

    const calculateProgress = () => {
        const prayers = Object.values(prayerData);
        if (prayers.length === 0) return 0;
        const performed = prayers.filter(p => p.performed).length;
        return (performed / prayers.length) * 100;
    };

    const renderPrayerItem = ({ item, index }) => {
        const { name, details } = item;
        const translateY = animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0],
        });

        return (
            <Animated.View
                style={[
                    styles.prayerItemWrapper,
                    { 
                        opacity: animatedValue,
                        transform: [{ translateY }],
                    },
                ]}
            >
                <LinearGradient
                    colors={
                        details.performed
                            ? ['rgba(34, 197, 94, 0.15)', 'rgba(22, 163, 74, 0.1)']
                            : ['rgba(56, 189, 248, 0.1)', 'rgba(99, 102, 241, 0.05)']
                    }
                    style={styles.prayerItem}
                >
                    <View style={styles.prayerHeader}>
                        <View style={styles.prayerTitleSection}>
                            <Text style={styles.prayerEmoji}>{getPrayerEmoji(name)}</Text>
                            <View>
                                <Text style={styles.prayerName}>{name}</Text>
                                {details.performed && (
                                    <View style={styles.statusBadge}>
                                        <Text style={styles.statusText}>
                                            {details.withJamat ? '✓ With Jamat' : '✓ Completed'}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>

                    <View style={styles.switchesContainer}>
                        <View style={styles.switchRow}>
                            <View style={styles.switchLabelContainer}>
                                <Text style={styles.switchLabel}>Performed</Text>
                                <Text style={styles.switchDescription}>
                                    {details.performed ? 'Alhamdulillah' : 'Not yet'}
                                </Text>
                            </View>
                            <Switch
                                trackColor={{ false: '#334155', true: '#22c55e' }}
                                thumbColor={details.performed ? '#f0fdf4' : '#e2e8f0'}
                                ios_backgroundColor="#334155"
                                value={details.performed}
                                onValueChange={() =>
                                    updatePrayerStatus(
                                        name,
                                        !details.performed,
                                        !details.performed && details.withJamat
                                    )
                                }
                            />
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.switchRow}>
                            <View style={styles.switchLabelContainer}>
                                <Text style={styles.switchLabel}>With Jamat</Text>
                                <Text style={styles.switchDescription}>
                                    {details.withJamat ? 'In congregation' : 'Individual'}
                                </Text>
                            </View>
                            <Switch
                                trackColor={{ false: '#334155', true: '#3b82f6' }}
                                thumbColor={details.withJamat ? '#dbeafe' : '#e2e8f0'}
                                ios_backgroundColor="#334155"
                                value={details.withJamat}
                                disabled={!details.performed}
                                onValueChange={(value) => {
                                    if (details.performed) {
                                        updatePrayerStatus(name, details.performed, value);
                                    }
                                }}
                            />
                        </View>
                    </View>
                </LinearGradient>
            </Animated.View>
        );
    };

    const getPrayerList = () => {
        return Object.keys(prayerData).map((key) => ({
            name: key,
            details: prayerData[key],
        }));
    };

    const progress = calculateProgress();

    return (
        <LinearGradient colors={['#0a0e27', '#1a1f3a', '#0a0e27']} style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Daily Prayers</Text>
                    <Text style={styles.dateText}>{selectedDate}</Text>
                </View>

                {Object.keys(prayerData).length > 0 && (
                    <View style={styles.progressCard}>
                        <View style={styles.progressInfo}>
                            <Text style={styles.progressLabel}>Today's Progress</Text>
                            <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
                        </View>
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBar, { width: `${progress}%` }]} />
                        </View>
                    </View>
                )}
            </View>

            {Object.keys(prayerData).length > 0 ? (
                <FlatList
                    data={getPrayerList()}
                    keyExtractor={(item) => item.name}
                    renderItem={renderPrayerItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyEmoji}>📿</Text>
                    <Text style={styles.emptyTitle}>No Prayer Data</Text>
                    <Text style={styles.emptyText}>
                        No prayer information available for this date yet.
                    </Text>
                </View>
            )}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    headerContent: {
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#f1f5f9',
        letterSpacing: 0.5,
    },
    dateText: {
        fontSize: 16,
        color: '#38bdf8',
        marginTop: 6,
        fontWeight: '600',
    },
    progressCard: {
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(56, 189, 248, 0.2)',
    },
    progressInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    progressLabel: {
        fontSize: 14,
        color: '#94a3b8',
        fontWeight: '600',
    },
    progressPercentage: {
        fontSize: 24,
        fontWeight: '700',
        color: '#38bdf8',
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: 'rgba(51, 65, 85, 0.5)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#38bdf8',
        borderRadius: 4,
    },
    listContent: {
        padding: 20,
        paddingTop: 0,
    },
    prayerItemWrapper: {
        marginBottom: 16,
    },
    prayerItem: {
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(56, 189, 248, 0.2)',
    },
    prayerHeader: {
        marginBottom: 16,
    },
    prayerTitleSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    prayerEmoji: {
        fontSize: 32,
    },
    prayerName: {
        fontSize: 22,
        fontWeight: '700',
        color: '#f1f5f9',
    },
    statusBadge: {
        marginTop: 4,
        paddingHorizontal: 8,
        paddingVertical: 2,
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    statusText: {
        fontSize: 11,
        color: '#86efac',
        fontWeight: '600',
    },
    switchesContainer: {
        gap: 0,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    switchLabelContainer: {
        flex: 1,
    },
    switchLabel: {
        fontSize: 16,
        color: '#e2e8f0',
        fontWeight: '600',
        marginBottom: 2,
    },
    switchDescription: {
        fontSize: 13,
        color: '#94a3b8',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(148, 163, 184, 0.1)',
        marginVertical: 4,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyEmoji: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#f1f5f9',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 15,
        color: '#94a3b8',
        textAlign: 'center',
        lineHeight: 22,
    },
});

export default DailyPrayers;
