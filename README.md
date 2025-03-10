# zkLogin Document Sharing

This project implements a **document-sharing** system leveraging **zkLogin** for authentication and **Polyhedra Expander Proof System** for secure proof generation. Additionally, a **smart contract built in Aptos Move** manages document sharing operations.

## **Features**
- **Decentralized Authentication:** Uses zkLogin for seamless, private authentication.
- **Zero-Knowledge Proofs:** Ensures document security with Polyhedra Expander Proofs.
- **Aptos Move Smart Contract:** Handles document management and access control.
- **End-to-End Encryption:** Guarantees that only authorized users can access shared documents.
- **Tamper-Proof Sharing:** Utilizes cryptographic proofs to ensure document integrity.

## **Smart Contract Functions**
The smart contract, built in **Aptos Move**, includes the following core functions:
- **`add_document(document_id, owner, metadata)`** → Stores the document reference on-chain.
- **`verify_access(document_id, user)`** → Checks if a user has access to a document.
- **`grant_access(document_id, recipient)`** → Allows the owner to grant access to a document.
- **`revert_access(document_id, recipient)`** → Revokes a recipient's access to a document.

## **Getting Started**

### **1. Prerequisites**
Ensure you have the following installed:
- Node.js (v18+)
- Bun.js (package manager)
- Vite (for local development)
- Google Cloud Account (for OAuth setup)
- Aptos CLI & Move Compiler (for deploying and interacting with the smart contract)

### **2. Configuring Google OAuth**
Follow these steps to set up Google OAuth for zkLogin:
1. Go to [Google Cloud Console](https://console.cloud.google.com/) and sign in.
2. Click the **project dropdown menu** and create/select a project.
3. Search for **OAuth consent screen** and complete the setup.
4. Navigate to **Credentials** > **Create Credentials** > **OAuth client ID**.
5. Select **Web application** as the application type.
6. Add the following URLs:
   - **Authorized JavaScript origins:** `http://localhost:5173`
   - **Authorized redirect URIs:** `http://localhost:5173/callback`
7. Click **Create** and copy the **Client ID**.
8. Paste the **Client ID** in `src/config/constants.ts`.

### **3. Installation**
Run the following commands:
```bash
bun i # Install dependencies
bun dev # Start the local development server
```
The app will be available at `http://localhost:5173`.

### **4. Deploying the Smart Contract**
1. Install the Aptos CLI and configure your Aptos account:
   ```bash
   aptos init
   ```
2. Move into the contract directory and compile:
   ```bash
   move build
   ```
3. Deploy the contract to Aptos:
   ```bash
   aptos move publish --profile default
   ```
4. Verify the deployment and interact using Aptos CLI or frontend integration.

## **Usage**
1. **User Login:** zkLogin handles authentication via Google OAuth.
2. **Upload Documents:** Users can securely upload documents to the platform.
3. **Add Documents On-Chain:** Calls `add_document` in the Aptos Move contract.
4. **Grant & Revoke Access:** Uses `grant_access` and `revert_access` for permissions.
5. **Verify Document Access:** Calls `verify_access` to check user permissions.
6. **Generate Proofs:** Uses Polyhedra Expander Proof System to validate document integrity.

## **Technology Stack**
- **zkLogin**: Decentralized authentication mechanism.
- **Polyhedra Expander Proof System**: Zero-knowledge proofs for document verification.
- **Aptos Move Smart Contract**: Manages document storage and access control.
- **Vite + Bun.js**: Frontend development setup.
- **Google OAuth**: Identity provider for authentication.

## **Contributing**
Contributions are welcome! Follow these steps:
1. Fork the repository.
2. Create a new branch (`feature/your-feature`).
3. Commit your changes.
4. Push to the branch and open a Pull Request.

## **License**
This project is licensed under the MIT License.

