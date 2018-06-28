pragma solidity ^0.4.23;
import "./Utils/Ownable.sol";


contract AssetManager is Ownable {

    struct Asset {
        uint id;
        address creator;
        bytes32 ipfsHash;
        uint price;
    }

    struct AssetPack {
        uint [] assetIds;
        address creator;
        uint price;
    }


    uint numberOfAssets;
    uint numberOfAssetPacks;


    Asset [] assets;
    AssetPack [] assetPacks;

    mapping(address => uint) artistBalance;
    mapping(address => mapping(uint => bool)) hasPermission;
    mapping(bytes32 => bool) hashExists;

    mapping(address => uint[]) boughtAssets;
    mapping(address => uint[]) createdAssets;
    mapping(address => uint[]) createdAssetPacks;



    /// @notice Function to create assetpack
    /// @param _ipfsHashes is array containing all ipfsHashes for assets we'd like to put in pack
    /// @param _packPrice is price for total assetPack (every asset will have average price)
    function createAssetPack(bytes32[] _ipfsHashes, uint _packPrice) public {
        require(_ipfsHashes.length > 0);
        uint assetPrice = _packPrice / _ipfsHashes.length;
        uint[] memory ids = new uint[](_ipfsHashes.length);

        for(uint i=0; i< _ipfsHashes.length; i++){
            ids[i] = numberOfAssets;
            createAsset(_ipfsHashes[i], assetPrice);
        }

        assetPacks.push(AssetPack({
            assetIds: ids,
            creator: msg.sender,
            price: _packPrice
            }));

        createdAssetPacks[msg.sender].push(numberOfAssetPacks);
        numberOfAssetPacks++;
    }

    /// @notice Function which creates an asset
    /// @dev id is automatically generated, and it's it's position in array which holds all assets, also, creator of asset is msg.sender
    /// @param _ipfsHash is ipfsHash to image of asset
    /// @param _price is price of asset
    function createAsset(bytes32 _ipfsHash, uint _price) public {
        require(hashExists[_ipfsHash] == false);

        assets.push(Asset({
            id : numberOfAssets,
            creator : msg.sender,
            ipfsHash : _ipfsHash,
            price : _price
            }));
        createdAssets[msg.sender].push(numberOfAssets);
        hashExists[_ipfsHash] = true;
        numberOfAssets++;
    }



    /// @notice Function where user can buy himself a permision to use an asset
    /// @dev msg.value will be sent to asset creator
    /// @param _assetId is id of asset user wants to buy
    function buyAssetPermision(uint _assetId) public payable {
        require(msg.value >= assets[_assetId].price);
        boughtAssets[msg.sender].push(_assetId);
        hasPermission[msg.sender][_assetId] = true;
        assets[_assetId].creator.transfer(msg.value);
    }

    /// @notice Function to fetch total number of assets
    /// @return numberOfAssets
    function getNumberOfAssets() public view returns (uint) {
        return numberOfAssets;
    }

    /// @notice Function to fetch total number of assetpacks
    /// @return uint numberOfAssetPacks
    function getNumberOfAssetPacks() public view returns(uint) {
        return numberOfAssetPacks;
    }
    /// @notice Function to check have user bought permission for an asset
    /// @param _address is address of user
    /// @param _assetId is id of asset
    function checkHasPermission(address _address, uint _assetId) public view returns (bool){
        Asset memory asset = assets[_assetId];
        if(asset.creator == _address){
            return true;
        } else {
            return hasPermission[_address][_assetId];
        }
    }

    /// @notice Function to check does hash exist in mapping
    /// @param _ipfsHash is bytes32 representation of hash
    function checkHashExists(bytes32 _ipfsHash) public view returns (bool){
        return hashExists[_ipfsHash];
    }

    /// @notice Function to give you permission for all assets you are buying during image creation
    /// @param _address is address of buyer
    /// @param _pickedAssets is array of picked assets
    function givePermission(address _address, uint[] _pickedAssets) public {
        for(uint i=0; i<_pickedAssets.length; i++){
            if(hasPermission[_address][_pickedAssets[i]] == false){
                boughtAssets[_address].push(_pickedAssets[i]);
                hasPermission[_address][_pickedAssets[i]] = true;
                artistBalance[assets[_pickedAssets[i]].creator] += assets[_pickedAssets[i]].price;
            }
        }
    }
    /// @notice Method to get all info for an asset
    /// @param id is id of asset
    /// @return All data for an asset
    function getAssetInfo(uint id) public view returns (uint, address, bytes32, uint){
        require(id >= 0);
        require(id < numberOfAssets);
        Asset memory asset = assets[id];

        return (asset.id, asset.creator, asset.ipfsHash, asset.price);
    }


    /// @notice Method to get price of asset
    /// @param id is id of asset
    /// @return price of asset
    function getAssetPrice(uint id) public view returns (uint){
        require(id >= 0);
        require(id < numberOfAssets);

        Asset memory asset = assets[id];

        return asset.price;
    }
    /// @notice Function to get assetIds(bought) for user
    /// @param _address is address of user
    /// @return array of assetIds user has bought permission to use
    function getAssetsForUser(address _address) public view returns (uint[]) {
        return boughtAssets[_address];
    }

    /// @notice Function to get assetIds user have created
    /// @param _address is address of user (creator)
    /// @return array of assetIds user has created
    function getAssetsUserCreated(address _address) public view returns(uint[]){
        return createdAssets[_address];
    }

    function getAssetPacksUserCreated(address _address) public view returns(uint[]){
        return createdAssetPacks[_address];
    }

    /// @notice Function to get ipfsHash for selected asset
    /// @param _id is id of asset we'd like to get ipfs hash
    /// @return string representation of ipfs hash of that asset
    function getAssetIpfs(uint _id) public view returns (bytes32) {
        require(_id < numberOfAssets);
        Asset memory asset = assets[_id];
        return asset.ipfsHash;
    }

    ///@notice Function where all artists can withdraw their funds
    function withdraw() public {
        require(msg.sender != address(0));
        uint amount = artistBalance[msg.sender];

        msg.sender.transfer(amount);
    }


    /// @notice Function to get ipfs hash and id for all assets in one asset pack
    /// @param _assetPackId is id of asset pack
    /// @return two arrays with data
    function getAssetPackData(uint _assetPackId) public view returns(uint[], bytes32[]){
        require(_assetPackId < numberOfAssetPacks);

        AssetPack memory assetPack = assetPacks[_assetPackId];
        bytes32[] memory hashes = new bytes32[](assetPack.assetIds.length);

        for(uint i=0; i<assetPack.assetIds.length; i++){
            hashes[i] = getAssetIpfs(assetPack.assetIds[i]);
        }

        return(assetPack.assetIds, hashes);
    }


}