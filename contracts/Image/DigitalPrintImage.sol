pragma solidity ^0.4.23;

import "./ImageToken.sol";
import "../Utils/Functions.sol";
import "../IAssetManager.sol";
import "../UserManager.sol";


contract DigitalPrintImage is ImageToken, Functions, UserManager {

    struct ImageMetadata {
        uint finalSeed;
        bytes32[] potentialAssets;
        uint timestamp;
        address creator;
        string ipfsHash;
        string title;
    }

    mapping(uint => bool) public seedExists;
    mapping(uint => ImageMetadata) public imageMetadata;
    mapping(uint => string) public idToIpfsHash;

    address public marketplaceContract;
    IAssetManager public assetManager;

    modifier onlyMarketplaceContract() {
        require(msg.sender == address(marketplaceContract));
        _;
    }

    /// @dev only for testing purposes
    // function createImageTest() public returns(uint) {
    //     return createImage(msg.sender);
    // }

    /// @notice Function will create new image
    /// @dev owner of image will be msg.sender, and timestamp will be automatically generated
    /// @dev _txHash and _timestamp together with keccak256 will give us randomSeed for user
    /// @param _randomHashIds is array of random hashes from our array
    /// @param _timestamp is timestamp when image is created
    /// @param _iterations is number of how many times he generated random asset positions until he liked what he got
    /// @param _potentialAssets is set of all potential assets user selected for an image
    /// @param _author is nickname of image owner
    /// @param _ipfsHash is ipfsHash of the image .png
    /// @param _title of image user is creating
    /// @return returns id of created image
    function createImage(
        uint[] _randomHashIds,
        uint _timestamp,
        uint _iterations,
        bytes32[] _potentialAssets,
        string _author,
        string _ipfsHash,
        string _title) public payable returns (uint) {
        require(_potentialAssets.length <= 5);
        // if user exists send his username, if it doesn't check for some username that doesn't exists
        require(msg.sender == usernameToAddress[_author] || !usernameExists[_author]);

        // if user doesn't exists create that user with no profile picture
        if (!usernameExists[_author]) {
            register(_author, "0x0");
        }

        uint finalSeed = uint(getFinalSeed(calculateSeed(_randomHashIds, _timestamp), _iterations));

        require(seedExists[finalSeed] == false);

        uint[] memory pickedAssets;

        (pickedAssets, , , , , ) = pickRandomAssets(finalSeed, _potentialAssets);

        uint[] memory pickedAssetPacks = assetManager.pickUniquePacks(pickedAssets);
        uint finalPrice = 0;

        for (uint i = 0; i < pickedAssetPacks.length; i++) {
            if (assetManager.checkHasPermissionForPack(msg.sender, pickedAssetPacks[i]) == false) {
                finalPrice += assetManager.getAssetPackPrice(pickedAssetPacks[i]);

                assetManager.buyAssetPack.value(assetManager.getAssetPackPrice(pickedAssetPacks[i]))(msg.sender, pickedAssetPacks[i]);
            }
        }
        
        require(msg.value >= finalPrice);

        uint id = createImage(msg.sender);

        imageMetadata[id] = ImageMetadata({
            finalSeed: finalSeed,
            potentialAssets: _potentialAssets,
            timestamp: _timestamp,
            creator: msg.sender,
            ipfsHash: _ipfsHash,
            title: _title
        });

        idToIpfsHash[id] = _ipfsHash;
        seedExists[finalSeed] = true;
        return id;
    }

    /// @notice Function to calculate final price for an image based on selected assets
    /// @param _pickedAssets is array of picked packs
    /// @param _owner is address of image owner
    /// @return finalPrice for the image
    function calculatePrice(uint[] _pickedAssets, address _owner) public view returns (uint) {
        if (_pickedAssets.length == 0) {
            return 0;
        }

        uint[] memory pickedAssetPacks = assetManager.pickUniquePacks(_pickedAssets);
        uint finalPrice = 0;
        for (uint i = 0; i < pickedAssetPacks.length; i++) {
            if (assetManager.checkHasPermissionForPack(_owner, pickedAssetPacks[i]) == false) {
                finalPrice += assetManager.getAssetPackPrice(pickedAssetPacks[i]);
            }
        }

        return finalPrice;
    }

    function getImageMetadata(uint _imageId) public view returns(uint, bytes32[], uint, string, address, string, string) {
        require(_imageId < numOfImages);

        ImageMetadata memory metadata = imageMetadata[_imageId];

        return(
            metadata.finalSeed,
            metadata.potentialAssets,
            metadata.timestamp,
            addressToUser[metadata.creator].username,
            ownerOf(_imageId),
            metadata.ipfsHash,
            metadata.title
        );

    }

    /// @notice adds marketplace address to contract only if it doesn't already exist
    /// @param _marketplaceContract address of marketplace contract
    function addMarketplaceContract(address _marketplaceContract) public onlyOwner {
        // not required while on testnet
        // @dev require(address(marketplaceContract) == 0x0);
        marketplaceContract = _marketplaceContract;
    }

    /// @notice approving image to be taken from specific address
    /// @param _from address from which we transfer image
    /// @param _to address that we give permission to take image
    /// @param _imageId we are willing to give
    function transferFromMarketplace(address _from, address _to, uint256 _imageId) public onlyMarketplaceContract {
        require(tokensForOwner[_imageId] != 0x0);
        require(ownerOf(_imageId) == _from);

        tokensForApproved[_imageId] = 0x0;
        removeImage(_from, _imageId);
        addImage(_to, _imageId);

        emit Approval(_from, 0, _imageId);
        emit Transfer(_from, _to, _imageId);
    }

    /// @notice Function to add assetManager
    /// @dev during testing can be changed, after deployment to main network can be set only once
    /// @param _assetManager is address of assetManager contract
    function addAssetManager(address _assetManager) public onlyOwner {
        assetManager = IAssetManager(_assetManager);
    }

}