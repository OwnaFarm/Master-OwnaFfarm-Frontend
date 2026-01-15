'use client'

import { useCallback } from 'react'
import { useWriteContract, useAccount } from 'wagmi'
import { useSwitchChain } from 'wagmi'
import {
    OWNA_FARM_NFT_ADDRESS,
    OWNA_FARM_NFT_ABI,
    MANTLE_SEPOLIA_CHAIN_ID
} from '@/lib/contracts/owna-farm-nft'
import { createPublicClient, http } from 'viem'
import { mantleSepoliaTestnet } from 'viem/chains'

export interface Invoice {
    tokenId: bigint
    farmer: string
    targetFund: bigint
    fundedAmount: bigint
    yieldBps: number
    duration: number
    createdAt: number
    status: number // 0=Pending, 1=Approved, 2=Rejected, 3=Funded, 4=Completed
    offtakerId: string
}

export interface ContractStats {
    totalSubmitted: number
    pendingCount: number
    approvedCount: number
    // Rejected = totalSubmitted - pendingCount - approvedCount (approximately)
}

// Create a dedicated public client for Mantle Sepolia
const mantleSepoliaClient = createPublicClient({
    chain: mantleSepoliaTestnet,
    transport: http(),
})

export function useAdminContract() {
    const { writeContractAsync, isPending } = useWriteContract()
    const { switchChainAsync } = useSwitchChain()
    const { chainId } = useAccount()

    // Fetch contract stats
    const fetchStats = useCallback(async (): Promise<ContractStats> => {
        try {
            const [nextTokenId, pendingCount, availableCount] = await Promise.all([
                mantleSepoliaClient.readContract({
                    address: OWNA_FARM_NFT_ADDRESS,
                    abi: OWNA_FARM_NFT_ABI,
                    functionName: 'nextTokenId',
                }),
                mantleSepoliaClient.readContract({
                    address: OWNA_FARM_NFT_ADDRESS,
                    abi: OWNA_FARM_NFT_ABI,
                    functionName: 'getPendingCount',
                }),
                mantleSepoliaClient.readContract({
                    address: OWNA_FARM_NFT_ADDRESS,
                    abi: OWNA_FARM_NFT_ABI,
                    functionName: 'getAvailableCount',
                }),
            ])

            // nextTokenId starts at 1, so total submitted = nextTokenId - 1
            const totalSubmitted = Number(nextTokenId) - 1

            return {
                totalSubmitted: totalSubmitted > 0 ? totalSubmitted : 0,
                pendingCount: Number(pendingCount),
                approvedCount: Number(availableCount),
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error)
            return { totalSubmitted: 0, pendingCount: 0, approvedCount: 0 }
        }
    }, [])

    // Fetch pending invoices from contract
    const fetchPendingInvoices = useCallback(async (offset: number = 0, limit: number = 100): Promise<Invoice[]> => {
        try {
            const result = await mantleSepoliaClient.readContract({
                address: OWNA_FARM_NFT_ADDRESS,
                abi: OWNA_FARM_NFT_ABI,
                functionName: 'getPendingInvoices',
                args: [BigInt(offset), BigInt(limit)],
            })

            const [ids, data] = result as [bigint[], any[]]

            return ids.map((tokenId, index) => ({
                tokenId,
                farmer: data[index].farmer,
                targetFund: data[index].targetFund,
                fundedAmount: data[index].fundedAmount,
                yieldBps: Number(data[index].yieldBps),
                duration: Number(data[index].duration),
                createdAt: Number(data[index].createdAt),
                status: Number(data[index].status),
                offtakerId: data[index].offtakerId,
            }))
        } catch (error) {
            console.error('Failed to fetch pending invoices:', error)
            return []
        }
    }, [])

    // Fetch approved (available) invoices from contract
    const fetchApprovedInvoices = useCallback(async (offset: number = 0, limit: number = 100): Promise<Invoice[]> => {
        try {
            const result = await mantleSepoliaClient.readContract({
                address: OWNA_FARM_NFT_ADDRESS,
                abi: OWNA_FARM_NFT_ABI,
                functionName: 'getAvailableInvoices',
                args: [BigInt(offset), BigInt(limit)],
            })

            const [ids, data] = result as [bigint[], any[]]

            return ids.map((tokenId, index) => ({
                tokenId,
                farmer: data[index].farmer,
                targetFund: data[index].targetFund,
                fundedAmount: data[index].fundedAmount,
                yieldBps: Number(data[index].yieldBps),
                duration: Number(data[index].duration),
                createdAt: Number(data[index].createdAt),
                status: Number(data[index].status),
                offtakerId: data[index].offtakerId,
            }))
        } catch (error) {
            console.error('Failed to fetch approved invoices:', error)
            return []
        }
    }, [])

    // Approve invoice
    const approveInvoice = useCallback(async (tokenId: bigint): Promise<string> => {
        // Switch chain if needed
        if (chainId !== MANTLE_SEPOLIA_CHAIN_ID) {
            await switchChainAsync({ chainId: MANTLE_SEPOLIA_CHAIN_ID })
        }

        const txHash = await writeContractAsync({
            address: OWNA_FARM_NFT_ADDRESS,
            abi: OWNA_FARM_NFT_ABI,
            functionName: 'approveInvoice',
            args: [tokenId],
            chainId: MANTLE_SEPOLIA_CHAIN_ID,
        })

        // Wait for confirmation
        await mantleSepoliaClient.waitForTransactionReceipt({
            hash: txHash,
            confirmations: 1,
        })

        return txHash
    }, [writeContractAsync, switchChainAsync, chainId])

    // Reject invoice
    const rejectInvoice = useCallback(async (tokenId: bigint): Promise<string> => {
        // Switch chain if needed
        if (chainId !== MANTLE_SEPOLIA_CHAIN_ID) {
            await switchChainAsync({ chainId: MANTLE_SEPOLIA_CHAIN_ID })
        }

        const txHash = await writeContractAsync({
            address: OWNA_FARM_NFT_ADDRESS,
            abi: OWNA_FARM_NFT_ABI,
            functionName: 'rejectInvoice',
            args: [tokenId],
            chainId: MANTLE_SEPOLIA_CHAIN_ID,
        })

        // Wait for confirmation
        await mantleSepoliaClient.waitForTransactionReceipt({
            hash: txHash,
            confirmations: 1,
        })

        return txHash
    }, [writeContractAsync, switchChainAsync, chainId])

    return {
        fetchStats,
        fetchPendingInvoices,
        fetchApprovedInvoices,
        approveInvoice,
        rejectInvoice,
        isLoading: isPending,
    }
}
