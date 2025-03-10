module keyless_docs::document_sharing {
    use std::string::{String};
    use std::vector;
    use aptos_framework::account;
    use aptos_framework::timestamp;
    use aptos_std::table::{Self, Table};
    use std::signer;
    // Error codes
    const ENOT_AUTHORIZED: u64 = 1;
    const EDOCUMENT_NOT_FOUND: u64 = 2;
    const EINVALID_PROOF: u64 = 3;

    // Represents a document's metadata
    struct Document has store {
        id: String,
        ipfs_hash: String,
        encryption_key_hash: String, // Hash of the encryption key
        owner: address,
        created_at: u64,
        updated_at: u64
    }

    // Access control list for a document
    struct AccessControl has key {
        documents: Table<String, Document>,
        // Maps document_id -> address -> bool
        access_list: Table<String, vector<address>>,
    }

    // Initialize storage for a new account
    public entry fun initialize(account: &signer) {
        let addr = signer::address_of(account);
        if (!exists<AccessControl>(addr)) {
            move_to(account, AccessControl {
                documents: table::new(),
                access_list: table::new(),
            });
        }
    }

    // Add a new document
    public entry fun add_document(
        account: &signer,
        document_id: String,
        ipfs_hash: String,
        encryption_key_hash: String,
    ) acquires AccessControl {
        let addr = signer::address_of(account);
        let access_control = borrow_global_mut<AccessControl>(addr);
        
        let document = Document {
            id: document_id,
            ipfs_hash,
            encryption_key_hash,
            owner: addr,
            created_at: timestamp::now_seconds(),
            updated_at: timestamp::now_seconds(),
        };

        table::add(&mut access_control.documents, document_id, document);
        table::add(&mut access_control.access_list, document_id, vector::empty<address>());
    }

    // Grant access to a document
    public entry fun grant_access(
        account: &signer,
        document_id: String,
        to_address: address,
    ) acquires AccessControl {
        let addr = signer::address_of(account);
        let access_control = borrow_global_mut<AccessControl>(addr);
        
        assert!(table::contains(&access_control.documents, document_id), EDOCUMENT_NOT_FOUND);
        let document = table::borrow(&access_control.documents, document_id);
        assert!(document.owner == addr, ENOT_AUTHORIZED);

        let access_list = table::borrow_mut(&mut access_control.access_list, document_id);
        if (!vector::contains(access_list, &to_address)) {
            vector::push_back(access_list, to_address);
        };
    }

    // Verify access using ZK proof
    public fun verify_access(
        addr: address,
        document_id: String,
        // ZK proof parameters would go here
    ): bool acquires AccessControl {
        let access_control = borrow_global<AccessControl>(addr);
        
        assert!(table::contains(&access_control.documents, document_id), EDOCUMENT_NOT_FOUND);
        let document = table::borrow(&access_control.documents, document_id);
        
        if (document.owner == addr) {
            return true
        };

        let access_list = table::borrow(&access_control.access_list, document_id);
        vector::contains(access_list, &addr)
    }

    // Revoke access
    public entry fun revoke_access(
        account: &signer,
        document_id: String,
        revoke_from: address,
    ) acquires AccessControl {
        let addr = signer::address_of(account);
        let access_control = borrow_global_mut<AccessControl>(addr);
        
        assert!(table::contains(&access_control.documents, document_id), EDOCUMENT_NOT_FOUND);
        let document = table::borrow(&access_control.documents, document_id);
        assert!(document.owner == addr, ENOT_AUTHORIZED);

        let access_list = table::borrow_mut(&mut access_control.access_list, document_id);
        let (found, index) = vector::index_of(access_list, &revoke_from);
        if (found) {
            vector::remove(access_list, index);
        };
    }

    // Get document metadata
    #[view]
    public fun get_document(addr: address, document_id: String): (String, String, address, u64) acquires AccessControl {
        let access_control = borrow_global<AccessControl>(addr);
        assert!(table::contains(&access_control.documents, document_id), EDOCUMENT_NOT_FOUND);
        
        let document = table::borrow(&access_control.documents, document_id);
        (
            document.id,
            document.ipfs_hash,
            document.owner,
            document.created_at,
        )
    }
}