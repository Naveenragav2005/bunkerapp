import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';

type FuelHistory = {
  amountPaid: number;
  taxPaid: number;
  basePrice: number;
  fuelType: 'Petrol' | 'Diesel';
  litres: number;
};

const FuelTaxTab: React.FC = () => {
  const [fuelType, setFuelType] = useState<'Petrol' | 'Diesel'>('Petrol');
  const [fuelAmount, setFuelAmount] = useState<string>('');
  const [fuelLitres, setFuelLitres] = useState<string>('');
  const [history, setHistory] = useState<FuelHistory[]>([]);

  // Tax rates and fixed amounts
  const petrolVAT = 0.13; // 13% VAT
  const dieselVAT = 0.11; // 11% VAT
  const petrolFixedTax = 11.52; // ₹ per litre
  const dieselFixedTax = 9.62; // ₹ per litre
  const petrolPrice = 102.08; // Current price per litre (inclusive of taxes)
  const dieselPrice = 93.68; // Current price per litre (inclusive of taxes)

  const calculateTaxes = () => {
    const amount = parseFloat(fuelAmount);
    const litres = parseFloat(fuelLitres);

    if (isNaN(amount) || isNaN(litres) || litres === 0) {
      alert('Please enter valid numbers for amount and litres.');
      return;
    }

    const fixedTax = fuelType === 'Petrol' ? petrolFixedTax : dieselFixedTax;
    const VAT = fuelType === 'Petrol' ? petrolVAT : dieselVAT;
    const totalPerLitre = fuelType === 'Petrol' ? petrolPrice : dieselPrice;

    // Base price per litre
    const basePricePerLitre = (totalPerLitre - (totalPerLitre * VAT) - fixedTax) / (1 + VAT);
    const totalBasePrice = litres * basePricePerLitre;

    // Total taxes
    const totalTaxes = amount - totalBasePrice;

    if (totalTaxes < 0) {
      alert('Entered amount is less than the base price. Please check your input.');
      return;
    }

    // Add to history
    const newEntry: FuelHistory = {
      amountPaid: amount,
      taxPaid: totalTaxes,
      basePrice: totalBasePrice,
      fuelType,
      litres,
    };
    setHistory([...history, newEntry]);
    alert('Transaction added to history!');
  };

  const calculateCumulativeTotals = () => {
    return history.reduce(
      (totals, entry) => {
        if (entry.fuelType === 'Petrol') {
          totals.petrol.totalAmountPaid += entry.amountPaid;
          totals.petrol.totalTaxesPaid += entry.taxPaid;
          totals.petrol.totalBasePrice += entry.basePrice;
        } else if (entry.fuelType === 'Diesel') {
          totals.diesel.totalAmountPaid += entry.amountPaid;
          totals.diesel.totalTaxesPaid += entry.taxPaid;
          totals.diesel.totalBasePrice += entry.basePrice;
        }
        return totals;
      },
      {
        petrol: { totalAmountPaid: 0, totalTaxesPaid: 0, totalBasePrice: 0 },
        diesel: { totalAmountPaid: 0, totalTaxesPaid: 0, totalBasePrice: 0 },
      }
    );
  };

  const totals = calculateCumulativeTotals();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tamil Nadu Fuel Tax Calculator</Text>

      <Text style={styles.label}>Select Fuel Type:</Text>
      <Picker
        selectedValue={fuelType}
        onValueChange={(value: string) => setFuelType(value as 'Petrol' | 'Diesel')}
        style={styles.picker}
      >
        <Picker.Item label="Petrol" value="Petrol" />
        <Picker.Item label="Diesel" value="Diesel" />
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Enter Total Amount Paid (₹)"
        keyboardType="numeric"
        value={fuelAmount}
        onChangeText={setFuelAmount}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Fuel in Litres"
        keyboardType="numeric"
        value={fuelLitres}
        onChangeText={setFuelLitres}
      />

      <Button title="Add Transaction to History" onPress={calculateTaxes} />

      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Cumulative Totals (Petrol)</Text>
        <Text>Total Amount Paid: ₹{totals.petrol.totalAmountPaid.toFixed(2)}</Text>
        <Text>Total Taxes Paid: ₹{totals.petrol.totalTaxesPaid.toFixed(2)}</Text>
        <Text>Total Base Price: ₹{totals.petrol.totalBasePrice.toFixed(2)}</Text>

        <Text style={styles.historyTitle}>Cumulative Totals (Diesel)</Text>
        <Text>Total Amount Paid: ₹{totals.diesel.totalAmountPaid.toFixed(2)}</Text>
        <Text>Total Taxes Paid: ₹{totals.diesel.totalTaxesPaid.toFixed(2)}</Text>
        <Text>Total Base Price: ₹{totals.diesel.totalBasePrice.toFixed(2)}</Text>
      </View>

      <FlatList
        data={history}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <Text>Fuel Type: {item.fuelType}</Text>
            <Text>Litres: {item.litres}</Text>
            <Text>Amount Paid: ₹{item.amountPaid.toFixed(2)}</Text>
            <Text>Tax Paid: ₹{item.taxPaid.toFixed(2)}</Text>
            <Text>Base Price: ₹{item.basePrice.toFixed(2)}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: '600',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
    backgroundColor: 'white',
  },
  historyContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  historyItem: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default FuelTaxTab;
