pragma solidity ^0.4.23;
import "./Utils/Ownable.sol";


contract AssetManager is Ownable {

    struct Asset {
        uint id;
        /// atributes field is going to be 3 digit uint where every digit can be "1" or "2"
        /// 1st digit will tell us if asset is background 1 - true / 2 - false
        /// 2nd digit will tell us if rotation is enabled 1 - true / 2 - false
        /// 3rd digit will tell us if scaling  is enabled 1 - true / 2 - false
        uint attributes;
        address creator;
        bytes32 ipfsHash;
        uint price;
    }

    struct AssetPack {
        bytes32 packCover;
        string name;
        uint [] assetIds;
        address creator;
        uint price;
    }


    uint numberOfAssets;
    uint numberOfAssetPacks;


    Asset [] assets;
    AssetPack [] assetPacks;

    mapping(address => string) username;
    mapping(address => bytes32) profilePicture;
    mapping(string => bool) usernameExists;
    mapping(bytes32 => bool) profilePictureExists;

    mapping(address => uint) artistBalance;
    mapping(address => mapping(uint => bool)) hasPermission;
    mapping(bytes32 => bool) hashExists;

    mapping(address => uint[]) boughtAssets;
    mapping(address => uint[]) createdAssets;
    mapping(address => uint[]) createdAssetPacks;

    /// @notice Function to add username
    /// @dev username needs to be unique
    /// @param username is username of user
    function addUserName(string username) {
        require(username != "");
        require(usernameExists[username] == false);
        username[msg.sender] = username;
    }

    /// @notice Function to add profile picture
    /// @dev profile picture needs to be unique needs to be unique
    /// @param ipfsHashToImage is ipfs hash to profile image of user
    function addProfilePicture(bytes32 ipfsHashToImage) {
        require(profilePictureExists[ipfsHashToImage] == false);
        profilePicture[msg.sender] = ipfsHashToImage;
    }

    /// @notice Funtion to allow user if he wants to upload both profile image and username to do it in one trnx
    /// @param username is username
    /// @param ipfsHashToImage is ipfs hash of image
    function uploadInfo(string username, bytes32 ipfsHashToImage) {
        addUserName(username);
        addProfilePicture(ipfsHashToImage);
    }

    /// @notice Function to create assetpack
    /// @dev ADD ATTRIBUTES VALIDATION
    /// @param _packCover is cover image for asset pack
    /// @param _name is name of the asset pack
    /// @param _attributes is array of attributes
    /// @param _ipfsHashes is array containing all ipfsHashes for assets we'd like to put in pack
    /// @param _packPrice is price for total assetPack (every asset will have average price)
    function createAssetPack(bytes32 _packCover, string _name, uint[] _attributes, bytes32[] _ipfsHashes, uint _packPrice) public {
        require(_ipfsHashes.length > 0);
        require(_ipfsHashes.length < 50);
        require(_attributes.length < 50);

        uint assetPrice = _packPrice / _ipfsHashes.length;
        uint[] memory ids = new uint[](_ipfsHashes.length);

        for(uint i=0; i< _ipfsHashes.length; i++){
            ids[i] = numberOfAssets;
            createAsset(_attributes[i], _ipfsHashes[i], assetPrice);
        }

        assetPacks.push(AssetPack({
            packCover: _packCover,
            name: _name,
            assetIds: ids,
            creator: msg.sender,
            price: _packPrice
            }));

        createdAssetPacks[msg.sender].push(numberOfAssetPacks);
        numberOfAssetPacks++;
    }

    /// @notice Function which creates an asset
    /// @dev this method will be internal/private later in production
    /// @dev id is automatically generated, and it's it's position in array which holds all assets, also, creator of asset is msg.sender
    /// @dev add attributes validation
    /// @param _attributes is meta info for asset
    /// @param _ipfsHash is ipfsHash to image of asset
    /// @param _price is price of asset
    function createAsset(uint _attributes, bytes32 _ipfsHash, uint _price) public {
        require(hashExists[_ipfsHash] == false);
        require(_price > 0);

        assets.push(Asset({
            id : numberOfAssets,
            attributes: _attributes,
            creator : msg.sender,
            ipfsHash : _ipfsHash,
            price : _price
            }));

        createdAssets[msg.sender].push(numberOfAssets);
        hasPermission[msg.sender][numberOfAssets] = true;
        hashExists[_ipfsHash] = true;
        numberOfAssets++;
    }

    /// @notice Function where user can buy himself a permission to use all assets in one assetPack
    /// @dev msg.value will be
    /// @param _assetPackId is id of asset pack we'd like to buy
    function buyAssetPack(uint _assetPackId) public payable {
        AssetPack memory assetPack = assetPacks[_assetPackId];
        uint price = 0;
        uint assetPrice = assetPack.price / assetPack.assetIds.length;
        for(uint i=0; i<assetPack.assetIds.length; i++){
            if(hasPermission[msg.sender][assetPack.assetIds[i]] == false) {
                boughtAssets[msg.sender].push(assetPack.assetIds[i]);
                hasPermission[msg.sender][assetPack.assetIds[i]] = true;
                price += assetPrice;
            }
        }
        require(msg.value >= price);
        artistBalance[assetPack.creator] += price;
    }

    /// @notice Function where user can buy himself a permission to use an asset
    /// @dev msg.value will be sent to asset creator
    /// @param _assetId is id of asset user wants to buy
    function buyAssetPermision(uint _assetId) public payable {
        require(msg.value >= assets[_assetId].price);
        boughtAssets[msg.sender].push(_assetId);
        hasPermission[msg.sender][_assetId] = true;
        artistBalance[assets[_assetId].creator] += msg.value;
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
            if(hasPermission[_address][_pickedAssets[i]] == false ){
                boughtAssets[_address].push(_pickedAssets[i]);
                hasPermission[_address][_pickedAssets[i]] = true;
                artistBalance[assets[_pickedAssets[i]].creator] += assets[_pickedAssets[i]].price;
            }
        }
    }
    /// @notice Method to get all info for an asset
    /// @param id is id of asset
    /// @return All data for an asset
    function getAssetInfo(uint id) public view returns (uint, uint, address, bytes32, uint){
        require(id >= 0);
        require(id < numberOfAssets);
        Asset memory asset = assets[id];

        return (asset.id, asset.attributes, asset.creator, asset.ipfsHash, asset.price);
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

    /// @notice Function to get attributes for selected asset
    /// @param _id is id of asset we'd like to get ipfs hash
    /// @return uint representation of attributes of that asset
    function getAssetAttributes(uint _id) public view returns (uint) {
        require(_id < numberOfAssets);
        Asset memory asset = assets[_id];
        return asset.attributes;
    }

    /// @notice Function to get array of ipfsHashes for specific assets
    /// @dev need for data parsing on frontend efficiently
    /// @param _ids is array of ids
    /// @return bytes32 array of hashes
    function getIpfsForAssets(uint [] _ids) public view returns (bytes32[]) {
        bytes32[] memory hashes = new bytes32[](_ids.length);
        for(uint i=0; i<_ids.length; i++) {
            Asset memory asset = assets[_ids[i]];
            hashes[i] = asset.ipfsHash;
        }

        return hashes;
    }

    function getAttributesForAssets(uint [] _ids) public view returns(uint[]) {
        uint[] memory attributes = new uint[](_ids.length);
        for(uint i=0; i< _ids.length; i++) {
            Asset memory asset = assets[_ids[i]];
            attributes[i] = asset.attributes;
        }
        return attributes;
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
    function getAssetPackData(uint _assetPackId) public view returns(string, uint[], uint[], bytes32[]){
        require(_assetPackId < numberOfAssetPacks);

        AssetPack memory assetPack = assetPacks[_assetPackId];
        bytes32[] memory hashes = new bytes32[](assetPack.assetIds.length);

        for(uint i=0; i<assetPack.assetIds.length; i++){
            hashes[i] = getAssetIpfs(assetPack.assetIds[i]);
        }
        uint[] memory attributes = getAttributesForAssets(assetPack.assetIds);

        return(assetPack.name, assetPack.assetIds, attributes, hashes);
    }

    /// @notice Function to get name for asset pack
    /// @param _assetPackId is id of asset pack
    /// @return string name of asset pack
    function getAssetPackName(uint _assetPackId) public view returns (string) {
        require(_assetPackId < numberOfAssetPacks);

        AssetPack memory assetPack = assetPacks[_assetPackId];

        return assetPack.name;
    }

    /// @notice Function to get first image of every pack which will represent it
    /// @param _packIds is array of asset pack ids
    /// @return bytes32[] array of hashes
    function getHoverImagesForAssetPacks(uint [] _packIds) public view returns (bytes32[]) {
        require(_packIds.length > 0);
        bytes32[] memory hashes = new bytes32[](_packIds.length);
        for(uint i=0; i<_packIds.length; i++) {
            AssetPack memory assetPack = assetPacks[_packIds[i]];
            hashes[i] = getAssetIpfs(assetPack.assetIds[0]);
        }
        return hashes;
    }

    /// @notice Function to get cover image for every assetpack
    /// @param _packIds is array of asset pack ids
    /// @return bytes32[] array of hashes
    function getCoversForPacks(uint [] _packIds) public view returns (bytes32[]) {
        require(_packIds.length > 0);
        bytes32[] memory covers = new bytes32[](_packIds.length);
        for(uint i=0; i<_packIds.length; i++) {
            AssetPack memory assetPack = assetPacks[_packIds[i]];
            covers[i] = assetPack.packCover;
        }
        return covers;
    }

    function getAssetsUserHaveInPack(uint packId, address _userAddress) public view returns (uint[]) {
        AssetPack memory assetPack = assetPacks[packId];
        uint[] memory ownedAssets = new uint[](assetPack.assetIds.length);
        uint counter = 0;
        for(uint i=0; i<assetPack.assetIds.length; i++) {
            if(hasPermission[_userAddress][assetPack.assetIds[i]] == true) {
                ownedAssets[counter] = assetPack.assetIds[i];
            }
        }
        return ownedAssets;
    }
    /// @notice Function to get owned assets from one pack and pack size
    /// @param _assetPacksIds is array with ids of asset packs we need information for
    /// @param _userAddress is address of user we are checking this
    /// @return two arrays one containing how many assets we have and second containing packs size
    function getOwnedAssetsFromPacks(uint [] _assetPacksIds, address _userAddress) public view returns (uint[],uint[]) {
        uint [] memory ownedAssets = new uint[](_assetPacksIds.length);
        uint [] memory totalInPack = new uint[](_assetPacksIds.length);
        uint counter = 0;
        for(uint i=0; i< _assetPacksIds.length; i++) {
            AssetPack memory assetPack = assetPacks[_assetPacksIds[i]];
            for(uint j=0; j<assetPack.assetIds.length; j++) {
                if(hasPermission[_userAddress][assetPack.assetIds[j]] == true) {
                    counter++;
                }
            }
            ownedAssets[i] = counter;
            totalInPack[i] = assetPack.assetIds.length;
            counter = 0;
        }

        return (ownedAssets, totalInPack);
    }
}