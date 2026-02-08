"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { BiSolidLock } from "react-icons/bi";
import { FaAngleDown, FaAngleLeft } from "react-icons/fa6";


export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState(null);
  const router = useRouter();



 const sections = [
  {
    title: "Information We Collect",
    content: `
      <p class="mb-4">
        ATD Money collects personal and financial information solely for the purpose of providing
        gold loan and related financial services through its digital platform. These services are
        facilitated in association with RBI-registered Non-Banking Financial Companies (NBFCs),
        whose details are disclosed on our website and mobile application.
      </p>

      <p class="mb-3"><strong>A. Lending Services</strong></p>
      <p class="mb-4">
        To process your gold loan application, we collect information necessary for identity
        verification, gold valuation, loan disbursement, repayment, regulatory compliance, and
        customer support.
      </p>

      <p class="mb-3"><strong>B. Non-Lending Services</strong></p>
      <p class="mb-4">
        We may also collect information when you browse, register, or interact with our platform,
        even if the loan is not sanctioned.
      </p>

      <ol class="list-decimal ml-6 space-y-2">
        <li>Personal details such as name, gender, date of birth, address, mobile number, and email ID.</li>
        <li>KYC details including Aadhaar, PAN, photograph, and signature.</li>
        <li>Bank account or repayment-related information.</li>
        <li>Details of gold items submitted for valuation.</li>
        <li>Transactional information strictly limited to loan-related financial transactions.</li>
        <li>Device and log information such as IP address, browser type, access time, and crash logs.</li>
        <li>Communication records including customer support calls (recorded for quality and compliance).</li>
      </ol>
    `
  },

  {
    title: "Information about you we collect from third parties",
    content: `
      <p class="mb-4">
        With your explicit consent and as permitted by applicable laws, we may obtain information
        from third parties such as credit bureaus, payment gateways, document verification agencies,
        and banking partners.
      </p>

      <p class="mb-4">
        This information may include credit history, verification status, repayment confirmations,
        and transaction references required to assess loan eligibility and compliance.
      </p>

      <p class="mb-4">
        Any such data is collected strictly on a need basis, transferred securely to the partnered
        NBFC, and not retained beyond regulatory or contractual requirements.
      </p>
    `
  },

  {
    title: "Information you give us about you",
    content: `
      <p class="mb-4">
        When you apply for a gold loan or use our services, you voluntarily provide certain
        information required to create your profile and process your application.
      </p>

      <ul class="list-disc ml-6 space-y-2">
        <li>Information provided through application forms on the website or mobile app.</li>
        <li>Identity and address proof documents submitted for KYC verification.</li>
        <li>Income, employment, or business-related details (if applicable).</li>
        <li>Communication shared through email, chat, or customer support.</li>
        <li>Feedback, reviews, or responses submitted voluntarily.</li>
      </ul>

      <p class="mt-4">
        We do not collect or store biometric data. If anyone claims to do so on our behalf,
        please report the same to our Grievance Officer immediately.
      </p>
    `
  },

  {
    title: "Storage of Personal Information",
    content: `
      <p class="mb-4">
        We store only the minimum personal information required to process your gold loan and
        comply with regulatory obligations. All data is stored on secure servers located in India.
      </p>

      <p class="mb-4">
        Sensitive financial and KYC information collected on behalf of NBFCs is securely transferred
        to them and retained only as required under applicable laws such as the Prevention of Money
        Laundering Act, 2002.
      </p>
    `
  },

  {
    title: "Collection of Specific Non-Personal Information",
    content: `
      <p class="mb-4">
        We may collect non-personal information such as browser type, device model, operating
        system, and usage patterns to improve platform performance and user experience.
      </p>

      <p class="mb-4">
        Cookies may be used to personalize your experience. You may disable cookies through your
        browser settings, though certain features of the website may not function optimally.
      </p>
    `
  },

  {
    title: "Consent of the Customers",
    content: `
      <p class="mb-4">
        By accessing or using our platform, you expressly consent to the collection, storage,
        processing, and sharing of your information as described in this Privacy Policy.
      </p>

      <p class="mb-4">
        You may request access, correction, or deletion of your personal information by contacting
        us, subject to regulatory and contractual limitations.
      </p>
    `
  },

  {
    title: "Prominent Disclosure",
    content: `
      <p class="mb-4">
        ATD Money does not sell, lease, or rent your personal information to third parties.
        Information is shared only with authorized partners, NBFCs, service providers, or
        regulatory authorities where legally required.
      </p>

      <p class="mb-4">
        We implement reasonable security practices including encryption, access controls, and
        periodic audits to safeguard your data.
      </p>
    `
  },

  {
    title: "Exclusions of Privacy Policy",
    content: `
      <p class="mb-4">
        This Privacy Policy does not apply to third-party websites or services linked from our
        platform. We encourage you to review the privacy policies of such websites separately.
      </p>
    `
  },

  {
    title: "Amendments",
    content: `
      <p class="mb-4">
        We may update this Privacy Policy from time to time to reflect changes in laws, regulations,
        or business practices. Updated versions will be published on this page.
      </p>
    `
  },

  {
    title: "Contact Person",
    content: `
      <p class="mb-4">
        For any privacy-related concerns or requests, please contact us at:
        <a href="mailto:grievances@atdmoney.com" class="text-teal-600 hover:underline">
          grievances@atdmoney.com
        </a>
      </p>
    `
  },

  {
    title: "Terms & Conditions",
    content: `
      <ol class="list-decimal ml-6 space-y-2">
        <li>Loan approval is subject to eligibility and internal credit assessment.</li>
        <li>All terms are governed by applicable RBI and statutory regulations.</li>
        <li>Use of the platform constitutes acceptance of this Privacy Policy and Terms of Use.</li>
      </ol>
    `
  }
];


  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className=" py-4  md:py-8 px-4 md:px-10">
        <header className="mb-12 text-center">
          <div className="flex justify-end mb-4">
  {/* Back button - top right */}
  <button 
    onClick={() => router.back()} 
    className="flex items-center cursor-pointer gap-2 bg-blue-900 hover:bg-blue-950 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200 font-medium"
  >
    <FaAngleLeft className="w-4 h-4" />
    Back
  </button>
</div>
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center">
              <BiSolidLock className="text-white w-8 h-8" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-2">
            Privacy Policy
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            ATD Money is devoted to shielding the private and financial
            details submitted by our customers and would make the best effort
            to defend such info and details from unconstitutional use.
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-10">
          <div className="p-4 md:p-8 bg-teal-600 text-white">
            <h2 className="text-2xl text-center font-bold">
              Privacy Policy Overview 
            </h2>
            <p className="mt-2 text-indigo-100">
              This Privacy Policy would be relevant to use of the website or
              other web application of ATD Money. The terms and conditions of
              Website Use as stated in 'Policy on Website Use of the ATD
              Money' as modified infrequently is integrated herein by way of
              reference.
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {sections.map((section, index) =>
              <div key={index} className="accordion-item">
                <h3 className="text-lg ml-5 mt-5 text-left sm:text-xl font-medium text-gray-900">
                  {section.title}
                </h3>

                <div
                  className="px-6 py-5 sm:px-8 bg-gray-50 text-gray-700 prose prose-indigo max-w-none"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-gray-800 max-w-md">
          <h2 className="text-xl font-semibold text-teal-700 mb-4">
            Grievance Officer
          </h2>

          <p className="font-medium text-lg mb-2">Mr. Kisan Sahoo</p>
          <p className="mb-4">Grievance Officer</p>

          <div className="text-sm leading-relaxed mb-4">
            <p>1st Floor, C 316, B and C, Sector 10, Noida,</p>
            <p>Gautam Buddha Nagar, Uttar Pradesh, 201301</p>
            <p className="mt-2">
              📞 Mob: <a href="tel:+919999589201" className="text-teal-600 hover:underline">
                +91-9999589201
              </a>
            </p>
            <p>
              📧 Email: <a href="mailto:grievances@atdmoney.com" className="text-teal-600 hover:underline">
                grievances@atdmoney.com
              </a>
            </p>
          </div>

          <p className="text-sm text-gray-600">
            Please review the privacy policy periodically to ensure you're
            aware of the latest updates.
          </p>
        </div>
       <div className="flex justify-end my-4">
  {/* Back button - top right */}
  <button 
    onClick={() => router.back()} 
    className="flex items-center cursor-pointer gap-2 bg-blue-900 hover:bg-blue-950 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200 font-medium"
  >
    <FaAngleLeft className="w-4 h-4" />
    Back
  </button>
</div>

        <footer className="text-center mt-6 text-gray-600 text-sm">
          <p>
            © {new Date().getFullYear()} ATD Money. All rights reserved.
          </p>
        </footer>
      </div>
    </div>;
}
