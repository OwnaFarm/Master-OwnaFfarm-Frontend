/**
 * OwnaFarm NFT Contract Configuration
 * Contract Address: 0xC51601dde25775bA2740EE14D633FA54e12Ef6C7
 * Network: Mantle Sepolia
 */

export const OWNA_FARM_NFT_ADDRESS = '0xC51601dde25775bA2740EE14D633FA54e12Ef6C7' as const

export const OWNA_FARM_NFT_ABI = [
    {
        inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
        name: 'approveInvoice',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
        name: 'rejectInvoice',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'offset', type: 'uint256' },
            { internalType: 'uint256', name: 'limit', type: 'uint256' },
        ],
        name: 'getPendingInvoices',
        outputs: [
            { internalType: 'uint256[]', name: 'ids', type: 'uint256[]' },
            {
                components: [
                    { internalType: 'address', name: 'farmer', type: 'address' },
                    { internalType: 'uint128', name: 'targetFund', type: 'uint128' },
                    { internalType: 'uint128', name: 'fundedAmount', type: 'uint128' },
                    { internalType: 'uint16', name: 'yieldBps', type: 'uint16' },
                    { internalType: 'uint32', name: 'duration', type: 'uint32' },
                    { internalType: 'uint32', name: 'createdAt', type: 'uint32' },
                    { internalType: 'enum OwnaFarmNFT.InvoiceStatus', name: 'status', type: 'uint8' },
                    { internalType: 'bytes32', name: 'offtakerId', type: 'bytes32' },
                ],
                internalType: 'struct OwnaFarmNFT.Invoice[]',
                name: 'data',
                type: 'tuple[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getPendingCount',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        name: 'invoices',
        outputs: [
            { internalType: 'address', name: 'farmer', type: 'address' },
            { internalType: 'uint128', name: 'targetFund', type: 'uint128' },
            { internalType: 'uint128', name: 'fundedAmount', type: 'uint128' },
            { internalType: 'uint16', name: 'yieldBps', type: 'uint16' },
            { internalType: 'uint32', name: 'duration', type: 'uint32' },
            { internalType: 'uint32', name: 'createdAt', type: 'uint32' },
            { internalType: 'enum OwnaFarmNFT.InvoiceStatus', name: 'status', type: 'uint8' },
            { internalType: 'bytes32', name: 'offtakerId', type: 'bytes32' },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
            { indexed: true, internalType: 'address', name: 'approver', type: 'address' },
        ],
        name: 'InvoiceApproved',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
            { indexed: true, internalType: 'address', name: 'rejector', type: 'address' },
        ],
        name: 'InvoiceRejected',
        type: 'event',
    },
] as const

// Mantle Sepolia Chain ID
export const MANTLE_SEPOLIA_CHAIN_ID = 5003
