import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how we collect, use, and protect your personal information.",
};

const sections = [
  {
    id: "introduction",
    title: "Introduction",
    content: `We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.

Please read this policy carefully. If you disagree with its terms, please discontinue use of our services. We reserve the right to make changes to this policy at any time, and we'll alert you about significant changes by updating the date at the top of this policy.`,
  },
  {
    id: "information-we-collect",
    title: "Information We Collect",
    content: `We may collect information about you in a variety of ways. The information we may collect includes:`,
    list: [
      {
        label: "Personal Data",
        detail:
          "Personally identifiable information such as your name, email address, telephone number, and demographic information that you voluntarily give us when registering or when choosing to participate in various activities.",
      },
      {
        label: "Derivative Data",
        detail:
          "Information our servers automatically collect when you access our website, such as your IP address, browser type, operating system, access times, and pages viewed directly before and after accessing the site.",
      },
      {
        label: "Financial Data",
        detail:
          "Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase or order from us. We store only very limited financial information.",
      },
      {
        label: "Device Data",
        detail:
          "Device information such as your mobile device ID, model, manufacturer, and information about the location of your device, if you access the services from a mobile device.",
      },
    ],
  },
  {
    id: "use-of-information",
    title: "Use of Your Information",
    content: `Having accurate information about you permits us to provide you with a smooth, efficient, and customised experience. Specifically, we may use information collected about you to:`,
    list: [
      { detail: "Create and manage your account." },
      { detail: "Process transactions and send you related information." },
      { detail: "Send administrative information, such as updates, security alerts, and support messages." },
      { detail: "Respond to your comments and questions and provide customer service." },
      { detail: "Send you marketing and promotional communications (with your consent)." },
      { detail: "Monitor and analyse usage and trends to improve your experience." },
      { detail: "Notify you of updates to our products and services." },
      { detail: "Prevent fraudulent transactions and monitor against theft." },
    ],
  },
  {
    id: "disclosure",
    title: "Disclosure of Your Information",
    content: `We may share information we have collected about you in certain situations. Your information may be disclosed as follows:`,
    list: [
      {
        label: "By Law or to Protect Rights",
        detail:
          "If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others.",
      },
      {
        label: "Business Transfers",
        detail:
          "We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business.",
      },
      {
        label: "Third-Party Service Providers",
        detail:
          "We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, and customer service.",
      },
      {
        label: "With Your Consent",
        detail: "We may disclose your personal information for any other purpose with your consent.",
      },
    ],
  },
  {
    id: "cookies",
    title: "Cookies and Tracking Technologies",
    content: `We may use cookies, web beacons, tracking pixels, and other tracking technologies on our website to help customise the site and improve your experience. When you access our website, your personal information is not collected through the use of tracking technology.

Most browsers are set to accept cookies by default. You can remove or reject cookies, but be aware that such action could affect the availability and functionality of our website. You may also opt out of interest-based advertising by visiting the Digital Advertising Alliance or the Network Advertising Initiative opt-out pages.`,
  },
  {
    id: "security",
    title: "Security of Your Information",
    content: `We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.

Any information disclosed online is vulnerable to interception and misuse by unauthorised parties. Therefore, we cannot guarantee complete security if you provide personal information.`,
  },
  {
    id: "data-retention",
    title: "Data Retention",
    content: `We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy policy, unless a longer retention period is required or permitted by law (such as tax, accounting or other legal requirements).

When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymise it, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.`,
  },
  {
    id: "your-rights",
    title: "Your Privacy Rights",
    content: `Depending on your location, you may have the following rights regarding your personal information:`,
    list: [
      { label: "Right to Access", detail: "The right to request copies of your personal data." },
      {
        label: "Right to Rectification",
        detail: "The right to request correction of information you believe is inaccurate or incomplete.",
      },
      {
        label: "Right to Erasure",
        detail: "The right to request that we erase your personal data, under certain conditions.",
      },
      {
        label: "Right to Restrict Processing",
        detail: "The right to request that we restrict the processing of your personal data.",
      },
      {
        label: "Right to Data Portability",
        detail: "The right to request that we transfer the data we have collected to another organisation, or directly to you.",
      },
      {
        label: "Right to Object",
        detail: "The right to object to our processing of your personal data, under certain conditions.",
      },
    ],
  },
  {
    id: "children",
    title: "Children's Privacy",
    content: `Our services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us. If we become aware that we have collected personal information from a child under age 13 without verification of parental consent, we take steps to remove that information from our servers.`,
  },
  {
    id: "contact",
    title: "Contact Us",
    content: `If you have questions or comments about this Privacy Policy, please contact us at:`,
    contact: {
      company: "Your Company Name",
      address: "123 Business Street, Suite 100",
      city: "New York, NY 10001",
      email: "privacy@yourcompany.com",
      phone: "+1 (555) 000-0000",
    },
  },
];

export default function PrivacyPolicyPage() {
  const lastUpdated = "April 11, 2026";

  return (
    <html><head><title>Home</title></head><body><h1>Hello World</h1><p>This is HTML from Node.js API</p> </body> </html>
  );
}