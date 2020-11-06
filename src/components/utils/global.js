import { atom } from 'recoil';

export const isInventory = atom({
    key: 'isInventory', // unique ID (with respect to other atoms/selectors)
    default: false, // default value (aka initial value)
});