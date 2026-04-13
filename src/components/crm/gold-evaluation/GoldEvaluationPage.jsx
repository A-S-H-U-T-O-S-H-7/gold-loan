"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Gem, Mail, Phone, User } from "lucide-react";
import toast from "react-hot-toast";
import { useThemeStore } from "@/lib/store/useThemeStore";
import {
  formatGoldEvaluationForUI,
  goldEvaluationAPI,
} from "@/lib/services/GoldEvaluationServices";

const SectionCard = ({ title, children, isDark }) => (
  <section
    className={`rounded-2xl border p-5 ${
      isDark ? "border-gray-700 bg-gray-800" : "border-emerald-200 bg-white"
    }`}
  >
    <h2
      className={`mb-4 text-lg font-semibold ${
        isDark ? "text-emerald-300" : "text-emerald-700"
      }`}
    >
      {title}
    </h2>
    {children}
  </section>
);

const InfoGrid = ({ rows, isDark }) => (
  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
    {rows.map(({ label, value }) => (
      <div
        key={label}
        className={`rounded-xl border p-3 ${
          isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-emerald-50/40"
        }`}
      >
        <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          {label}
        </p>
        <p className={`mt-1 text-sm font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}>{value}</p>
      </div>
    ))}
  </div>
);

const GoldEvaluationPage = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadApplication = async () => {
      try {
        setLoading(true);
        const response = await goldEvaluationAPI.getApplication(params.id);
        setData(formatGoldEvaluationForUI(response));
      } catch (error) {
        toast.error(error?.response?.data?.message || error?.message || "Failed to load gold evaluation");
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      loadApplication();
    }
  }, [params?.id]);

  useEffect(() => {
    const view = searchParams.get("view");
    if (!view) return;

    const section = document.getElementById(view === "gold" ? "gold-section" : "appraisal-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [searchParams, data]);

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? "bg-gray-900 text-white" : "bg-emerald-50/30 text-gray-900"} p-6`}>
        <div className="mx-auto max-w-7xl animate-pulse rounded-2xl border p-6">
          Loading gold evaluation...
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`min-h-screen ${isDark ? "bg-gray-900 text-white" : "bg-emerald-50/30 text-gray-900"} p-6`}>
        <div className="mx-auto max-w-4xl rounded-2xl border p-6">Application data not found.</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-emerald-50/30"}`}>
      <div className="mx-auto max-w-7xl p-4 md:p-6">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className={`rounded-xl border p-3 transition-all duration-200 hover:scale-105 ${
                isDark ? "border-gray-700 bg-gray-800 text-emerald-300" : "border-emerald-200 bg-white text-emerald-700"
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                Appraisal & Gold Evaluation
              </h1>
              <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
                {data.name} · {data.crnNo}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className={`rounded-xl border p-3 ${isDark ? "border-gray-700 bg-gray-800" : "border-emerald-200 bg-white"}`}>
              <p className="text-xs uppercase text-gray-500">Gold Amount</p>
              <p className={`mt-1 font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Rs {data.goldAmount}</p>
            </div>
            <div className={`rounded-xl border p-3 ${isDark ? "border-gray-700 bg-gray-800" : "border-emerald-200 bg-white"}`}>
              <p className="text-xs uppercase text-gray-500">Approved</p>
              <p className={`mt-1 font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Rs {data.approvedAmount}</p>
            </div>
            <div className={`rounded-xl border p-3 ${isDark ? "border-gray-700 bg-gray-800" : "border-emerald-200 bg-white"}`}>
              <p className="text-xs uppercase text-gray-500">ROI</p>
              <p className={`mt-1 font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{data.roi}</p>
            </div>
            <div className={`rounded-xl border p-3 ${isDark ? "border-gray-700 bg-gray-800" : "border-emerald-200 bg-white"}`}>
              <p className="text-xs uppercase text-gray-500">Tenure</p>
              <p className={`mt-1 font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{data.tenure}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <SectionCard title="Customer Details" isDark={isDark}>
            <div className="mb-4 flex flex-wrap gap-4">
              <div className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 ${isDark ? "bg-gray-900 text-gray-200" : "bg-emerald-50 text-emerald-800"}`}>
                <User className="h-4 w-4" />
                {data.name}
              </div>
              <div className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 ${isDark ? "bg-gray-900 text-gray-200" : "bg-emerald-50 text-emerald-800"}`}>
                <Phone className="h-4 w-4" />
                {data.phone}
              </div>
              <div className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 ${isDark ? "bg-gray-900 text-gray-200" : "bg-emerald-50 text-emerald-800"}`}>
                <Mail className="h-4 w-4" />
                {data.email}
              </div>
            </div>
            <InfoGrid
              isDark={isDark}
              rows={[
                { label: "CRN No", value: data.crnNo },
                { label: "Loan No", value: data.loanNo },
                { label: "Date of Birth", value: data.dob },
                { label: "Gender", value: data.gender },
                { label: "PAN No", value: data.panNo },
                { label: "Aadhaar No", value: data.aadharNo },
                { label: "Alternate Mobile", value: data.altMobile },
                { label: "Loan Term", value: data.loanTerm },
                { label: "Approval Note", value: data.approvalNote },
              ]}
            />
          </SectionCard>

          <SectionCard title="Address & Bank" isDark={isDark}>
            <InfoGrid
              isDark={isDark}
              rows={[
                { label: "Permanent Address", value: data.permanentAddress },
                { label: "Current Address", value: data.currentAddress },
                { label: "Bank Name", value: data.bank.bankName },
                { label: "Branch Name", value: data.bank.branchName },
                { label: "Account Type", value: data.bank.accountType },
                { label: "Account No", value: data.bank.accountNo },
                { label: "IFSC Code", value: data.bank.ifscCode },
                { label: "Bank Verification", value: data.bank.bankVerified },
              ]}
            />
          </SectionCard>

          <section id="appraisal-section">
            <SectionCard title="Nominee Details" isDark={isDark}>
              <InfoGrid
                isDark={isDark}
                rows={[
                  { label: "Nominee Name", value: data.nominee.name },
                  { label: "Relation", value: data.nominee.relation },
                  { label: "Date of Birth", value: data.nominee.dob },
                  { label: "Gender", value: data.nominee.gender },
                  { label: "Mobile", value: data.nominee.mobile },
                  { label: "Email", value: data.nominee.email },
                  { label: "Aadhaar No", value: data.nominee.aadharNo },
                  { label: "PAN No", value: data.nominee.panNo },
                ]}
              />
            </SectionCard>
          </section>

          <section id="gold-section">
            <SectionCard title="Gold Evaluation" isDark={isDark}>
              <div className="overflow-x-auto">
                <table className="min-w-full overflow-hidden rounded-xl">
                  <thead>
                    <tr className={isDark ? "bg-gray-900 text-gray-200" : "bg-emerald-50 text-gray-700"}>
                      {["Item", "Type", "Purity", "Gross Wt", "Stone Wt", "Net Wt", "Rate/Gm", "Market", "Appraised", "Loan", "Condition", "Hallmark", "Receipt", "Status"].map((label) => (
                        <th key={label} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.golds.map((gold) => (
                      <tr key={gold.id} className={`border-t ${isDark ? "border-gray-700 text-gray-200" : "border-gray-200 text-gray-700"}`}>
                        <td className="px-3 py-3 text-sm font-medium">{gold.itemName}</td>
                        <td className="px-3 py-3 text-sm">{gold.goldType}</td>
                        <td className="px-3 py-3 text-sm">{gold.purity}</td>
                        <td className="px-3 py-3 text-sm">{gold.grossWeight}</td>
                        <td className="px-3 py-3 text-sm">{gold.stoneWeight}</td>
                        <td className="px-3 py-3 text-sm">{gold.netWeight}</td>
                        <td className="px-3 py-3 text-sm">Rs {gold.ratePerGram}</td>
                        <td className="px-3 py-3 text-sm">Rs {gold.marketValue}</td>
                        <td className="px-3 py-3 text-sm">Rs {gold.appraisedValue}</td>
                        <td className="px-3 py-3 text-sm">Rs {gold.loanValue}</td>
                        <td className="px-3 py-3 text-sm">{gold.conditions}</td>
                        <td className="px-3 py-3 text-sm">{gold.hallmarkNo}</td>
                        <td className="px-3 py-3 text-sm">{gold.receiptNo}</td>
                        <td className="px-3 py-3 text-sm">{gold.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {data.golds.map((gold) =>
                gold.pictures?.length ? (
                  <div key={`${gold.id}-images`} className="mt-5">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                      <Gem className="h-4 w-4" />
                      {gold.itemName} Images
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {gold.pictures.map((picture) => (
                        <a
                          key={picture}
                          href={picture}
                          target="_blank"
                          rel="noreferrer"
                          className={`overflow-hidden rounded-xl border ${
                            isDark ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-gray-50"
                          }`}
                        >
                          <img src={picture} alt={gold.itemName} className="h-40 w-full object-cover" />
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null
              )}
            </SectionCard>
          </section>
        </div>
      </div>
    </div>
  );
};

export default GoldEvaluationPage;
