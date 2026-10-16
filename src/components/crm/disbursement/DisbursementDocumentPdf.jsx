import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 42, fontFamily: 'Helvetica', fontSize: 10, color: '#334155' },
  brand: { color: '#957025', fontSize: 11, marginBottom: 5 },
  title: { fontSize: 20, color: '#172033', marginBottom: 8 },
  rule: { borderBottomWidth: 1, borderBottomColor: '#caa54f', marginBottom: 18 },
  row: { flexDirection: 'row', marginBottom: 9 },
  label: { width: 155, color: '#64748b' },
  value: { flex: 1 },
  note: { marginTop: 18, lineHeight: 1.5 },
  signature: { marginTop: 60, borderTopWidth: 1, borderTopColor: '#334155', width: 200, paddingTop: 6 },
});

function Row({ label, value }) {
  return <View style={styles.row}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{String(value || '-')}</Text></View>;
}

export default function DisbursementDocumentPdf({ type, data }) {
  const { application, offer, bank, readiness } = data;
  const isPledge = type === 'pledge_receipt';
  const title = isPledge ? 'Pledge Receipt' : 'KYC Acknowledgement';
  return <Document title={`${title} - ${application.applicationNo}`} author="ATD Gold Loan">
    <Page size="A4" style={styles.page}>
      <Text style={styles.brand}>ATD GOLD LOAN</Text>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.rule} />
      <Row label="Application" value={application.applicationNo} />
      <Row label="Customer" value={application.name} />
      <Row label="Mobile" value={application.mobile} />
      <Row label="Branch" value={application.branchName} />
      {isPledge ? <>
        <Row label="Gold receipt number" value={readiness.custody?.receiptNumber} />
        <Row label="Storage location" value={readiness.custody?.storageLocation} />
        <Row label="Recorded at" value={readiness.custody?.recordedAt ? new Date(readiness.custody.recordedAt).toLocaleString('en-IN') : null} />
        <Row label="Approved loan principal" value={`Rs. ${Number(offer?.approvedAmount || 0).toLocaleString('en-IN')}`} />
        <Text style={styles.note}>This receipt records the pledged gold custody reference for the application shown above. Keep it with the signed loan agreement and the detailed gold evaluation.</Text>
      </> : <>
        <Row label="KYC revision" value={bank?.kycRevision} />
        <Row label="Verification status" value={readiness.bankVerified ? 'Verified' : 'Pending'} />
        <Row label="Verified at" value={bank?.verifiedAt ? new Date(bank.verifiedAt).toLocaleString('en-IN') : null} />
        <Row label="Account holder" value={bank?.accountHolderName} />
        <Row label="Bank" value={bank?.bankName} />
        <Row label="Payout account" value={bank?.maskedAccountNumber} />
        <Text style={styles.note}>This acknowledges the saved KYC verification for this application. Identity documents remain in the restricted KYC record.</Text>
      </>}
      <Text style={styles.signature}>Authorised staff signature</Text>
    </Page>
  </Document>;
}
