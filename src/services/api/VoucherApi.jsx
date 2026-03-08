const VoucherApi = {
    getActiveVoucher: async () => {
        let api = "http://localhost:8080/api/vouchers/public";
        const response = await fetch(api, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        return json.data;
    }
}
export default VoucherApi;