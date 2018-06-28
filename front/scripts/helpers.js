
export function getAccounts() {
    return new Promise((resolve, reject) => {
        web3.eth.getAccounts((err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data[0]);
        })
    })
}