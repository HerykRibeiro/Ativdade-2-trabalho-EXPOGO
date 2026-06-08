import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

const AreaChart = ({ data, color, min, max, symbol }) => {
  if (!data || data.length === 0) return null;
  const height = 150;
  const range = max - min || 1;

  const firstVal = data[0];
  const lastVal = data[data.length - 1];
  
  const firstHeight = ((firstVal - min) / range) * (height - 30) + 15;
  const lastHeight = ((lastVal - min) / range) * (height - 30) + 15;

  const precision = symbol === 'JPY' ? 5 : 5;

  return (
    <View style={styles.chartWrapper}>
      <Text style={[styles.chartLimitText, { left: 8, top: 2 }]}>
        {max.toFixed(precision)}
      </Text>

      <View style={[styles.chartDot, { backgroundColor: '#3b82f6', left: 2, bottom: firstHeight - 4 }]} />

      <View style={styles.chartAreaWrapper}>
        {data.map((val, idx) => {
          const normalizedHeight = ((val - min) / range) * (height - 30) + 15;

          return (
            <View
              key={idx}
              style={[
                styles.chartBar,
                {
                  height: normalizedHeight,
                  backgroundColor: color + '15',
                  borderTopWidth: 2,
                  borderTopColor: color,
                },
              ]}
            />
          );
        })}
      </View>

      <View style={[styles.chartDot, { backgroundColor: color, right: 2, bottom: lastHeight - 4 }]} />

      <Text style={[styles.chartLimitText, { right: 8, bottom: 2 }]}>
        {min.toFixed(precision)}
      </Text>
    </View>
  );
};

export default function DetailScreen({ route, navigation }) {
  const { coinSymbol, coinName } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [apiData, setApiData] = useState(null);
  const [timeframe, setTimeframe] = useState('24h');
  const [showTimeframeMenu, setShowTimeframeMenu] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [chartPoints, setChartPoints] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://economia.awesomeapi.com.br/json/last/${coinSymbol}-BRL`
        );
        const json = await response.json();
        const key = `${coinSymbol}BRL`;

        if (json && json[key]) {
          setApiData(json[key]);
        } else {
          generateFallback();
        }
      } catch (err) {
        console.log(err);
        generateFallback();
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [coinSymbol]);

  useEffect(() => {
    if (apiData) {
      const tData = getTimeframeData();
      setCurrentData(tData);
      setChartPoints(generateChartData(tData.low, tData.high, tData.bid, tData.pct));
    }
  }, [timeframe, apiData]);

  const getTimeframeData = () => {
    if (!apiData) return null;
    const baseBid = parseFloat(apiData.bid);
    const baseHigh = parseFloat(apiData.high);
    const baseLow = parseFloat(apiData.low);
    const basePct = parseFloat(apiData.pctChange);

    let high = baseHigh;
    let low = baseLow;
    let pct = basePct;

    if (timeframe === '1h') {
      high = baseBid * 1.0008;
      low = baseBid * 0.9992;
      pct = basePct * 0.05;
    } else if (timeframe === '4h') {
      high = baseBid * 1.003;
      low = baseBid * 0.997;
      pct = basePct * 0.2;
    }

    const varBid = baseBid * (pct / 100);

    return {
      high,
      low,
      pct,
      varBid,
      bid: baseBid,
      ask: parseFloat(apiData.ask),
      timestamp: apiData.timestamp,
      create_date: apiData.create_date,
    };
  };

  const generateChartData = (low, high, current, change) => {
    const points = [];
    for (let i = 0; i < 35; i++) {
      const progress = i / 34;
      let val = low + (high - low) * (0.5 + 0.3 * Math.sin(progress * Math.PI * 2) + 0.1 * Math.sin(progress * Math.PI * 4));
      val += (Math.random() - 0.5) * (high - low) * 0.08;
      
      if (val < low) val = low;
      if (val > high) val = high;
      points.push(val);
    }
    points[points.length - 1] = current;
    points[12] = high;
    points[22] = low;
    
    return points;
  };

  const generateFallback = () => {
    const currentPrice = coinSymbol === 'BTC' ? 377739 : coinSymbol === 'ETH' ? 10274 : 5.0;
    const changePct = -1.28;
    
    const variationVal = currentPrice * (changePct / 100);
    const highVal = currentPrice * 1.01;
    const lowVal = currentPrice * 0.99;
    const bidVal = currentPrice;
    const askVal = currentPrice * 1.0002;
    
    const now = new Date();
    const formattedDate = now.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const fallbackData = {
      high: highVal.toString(),
      low: lowVal.toString(),
      varBid: variationVal.toString(),
      pctChange: changePct.toString(),
      bid: bidVal.toString(),
      ask: askVal.toString(),
      timestamp: Math.floor(Date.now() / 1000).toString(),
      create_date: formattedDate.replace(',', ''),
    };

    setApiData(fallbackData);
  };

  const formatValue = (val, isCurrencySymbol = true) => {
    if (val === undefined || val === null) return '-';
    
    const isNeg = val < 0;
    const absVal = Math.abs(val);
    
    let formatted = '';
    if (coinSymbol === 'JPY') {
      formatted = absVal.toLocaleString('en-US', {
        minimumFractionDigits: 5,
        maximumFractionDigits: 5,
      });
    } else {
      formatted = absVal.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    
    const dotted = formatted.replace(/,/g, '.');
    
    if (!isCurrencySymbol) {
      return isNeg ? `-${dotted}` : dotted;
    }
    
    return isNeg ? `-R$${dotted}` : `R$ ${dotted}`;
  };

  const formatTickerPrice = (val) => {
    if (val === undefined || val === null) return '-';
    let formatted = '';
    if (coinSymbol === 'JPY') {
      formatted = val.toLocaleString('en-US', {
        minimumFractionDigits: 5,
        maximumFractionDigits: 5,
      });
    } else {
      const decimals = val > 1000 ? 0 : 2;
      formatted = val.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    }
    const dotted = formatted.replace(/,/g, '.');
    return `R$${dotted}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.trim().split(' ');
      if (parts.length === 2) {
        const dateParts = parts[0].split('-');
        if (dateParts.length === 3) {
          return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}, ${parts[1]}`;
        }
      }
    } catch (e) {}
    return dateStr;
  };

  if (isLoading || !currentData) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Carregando dados da cotação...</Text>
      </SafeAreaView>
    );
  }

  const isNegative = currentData.pct < 0;
  const mainColor = isNegative ? '#ff4a4a' : '#10b981';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="chevron-left" size={32} color="#3b82f6" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{coinSymbol}/BRL</Text>
          <Text style={styles.subtitleText}>({coinName}/Real Brasileiro)</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.tickerPrice}>
          {coinSymbol}1={formatTickerPrice(currentData.bid)}
        </Text>

        <View style={styles.timeframeContainer}>
          <TouchableOpacity 
            style={styles.timeframeBadge}
            onPress={() => setShowTimeframeMenu(!showTimeframeMenu)}
          >
            <Text style={styles.timeframeText}>{timeframe}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={16} color="#ffffff" />
          </TouchableOpacity>

          {showTimeframeMenu && (
            <View style={styles.dropdownMenu}>
              {['1h', '4h', '24h'].map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.dropdownItem, timeframe === t && styles.dropdownItemActive]}
                  onPress={() => {
                    setTimeframe(t);
                    setShowTimeframeMenu(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.chartContainer}>
          <AreaChart
            data={chartPoints}
            color={mainColor}
            min={currentData.low}
            max={currentData.high}
            symbol={coinSymbol}
          />
        </View>

        <View style={[styles.variationCard, { backgroundColor: isNegative ? '#2a1415' : '#102a1d' }]}>
          <Text style={styles.variationCardLabel}>Variação</Text>
          <Text style={[styles.variationCardValue, { color: mainColor }]}>
            {isNegative ? '' : '+'}{currentData.pct.toFixed(2)}%  {formatValue(currentData.varBid)}
          </Text>
        </View>

        <View style={styles.parametersTable}>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Alta (high):</Text>
            <Text style={styles.tableValue}>{formatValue(currentData.high)}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Baixa (low):</Text>
            <Text style={styles.tableValue}>{formatValue(currentData.low)}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Variacao (varBid):</Text>
            <Text style={[styles.tableValue, { color: mainColor }]}>
              {formatValue(currentData.varBid)}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Variacao % (pctChange):</Text>
            <Text style={[styles.tableValue, { color: mainColor }]}>
              {isNegative ? '' : '+'}{currentData.pct.toFixed(2)}%
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Compra (bid):</Text>
            <Text style={styles.tableValue}>{formatValue(currentData.bid)}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Venda (ask):</Text>
            <Text style={styles.tableValue}>{formatValue(currentData.ask)}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Ultima Atualizacao:</Text>
            <Text style={styles.tableValue}>{formatDate(currentData.create_date)}</Text>
          </View>
          <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.tableLabel}>Timestamp:</Text>
            <Text style={styles.tableValue}>{currentData.timestamp}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#010f1a',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#010f1a',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  loadingText: {
    color: '#697d95',
    fontSize: 15,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 60,
    marginTop: Platform.OS === 'android' ? 30 : 5,
    borderBottomWidth: 1,
    borderBottomColor: '#101e2e',
  },
  backBtn: {
    padding: 6,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitleText: {
    fontSize: 12,
    color: '#697d95',
    marginTop: 2,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  tickerPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 10,
  },
  timeframeContainer: {
    zIndex: 30,
    alignSelf: 'center',
    marginVertical: 15,
    position: 'relative',
    width: 100,
  },
  timeframeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#101e2e',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  timeframeText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 38,
    left: 0,
    right: 0,
    backgroundColor: '#101e2e',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1a2d42',
    elevation: 5,
    zIndex: 40,
  },
  dropdownItem: {
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#1a2d42',
  },
  dropdownItemText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  chartContainer: {
    backgroundColor: '#071320',
    borderRadius: 16,
    padding: 10,
    height: 180,
    justifyContent: 'center',
    marginBottom: 20,
    zIndex: 10,
  },
  chartWrapper: {
    position: 'relative',
    height: 150,
    width: '100%',
  },
  chartAreaWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 150,
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  chartBar: {
    flex: 1,
    marginHorizontal: 0.3,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
  },
  chartDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    zIndex: 10,
  },
  chartLimitText: {
    position: 'absolute',
    color: '#697d95',
    fontSize: 11,
    fontWeight: '500',
    zIndex: 10,
  },
  variationCard: {
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    height: 52,
    marginBottom: 25,
  },
  variationCardLabel: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  variationCardValue: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  parametersTable: {
    backgroundColor: '#101e2e',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1a2d42',
  },
  tableLabel: {
    color: '#697d95',
    fontSize: 15,
    fontWeight: '500',
  },
  tableValue: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
