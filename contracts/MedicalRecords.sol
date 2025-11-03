// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title MedicalRecords
 * @notice A blockchain-based medical records access control system
 * @dev Allows patients to upload medical record metadata and manage doctor access permissions
 */
contract MedicalRecords {
    /**
     * @dev Struct to store medical record metadata
     */
    struct Record {
        string id;                      // Unique record identifier
        string hash;                    // Hash of the actual medical record file
        address owner;                  // Address of the patient who owns the record
        mapping(address => bool) accessList;  // Mapping of doctor addresses to access permissions
        uint256 timestamp;              // Timestamp when the record was uploaded
    }

    // Mapping from record ID to Record struct
    mapping(string => Record) public records;
    
    // Mapping to check if a record exists
    mapping(string => bool) public recordExists;

    /**
     * @dev Event emitted when a new medical record is uploaded
     */
    event RecordUploaded(
        address indexed owner,
        string indexed id,
        uint256 time
    );

    /**
     * @dev Event emitted when access is granted to a doctor
     */
    event AccessGranted(
        string indexed id,
        address indexed doctor,
        uint256 time
    );

    /**
     * @dev Event emitted when access is revoked from a doctor
     */
    event AccessRevoked(
        string indexed id,
        address indexed doctor,
        uint256 time
    );

    /**
     * @notice Upload a new medical record
     * @param id Unique identifier for the medical record
     * @param hash Hash of the medical record file (stored off-chain)
     * @dev Only the owner (patient) can upload records for themselves
     */
    function uploadRecord(string memory id, string memory hash) public {
        require(bytes(id).length > 0, "Record ID cannot be empty");
        require(bytes(hash).length > 0, "Hash cannot be empty");
        require(!recordExists[id], "Record with this ID already exists");

        Record storage newRecord = records[id];
        newRecord.id = id;
        newRecord.hash = hash;
        newRecord.owner = msg.sender;
        newRecord.timestamp = block.timestamp;

        recordExists[id] = true;

        emit RecordUploaded(msg.sender, id, block.timestamp);
    }

    /**
     * @notice Grant access to a doctor for a specific medical record
     * @param id The record ID to grant access for
     * @param doctor The address of the doctor to grant access to
     * @dev Only the record owner (patient) can grant access
     */
    function grantAccess(string memory id, address doctor) public {
        require(recordExists[id], "Record does not exist");
        require(records[id].owner == msg.sender, "Only record owner can grant access");
        require(doctor != address(0), "Invalid doctor address");
        require(!records[id].accessList[doctor], "Access already granted");

        records[id].accessList[doctor] = true;

        emit AccessGranted(id, doctor, block.timestamp);
    }

    /**
     * @notice Revoke access from a doctor for a specific medical record
     * @param id The record ID to revoke access for
     * @param doctor The address of the doctor to revoke access from
     * @dev Only the record owner (patient) can revoke access
     */
    function revokeAccess(string memory id, address doctor) public {
        require(recordExists[id], "Record does not exist");
        require(records[id].owner == msg.sender, "Only record owner can revoke access");
        require(doctor != address(0), "Invalid doctor address");
        require(records[id].accessList[doctor], "Access not granted");

        records[id].accessList[doctor] = false;

        emit AccessRevoked(id, doctor, block.timestamp);
    }

    /**
     * @notice Check if a user (doctor) has access to a specific medical record
     * @param id The record ID to check access for
     * @param user The address of the user (doctor) to check access for
     * @return bool True if the user has access, false otherwise
     * @dev This is a view function, can be called by anyone without gas cost
     */
    function checkAccess(string memory id, address user) public view returns (bool) {
        if (!recordExists[id]) {
            return false;
        }
        return records[id].accessList[user];
    }

    /**
     * @notice Get basic information about a medical record
     * @param id The record ID to retrieve information for
     * @return recordId The record identifier
     * @return hash The hash of the medical record
     * @return owner The address of the record owner
     * @return timestamp The timestamp when the record was uploaded
     */
    function getRecordInfo(string memory id) public view returns (
        string memory recordId,
        string memory hash,
        address owner,
        uint256 timestamp
    ) {
        require(recordExists[id], "Record does not exist");
        Record storage record = records[id];
        return (record.id, record.hash, record.owner, record.timestamp);
    }
}

