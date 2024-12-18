// // import React, { useEffect, useState } from 'react';
// // import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
// // import { PieChart } from 'react-native-chart-kit';
// // import AsyncStorage from '@react-native-async-storage/async-storage';

// // const screenWidth = Dimensions.get('window').width;

// // const PieChartPage: React.FC = () => {
// //   const [petrolData, setPetrolData] = useState({ base: 0, taxes: 0 });
// //   const [dieselData, setDieselData] = useState({ base: 0, taxes: 0 });

// //   const fetchTotalsFromStorage = async () => {
// //     try {
// //       const petrolTotals = JSON.parse(await AsyncStorage.getItem('petrolTotals') || '{}');
// //       const dieselTotals = JSON.parse(await AsyncStorage.getItem('dieselTotals') || '{}');

// //       setPetrolData({
// //         base: petrolTotals?.totalBasePrice || 0,
// //         taxes: petrolTotals?.totalTaxesPaid || 0,
// //       });

// //       setDieselData({
// //         base: dieselTotals?.totalBasePrice || 0,
// //         taxes: dieselTotals?.totalTaxesPaid || 0,
// //       });
// //     } catch (error) {
// //       console.error('Error fetching data:', error);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchTotalsFromStorage();
// //   }, []);

// //   return (
// //     <ScrollView contentContainerStyle={styles.container}>
// //       <Text style={styles.title}>Fuel Price Breakdown</Text>

// //       <Text style={styles.chartTitle}>Petrol</Text>
// //       <PieChart
// //         data={[
// //           { name: 'Base Price', amount: petrolData.base, color: '#FF8A65', legendFontColor: '#333', legendFontSize: 14 },
// //           { name: 'Taxes', amount: petrolData.taxes, color: '#4CAF50', legendFontColor: '#333', legendFontSize: 14 },
// //         ]}
// //         width={screenWidth - 40}
// //         height={220}
// //         chartConfig={chartConfig}
// //         accessor="amount"
// //         backgroundColor="transparent"
// //         paddingLeft="15"
// //       />

// //       <Text style={styles.chartTitle}>Diesel</Text>
// //       <PieChart
// //         data={[
// //           { name: 'Base Price', amount: dieselData.base, color: '#FF8A65', legendFontColor: '#333', legendFontSize: 14 },
// //           { name: 'Taxes', amount: dieselData.taxes, color: '#4CAF50', legendFontColor: '#333', legendFontSize: 14 },
// //         ]}
// //         width={screenWidth - 40}
// //         height={220}
// //         chartConfig={chartConfig}
// //         accessor="amount"
// //         backgroundColor="transparent"
// //         paddingLeft="15"
// //       />
// //     </ScrollView>
// //   );
// // };

// // const chartConfig = {
// //   backgroundColor: '#ffffff',
// //   backgroundGradientFrom: '#ffffff',
// //   backgroundGradientTo: '#ffffff',
// //   color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
// //   labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
// //   strokeWidth: 2,
// //   useShadowColorFromDataset: false,
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flexGrow: 1,
// //     padding: 20,
// //     backgroundColor: '#f4f4f4',
// //   },
// //   title: {
// //     fontSize: 20,
// //     fontWeight: 'bold',
// //     marginBottom: 20,
// //     textAlign: 'center',
// //   },
// //   chartTitle: {
// //     fontSize: 18,
// //     fontWeight: '600',
// //     marginTop: 20,
// //     marginBottom: 10,
// //     textAlign: 'center',
// //   },
// // });

// // export default PieChartPage;


// import React from 'react';
// import { View, Dimensions } from 'react-native';
// import PieChart from 'react-native-chart-kit';

// const screenWidth = Dimensions.get('window').width;

// const TestChart = () => {
//   return (
//     <View>
//       <PieChart
//         data={[
//           { name: 'Base Price', amount: 50, color: '#FF8A65', legendFontColor: '#333', legendFontSize: 14 },
//           { name: 'Taxes', amount: 30, color: '#4CAF50', legendFontColor: '#333', legendFontSize: 14 },
//         ]}
//         width={screenWidth - 40}
//         height={220}
//         chartConfig={{
//           backgroundColor: '#ffffff',
//           backgroundGradientFrom: '#ffffff',
//           backgroundGradientTo: '#ffffff',
//           color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//         }}
//         accessor="amount"
//         backgroundColor="transparent"
//         paddingLeft="15"
//       />
//     </View>
//   );
// };

// export default TestChart;

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { PieChart } from 'react-native-chart-kit'; // Ensure this import works with the installed version
import AsyncStorage from '@react-native-async-storage/async-storage';
import { database } from './firebase'; // Import Firebase configuration
import { collection, addDoc } from 'firebase/firestore';


const screenWidth = Dimensions.get('window').width;

const ChartTab: React.FC = () => {
  const [petrolData, setPetrolData] = useState({ base: 0, taxes: 0 });
  const [dieselData, setDieselData] = useState({ base: 0, taxes: 0 });

  // Fetch totals from AsyncStorage
  const fetchTotalsFromStorage = async () => {
    try {
      const petrolTotals = JSON.parse(await AsyncStorage.getItem('petrolTotals') || '{}');
      const dieselTotals = JSON.parse(await AsyncStorage.getItem('dieselTotals') || '{}');

      setPetrolData({
        base: petrolTotals?.totalBasePrice || 0,
        taxes: petrolTotals?.totalTaxesPaid || 0,
      });

      setDieselData({
        base: dieselTotals?.totalBasePrice || 0,
        taxes: dieselTotals?.totalTaxesPaid || 0,
      });
    } catch (error) {
      console.error('Error fetching data from AsyncStorage:', error);
    }
  };

  useEffect(() => {
    fetchTotalsFromStorage();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Fuel Price Breakdown</Text>

      {/* Petrol Chart */}
      <Text style={styles.chartTitle}>Petrol</Text>
      {PieChart ? (
        <PieChart
          data={[
            { name: 'Base Price', amount: petrolData.base, color: '#FF8A65', legendFontColor: '#333', legendFontSize: 14 },
            { name: 'Taxes', amount: petrolData.taxes, color: '#4CAF50', legendFontColor: '#333', legendFontSize: 14 },
          ]}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
        />
      ) : (
        <Text>PieChart component not found</Text>
      )}

      {/* Diesel Chart */}
      <Text style={styles.chartTitle}>Diesel</Text>
      {PieChart ? (
        <PieChart
          data={[
            { name: 'Base Price', amount: dieselData.base, color: '#FF8A65', legendFontColor: '#333', legendFontSize: 14 },
            { name: 'Taxes', amount: dieselData.taxes, color: '#4CAF50', legendFontColor: '#333', legendFontSize: 14 },
          ]}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
        />
      ) : (
        <Text>PieChart component not found</Text>
      )}
    </ScrollView>
  );
};

// Chart Configuration
const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  useShadowColorFromDataset: false,
};

// Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default ChartTab;
