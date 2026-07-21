import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { SITE_NAME } from "@/lib/site";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#2b241b" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  siteName: { fontSize: 16, fontWeight: 700 },
  muted: { color: "#6b5f4f" },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 11, fontWeight: 700, marginBottom: 4 },
  row: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#e8ddcc", paddingVertical: 6 },
  headerRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#2b241b", paddingBottom: 6, fontWeight: 700 },
  colTitle: { flex: 3 },
  colQty: { flex: 1, textAlign: "right" },
  colPrice: { flex: 1, textAlign: "right" },
  colTotal: { flex: 1, textAlign: "right" },
  totalRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 12, gap: 24 },
  totalLabel: { fontWeight: 700 },
});

export function OrderInvoiceDocument({
  order,
}: {
  order: {
    id: string;
    createdAt: Date;
    totalCents: number;
    shippingName: string;
    shippingAddress: string;
    shippingCity: string;
    shippingPostalCode: string;
    shippingCountry: string;
    items: { titleSnapshot: string; quantity: number; priceCentsSnapshot: number }[];
  };
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.siteName}>{SITE_NAME}</Text>
          </View>
          <View>
            <Text>Facture n&deg; {order.id}</Text>
            <Text style={styles.muted}>Date : {order.createdAt.toLocaleDateString("fr-FR")}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adresse de livraison</Text>
          <Text>{order.shippingName}</Text>
          <Text>{order.shippingAddress}</Text>
          <Text>
            {order.shippingPostalCode} {order.shippingCity}, {order.shippingCountry}
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.headerRow}>
            <Text style={styles.colTitle}>Article</Text>
            <Text style={styles.colQty}>Qte</Text>
            <Text style={styles.colPrice}>Prix unitaire</Text>
            <Text style={styles.colTotal}>Total</Text>
          </View>
          {order.items.map((item, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.colTitle}>{item.titleSnapshot}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colPrice}>{(item.priceCentsSnapshot / 100).toFixed(2)} EUR</Text>
              <Text style={styles.colTotal}>
                {((item.priceCentsSnapshot * item.quantity) / 100).toFixed(2)} EUR
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalLabel}>{(order.totalCents / 100).toFixed(2)} EUR</Text>
        </View>
      </Page>
    </Document>
  );
}
