"use client";

import Link from "next/link";

const CRNLink = ({ crnNo, userId, className = "" }) => {
  return (
    <Link
      href={userId ? `/crm/user-kyc/${userId}` : "#"}
      className={`font-semibold text-emerald-600 hover:text-emerald-700 hover:underline ${className}`}
    >
      {crnNo || "N/A"}
    </Link>
  );
};

export default CRNLink;
