export type UgandaBank = {
  bankName: string
  bankSortCode: string
}

/** Uganda bank picker (name + sort code) for partner liquidations / payouts. */
export const UGANDA_BANKS: UgandaBank[] = [
  { bankName: 'Barclays (now Absa)', bankSortCode: '013847' },
  { bankName: 'Bank of Baroda', bankSortCode: '020147' },
  { bankName: 'Stanbic Bank Ltd', bankSortCode: '040147' },
  { bankName: 'DFCU Bank', bankSortCode: '050147' },
  { bankName: 'Tropical Africa Bank', bankSortCode: '060147' },
  { bankName: 'Standard Chartered Bank', bankSortCode: '080147' },
  { bankName: 'I & M Bank', bankSortCode: '110147' },
  { bankName: 'Orient Bank', bankSortCode: '110147' },
  { bankName: 'Bank of Africa', bankSortCode: '130447' },
  { bankName: 'Centenary Bank', bankSortCode: '163747' },
  { bankName: 'Crane Bank', bankSortCode: '170147' },
  { bankName: 'Cairo International Bank', bankSortCode: '180147' },
  { bankName: 'Diamond Trust Bank', bankSortCode: '190147' },
  { bankName: 'Citi Bank', bankSortCode: '220147' },
  { bankName: 'Housing Finance Bank', bankSortCode: '230147' },
  { bankName: 'Global Trust Bank', bankSortCode: '240147' },
  { bankName: 'Kenya Commercial Bank (KCB)', bankSortCode: '252947' },
  { bankName: 'United Bank for Africa (UBA)', bankSortCode: '260147' },
  { bankName: 'FINA Bank', bankSortCode: '271147' },
  { bankName: 'Ecobank', bankSortCode: '290147' },
  { bankName: 'Equity Bank', bankSortCode: '300147' },
  { bankName: 'ABC Bank', bankSortCode: '310147' },
  { bankName: 'Exim Bank', bankSortCode: '320147' },
  { bankName: 'Imperial Bank Uganda', bankSortCode: '320147' },
  { bankName: 'NC Bank', bankSortCode: '350147' },
  { bankName: 'Post Bank Uganda', bankSortCode: '560147' },
  { bankName: 'Bank of Uganda', bankSortCode: '990147' },
]

export function findUgandaBankBySortCode(
  sortCode: string,
): UgandaBank | undefined {
  const code = sortCode.trim()
  return UGANDA_BANKS.find((b) => b.bankSortCode === code)
}

export function findUgandaBankByName(name: string): UgandaBank | undefined {
  const n = name.trim().toLowerCase()
  return UGANDA_BANKS.find((b) => b.bankName.toLowerCase() === n)
}
