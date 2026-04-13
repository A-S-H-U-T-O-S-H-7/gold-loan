Apis
const myHeaders = new Headers();
myHeaders.append("Accept", "application/json");
myHeaders.append("Authorization", "Bearer xxxzI");

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.atdmoney.in/api/crm/application/completed", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
response
{
    "success": true,
    "message": "Completed applications fetched successfully",
    "data": [
        {
            "application_id": 1,
            "enquiry_date": "2026-03-23 18:19:32",
            "complete_date": "2026-03-23",
            "complete_time": "06:19:32 PM",
            "approved_amount": "0.00",
            "gold_amount": "0.00",
            "roi": null,
            "tenure": null,
            "loan_term": null,
            "loan_status": 2,
            "approval_note": "NEW CUSTOMER",
            "verify": 0,
            "report_check": 0,
            "totl_final_report": null,
            "user_id": 1,
            "crnno": "S01AM126",
            "fullname": "Satyendra Sharma",
            "dob": "2002-08-01",
            "gender": "Male",
            "phone": "9569584126",
            "email": "satyendra.alltimedata@gmail.com",
            "blacklist": 0,
            "blacklistdate": null,
            "address_id": 1,
            "house_no": "C-316",
            "address": "New Asho Nagar",
            "state": "Delhi",
            "city": "Delhi",
            "pincode": "110096",
            "current_house_no": "C-316",
            "current_address": "New Asho Nagar",
            "current_state": "Delhi",
            "current_city": "Delhi",
            "current_pincode": "110096",
            "document_id": 1,
            "selfie": "https://api.atdmoney.in/storage/customers/photo/2026/03/photo_8d8fc8b8-0c83-4cf4-94a9-9d1195ad1849.jpg",
            "pan_proof": "https://api.atdmoney.in/storage/customers/pancard/2026/03/pan_card_bdcd14b7-58d0-4667-b672-4951073dd84a.jpg",
            "aadhar_proof": "https://api.atdmoney.in/storage/customers/aadhar_front/2026/03/aadhar_front_d2e85364-2b82-4e76-be1c-d45a90544ee8.png",
            "address_proof": "https://api.atdmoney.in/storage/customers/aadhar_back/2026/03/aadhar_back_8aadb843-45e0-47a8-ab86-8c910f551113.jpg"
        }
    ],
    "pagination": {
        "total": 1,
        "current_page": 1,
        "per_page": 10,
        "total_pages": 1
    }
}

follow up
const myHeaders = new Headers();
myHeaders.append("Accept", "application/json");
myHeaders.append("Authorization", "Bearer xxxI");

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.atdmoney.in/api/crm/application/followup", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
{
    "success": true,
    "message": "Follow-Up applications fetched successfully",
    "data": [
        {
            "application_id": 1,
            "enquiry_date": "2026-03-23 18:19:32",
            "complete_date": "2026-03-23",
            "complete_time": "06:19:32 PM",
            "approved_amount": "0.00",
            "gold_amount": "0.00",
            "roi": null,
            "tenure": null,
            "loan_term": null,
            "loan_status": 4,
            "approval_note": "NEW CUSTOMER",
            "verify": 0,
            "report_check": 0,
            "totl_final_report": null,
            "user_id": 1,
            "crnno": "S01AM126",
            "fullname": "Satyendra Sharma",
            "dob": "2002-08-01",
            "gender": "Male",
            "phone": "9569584126",
            "email": "satyendra.alltimedata@gmail.com",
            "blacklist": 0,
            "blacklistdate": null,
            "house_no": "C-316",
            "address": "New Asho Nagar",
            "state": "Delhi",
            "city": "Delhi",
            "pincode": "110096",
            "current_house_no": "C-316",
            "current_address": "New Asho Nagar",
            "current_state": "Delhi",
            "current_city": "Delhi",
            "current_pincode": "110096",
            "document_id": 1,
            "selfie": "https://api.atdmoney.in/storage/customers/photo/2026/03/photo_8d8fc8b8-0c83-4cf4-94a9-9d1195ad1849.jpg",
            "pan_proof": "https://api.atdmoney.in/storage/customers/pancard/2026/03/pan_card_bdcd14b7-58d0-4667-b672-4951073dd84a.jpg",
            "aadhar_proof": "https://api.atdmoney.in/storage/customers/aadhar_front/2026/03/aadhar_front_d2e85364-2b82-4e76-be1c-d45a90544ee8.png",
            "address_proof": "https://api.atdmoney.in/storage/customers/aadhar_back/2026/03/aadhar_back_8aadb843-45e0-47a8-ab86-8c910f551113.jpg"
        }
    ],
    "pagination": {
        "total": 1,
        "current_page": 1,
        "per_page": 10,
        "total_pages": 1
    }
}

const myHeaders = new Headers();
myHeaders.append("Accept", "application/json");
myHeaders.append("Authorization", "Bearer xxzI");
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "status": 4,
  "remark": "ergtdrgadgshsfadghadg"
});

const requestOptions = {
  method: "PUT",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.atdmoney.in/api/crm/application/status/1", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
{
    "success": true,
    "message": "Application status updated successfully."
}

inprogress
const myHeaders = new Headers();
myHeaders.append("Accept", "application/json");
myHeaders.append("Authorization", "Bearer xxxI");

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.atdmoney.in/api/crm/application/inprocess", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
{
    "success": true,
    "message": "In-Process applications fetched successfully",
    "data": [
        {
            "application_id": 1,
            "enquiry_date": "2026-03-23 18:19:32",
            "complete_date": "2026-03-23",
            "complete_time": "06:19:32 PM",
            "approved_amount": "0.00",
            "gold_amount": "0.00",
            "roi": null,
            "tenure": null,
            "loan_term": null,
            "loan_status": 5,
            "approval_note": "NEW CUSTOMER",
            "verify": 0,
            "report_check": 0,
            "totl_final_report": null,
            "user_id": 1,
            "crnno": "S01AM126",
            "fullname": "Satyendra Sharma",
            "dob": "2002-08-01",
            "gender": "Male",
            "phone": "9569584126",
            "email": "satyendra.alltimedata@gmail.com",
            "blacklist": 0,
            "blacklistdate": null,
            "address_id": 1,
            "house_no": "C-316",
            "address": "New Asho Nagar",
            "state": "Delhi",
            "city": "Delhi",
            "pincode": "110096",
            "current_house_no": "C-316",
            "current_address": "New Asho Nagar",
            "current_state": "Delhi",
            "current_city": "Delhi",
            "current_pincode": "110096",
            "document_id": 1,
            "selfie": "https://api.atdmoney.in/storage/customers/photo/2026/03/photo_8d8fc8b8-0c83-4cf4-94a9-9d1195ad1849.jpg",
            "pan_proof": "https://api.atdmoney.in/storage/customers/pancard/2026/03/pan_card_bdcd14b7-58d0-4667-b672-4951073dd84a.jpg",
            "aadhar_proof": "https://api.atdmoney.in/storage/customers/aadhar_front/2026/03/aadhar_front_d2e85364-2b82-4e76-be1c-d45a90544ee8.png",
            "address_proof": "https://api.atdmoney.in/storage/customers/aadhar_back/2026/03/aadhar_back_8aadb843-45e0-47a8-ab86-8c910f551113.jpg"
        }
    ],
    "pagination": {
        "total": 1,
        "current_page": 1,
        "per_page": 10,
        "total_pages": 1
    }
}

edit
const myHeaders = new Headers();
myHeaders.append("Accept", "application/json");
myHeaders.append("Authorization", "Bearer xxxuzI");

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.atdmoney.in/api/crm/appraisal/edit/1", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
{
    "success": true,
    "message": "Appraisal report data fetched successfully.",
    "application": {
        "user_id": 1,
        "crnno": "S01AM126",
        "fullname": "Satyendra Sharma",
        "dob": "2002-08-01",
        "gender": "Male",
        "phone": "9569584126",
        "email": "satyendra.alltimedata@gmail.com",
        "alt_mobile": null,
        "pan_no": "AMLPV5184B",
        "aadhar_no": "222222222222",
        "house_no": "C-316",
        "address": "New Asho Nagar",
        "state": "Delhi",
        "city": "Delhi",
        "pincode": "110096",
        "current_house_no": "C-316",
        "current_address": "New Asho Nagar",
        "current_city": "Delhi",
        "current_state": "Delhi",
        "current_pincode": "110096",
        "id": 1,
        "loan_no": null,
        "gold_amount": "500000.00",
        "approved_amount": "200000.00",
        "roi": "0.000",
        "tenure": 12,
        "loan_term": 4,
        "dw_collection": "0.00",
        "emi_collection": "0.00",
        "grace_period": 0,
        "process_fee": "0.00",
        "approved_date": null,
        "address_id": 1,
        "approval_note": "NEW CUSTOMER",
        "nominee_name": "Ashutosh Mohanty",
        "nominee_relation": "Friend",
        "nominee_dob": "2012-05-02",
        "nominee_gender": "Male",
        "nominee_mobile": "9999999999",
        "nominee_email": "ashutosh.alltimedata@gmail.com",
        "nominee_aadhar_no": "888888888888",
        "nominee_pan_no": "AMLPV5365B",
        "bank_name": "ICICI Bank",
        "branch_name": "New Delhi",
        "account_type": "SAVING",
        "account_no": "0015355454",
        "ifsc_code": "ICIC0000017",
        "bankVerif": 0,
        "appraisal": null,
        "golds": [
            {
                "id": 2,
                "branch_id": 2,
                "admin_id": 1,
                "application_id": 1,
                "gold_type": "Jewellery",
                "item_name": "Necklace",
                "purity": "22K",
                "gross_weight": 15.5,
                "stone_weight": 0.5,
                "net_weight": 15,
                "rate_per_gram": 6500,
                "market_value": 97500,
                "appraised_value": 90000,
                "loan_value": 75000,
                "conditions": "Good",
                "hallmark_no": "BIS22K123456",
                "receipt_no": "REC2026030001",
                "remarks": "Gold necklace in good condition",
                "pictures": null,
                "status": "Pending",
                "verify_by": null,
                "created_at": "2026-03-24T08:13:27.000000Z",
                "updated_at": "2026-03-24T08:13:27.000000Z",
                "pictures_url": []
            },
            {
                "id": 3,
                "branch_id": 2,
                "admin_id": 1,
                "application_id": 1,
                "gold_type": "Jewellery",
                "item_name": "Necklace",
                "purity": "22K",
                "gross_weight": 15.5,
                "stone_weight": 0.5,
                "net_weight": 15,
                "rate_per_gram": 6500,
                "market_value": 97500,
                "appraised_value": 90000,
                "loan_value": 75000,
                "conditions": "Good",
                "hallmark_no": "BIS22K123456",
                "receipt_no": "REC2026030001",
                "remarks": "Gold necklace in good condition",
                "pictures": null,
                "status": "Pending",
                "verify_by": null,
                "created_at": "2026-03-24T08:13:29.000000Z",
                "updated_at": "2026-03-24T08:13:29.000000Z",
                "pictures_url": []
            },
            {
                "id": 4,
                "branch_id": 2,
                "admin_id": 1,
                "application_id": 1,
                "gold_type": "Jewellery",
                "item_name": "Necklace",
                "purity": "22K",
                "gross_weight": 15.5,
                "stone_weight": 0.5,
                "net_weight": 15,
                "rate_per_gram": 6500,
                "market_value": 97500,
                "appraised_value": 90000,
                "loan_value": 75000,
                "conditions": "Good",
                "hallmark_no": "BIS22K123456",
                "receipt_no": "REC2026030001",
                "remarks": "Gold necklace in good condition",
                "pictures": "[\"customers\\/gold\\/pictures\\/2026\\/03\\/gold_0a52eaaf-4cae-4819-8cc1-f13c6d500edd.jpg\"]",
                "status": "Pending",
                "verify_by": null,
                "created_at": "2026-03-24T08:22:06.000000Z",
                "updated_at": "2026-03-24T08:22:06.000000Z",
                "pictures_url": [
                    "https://api.atdmoney.in/storage/customers/gold/pictures/2026/03/gold_0a52eaaf-4cae-4819-8cc1-f13c6d500edd.jpg"
                ]
            }
        ]
    }
}

eligibility button will be gold evaluation kardo jo api de rakha hai

appraisal me midification hoga and action as it rahne do organization ki jagah nominee dikh do
