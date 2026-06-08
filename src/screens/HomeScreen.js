import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Platform,
} from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { fetchMarketData } from '../services/api';
import Sparkline from '../components/Sparkline';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');

  const [cryptoData, setCryptoData] = useState([
    { id: 'btc', symbol: 'BTC', name: 'Bitcoin', price: 377739.00, change: -1.28, icon: 'bitcoin', iconColor: '#ffffff', iconBgColor: '#f7931a' },
    { id: 'eth', symbol: 'ETH', name: 'Ethereum', price: 10274.00, change: -1.82, icon: 'diamond', iconColor: '#ffffff', iconBgColor: '#627eea' },
    { id: 'sol', symbol: 'SOL', name: 'Solana', price: 418.50, change: -1.02, icon: 'bolt', iconColor: '#ffffff', iconBgColor: '#14f195' },
    { id: 'xrp', symbol: 'XRP', name: 'XRP', price: 6.63, change: -1.16, icon: 'close', iconColor: '#ffffff', iconBgColor: '#23292f' },
    { id: 'bnb', symbol: 'BNB', name: 'Binance Coin', price: 3285.00, change: -0.91, icon: 'cubes', iconColor: '#ffffff', iconBgColor: '#f3ba2f' },
    { id: 'ltc', symbol: 'LTC', name: 'Litecoin', price: 263.00, change: -0.08, icon: 'circle-o', iconColor: '#ffffff', iconBgColor: '#5a626a' },
  ]);

  const [fiatData, setFiatData] = useState([
    { id: 'usd', symbol: 'USD', name: 'Dólar Americano', price: 5.07, change: 0.56, icon: '🇺🇸' },
    { id: 'eur', symbol: 'EUR', name: 'Euro', price: 5.89, change: 0.35, icon: '🇪🇺' },
    { id: 'gbp', symbol: 'GBP', name: 'Libra Esterlina', price: 6.80, change: 0.15, icon: '🇬🇧' },
    { id: 'jpy', symbol: 'JPY', name: 'Iene Japonês', price: 0.03180, change: 0.38, icon: '🇯🇵' },
    { id: 'cad', symbol: 'CAD', name: 'Dólar Canadense', price: 3.66, change: 0.20, icon: '🇨🇦' },
    { id: 'aud', symbol: 'AUD', name: 'Dólar Australiano', price: 3.61, change: -0.08, icon: '🇦🇺' },
  ]);

  const loadRates = async () => {
    try {
      const data = await fetchMarketData();
      
      setCryptoData((prev) =>
        prev.map((coin) => {
          const key = `${coin.symbol}BRL`;
          if (data[key]) {
            return {
              ...coin,
              price: parseFloat(data[key].bid),
              change: parseFloat(data[key].pctChange),
            };
          }
          return coin;
        })
      );

      setFiatData((prev) =>
        prev.map((coin) => {
          const key = `${coin.symbol}BRL`;
          if (data[key]) {
            return {
              ...coin,
              price: parseFloat(data[key].bid),
              change: parseFloat(data[key].pctChange),
            };
          }
          return coin;
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadRates();
    const interval = setInterval(loadRates, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (value, symbol) => {
    let formatted = '';
    if (symbol === 'JPY') {
      formatted = value.toLocaleString('en-US', {
        minimumFractionDigits: 5,
        maximumFractionDigits: 5,
      });
    } else {
      const decimals = value > 1000 ? 0 : 2;
      formatted = value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    }
    const dotted = formatted.replace(/,/g, '.');
    return `R$ ${dotted}`;
  };

  const filteredCrypto = cryptoData.filter(
    (coin) =>
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFiat = fiatData.filter(
    (coin) =>
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasAnyResults = filteredCrypto.length > 0 || filteredFiat.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.appName}>
            My<Text style={styles.appNameHighlight}>Currency</Text>
          </Text>
          <TouchableOpacity
            style={styles.bellBtn}
            onPress={() => alert('Sem notificações no momento.')}
          >
            <MaterialIcons name="notifications-none" size={26} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={22} color="#697d95" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar Moeda (ex: EURBRL)"
            placeholderTextColor="#697d95"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialIcons name="close" size={20} color="#697d95" />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.sectionTitle}>Principais Cotacoes</Text>
        
        {filteredCrypto.length > 0 && (
          <>
            <View style={styles.sectionSubtitleRow}>
              <Text style={styles.sectionSubtitle}>Crypto</Text>
              <Text style={[styles.sectionSubtitle, { color: '#3b82f6' }]}>24h</Text>
            </View>

            <View style={styles.gridContainer}>
              {filteredCrypto.map((coin) => {
                const isNegative = coin.change < 0;
                const color = isNegative ? '#ff4a4a' : '#10b981';
                return (
                  <TouchableOpacity
                    key={coin.id}
                    style={styles.card}
                    onPress={() => navigation.navigate('Details', { coinSymbol: coin.symbol, coinName: coin.name })}
                  >
                    <View style={styles.cardHeader}>
                      <View style={[styles.iconBadge, { backgroundColor: coin.iconBgColor || (coin.iconColor + '20') }]}>
                        <FontAwesome name={coin.icon} size={16} color={coin.iconColor} />
                      </View>
                      <View style={styles.symbolsContainer}>
                        <Text style={styles.coinSymbol}>{coin.symbol}</Text>
                        <Text style={styles.coinName} numberOfLines={1}>{coin.name}</Text>
                      </View>
                    </View>

                    <Text style={styles.coinPrice}>{formatPrice(coin.price, coin.symbol)}</Text>

                    <View style={styles.cardFooter}>
                      <Text style={[styles.coinChange, { color }]}>
                        {isNegative ? '' : '+'}{coin.change.toFixed(2)}%
                      </Text>
                      <Sparkline color={color} />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        {filteredFiat.length > 0 && (
          <>
            <View style={[styles.sectionSubtitleRow, { marginTop: 25 }]}>
              <Text style={styles.sectionSubtitle}>Fiat</Text>
              <Text style={[styles.sectionSubtitle, { color: '#3b82f6' }]}>24h</Text>
            </View>

            <View style={styles.gridContainer}>
              {filteredFiat.map((coin) => {
                const isNegative = coin.change < 0;
                const color = isNegative ? '#ff4a4a' : '#10b981';
                return (
                  <TouchableOpacity
                    key={coin.id}
                    style={styles.card}
                    onPress={() => navigation.navigate('Details', { coinSymbol: coin.symbol, coinName: coin.name })}
                  >
                    <View style={styles.cardHeader}>
                      <View style={[styles.iconBadge, { backgroundColor: '#1e293b' }]}>
                        <Text style={{ fontSize: 16 }}>{coin.icon}</Text>
                      </View>
                      <View style={styles.symbolsContainer}>
                        <Text style={styles.coinSymbol}>{coin.symbol}</Text>
                        <Text style={styles.coinName} numberOfLines={1}>{coin.name}</Text>
                      </View>
                    </View>

                    <Text style={styles.coinPrice}>{formatPrice(coin.price, coin.symbol)}</Text>

                    <View style={styles.cardFooter}>
                      <Text style={[styles.coinChange, { color }]}>
                        {isNegative ? '' : '+'}{coin.change.toFixed(2)}%
                      </Text>
                      <Sparkline color={color} />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}
        
        {!hasAnyResults && (
          <View style={styles.noResults}>
            <MaterialIcons name="search-off" size={48} color="#697d95" />
            <Text style={styles.noResultsText}>Nenhuma moeda encontrada</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#010f1a',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 35 : 10,
    paddingBottom: 25,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  appNameHighlight: {
    color: '#3b82f6',
  },
  bellBtn: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#101e2e',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 25,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 15,
    height: '100%',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  sectionSubtitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#a2b0c2',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    backgroundColor: '#101e2e',
    width: (width - 52) / 2,
    borderRadius: 16,
    padding: 15,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  symbolsContainer: {
    flex: 1,
  },
  coinSymbol: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  coinName: {
    fontSize: 11,
    color: '#697d95',
    marginTop: 1,
  },
  coinPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coinChange: {
    fontSize: 13,
    fontWeight: '600',
  },
  noResults: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 10,
  },
  noResultsText: {
    color: '#697d95',
    fontSize: 16,
    fontWeight: '500',
  },
});
