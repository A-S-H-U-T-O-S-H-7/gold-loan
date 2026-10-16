# CRM lead and application flow: code walkthrough

> Historical review from 8 October 2026. The current Create/Pending, KYC, Follow-up, Rejected, and Gold Evaluation queues use the backend and page-specific services. See `goldloan/PENDING_APPLICATIONS.md` for the current first-queue contract. Later loan-offer, credit, disbursement, and servicing pages still need their own backend integration. The older implementation notes below describe the state before the Pending/KYC refactor.

Reviewed against the current frontend code on 8 October 2026. This describes **what the pages actually do**, with the intended flow called out where the implementation is disconnected. `PROJECT_FLOW.md` describes a target business process; it is not proof that every step works today.

## Short answer

The designed route is:

```text
Website /apply OR CRM Create Customer (New Lead)
  -> /crm/create-customer (PENDING)
  -> /crm/kyc/[id] (PENDING / UNDER_REVIEW / FOLLOW_UP / REJECTED / KYC_VERIFIED)
  -> /crm/gold-evaluation (KYC_VERIFIED)
  -> /crm/gold-evaluation/[id] (GOLD_EVALUATED)
  -> /crm/loan-offer (OFFER_ACCEPTED)
  -> /crm/credit-approval (APPROVED)
  -> /crm/disbursement (READY_FOR_TRANSFER)
  -> /crm/transaction (TRANSFERRED or failure)
  -> /crm/manage-loans (All tab; Active tab expects ACTIVE or TRANSFERRED)
```

**This is not currently one connected, end-to-end flow.** The first queue uses API data, while the subsequent stage pages use a browser-local Zustand store populated with demo applications. A new API lead therefore does not automatically reach KYC, gold evaluation, or Manage Loans. Also, the transaction page sets `TRANSFERRED`, but no active page action changes it to `ACTIVE`.

## Data and page architecture

| Layer | Current implementation | Consequence |
| --- | --- | --- |
| Public lead | [`ApplyForm.jsx`](src/components/pages/apply/ApplyForm.jsx) calls [`createPublicApplication`](src/lib/services/applicationService.js), `POST /api/public/applications` | A successful submit displays the returned application ID. No OTP step is implemented in this form. |
| CRM lead and pending list | [`CreateCustomer.jsx`](src/components/crm/create-customer/CreateCustomer.jsx) uses `POST /crm/applications` and `GET /crm/applications?status=PENDING` through the Axios client | Public and CRM leads are intended to enter this same pending list. The backend implementation is outside this repository, so its persistence and status rules cannot be verified here. |
| Later CRM stages | [`loanStore.js`](src/lib/store/loanStore.js) holds `applications`, seeded from [`mockLoans.js`](src/lib/data/mockLoans.js) and persisted under `gold-loan-crm-data-v2` in browser storage | KYC, follow-up, gold evaluation, offer, credit, disbursement, transaction, dashboard, and Manage Loans read a different collection from Create Customer. Changes are local to that browser. |
| CRM access | [`layout.jsx`](src/app/crm/(authenticated)/layout.jsx) checks [`authAdminStore.js`](src/lib/store/authAdminStore.js); [`Sidebar.jsx`](src/components/crm/Sidebar.jsx) filters links by permissions | Login gates the CRM layout. Menu visibility does not itself connect the two application data sources. |
| Status vocabularies | [`crm.js`](src/lib/constants/crm.js) defines string statuses for the mock flow; [`applicationStatus.js`](src/utils/applicationStatus.js) defines numeric IDs for older API services | These are separate models. A label or status ID in an older service should not be assumed to move a row in the current mock screens. |

The API URL defaults to `http://localhost:4000/api` in `applicationService.js` unless `NEXT_PUBLIC_API_URL` is set. This repo contains client calls, not the implementation of those two creation endpoints.

## Step-by-step page movement

| Step | Page and list condition | User action and resulting state | Next visible place |
| --- | --- | --- | --- |
| 1a. Website entry | `/apply`; name and mobile required, optional DOB, branch, state, city, PIN, email | Submit calls `POST /api/public/applications`; success shows reference ID | Intended: `/crm/create-customer` pending API list. The public user stays on `/apply`. |
| 1b. Staff entry | `/crm/create-customer` → **New Lead** modal; name and mobile required, email and purpose optional | Save calls `POST /crm/applications`, then refetches the pending list | `/crm/create-customer`, provided the API returns it for `status=PENDING`. |
| 2. Pending queue | `/crm/create-customer` calls `GET /crm/applications` with `status=PENDING`, pagination, search, and dates | Row shows App ID, source, name, mobile, purpose, status, and a `tel:` Call link | There is **no row link to KYC, status editor, or follow-up action** in [`CreateCustomerTableRow.jsx`](src/components/crm/create-customer/CreateCustomerTableRow.jsx). Calling does not save a call outcome. |
| 3. KYC | `/crm/kyc/[id]` and `/crm/user-kyc/[id]` render [`KYCPage.jsx`](src/components/crm/kyc/KYCPage.jsx) | The form finds `id` **only in `loanStore.applications`**, saves customer details there, then selects `PENDING`, `UNDER_REVIEW`, `FOLLOW_UP`, `REJECTED`, or `KYC_VERIFIED` | `KYC_VERIFIED` redirects to Gold Evaluation; `FOLLOW_UP` to Follow-Up; `REJECTED` to Rejected Applications; `PENDING`/`UNDER_REVIEW` to Create Customer. An API-only ID is “Application not found.” |
| 4. Follow-up exception | `/crm/follow-up` filters local applications to `FOLLOW_UP` | Row's KYC Verification button links back to `/crm/kyc/[id]`; form can choose a new status | Back to KYC, then to the selected route. The visible Call button is just `tel:`; it does not record a call. |
| 5. Gold evaluation | `/crm/gold-evaluation` filters local applications to **exactly** `KYC_VERIFIED`; row opens `/crm/gold-evaluation/[id]` | Detail page records gold items, rates/LTV and notes. Submit sets `GOLD_EVALUATED`; reject sets `REJECTED`; save pending sets `PENDING_EVALUATION` | `GOLD_EVALUATED` redirects to Loan Offer. `PENDING_EVALUATION` disappears from the Gold Evaluation list, because that list only includes `KYC_VERIFIED`. |
| 6. Loan offer | `/crm/loan-offer` filters to **exactly** `GOLD_EVALUATED` | Modal checks amount against eligibility and records rate, tenure, fee, repayment type and note. Accept calls `generateOffer` (`OFFER_PENDING`) then `acceptOffer` (`OFFER_ACCEPTED`); reject sets `REJECTED`; save pending sets `OFFER_PENDING` | Accepted case appears in Credit Approval. A saved `OFFER_PENDING` case disappears from this page because its filter only includes `GOLD_EVALUATED`. |
| 7. Credit approval | `/crm/credit-approval` filters to **exactly** `OFFER_ACCEPTED`; row opens `/crm/credit-approval/[id]` | Checklist and approved amount must pass checks. Approve sets `APPROVED`; reject sets `REJECTED`; “send back for review” actually sets `GOLD_EVALUATED` | Approved case redirects to Disbursement. Send-back returns to Loan Offer list, **not** Gold Evaluation, despite the confirmation text. |
| 8. Disbursement preparation | `/crm/disbursement` filters to **exactly** `APPROVED` | Modal records signature type, transfer mode and account details; sets `READY_FOR_TRANSFER` and a randomly generated `lockerId` | Case leaves Disbursement and appears in Transaction. This action prepares a transfer; it does not execute one. |
| 9. Transaction | `/crm/transaction` includes `READY_FOR_TRANSFER` and rows with transaction success/failure | Finance confirms a reference ID; page writes transaction `SUCCESS` and application `TRANSFERRED`. Failure writes transaction `FAILED` but application remains `READY_FOR_TRANSFER` | `TRANSFERRED` is visible in Manage Loans **All and Active tabs**. No current page action moves it to `ACTIVE`. |
| 10. Manage Loans | `/crm/manage-loans` reads **all local applications** for the All tab, including drafts and rejected cases | Active tab includes `ACTIVE` and `TRANSFERRED`; Overdue tab includes `OVERDUE` and `NPA`; Closed tab includes `CLOSED` | Manage Loans is a summary/view page, not a terminal queue created by an API handoff. Its All tab includes records from every stage. |

The exact stage filters above come from the mounted page components, especially [`GoldEvaluation.jsx`](src/components/crm/gold-evaluation/GoldEvaluation.jsx), [`LoanOffer.jsx`](src/components/crm/loan-offer/LoanOffer.jsx), [`CreditApproval.jsx`](src/components/crm/credit-approval/CreditApproval.jsx), [`Disbursement.jsx`](src/components/crm/disbursement/Disbursement.jsx), [`Transaction.jsx`](src/components/crm/transaction/Transaction.jsx), and [`ManageLoan.jsx`](src/components/crm/manage-loans/ManageLoan.jsx). The broader `*_QUEUE` constants and helper services are not always used by those pages.

## Exceptions and after disbursement

- **Rejected:** Gold Evaluation, Loan Offer, and Credit Approval can set `REJECTED`; KYC can select it too. `/crm/rejected-applications` shows local rejected rows and can restore the `previousStatus` (or `PENDING`) through [`Rejectedpage.jsx`](src/components/crm/rejected-applications/Rejectedpage.jsx). KYC's direct `setStatus` call does not supply a rejection reason or stage.
- **Follow-up:** KYC can set `FOLLOW_UP`. The Follow-Up page has a KYC link, but no visible action to update a call outcome or next follow-up date. A separate [`followupService.js`](src/lib/services/followupService.js) contains call-log helpers, but the mounted list does not call them.
- **Active, overdue, NPA, closed:** `/crm/active-loans` computes servicing display status for local `ACTIVE`, `OVERDUE`, or `NPA` rows. `/crm/overdue-loans` redirects to its Overdue tab; `/crm/closed-loans` redirects to Manage Loans. [`paymentService.js`](src/lib/services/paymentService.js) can set `CLOSED` after a full/foreclosure payment or zero outstanding, and otherwise updates the stored servicing status. These paths need an `ACTIVE` record, which the current transaction page does not create.
- **Other operations:** Collection, payment history, vault, gold release, reports and dashboard use the local store. The dashboard pipeline is therefore not a count of the API pending leads.

## Why a newly created lead does not flow through today

1. `CreateCustomer.jsx` writes/reads the API collection; `KYCPage.jsx` looks up only the local store. There is no API-to-store import or API-backed KYC read in this mounted flow.
2. The pending row provides no link to `/crm/kyc/[id]`. Even entering that URL manually fails for an API-only ID.
3. The `/crm/user-kyc/new` route mounts `KYCPage` without an ID. The component does not implement a new-application branch, so this route does not bridge the gap.
4. Several saved or returned statuses fall outside their page's exact filter (`PENDING_EVALUATION`, `OFFER_PENDING`, and credit's send-back case).
5. Transfer success sets `TRANSFERRED`, while the servicing pages and `paymentService` expect `ACTIVE` for collection. Manage Loans nevertheless lists `TRANSFERRED` in Active.

For a connected production flow, the application ID and record must be shared across every stage, with one authoritative status model. The pending row needs an action that opens KYC; each stage needs a list filter that includes its saved/in-progress states; and successful transfer needs to establish the active loan state. These are implementation gaps observed in code, not backend behavior verified at runtime.

## Source map

- Entry/API: [`ApplyForm.jsx`](src/components/pages/apply/ApplyForm.jsx), [`CreateCustomer.jsx`](src/components/crm/create-customer/CreateCustomer.jsx), [`NewLeadModal.jsx`](src/components/crm/create-customer/NewLeadModal.jsx), [`applicationService.js`](src/lib/services/applicationService.js).
- Local data/status: [`loanStore.js`](src/lib/store/loanStore.js), [`crm.js`](src/lib/constants/crm.js), [`mockLoans.js`](src/lib/data/mockLoans.js), [`applicationStatus.js`](src/utils/applicationStatus.js).
- Mounted stage actions: [`KYCPage.jsx`](src/components/crm/kyc/KYCPage.jsx), [`gold-evaluation/[id]/page.jsx`](src/app/crm/(authenticated)/gold-evaluation/[id]/page.jsx), [`LoanOffer.jsx`](src/components/crm/loan-offer/LoanOffer.jsx), [`credit-approval/[id]/page.jsx`](src/app/crm/(authenticated)/credit-approval/[id]/page.jsx), [`Disbursement.jsx`](src/components/crm/disbursement/Disbursement.jsx), [`Transaction.jsx`](src/components/crm/transaction/Transaction.jsx), [`ManageLoan.jsx`](src/components/crm/manage-loans/ManageLoan.jsx).
