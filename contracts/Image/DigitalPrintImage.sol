pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";
import "../Utils/Functions.sol";
import "../IAssetManager.sol";
import "../UserManager.sol";
import "../Utils/Ownable.sol";

contract DigitalPrintImage is ERC721Token, UserManager, Ownable {

    struct ImageMetadata {
        uint finalSeed;
        bytes32[] potentialAssets;
        uint timestamp;
        address creator;
        string ipfsHash;
        string extraData;
    }

    mapping(uint => bool) public seedExists;
    mapping(uint => ImageMetadata) public imageMetadata;
    mapping(uint => string) public idToIpfsHash;

    address public marketplaceContract;
    IAssetManager public assetManager;
    Functions public functions;

    modifier onlyMarketplaceContract() {
        require(msg.sender == address(marketplaceContract));
        _;
    }

    event ImageCreated(uint indexed imageId, address indexed owner);
    /// @dev only for testing purposes
    function createImageTest() public {
        _mint(msg.sender, totalSupply());
    }

    constructor() public ERC721Token("DigitalPrintImage", "DPM") {}

    /// @notice Function will create new image
    /// @dev owner of image will be msg.sender, and timestamp will be automatically generated
    /// @dev _txHash and _timestamp together with keccak256 will give us randomSeed for user
    /// @param _randomHashIds is array of random hashes from our array
    /// @param _timestamp is timestamp when image is created
    /// @param _iterations is number of how many times he generated random asset positions until he liked what he got
    /// @param _potentialAssets is set of all potential assets user selected for an image
    /// @param _author is nickname of image owner
    /// @param _ipfsHash is ipfsHash of the image .png
    /// @param _extraData string containing ipfsHash that contains (frame,width,height,title,description)
    /// @return returns id of created image
    function createImage(
        uint[] _randomHashIds,
        uint _timestamp,
        uint _iterations,
        bytes32[] _potentialAssets,
        string _author,
        string _ipfsHash,
        string _extraData) public payable {
        require(_potentialAssets.length <= 5);
        // if user exists send his username, if it doesn't check for some username that doesn't exists
        require(msg.sender == usernameToAddress[_author] || !usernameExists[_author]);

        // if user doesn't exists create that user with no profile picture
        if (!usernameExists[_author]) {
            register(_author, bytes32(0));
        }

        uint[] memory pickedAssets;
        uint finalSeed;
       
        (pickedAssets, finalSeed) = getPickedAssets(_potentialAssets, _randomHashIds, _timestamp, _iterations); 
        uint[] memory pickedAssetPacks = assetManager.pickUniquePacks(pickedAssets);
        uint finalPrice = 0;

        for (uint i = 0; i < pickedAssetPacks.length; i++) {
            if (assetManager.checkHasPermissionForPack(msg.sender, pickedAssetPacks[i]) == false) {
                finalPrice += assetManager.getAssetPackPrice(pickedAssetPacks[i]);

                assetManager.buyAssetPack.value(assetManager.getAssetPackPrice(pickedAssetPacks[i]))(msg.sender, pickedAssetPacks[i]);
            }
        }
        
        require(msg.value >= finalPrice);

        uint id = totalSupply();
        _mint(msg.sender, id);

        imageMetadata[id] = ImageMetadata({
            finalSeed: finalSeed,
            potentialAssets: _potentialAssets,
            timestamp: _timestamp,
            creator: msg.sender,
            ipfsHash: _ipfsHash,
            extraData: _extraData
        });

        idToIpfsHash[id] = _ipfsHash;
        seedExists[finalSeed] = true;

        emit ImageCreated(id, msg.sender);
    }


    function getPickedAssets(bytes32[] _potentialAssets, uint[] _randomHashIds, uint _timestamp, uint _iterations) internal view returns(uint[], uint) {
        uint finalSeed = uint(functions.getFinalSeed(functions.calculateSeed(_randomHashIds, _timestamp), _iterations));

        require(!seedExists[finalSeed]);

        return (functions.pickRandomAssets(finalSeed, _potentialAssets), finalSeed);
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

    function getGalleryData(uint _imageId) public view 
    returns(address, address, string, bytes32, string, string) {
        require(_imageId < totalSupply());

        return(
            imageMetadata[_imageId].creator,
            ownerOf(_imageId),
            addressToUser[ownerOf(_imageId)].username,
            addressToUser[ownerOf(_imageId)].hashToProfilePicture,
            imageMetadata[_imageId].ipfsHash,
            imageMetadata[_imageId].extraData
        );

    }

    function getImageMetadata(uint _imageId) public view
    returns(address, string, uint, string, uint, bytes32[]) {
        ImageMetadata memory metadata = imageMetadata[_imageId];

        return(
            metadata.creator,
            metadata.extraData,
            metadata.finalSeed,
            metadata.ipfsHash,
            metadata.timestamp,
            metadata.potentialAssets
        );
    }

    function getUserImages(address _user) public view returns(uint[]) {
        return ownedTokens[_user];
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
        require(isApprovedOrOwner(_from, _imageId));

        clearApproval(_from, _imageId);
        removeTokenFrom(_from, _imageId);
        addTokenTo(_to, _imageId);

        emit Transfer(_from, _to, _imageId);
    }

    /// @notice Function to add assetManager
    /// @dev during testing can be changed, after deployment to main network can be set only once
    /// @param _assetManager is address of assetManager contract
    function addAssetManager(address _assetManager) public onlyOwner {
        assetManager = IAssetManager(_assetManager);
    }

    function addFunctions(address _functions) public onlyOwner {
        functions = Functions(_functions);
    }
}
