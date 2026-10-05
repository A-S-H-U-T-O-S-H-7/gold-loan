# ATD Gold Loan — Project Flow and Backend Requirements

## Purpose

This document describes how the **frontend product should work** from the moment a customer becomes a lead through loan closure. It is intentionally separate from backend implementation documentation: it defines the handoff the backend must provide — data, API operations, permissions, and important business rules.

## Important current-state note

The CRM screens already show the workflow below, but several of them currently use a local Zustand mock store (`src/lib/store/loanStore.js`). The public **Apply** form also uses a demo OTP (`123456`) and does not create a lead yet. A production backend must become the source of truth for all application, loan, payment, and audit data.

## People in the system

| Person | What they do |
| --- | --- |
| Customer | Applies for a gold loan, verifies their phone, supplies KYC/documents, accepts an offer, and repays the loan. |
| Call/branch executive | Receives new leads, calls customers, records remarks, and creates or completes applications. |
| KYC officer | Checks identity, address, bank, nominee, and documents. |
| Gold appraiser | Records every pledged gold item, its weight, purity, valuation, photos, and remarks. |
| Credit approver | Reviews the completed case and approves, rejects, or sends it back. |
| Disbursement/operations officer | Starts and confirms the transfer to the customer's verified bank account. |
| Collection officer | Records repayments and follows overdue loans. |
| Branch/admin manager | Manages users, branches, permissions, rates, reports, audit logs, and vault records. |

## End-to-end lifecycle

```text
Customer enquiry / online apply / walk-in / referral
  → lead created
  → executive contacts customer
  → KYC + documents collected and verified
  → gold evaluated
  → loan offer generated
  → customer accepts offer
  → credit approval
  → disbursement prepared
  → transfer succeeds
  → active loan and repayment schedule
  → paid / closed and gold released
```

At any review point, the case can move to **Follow-up**, **Needs review**, or **Rejected**. A rejected case should retain its history and rejection reason; it must not be deleted.

## Application status flow

```text
DRAFT → PENDING → UNDER_REVIEW
                       ├→ FOLLOW_UP ────────────────┐
                       ├→ REJECTED                  │
                       └→ KYC_VERIFIED              │
                              ↓                       │
                       PENDING_EVALUATION ← NEEDS_REVIEW
                              ↓
                       GOLD_EVALUATED → OFFER_PENDING
                                               ├→ OFFER_ACCEPTED → APPROVED
                                               └→ REJECTED            ↓
                                                              READY_FOR_TRANSFER
                                                                    ├→ TRANSFERRED → ACTIVE → OVERDUE / NPA → CLOSED
                                                                    └→ FAILED ────────────────────────┘
```

`FOLLOW_UP` returns to the KYC/under-review queue after the missing information is obtained. `OVERDUE` and `NPA` are servicing states of an active loan, not application stages.

## Detailed business flow

### 1. Lead arrives

A lead can come from the website application form, a phone call, walk-in, referral, campaign, or CRM executive entry.

The minimum lead data is:

- Full name
- Indian mobile number
- Lead source
- Preferred/nearest branch
- Created-by user or system source

For the online Apply form, also capture date of birth, email, state, city, and PIN code. The form should first request an OTP, then create the lead only after OTP verification. The customer must receive a reference/lead ID and clear next-step message.

### 2. Lead queue and follow-up

The selected branch sees new leads in **Create Customer / Enquiries**. An executive can call the customer, add a timestamped outcome and remark, schedule the next follow-up, update the source, or start the KYC application.

Typical outcomes: `connected`, `not_connected`, `interested`, `not_interested`, `documents_pending`, `follow_up_required`, and `converted`.

### 3. KYC and customer application

Once the lead proceeds, the executive creates or completes an application. The KYC page captures:

- Customer: full name, DOB, gender, mobile, alternate mobile, email, PAN, Aadhaar
- Current address: house number, address, state, city, PIN
- Permanent address: the same fields, or a `same_as_current` flag
- Bank: bank name, branch, account type, account number, IFSC, account-holder name
- Nominee: name, relationship, DOB, gender, mobile, email, PAN, Aadhaar
- Documents: Aadhaar front/back, PAN, selfie/photo; any additional business-required documents

The officer verifies the data and moves the application to `KYC_VERIFIED`, `FOLLOW_UP`, or `REJECTED`. Every decision must include who performed it, when, and a reason/remark.

### 4. Gold evaluation

The appraiser selects the application and records one or more pledged gold items. Each item needs gold type, item name, purity, gross weight, stone weight, net weight, rate per gram, market/appraised/loan value, condition, hallmark/receipt number, remarks, and photos.

The backend supplies the current gold rate and allowed LTV percentage. The eligible loan amount is calculated from net weight × rate × LTV, subject to configured minimum/maximum rules. The evaluation is saved, then submitted for approval. It may be approved, rejected, or sent back for correction.

### 5. Loan offer and customer decision

After an approved evaluation, the executive creates an offer with the offered amount, ROI, tenure, repayment type (`Bullet`, `Monthly Interest`, or `EMI`), processing fee, grace period, and any notes. The backend calculates and persists the repayment schedule and totals.

The customer accepts or declines the offer. Acceptance must record the actor, time, method (in person/OTP/digital), and note. A decline needs a reason and ends the case as rejected unless a new offer is created.

### 6. Credit approval

The credit officer reviews KYC, documents, gold valuation, loan offer, blacklist result, and checklist. They approve the final amount, reject with a reason, or return the application to gold evaluation (`NEEDS_REVIEW`). Approval creates a sanctionable case.

### 7. Disbursement and transaction

Operations confirms the destination account, selects disbursement mode (`Bank Transfer`, `UPI`, or `Cash` where permitted), and starts the transfer. The application becomes `READY_FOR_TRANSFER`.

The payment gateway/bank result creates an immutable transaction record. A successful result marks the application `TRANSFERRED`, creates the loan account and schedule, and then marks it `ACTIVE`. A failed transfer stays actionable and must be safely retryable without duplicate disbursement.

### 8. Loan servicing, collections, closure, and gold release

For an active loan, the CRM shows instalments, payment history, outstanding principal/interest/charges, next due date, and loan status. Collections can record EMI, interest-only, partial, full, and foreclosure payments using cash, UPI, bank transfer, or cheque.

The backend updates balances atomically. It changes an overdue loan to `OVERDUE` and then `NPA` according to configured overdue rules. When all payable amounts are cleared, the loan is `CLOSED`. Gold release must be a separate recorded approval/hand-over action; the vault item only becomes available after release.

## Data the backend must own

| Entity | Essential data |
| --- | --- |
| Branch | Code, name, company/manager, contact details, address, active status. |
| Admin/user | Branch, name, username, password hash, role, permissions, status, profile photo. |
| Lead | Lead ID, source, branch, name, mobile, email, DOB, location, OTP state, owner, status, follow-up details. |
| Application/customer | CRN, application ID, lead link, personal details, KYC status, blacklist status, branch, assigned users, application status. |
| Addresses | Current and permanent address fields; address type. |
| KYC documents | Document type, secure storage URL/key, verification state, reviewer, timestamps, rejection remark. |
| Bank account | Account holder, bank/branch, type, masked account number for normal reads, IFSC, verification state. |
| Nominee | Name, relation, DOB, gender, contact details, PAN/Aadhaar where collected. |
| Call/follow-up | Application/lead, outcome, remark, next-follow-up date, created by, created time. |
| Gold evaluation | Application, gold rate, LTV, totals, eligible amount, appraiser details, approval state and remarks. |
| Gold item | Evaluation, gold type/item, purity, weights, values, condition, hallmark, receipt, pictures. |
| Loan offer / approval | Amounts, ROI, tenure, repayment type, fees, grace days, checklist, offer/approval/rejection decisions. |
| Loan account | Loan number, sanctioned/disbursed amount, balances, start/maturity dates, active/overdue/NPA/closed status. |
| Repayment schedule | Loan, instalment number, due date, principal, interest, fees, paid amount, outstanding amount, payment status. |
| Payment / disbursement transaction | Type, amount, mode, bank/gateway reference, status, attempted/settled time, actor, failure reason. |
| Vault / gold custody | Branch, locker reference, application/loan, gold summary, custody status, deposited/released timestamps and staff. |
| Audit log | Actor, branch, action, entity type/ID, before/after values, IP/device if available, timestamp. |
| Settings | Gold rates, LTV limits, interest/processing/penalty rates, grace period, NPA days, payment rules. |

Sensitive values such as Aadhaar, PAN, bank account numbers, document URLs, and passwords must never be returned unnecessarily. Mask them in list responses and limit access by role.

## Required API groups

All protected routes should use `Authorization: Bearer <accessToken>`, enforce the caller's branch/permission server-side, and return a consistent JSON shape such as `{ success, message, data, pagination }`.

| Area | API operations required |
| --- | --- |
| Authentication | Admin login/logout, current-user session, refresh token if used, forgot/reset password. |
| Lookup data | States, cities by state, active branches, banks/eNACH modes, current gold rates, configuration. |
| Leads | Create public lead after OTP, send/verify OTP, CRM lead list/detail/update, assignment, conversion to application, export. |
| Calls/follow-up | List calls, create call remark, set outcome/next follow-up, references/contact details. |
| Applications/KYC | Create multipart application, detail/edit/update, document upload/view, document verification, application status update, blacklist/activate, paginated lists by queue. |
| Gold evaluation | Get application data, get/save evaluation, manage gold items and images, get/update rates and LTV, calculate eligibility, submit/approve/reject, report/export. |
| Offer and credit | Create/update offer, calculate schedule, accept/reject offer, retrieve credit case, submit approval/rejection/return-for-review, sanction letter/email. |
| Disbursement/transactions | Create transfer attempt, callback/reconciliation update, retry with idempotency key, transaction list/detail/export. |
| Loan servicing | Active/overdue/NPA/closed loan lists, account detail, repayment schedule, record/reverse payment with controlled permission, payment history, foreclosure calculation. |
| Vault/release | Locker list, allocate/occupy/release locker, custody history, gold-release approval and receipt. |
| Administration | Branch CRUD/status, admin CRUD/status, username availability, roles/permissions, audit logs, reports. |

## Existing frontend API references

The frontend already contains client calls for parts of this contract in `src/lib/services/`. In particular, it expects application list/edit/update/status APIs, KYC creation, state/city lookups, branch/admin management, call history, appraisal PDF, and gold-evaluation endpoints. These references should be treated as integration clues, not as a complete backend specification: the contract above is the production target.

## Critical backend rules

- Generate immutable IDs: lead ID, application ID/CRN, loan number, transaction reference, and receipt number.
- Do not trust the frontend for role, branch, status, eligibility, interest, payment total, or LTV calculations.
- Permit only valid status transitions. For example, an unverified application cannot jump directly to disbursement.
- Require a reason for rejection, follow-up, status reversal, blacklist, and failed/retried transfer.
- Keep history instead of overwriting important events: status changes, offer decisions, evaluation versions, payments, and gold release.
- Use server-side validation for Indian mobile, PIN, PAN, Aadhaar format, monetary values, uploaded file size/type, and required fields.
- Store money and weights in precise decimal columns — never floating-point values.
- Paginate all CRM lists and allow safe filtering/search/sorting by branch and date.
- Make disbursement, payment, and callback operations idempotent to prevent duplicate money movement.
- Restrict document files to authorised users and use private storage or time-limited signed URLs.

## Frontend integration order

1. Replace demo OTP and lead submission on the public Apply page.
2. Replace CRM mock-store lead/KYC flow with real application APIs.
3. Integrate gold evaluation and offer/credit decisions.
4. Integrate disbursement, transactions, and payment posting with idempotency.
5. Integrate dashboard, reporting, vault, audit, and permission-driven visibility.

Each step should be released only after its API handles loading, validation errors, unauthorised responses, empty states, pagination, and refresh/reload persistence.
