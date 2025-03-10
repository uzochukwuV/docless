import { useState } from 'react';
import { encryptFile, hashKey } from './encryption';
import { ipfsService } from './ipfs';
import { Account, AccountAuthenticatorEd25519, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { devnetClient } from '../../../core/constants';
import { useKeylessAccounts } from '../../../core/useKeylessAccounts';

export const useDocumentEncryption = () => {
  const [isUploading, setIsUploading] = useState(false);
//   const config = new AptosConfig({ network: Network.LOCAL });
  
  const {activeAccount} = useKeylessAccounts()
  

  const uploadDocument = async (file: File) => {
    try {
      setIsUploading(true);
      const bob = Account.generate();
      alert(devnetClient.keyless.config.network)
        
    console.log(bob.accountAddress.toString())
    
      
      // Step 1: Encrypt the file
      const { encryptedFile, key } = await encryptFile(file);
      const keyHash = hashKey(key);

      // Step 2: Upload to IPFS
      const ipfsHash = await ipfsService.uploadFile( new File(["hello world!"], "hello.txt", { type: "text/plain" }));
        console.log(ipfsHash)
        console.log(activeAccount?.accountAddress.toString())
      // Step 3: Store metadata on chain
      
      
      const response = await devnetClient.transaction.build.simple({
        sender: activeAccount?.accountAddress!,
        data: {
            function: `862f910d4a2dd198805f94e4d9a568f642fa510c46521a11abb1d2941a4eddb9::document_sharing::add_document`,
            functionArguments: [
                file.name,
                ipfsHash,
                keyHash,
            ],
        },
        
      });

      const signedTx = await activeAccount?.signTransaction(response);
     
      signedTx?.ephemeralSignature.toString()

      // Store the encryption key securely (you might want to use a more secure method)
      localStorage.setItem(`key_${file.name}`, key);

      return { success: true, documentId: file.name };
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadDocument, isUploading };
};