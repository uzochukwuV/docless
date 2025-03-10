// Copyright © Aptos
// SPDX-License-Identifier: Apache-2.0

import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

export const LocalStorageKeys = {
  keylessAccounts: "@aptos-connect/keyless-accounts",
};




export const devnetClient = new Aptos(
  new AptosConfig({ network: Network.DEVNET, })
);

export const moduleAddress = "862f910d4a2dd198805f94e4d9a568f642fa510c46521a11abb1d2941a4eddb9"