// export const compareAddresses = (addr1 = '', addr2 = '') => addr1.toLowerCase() === addr2.toLowerCase();
//
// // export const getAddressStates = () => JSON.parse(localStorage.getItem(LS_CDP_SAVER_STATE) || '[]')
// // .sort((a, b) => b.lastConnected - a.lastConnected);
//
// // export const setAccountStates = (addresses) => localStorage.setItem(LS_CDP_SAVER_STATE, JSON.stringify(addresses));
//
// // const mergeLsItemDuplicates = (address) => {
// //   const addresses = getAddressStates();
// //   const duplicates = addresses
// //   .filter(item => compareAddresses(item.address, address))
// //   .sort((a, b) => a.lastConnected - b.lastConnected);
// //   if (duplicates.length) {
// //     const newAccState = duplicates.reduce((newAcc, acc) => ({
// //       ...newAcc,
// //       ...acc,
// //     }), {});
// //     const newAccounts = [
// //       ...addresses.filter(item => !compareAddresses(item.address, address)),
// //       newAccState,
// //     ];
// //     setAccountStates(newAccounts);
// //   }
// // };
//
// export const getLsExistingItemAndState = (address) => {
//   // mergeLsItemDuplicates(address);
//   let existingItem = null;
//
//   const oldStateLsVal = getAddressStates();
//
//   const existingItemIndex = oldStateLsVal.findIndex(item => compareAddresses(item.address, address));
//   if (existingItemIndex >= 0) existingItem = oldStateLsVal[existingItemIndex];
//
//   return { oldStateLsVal, existingItem, existingItemIndex };
// };
//
// export const addToLsState = (change, replace = false) => {
//   if (!change.address) throw new Error('You must send address in order to change ls state item value');
//
//   // const data = getLsExistingItemAndState(change.address);
//
//   const { existingItem, existingItemIndex } = data;
//   let { oldStateLsVal } = data;
//   let newStateVal = [];
//
//   if (!oldStateLsVal) oldStateLsVal = [];
//
//   if (!existingItem) {
//     newStateVal = [...oldStateLsVal, change];
//   } else {
//     oldStateLsVal[existingItemIndex] = replace ? { ...change } : { ...existingItem, ...change };
//     newStateVal = [...oldStateLsVal];
//   }
//
//   // setAccountStates(newStateVal);
// };
