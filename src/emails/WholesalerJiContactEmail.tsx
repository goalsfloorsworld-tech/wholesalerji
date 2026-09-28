import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface WholesalerJiContactEmailProps {
  leadId: string;
  source: string;
  name: string;
  phone: string;
  city: string;
  userType: string;
  companyName?: string;
  intent: string;
  selectedPanels: string;
  messageSummary: string;
  submittedAt: string;
}

export const WholesalerJiContactEmail = ({
  leadId,
  source,
  name,
  phone,
  city,
  userType,
  companyName,
  intent,
  selectedPanels,
  messageSummary,
  submittedAt,
}: WholesalerJiContactEmailProps) => {
  const previewText = `New WholesalerJi Lead: ${name} from ${city}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brandText}>WHOLESALERJI</Text>
            <Text style={subHeaderText}>NEW CONTACT PAGE ENQUIRY</Text>
          </Section>

          <Section style={section}>
            <Heading style={heading}>Lead Details</Heading>
            
            <table style={{ width: "100%", marginBottom: "20px", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={labelCell}>Name</td>
                  <td style={valueCell}>{name}</td>
                </tr>
                <tr>
                  <td style={labelCell}>Phone</td>
                  <td style={valueCell}>{phone}</td>
                </tr>
                <tr>
                  <td style={labelCell}>City</td>
                  <td style={valueCell}>{city}</td>
                </tr>
                <tr>
                  <td style={labelCell}>User Type</td>
                  <td style={valueCell}>{userType}</td>
                </tr>
                {companyName && (
                  <tr>
                    <td style={labelCell}>Company Name</td>
                    <td style={valueCell}>{companyName}</td>
                  </tr>
                )}
                <tr>
                  <td style={labelCell}>Intent</td>
                  <td style={valueCell}>{intent}</td>
                </tr>
                <tr>
                  <td style={labelCell}>Selected Panels</td>
                  <td style={valueCell}>{selectedPanels || "None"}</td>
                </tr>
              </tbody>
            </table>

            <Heading style={heading}>Message Summary</Heading>
            <div style={messageBox}>
              <Text style={messageText}>{messageSummary}</Text>
            </div>
          </Section>

          <Hr style={divider} />

          <Section style={footer}>
            <Text style={footerText}>Source: {source}</Text>
            <Text style={footerText}>Lead ID: {leadId}</Text>
            <Text style={footerText}>Submitted: {submittedAt}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// --- Clean Professional Styling ---
const main = {
  backgroundColor: "#f5f5f4", // stone-100
  padding: "40px 0",
  fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "0",
  border: "1px solid #e7e5e4", // stone-200
  borderRadius: "8px",
  overflow: "hidden",
  maxWidth: "600px",
};

const header = {
  backgroundColor: "#1c1917", // stone-900
  padding: "30px 20px",
  textAlign: "center" as const,
};

const brandText = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "900",
  letterSpacing: "4px",
  margin: "0",
};

const subHeaderText = {
  color: "#f59e0b", // amber-500
  fontSize: "12px",
  fontWeight: "bold",
  letterSpacing: "2px",
  marginTop: "8px",
  marginBottom: "0",
};

const section = { 
  padding: "30px 40px",
};

const heading = {
  fontSize: "16px",
  color: "#1c1917",
  fontWeight: "bold",
  textTransform: "uppercase" as const,
  marginBottom: "16px",
  marginTop: "0",
};

const labelCell = {
  color: "#57534e", // stone-500
  fontSize: "13px",
  fontWeight: "bold",
  padding: "10px 0",
  borderBottom: "1px solid #f5f5f4", // stone-100
  width: "35%",
};

const valueCell = {
  color: "#1c1917", // stone-900
  fontSize: "14px",
  padding: "10px 0",
  borderBottom: "1px solid #f5f5f4", // stone-100
};

const messageBox = {
  backgroundColor: "#f5f5f4", // stone-100
  padding: "20px",
  borderRadius: "6px",
  borderLeft: "4px solid #f59e0b", // amber-500
};

const messageText = {
  color: "#44403c", // stone-700
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
};

const divider = {
  borderColor: "#e7e5e4", // stone-200
  margin: "0",
};

const footer = {
  padding: "20px 40px",
  backgroundColor: "#fafaf9", // stone-50
};

const footerText = {
  color: "#78716c", // stone-400
  fontSize: "12px",
  margin: "4px 0",
};

export default WholesalerJiContactEmail;
