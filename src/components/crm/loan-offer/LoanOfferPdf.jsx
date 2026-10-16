import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { paddingTop: 38, paddingHorizontal: 42, paddingBottom: 48, fontFamily: 'Helvetica', fontSize: 9, color: '#1f2937' },
  header: { borderBottomWidth: 2, borderBottomColor: '#a87920', paddingBottom: 11, marginBottom: 16 },
  brand: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#805b17', marginBottom: 4 },
  title: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: '#152238' },
  subtitle: { fontSize: 8, color: '#6b7280', marginTop: 4 },
  section: { marginBottom: 15 },
  sectionTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#805b17', marginBottom: 7, paddingBottom: 3, borderBottomWidth: 0.6, borderBottomColor: '#d4b06b' },
  twoColumns: { flexDirection: 'row', marginBottom: 6 },
  column: { width: '50%', paddingRight: 12 },
  label: { color: '#6b7280', marginBottom: 2 },
  value: { fontFamily: 'Helvetica-Bold' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, borderBottomWidth: 0.5, borderBottomColor: '#e5e7eb' },
  rowLabel: { maxWidth: '72%' },
  rowValue: { fontFamily: 'Helvetica-Bold', textAlign: 'right' },
  total: { backgroundColor: '#f8f1e3', paddingHorizontal: 9, paddingVertical: 8, marginTop: 5 },
  note: { lineHeight: 1.45, marginTop: 6 },
  small: { fontSize: 8, color: '#6b7280', lineHeight: 1.4 },
  signatureArea: { marginTop: 17, paddingTop: 12, borderTopWidth: 0.6, borderTopColor: '#d4b06b' },
  choice: { marginTop: 12, marginBottom: 22 },
  signatures: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 29 },
  signature: { width: '46%', borderTopWidth: 0.8, borderTopColor: '#374151', paddingTop: 5 },
  blank: { marginTop: 18 },
  footer: { position: 'absolute', bottom: 24, left: 42, right: 42, flexDirection: 'row', justifyContent: 'space-between', fontSize: 7, color: '#6b7280' },
});

const rupees = (amount) => `Rs. ${Number(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const dateTime = (value) => value ? new Date(value).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) : '-';
const titleCase = (value) => String(value || '').replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());

function Detail({ label, value }) {
  return <View style={styles.column}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{String(value ?? '-')}</Text></View>;
}

function AmountRow({ label, value, total = false }) {
  return <View style={total ? [styles.row, styles.total] : styles.row}><Text style={styles.rowLabel}>{label}</Text><Text style={styles.rowValue}>{rupees(value)}</Text></View>;
}

export default function LoanOfferPdf({ application, offer }) {
  const upfrontCharges = offer.charges.filter((charge) => charge.deductedUpfront);
  const laterCharges = offer.charges.filter((charge) => !charge.deductedUpfront);
  const deductions = Number(offer.offeredAmount) - Number(offer.netDisbursementAmount);

  return <Document title={`Gold Loan Offer ${application.applicationNo} Version ${offer.version}`} author="ATD Gold Loan" subject="Customer copy for review and signature">
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.brand}>ATD GOLD LOAN</Text>
        <Text style={styles.title}>Gold Loan Offer and Acknowledgment</Text>
        <Text style={styles.subtitle}>Application {application.applicationNo}  |  Offer version {offer.version}  |  Saved {dateTime(offer.createdAt)}</Text>
      </View>

      <View style={styles.section} wrap={false}>
        <Text style={styles.sectionTitle}>Customer and evaluation</Text>
        <View style={styles.twoColumns}><Detail label="Customer name" value={application.name} /><Detail label="Mobile" value={application.mobile} /></View>
        <View style={styles.twoColumns}><Detail label="Branch" value={application.branchName || 'Unassigned'} /><Detail label="Gold evaluation reference" value={offer.goldEvaluationId} /></View>
        <AmountRow label="Eligible loan amount from finalised evaluation" value={offer.eligibleAmount} />
      </View>

      <View style={styles.section} wrap={false}>
        <Text style={styles.sectionTitle}>Proposed loan terms</Text>
        <AmountRow label="Offered loan principal" value={offer.offeredAmount} />
        <View style={styles.twoColumns}><Detail label="Interest rate" value={`${offer.interestRate}% per ${offer.interestRatePeriod === 'MONTHLY' ? 'month' : 'year'}`} /><Detail label="Tenure" value={`${offer.tenureValue} ${titleCase(offer.tenureUnit)}`} /></View>
        <View style={styles.twoColumns}><Detail label="Repayment mode" value={titleCase(offer.repaymentMode)} /><Detail label="Offer decision at printing" value={titleCase(offer.decision)} /></View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Charges and payout</Text>
        <AmountRow label={`Processing fee deducted upfront (${offer.processingFeeType === 'PERCENT' ? `${offer.processingFeeValue}% of principal` : 'fixed amount'})`} value={offer.processingFeeAmount} />
        {upfrontCharges.map((charge, index) => <AmountRow key={`${index}-${charge.name}`} label={`${charge.name} (deducted upfront)`} value={charge.amount} />)}
        {laterCharges.map((charge, index) => <AmountRow key={`${index}-${charge.name}`} label={`${charge.name} (not deducted upfront)`} value={charge.amount} />)}
        <AmountRow label="Total upfront deductions" value={deductions} />
        <AmountRow label="Net amount payable to customer" value={offer.netDisbursementAmount} total />
        {laterCharges.length > 0 && <Text style={[styles.small, styles.note]}>Charges marked “not deducted upfront” are shown for disclosure and are not subtracted from the net payout above.</Text>}
      </View>

      {offer.remark && <View style={styles.section}><Text style={styles.sectionTitle}>Staff remark</Text><Text style={styles.note}>{offer.remark}</Text></View>}

      <View style={styles.signatureArea} wrap={false}>
        <Text style={styles.sectionTitle}>Customer acknowledgment</Text>
        <Text style={styles.note}>I have reviewed this offer version, including the loan principal, interest basis, charges, and net payout stated above.</Text>
        <Text style={styles.choice}>(  ) I accept this offer      (  ) I decline this offer</Text>
        <View style={styles.signatures}>
          <View style={styles.signature}><Text>Customer signature / thumb impression</Text><Text style={styles.small}>Name: {application.name}</Text></View>
          <View style={styles.signature}><Text>Staff / witness signature</Text><Text style={styles.small}>Name: __________________________</Text></View>
        </View>
        <Text style={styles.blank}>Date: ____________________          Place: ____________________</Text>
        <Text style={[styles.small, styles.note]}>Decision recorded in the system: {titleCase(offer.decision)}{offer.decisionAt ? ` on ${dateTime(offer.decisionAt)}` : ''}. A signature on this paper does not automatically update that record.</Text>
      </View>

      <View style={styles.footer} fixed><Text>Application {application.applicationNo} / Offer version {offer.version}</Text><Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} /></View>
    </Page>
  </Document>;
}
