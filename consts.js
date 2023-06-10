import { ethers } from "ethers";

const ERC20_ADDRESSES = {
  ethereum: [
    { token: "USDC", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" },
    { token: "USDT", address: "0xdAC17F958D2ee523a2206206994597C13D831ec7" },
    { token: "USDD", address: "0x0C10bF8FcB7Bf5412187A595ab97a3609160b5c6" },
    { token: "SGETH", address: "0x72E2F4830b9E45d52F80aC08CB2bEC0FeF72eD9c" },
    { token: "DAI", address: "0x6B175474E89094C44Da98b954EedeAC495271d0F" },
    { token: "FRAX", address: "0x853d955aCEf822Db058eb8505911ED77F175b99e" },
    { token: "sUSD", address: "0x57Ab1ec28D129707052df4dF418D58a2D46d5f51" },
    { token: "LUSD", address: "0x5f98805A4E8be255a32880FDeC7F6728C6568bA0" },
    { token: "METIS", address: "0x9e32b13ce7f2e80a01932b42553652e053d6ed8e" },
  ],
  avalanche: [
    { token: "USDC", address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E" },
    { token: "USDT", address: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7" },
    { token: "FRAX", address: "0xD24C2Ad096400B6FBcd2ad8B24E7acBc21A1da64" },
  ],
  bsc: [
    { token: "BUSD", address: "0xe9e7cea3dedca5984780bafc599bd69add087d56" },
    { token: "USDT", address: "0x55d398326f99059fF775485246999027B3197955" },
    { token: "USDD", address: "0xd17479997F34dd9156Deef8F95A52D81D265be9c" },
    { token: "METIS", address: "0xe552Fb52a4F19e44ef5A967632DBc320B0820639" },
  ],
  polygon: [
    { token: "USDC", address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174" },
    { token: "USDT", address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f" },
    { token: "DAI", address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063" },
  ],
  arbitrum: [
    { token: "USDC", address: "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8" },
    { token: "USDT", address: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9" },
    { token: "SGETH", address: "0x82CbeCF39bEe528B5476FE6d1550af59a9dB6Fc0" },
    { token: "FRAX", address: "0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F" },
  ],
  optimism: [
    { token: "USDC", address: "0x7f5c764cbc14f9669b88837ca1490cca17c31607" },
    { token: "SGETH", address: "0xb69c8CBCD90A39D8D3d3ccf0a3E968511C3856A0" },
    { token: "DAI", address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1" },
    { token: "FRAX", address: "0x2E3D870790dC77A83DD1d18184Acc7439A53f475" },
    { token: "sUSD", address: "0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9" },
    { token: "LUSD", address: "0xc40F949F8a4e094D1b49a23ea9241D289B7b2819" },
  ],
  fantom: [
    { token: "USDC", address: "0x04068da6c83afcfa0e13ba15a6696662335d5b75" },
  ],
  metis: [
    { token: "METIS", address: "0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000" },
    {
      token: "metis.USDT",
      address: "0xbB06DCA3AE6887fAbF931640f67cab3e3a16F4dC",
    },
  ],
};

const chainIds = [
  { network: "ethereum", chainId: 101 },
  { network: "bsc", chainId: 102 },
  { network: "avalanche", chainId: 106 },
  { network: "polygon", chainId: 109 },
  { network: "arbitrum", chainId: 110 },
  { network: "optimism", chainId: 111 },
  { network: "fantom", chainId: 112 },
  { network: "metis", chainId: 151 },
];

const poolIds = {
  ethereum: [
    { token: "USDC", poolId: 1 },
    { token: "USDT", poolId: 2 },
    { token: "DAI", poolId: 3 },
    { token: "FRAX", poolId: 7 },
    { token: "USDD", poolId: 11 },
    { token: "ETH", poolId: 13 },
    { token: "sUSD", poolId: 14 },
    { token: "LUSD", poolId: 15 },
    { token: "MAI", poolId: 16 },
    { token: "METIS", poolId: 17 },
    { token: "metis.USDT", poolId: 19 },
  ],
  bsc: [
    { token: "USDT", poolId: 2 },
    { token: "BUSD", poolId: 5 },
    { token: "USDD", poolId: 11 },
    { token: "MAI", poolId: 16 },
    { token: "METIS", poolId: 17 },
    { token: "metis.USDT", poolId: 19 },
  ],
  avalanche: [
    { token: "USDC", poolId: 1 },
    { token: "USDT", poolId: 2 },
    { token: "FRAX", poolId: 7 },
    { token: "MAI", poolId: 16 },
    { token: "metis.USDT", poolId: 19 },
  ],
  polygon: [
    { token: "USDC", poolId: 1 },
    { token: "USDT", poolId: 2 },
    { token: "DAI", poolId: 3 },
    { token: "MAI", poolId: 16 },
  ],
  arbitrum: [
    { token: "USDC", poolId: 1 },
    { token: "USDT", poolId: 2 },
    { token: "FRAX", poolId: 7 },
    { token: "ETH", poolId: 13 },
    { token: "LUSD", poolId: 15 },
    { token: "MAI", poolId: 16 },
  ],
  optimism: [
    { token: "USDC", poolId: 1 },
    { token: "DAI", poolId: 3 },
    { token: "FRAX", poolId: 7 },
    { token: "ETH", poolId: 13 },
    { token: "sUSD", poolId: 14 },
    { token: "LUSD", poolId: 15 },
    { token: "MAI", poolId: 16 },
  ],
  fantom: [{ token: "USDC", poolId: 1 }],
  metis: [
    { token: "METIS", poolId: 17 },
    {
      token: "metis.USDT",
      poolId: 19,
    },
  ],
};

const routerAddresses = {
  ethereum: {
    native: "0x150f94B44927F078737562f0fcF3C95c01Cc2376",
    tokens: "0x8731d54E9D02c286767d56ac03e8037C07e01e98",
  },
  arbitrum: {
    native: "0xbf22f0f184bCcbeA268dF387a49fF5238dD23E40",
    tokens: "0x53Bf833A5d6c4ddA888F69c22C88C9f356a41614",
  },
  optimism: {
    native: "0xB49c4e680174E331CB0A7fF3Ab58afC9738d5F8b",
    tokens: "0xB0D502E938ed5f4df2E681fE6E419ff29631d62b",
  },
  // bsc: {
  //   tokens: "0x4a364f8c717cAAD9A442737Eb7b8A55cc6cf18D8",
  // },
  // avalanche: {
  //   tokens: "0x45A01E4e04F14f7A4a6702c74187c5F6222033cd",
  // },
  // polygon: {
  //   tokens: "0x45A01E4e04F14f7A4a6702c74187c5F6222033cd",
  // },
};

const providers = {
  ethereum: "https://eth.llamarpc.com",
  arbitrum: "https://endpoints.omniatech.io/v1/arbitrum/one/public",
  optimism: "https://optimism.publicnode.com",
  polygon: "https://polygon.llamarpc.com",
  ////////////////////////////////
};

export { ERC20_ADDRESSES, chainIds, routerAddresses, providers, poolIds };
