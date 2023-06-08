import { ethers } from "ethers";
import { routerETHABI } from "./abi/routerETHABI.js";
import { routerABI } from "./abi/routerABI.js";
import { chainIds, providers, routerAddresses } from "./consts.js";
import chalk from "chalk";
async function bridgeToken(
  srcChainId,
  tokenIn,
  dstChainId,
  tokenOut,
  qty,
  slippage,
  pkey
) {
  //detected source chain
  const detectedSrcChain = chainIds.find(
    (chain) => chain.chainId === srcChainId
  );
  console.log("SOURCE CHAIN:", chalk.green(detectedSrcChain.network));

  //detected destination chain
  const detectedDstChain = chainIds.find(
    (chain) => chain.chainId === dstChainId
  );
  console.log("DESTINATION CHAIN:", chalk.green(detectedDstChain.network));

  //retrieving rpc url for src chain
  const rpcUrl = providers[detectedSrcChain.network];

  //provider instance
  const RPC_PROVIDER = new ethers.JsonRpcProvider(rpcUrl);
  //signer from pk
  const signer = new ethers.Wallet(pkey, RPC_PROVIDER);
  const { address } = signer;
  console.log(chalk.magenta(address));

  console.log("SOURCE TOKEN:", chalk.green(tokenIn));
  console.log("AMOUNT:", chalk.green(qty, tokenIn));
  console.log("SLIPPAGE:", chalk.green(slippage + "%"));
  console.log("DESTINATION TOKEN:", chalk.green(tokenOut));
  //proceed for native token
  if (tokenIn === "ETH") {
    const amountInWei = ethers.parseEther(qty);
    const amountOutMin =
      amountInWei - (amountInWei * BigInt(slippage)) / BigInt("100");
    console.log(
      "AMOUNT OUT MIN:",
      chalk.green(ethers.formatEther(amountOutMin), tokenOut)
    );

    //router address for detected netowrk
    const routerETHAddress = routerAddresses[detectedSrcChain.network].native;
    const routerAddress = routerAddresses[detectedSrcChain.network].tokens;

    const routerETHContract = new ethers.Contract(
      routerETHAddress,
      routerETHABI,
      RPC_PROVIDER
    );
    const routerContract = new ethers.Contract(
      routerAddress,
      routerABI,
      RPC_PROVIDER
    );

    const params = [dstChainId, address, address, amountInWei, amountOutMin];

    const feeData = await RPC_PROVIDER.getFeeData();
    const { gasPrice } = feeData;
    const quoteData = await routerContract.quoteLayerZeroFee(
      dstChainId,
      1,
      address,
      "0x",
      {
        dstGasForCall: 0, // extra gas, if calling smart contract,
        dstNativeAmount: 0, // amount of dust dropped in destination wallet
        dstNativeAddr: address,
      }
    );
    const LZFee = quoteData[0];
    const estimatedGas = await routerETHContract.swapETH.estimateGas(
      ...params,
      { value: amountInWei + LZFee }
    );
    const swapETH = await routerETHContract.connect(signer).swapETH(...params, {
      value: amountInWei + LZFee,
      gasPrice: gasPrice,
      gasLimit: estimatedGas,
    });
    console.log(swapETH.hash);
  } else {
    //todo
  }
}

/**
 * @params
 * srcChainId: int
 * tokenIn: string (ticker)
 * dstChainId: int
 * tokenOut: string (ticker)
 * qty: string
 * slippage: string must be >= 1
 * pkey: string
 */

bridgeToken(111, "ETH", 110, "ETH", "0.001", "1", "");
