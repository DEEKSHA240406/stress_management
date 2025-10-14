import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../theme/colors';

export default function ExportReportScreen({ navigation }) {
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedSections, setSelectedSections] = useState({
    overview: true,
    analytics: true,
    students: true,
    trends: true,
  });

  const handleExport = () => {
    Alert.alert(
      'Export Report',
      `Report will be exported as ${selectedFormat.toUpperCase()} for the last ${selectedPeriod}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Export',
          onPress: () => {
            // Handle export logic here
            Alert.alert('Success', 'Report exported successfully!');
          },
        },
      ]
    );
  };

  const toggleSection = (section) => {
    setSelectedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const FormatButton = ({ format, icon, label }) => (
    <TouchableOpacity
      style={[styles.formatBtn, selectedFormat === format && styles.formatBtnActive]}
      onPress={() => setSelectedFormat(format)}
    >
      <Ionicons
        name={icon}
        size={32}
        color={selectedFormat === format ? colors.white : colors.primary}
      />
      <Text
        style={[
          styles.formatText,
          selectedFormat === format && styles.formatTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const PeriodButton = ({ period, label }) => (
    <TouchableOpacity
      style={[styles.periodBtn, selectedPeriod === period && styles.periodBtnActive]}
      onPress={() => setSelectedPeriod(period)}
    >
      <Text
        style={[
          styles.periodText,
          selectedPeriod === period && styles.periodTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const SectionCheckbox = ({ section, label, description }) => (
    <TouchableOpacity
      style={styles.checkboxItem}
      onPress={() => toggleSection(section)}
    >
      <View style={styles.checkboxLeft}>
        <View
          style={[
            styles.checkbox,
            selectedSections[section] && styles.checkboxActive,
          ]}
        >
          {selectedSections[section] && (
            <Ionicons name="checkmark" size={16} color={colors.white} />
          )}
        </View>
        <View style={styles.checkboxContent}>
          <Text style={styles.checkboxLabel}>{label}</Text>
          <Text style={styles.checkboxDescription}>{description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Export Report</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Format Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Format</Text>
          <View style={styles.formatContainer}>
            <FormatButton format="pdf" icon="document-text" label="PDF" />
            <FormatButton format="excel" icon="grid" label="Excel" />
            <FormatButton format="csv" icon="list" label="CSV" />
          </View>
        </View>

        {/* Period Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Time Period</Text>
          <View style={styles.periodContainer}>
            <PeriodButton period="week" label="Last Week" />
            <PeriodButton period="month" label="Last Month" />
            <PeriodButton period="quarter" label="Last Quarter" />
            <PeriodButton period="year" label="Last Year" />
          </View>
        </View>

        {/* Sections to Include */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Include Sections</Text>
          <View style={styles.checkboxContainer}>
            <SectionCheckbox
              section="overview"
              label="Overview"
              description="Summary statistics and key metrics"
            />
            <SectionCheckbox
              section="analytics"
              label="Analytics"
              description="Charts and detailed analysis"
            />
            <SectionCheckbox
              section="students"
              label="Student List"
              description="Individual student reports"
            />
            <SectionCheckbox
              section="trends"
              label="Trends"
              description="Historical data and patterns"
            />
          </View>
        </View>

        {/* Preview Info */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color={colors.info} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Report Preview</Text>
            <Text style={styles.infoText}>
              This report will include data from the last {selectedPeriod} with{' '}
              {Object.values(selectedSections).filter(Boolean).length} sections.
            </Text>
          </View>
        </View>

        {/* Export Button */}
        <TouchableOpacity style={styles.exportBtn} onPress={handleExport}>
          <Ionicons name="download-outline" size={24} color={colors.white} />
          <Text style={styles.exportText}>Export Report</Text>
        </TouchableOpacity>

        {/* Recent Exports */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Exports</Text>
          <RecentExportItem
            format="PDF"
            date="2 days ago"
            size="2.4 MB"
            icon="document-text"
          />
          <RecentExportItem
            format="Excel"
            date="1 week ago"
            size="1.8 MB"
            icon="grid"
          />
          <RecentExportItem
            format="CSV"
            date="2 weeks ago"
            size="856 KB"
            icon="list"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const RecentExportItem = ({ format, date, size, icon }) => (
  <View style={styles.exportItem}>
    <View style={styles.exportIcon}>
      <Ionicons name={icon} size={24} color={colors.primary} />
    </View>
    <View style={styles.exportInfo}>
      <Text style={styles.exportFormat}>{format} Report</Text>
      <Text style={styles.exportDate}>{date} • {size}</Text>
    </View>
    <TouchableOpacity style={styles.downloadIcon}>
      <Ionicons name="cloud-download-outline" size={24} color={colors.textSecondary} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
    marginBottom: 16,
  },
  formatContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formatBtn: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  formatBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  formatText: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: colors.primary,
    marginTop: 8,
  },
  formatTextActive: {
    color: colors.white,
  },
  periodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  periodBtn: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    margin: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  periodBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  periodText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: colors.text,
  },
  periodTextActive: {
    color: colors.white,
    fontFamily: 'Roboto-Bold',
  },
  checkboxContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 8,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  checkboxLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxContent: {
    marginLeft: 12,
    flex: 1,
  },
  checkboxLabel: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: colors.text,
    marginBottom: 2,
  },
  checkboxDescription: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.info + '15',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: colors.text,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
    lineHeight: 18,
  },
  exportBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 18,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  exportText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 8,
  },
  exportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  exportIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exportInfo: {
    flex: 1,
    marginLeft: 16,
  },
  exportFormat: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: colors.text,
    marginBottom: 4,
  },
  exportDate: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: colors.textSecondary,
  },
  downloadIcon: {
    padding: 8,
  },
});