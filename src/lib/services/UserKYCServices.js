import api from "@/utils/axiosInsatnce";

const normalizeValue = (value) => (typeof value === "string" ? value.trim() : value ?? "");
const normalizeAccountType = (value) => {
    const nextValue = normalizeValue(value);
    if (!nextValue) return "Saving";
    return nextValue.charAt(0).toUpperCase() + nextValue.slice(1).toLowerCase();
};

export const userKycService = {
    // Get states list
    getStates: async () => {
        try {
            const response = await api.get("/states");
            return response;
        } catch (error) {
            console.error("Error fetching states:", error);
            throw error;
        }
    },

    // Get cities by state name
    getCities: async (stateName) => {
        try {
            const response = await api.get(`/cities?state=${encodeURIComponent(stateName)}`);
            return response;
        } catch (error) {
            console.error("Error fetching cities:", error);
            throw error;
        }
    },

    // Create new user KYC (using FormData for file uploads)
    createUserKyc: async (data) => {
        try {
            const formData = new FormData();
            
            // Personal Details
            formData.append("fullname", normalizeValue(data.fullName));
            formData.append("dob", normalizeValue(data.dob));
            formData.append("gender", normalizeValue(data.gender));
            formData.append("mobile", normalizeValue(data.mobile));
            formData.append("alt_mobile", normalizeValue(data.alternatePhone));
            formData.append("email", normalizeValue(data.email));
            formData.append("pan_no", normalizeValue(data.panNumber).toUpperCase());
            formData.append("aadhar_no", normalizeValue(data.aadharNumber));
            
            // Current Address
            formData.append("curr_house_no", normalizeValue(data.currentAddress?.houseNo));
            formData.append("curr_address", normalizeValue(data.currentAddress?.addressLine1));
            if (data.currentAddress?.addressLine2) {
                formData.append("curr_address2", normalizeValue(data.currentAddress.addressLine2));
            }
            formData.append("curr_state", normalizeValue(data.currentAddress?.state));
            formData.append("curr_city", normalizeValue(data.currentAddress?.city));
            formData.append("curr_pincode", normalizeValue(data.currentAddress?.pincode));
            
            // Permanent Address
            if (data.sameAsCurrent) {
                formData.append("per_house_no", normalizeValue(data.currentAddress?.houseNo));
                formData.append("per_address", normalizeValue(data.currentAddress?.addressLine1));
                if (data.currentAddress?.addressLine2) {
                    formData.append("per_address2", normalizeValue(data.currentAddress.addressLine2));
                }
                formData.append("per_state", normalizeValue(data.currentAddress?.state));
                formData.append("per_city", normalizeValue(data.currentAddress?.city));
                formData.append("per_pincode", normalizeValue(data.currentAddress?.pincode));
            } else {
                formData.append("per_house_no", normalizeValue(data.permanentAddress?.houseNo));
                formData.append("per_address", normalizeValue(data.permanentAddress?.addressLine1));
                if (data.permanentAddress?.addressLine2) {
                    formData.append("per_address2", normalizeValue(data.permanentAddress.addressLine2));
                }
                formData.append("per_state", normalizeValue(data.permanentAddress?.state));
                formData.append("per_city", normalizeValue(data.permanentAddress?.city));
                formData.append("per_pincode", normalizeValue(data.permanentAddress?.pincode));
            }
            
            // Bank Details
            formData.append("bank_name", normalizeValue(data.bankName));
            formData.append("branch_name", normalizeValue(data.bankBranch));
            formData.append("account_type", normalizeAccountType(data.accountType));
            formData.append("account_no", normalizeValue(data.accountNumber));
            formData.append("ifsc", normalizeValue(data.ifsc).toUpperCase());
            formData.append("account_holder_name", normalizeValue(data.accountHolderName));
            
            // Nominee Details
            formData.append("nominee_name", normalizeValue(data.nominee?.name));
            formData.append("nominee_relation", normalizeValue(data.nominee?.relation));
            formData.append("nominee_dob", normalizeValue(data.nominee?.dob));
            formData.append("nominee_gender", normalizeValue(data.nominee?.gender));
            formData.append("nominee_mobile", normalizeValue(data.nominee?.mobile));
            formData.append("nominee_email", normalizeValue(data.nominee?.email));
            formData.append("nominee_aadhar_no", normalizeValue(data.nominee?.aadharNumber));
            formData.append("nominee_pan_no", normalizeValue(data.nominee?.panNumber).toUpperCase());
            
            // KYC Documents
            if (data.aadharDocument && data.aadharDocument instanceof File) {
                formData.append("aadhar_front", data.aadharDocument);
            }
            if (data.aadharBackDocument && data.aadharBackDocument instanceof File) {
                formData.append("aadhar_back", data.aadharBackDocument);
            }
            if (data.panDocument && data.panDocument instanceof File) {
                formData.append("pan_card", data.panDocument);
            }
            if (data.livePhoto && data.livePhoto instanceof File) {
                formData.append("photo", data.livePhoto);
            }
            
            const response = await api.post("/crm/application/create", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response;
        } catch (error) {
            console.error("Error creating user KYC:", error);
            throw error;
        }
    },

    // Update existing user KYC
    updateUserKyc: async (id, data) => {
        try {
            // For update, we need to send JSON data (not FormData based on your API example)
            const payload = {
                fullname: data.fullName || "",
                dob: data.dob || "",
                gender: data.gender || "",
                current_house_no: data.currentAddress?.houseNo || "",
                current_address: data.currentAddress?.addressLine1 || "",
                current_state: data.currentAddress?.state || "",
                current_city: data.currentAddress?.city || "",
                current_pincode: data.currentAddress?.pincode || "",
                house_no: data.sameAsCurrent ? data.currentAddress?.houseNo : data.permanentAddress?.houseNo || "",
                address: data.sameAsCurrent ? data.currentAddress?.addressLine1 : data.permanentAddress?.addressLine1 || "",
                state: data.sameAsCurrent ? data.currentAddress?.state : data.permanentAddress?.state || "",
                city: data.sameAsCurrent ? data.currentAddress?.city : data.permanentAddress?.city || "",
                pincode: data.sameAsCurrent ? data.currentAddress?.pincode : data.permanentAddress?.pincode || "",
                phone: data.mobile || "",
                email: data.email || "",
                bank_name: data.bankName || "",
                branch_name: data.bankBranch || "",
                account_type: normalizeAccountType(data.accountType),
                account_no: data.accountNumber || "",
                ifsc_code: data.ifsc || "",
                panno: data.panNumber || "",
                aadharno: data.aadharNumber || "",
                crnno: data.crnNo || "",
                approval_note: data.remarks || "NEW CUSTOMER",
                nominee_name: data.nominee?.name || "",
                nominee_relation: data.nominee?.relation || "",
                nominee_dob: data.nominee?.dob || "",
                nominee_gender: data.nominee?.gender || "",
                nominee_mobile: data.nominee?.mobile || "",
                nominee_email: data.nominee?.email || "",
                nominee_aadhar_no: data.nominee?.aadharNumber || "",
                nominee_pan_no: data.nominee?.panNumber || ""
            };
            
            const response = await api.put(`/crm/application/update/${id}`, payload);
            return response;
        } catch (error) {
            console.error("Error updating user KYC:", error);
            throw error;
        }
    },

    // Get user KYC details for editing
    getUserKyc: async (id) => {
        try {
            const response = await api.get(`/crm/application/edit/${id}`);
            return response;
        } catch (error) {
            console.error("Error fetching user KYC:", error);
            throw error;
        }
    },
};

// Helper function to map API response to form values
export const mapUserKycToFormValues = (apiResponse, initialFormValues) => {
    const data = apiResponse.data || apiResponse;
    
    return {
        ...initialFormValues,
        crnNo: data.crnno || "",
        applicationId: data.application_id || "",
        userId: data.user_id || "",
        fullName: data.fullname || "",
        dob: data.dob || "",
        gender: data.gender?.toLowerCase() || "",
        mobile: data.phone || data.mobile || "",
        alternatePhone: data.alt_mobile || "",
        email: data.email || "",
        panNumber: data.pan_no || "",
        aadharNumber: data.aadhar_no || "",
        
        currentAddress: {
            houseNo: data.current_house_no || "",
            addressLine1: data.current_address || "",
            addressLine2: data.current_address2 || "",
            state: data.current_state || "",
            city: data.current_city || "",
            pincode: data.current_pincode || ""
        },
        
        permanentAddress: {
            houseNo: data.house_no || "",
            addressLine1: data.address || "",
            addressLine2: data.address2 || "",
            state: data.state || "",
            city: data.city || "",
            pincode: data.pincode || ""
        },
        
        nominee: {
            name: data.nominee_name || "",
            relation: data.nominee_relation || "",
            dob: data.nominee_dob || "",
            gender: data.nominee_gender?.toLowerCase() || "",
            mobile: data.nominee_mobile || "",
            email: data.nominee_email || "",
            aadharNumber: data.nominee_aadhar_no || "",
            panNumber: data.nominee_pan_no || ""
        },
        
        accountNumber: data.account_no || "",
        ifsc: data.ifsc_code || "",
        bankName: data.bank_name || "",
        bankBranch: data.branch_name || "",
        accountType: data.account_type || "Saving",
        accountHolderName: data.account_holder_name || "",
        
        // Document URLs (for display)
        aadharDocumentPreview: data.aadhar_front_url || "",
        aadharBackDocumentPreview: data.aadhar_back_url || "",
        panDocumentPreview: data.pan_card_url || "",
        livePhotoPreview: data.photo_url || "",
        
        kycStatus: data.kyc_status || "pending",
        remarks: data.approval_note || ""
    };
};
