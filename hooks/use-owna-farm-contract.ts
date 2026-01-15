'use client'

import { useCallback } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, usePublicClient } from 'wagmi'
import { OWNA_FARM_NFT_ADDRESS, OWNA_FARM_NFT_ABI, MANTLE_SEPOLIA_CHAIN_ID } from '@/lib/contracts/owna-farm-nft'

export interface UseOwnaFarmContractReturn {
    approveInvoice: (tokenId: bigint) => Promise<`0x${string}`>
    rejectInvoice: (tokenId: bigint) => Promise<`0x${string}`>
    waitForTransaction: (hash: `0x${string}`) => Promise<void>
    isLoading: boolean
    error: Error | null
}

export function useOwnaFarmContract() {
    const { writeContractAsync, isPending, error } = useWriteContract()
    const publicClient = usePublicClient()

    const approveInvoice = useCallback(async (tokenId: bigint): Promise<`0x${string}`> => {
        const hash = await writeContractAsync({
            address: OWNA_FARM_NFT_ADDRESS,
            abi: OWNA_FARM_NFT_ABI,
            functionName: 'approveInvoice',
            args: [tokenId],
            chainId: MANTLE_SEPOLIA_CHAIN_ID,
        })
        return hash
    }, [writeContractAsync])

    const rejectInvoice = useCallback(async (tokenId: bigint): Promise<`0x${string}`> => {
        const hash = await writeContractAsync({
            address: OWNA_FARM_NFT_ADDRESS,
            abi: OWNA_FARM_NFT_ABI,
            functionName: 'rejectInvoice',
            args: [tokenId],
            chainId: MANTLE_SEPOLIA_CHAIN_ID,
        })
        return hash
    }, [writeContractAsync])

    const waitForTransaction = useCallback(async (hash: `0x${string}`): Promise<void> => {
        if (!publicClient) throw new Error('Public client not available')

        await publicClient.waitForTransactionReceipt({
            hash,
            confirmations: 1,
        })
    }, [publicClient])

    return {
        approveInvoice,
        rejectInvoice,
        waitForTransaction,
        isLoading: isPending,
        error,
    }
}
