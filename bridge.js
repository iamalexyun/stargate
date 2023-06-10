import { Wallet, ethers } from "ethers";
import { routerETHABI } from "./abi/routerETHABI.js";
import { routerABI } from "./abi/routerABI.js";
import {
  ERC20_ADDRESSES,
  chainIds,
  poolIds,
  providers,
  routerAddresses,
} from "./consts.js";
import chalk from "chalk";
import { ERC20ABI } from "./abi/ERC20ABI.js";
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

  //retrieving rpc url for src chain
  const rpcUrl = providers[detectedSrcChain.network];

  //provider instance
  const RPC_PROVIDER = new ethers.JsonRpcProvider(rpcUrl);

  //signer from pk
  const signer = new ethers.Wallet(pkey, RPC_PROVIDER);
  const { address } = signer;
  console.log(chalk.magenta(address));

  console.log("SOURCE CHAIN:", chalk.green(detectedSrcChain.network));
  console.log("SOURCE TOKEN:", chalk.green(tokenIn));
  console.log("AMOUNT:", chalk.green(qty, tokenIn));
  console.log("SLIPPAGE:", chalk.green(slippage + "%"));

  const detectedDstChain = chainIds.find(
    (chain) => chain.chainId === dstChainId
  );
  console.log("DESTINATION CHAIN:", chalk.green(detectedDstChain.network));
  console.log("DESTINATION TOKEN:", chalk.green(tokenOut));

  const routerAddress = routerAddresses[detectedSrcChain.network].tokens;
  const routerContract = new ethers.Contract(
    routerAddress,
    routerABI,
    RPC_PROVIDER
  );
  const feeData = await RPC_PROVIDER.getFeeData();
  const { gasPrice } = feeData;
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
    const routerETHContract = new ethers.Contract(
      routerETHAddress,
      routerETHABI,
      RPC_PROVIDER
    );

    const params = [dstChainId, address, address, amountInWei, amountOutMin];

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
    console.log(
      `Bridging ${chalk.green(qty)} ETH from ${chalk.green(
        detectedSrcChain.network
      )} to ${chalk.green(detectedDstChain.network)}`
    );
    // const swapETH = await routerETHContract.connect(signer).swapETH(...params, {
    //   value: amountInWei + LZFee,
    //   gasPrice: gasPrice,
    //   gasLimit: estimatedGas,
    // });
    // console.log(swapETH.hash);
  } else {
    const srcPoolId = poolIds[detectedSrcChain.network].find(
      (item) => item.token === tokenIn
    ).poolId;
    const dstPoolId = poolIds[detectedDstChain.network].find(
      (item) => item.token === tokenOut
    ).poolId;

    const srcTokenAddress = ERC20_ADDRESSES[detectedSrcChain.network].find(
      (item) => item.token === tokenIn
    ).address;

    const srcTokenContract = new ethers.Contract(
      srcTokenAddress,
      ERC20ABI,
      RPC_PROVIDER
    );
    const decimals = await srcTokenContract.decimals();
    const srcTokenBalance = await srcTokenContract.balanceOf(address);
    const amountInWei = ethers.parseUnits(qty, decimals);
    const amountOutMin =
      amountInWei - (amountInWei * BigInt(slippage)) / BigInt("100");
    console.log(
      "AMOUNT OUT MIN:",
      chalk.green(ethers.formatUnits(amountOutMin, decimals), tokenOut)
    );
    //cheching allowance
    let allowance = await srcTokenContract.allowance(address, routerAddress);

    if (allowance < srcTokenBalance) {
      console.log("Approving");
      const approve = await srcTokenContract
        .connect(signer)
        .approve(routerAddress, srcTokenBalance);
      console.log(approve.hash);
      await new Promise((r) => setTimeout(r, 10000));
    }
    allowance = await srcTokenContract.allowance(address, routerAddress);

    //we can add some feedback from the loop to get the idea of whats going on

    while (allowance < srcTokenBalance) {
      allowance = await srcTokenContract.allowance(address, routerAddress);
      await new Promise((r) => setTimeout(r, 5000));
    }

    const params = [
      dstChainId,
      srcPoolId,
      dstPoolId,
      address,
      amountInWei,
      amountOutMin,
      {
        dstGasForCall: 0,
        dstNativeAmount: 0,
        dstNativeAddr: "0x0000000000000000000000000000000000000001",
      },
      address,
      "0x",
    ];

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
    console.log(params);
    const estimatedGas = await routerContract
      .connect(signer)
      .swap.estimateGas(...params, {
        value: LZFee,
      });
    console.log(estimatedGas);
    const swap = await routerContract.connect(signer).swap(...params, {
      value: LZFee,
      gasPrice: gasPrice,
      gasLimit: estimatedGas,
    });
    console.log(swap.hash);
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

bridgeToken(111, "USDC", 110, "USDT", "0.5", "1", "");
