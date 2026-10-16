class Application {
  constructor(row) {
    const address = row.kyc?.details?.currentAddress;
    const addressParts = address && typeof address === 'object'
      ? [address.houseNo, address.address, address.city || row.city, address.state || row.state, address.pinCode || row.pin]
      : [row.city, row.state, row.pin];
    this.id = Number(row.id);
    this.applicationNo = row.applicationNo;
    this.name = row.name;
    this.mobile = row.mobile;
    this.email = row.email;
    this.dob = row.dob ? row.dob.toISOString().slice(0, 10) : null;
    this.preferredBranch = row.preferredBranch;
    this.state = row.state;
    this.city = row.city;
    this.pin = row.pin;
    this.purpose = row.purpose;
    this.requestedAmount = row.requestedAmount == null ? null : Number(row.requestedAmount);
    this.status = row.status;
    this.kycVerified = row.kyc?.isVerified === 1;
    this.latestRemark = row.statusHistory?.[0]?.remark ?? null;
    this.currentAddress = addressParts.filter((part) => typeof part === 'string' && part.trim()).join(', ') || null;
    this.followUpRemark = row.status === 'FOLLOW_UP' ? this.latestRemark : null;
    this.followUpEnteredAt = row.status === 'FOLLOW_UP' ? (row.statusHistory?.[0]?.createdAt ?? null) : null;
    this.source = row.source;
    this.createdByAdminId = row.createdByAdminId ? Number(row.createdByAdminId) : null;
    this.branchId = row.branchId ? Number(row.branchId) : null;
    this.branchName = row.branch?.name ?? null;
    this.createdAt = row.createdAt;
    this.updatedAt = row.updatedAt;
  }
}

export default Application;
