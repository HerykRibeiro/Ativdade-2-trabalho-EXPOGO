import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function Sparkline({ color }) {
  return (
    <View style={styles.sparklineContainer}>
      <View style={[styles.sparkSegment, { backgroundColor: color, top: 12, transform: [{ rotate: '15deg' }] }]} />
      <View style={[styles.sparkSegment, { backgroundColor: color, left: 9, top: 14, transform: [{ rotate: '-25deg' }] }]} />
      <View style={[styles.sparkSegment, { backgroundColor: color, left: 18, top: 10, transform: [{ rotate: '35deg' }] }]} />
      <View style={[styles.sparkSegment, { backgroundColor: color, left: 27, top: 15, transform: [{ rotate: '-15deg' }] }]} />
      <View style={[styles.sparkSegment, { backgroundColor: color, left: 36, top: 12, transform: [{ rotate: '10deg' }] }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  sparklineContainer: {
    width: 45,
    height: 20,
    position: 'relative',
  },
  sparkSegment: {
    position: 'absolute',
    width: 10,
    height: 2,
    borderRadius: 1,
  },
});
