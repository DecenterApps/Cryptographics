pragma solidity ^0.4.23;

contract IAssetManager {
    function createAssetPack(bytes32 _packCover, string _name, uint[] _attributes, bytes32[] _ipfsHashes, uint _packPrice) public;
    function createAsset(uint _attributes, bytes32 _ipfsHash, uint _packId) public;
    function buyAssetPack(uint _assetPackId) public payable;
    function getNumberOfAssets() public view returns (uint);
    function getNumberOfAssetPacks() public view returns(uint);
    function checkHasPermissionForPack(address _address, uint _packId) public view returns (bool);
    function checkHashExists(bytes32 _ipfsHash) public view returns (bool);
    function givePermission(address _address, uint _packId) public;
    function pickUniquePacks(uint [] assetIds) public view returns (uint[]);
    function getAssetInfo(uint id) public view returns (uint, uint, bytes32);
    function getAssetPacksUserCreated(address _address) public view returns(uint[]);
    function getAssetIpfs(uint _id) public view returns (bytes32);
    function getAssetAttributes(uint _id) public view returns (uint);
    function getIpfsForAssets(uint [] _ids) public view returns (bytes32[]);
    function getAttributesForAssets(uint [] _ids) public view returns(uint[]);
    function withdraw() public;
    function getAssetPackData(uint _assetPackId) public view returns(string, uint[], uint[], bytes32[]);
    function getAssetPackName(uint _assetPackId) public view returns (string);
    function getAssetPackPrice(uint _assetPackId) public view returns (uint);
    function getCoversForPacks(uint [] _packIds) public view returns (bytes32[]);
}
