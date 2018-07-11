pragma solidity ^0.4.23;

import "../Utils/Ownable.sol";
import "./ERC721.sol";

contract ImageToken is Ownable,ERC721 {

    mapping (uint => address) public tokensForOwner;
    mapping (uint => address) public tokensForApproved;
    mapping (address => uint[]) public tokensOwned;
    mapping (uint => uint) public tokenPosInArr;


    string public name;
    string public symbol;
    uint public numOfImages;

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event Mint(address indexed _to, uint256 indexed _tokenId);


    /// @notice Function constructor
    /// @dev will set name, symbol, and initial number of existing images to zero.
    constructor () public {
        name = "ImageToken";
        symbol = "IMT";
        numOfImages = 0;
    }

    /// @notice create image for specific owner
    /// @param _owner address for image owner
    /// @return function returns id of created image
    function createImage(address _owner) internal returns (uint) {
        uint imageId = numOfImages;
        tokensForOwner[imageId] = _owner;
        tokensOwned[_owner].push(imageId);
        tokenPosInArr[imageId] = tokensOwned[_owner].length - 1;

        numOfImages++;
        emit Mint(_owner, imageId);
        return imageId;
    }

    /// @notice transfer image to another address
    /// @param _to address to whom we send image
    /// @param _imageId id of image we have that we send to another address
    function transfer(address _to, uint256 _imageId) public {
        require(tokensForOwner[_imageId] != 0x0);
        require(ownerOf(_imageId) == msg.sender);

        tokensForApproved[_imageId] = 0x0;
        removeImage(msg.sender, _imageId);
        addImage(_to, _imageId);

        emit Approval(msg.sender, 0, _imageId);
        emit Transfer(msg.sender, _to, _imageId);
    }

    /// @notice approving image to be taken from specific address
    /// @param _to address that we give permission to take image
    /// @param _imageId is id of image we are going to give
    function approve(address _to, uint256 _imageId) public {
        require(tokensForOwner[_imageId] != 0x0);
        require(ownerOf(_imageId) == msg.sender);
        require(_to != msg.sender);

        if(_getApproved(_imageId) != 0x0 || _to != 0x0) {
            tokensForApproved[_imageId] = _to;
            emit Approval(msg.sender, _to, _imageId);
        }
    }

    /// @notice takes approved image from another user and sends it to another address
    /// @param _from is address of current owner of image
    /// @param _to is address of new image owner (address we are giving ownership to)
    /// @param _imageId is id of image we are going to transfer
    function transferFrom(address _from, address _to, uint256 _imageId) public {
        require(tokensForOwner[_imageId] != 0x0);
        require(_getApproved(_imageId) == msg.sender);
        require(ownerOf(_imageId) == _from);
        require(_to != 0x0);

        tokensForApproved[_imageId] = 0x0;
        removeImage(_from, _imageId);
        addImage(_to, _imageId);

        emit Approval(_from, 0, _imageId);
        emit Transfer(_from, _to, _imageId);
    }

    /// @notice add image with image id to Owner
    /// @dev for internal usage, will be called in another method, just writing clean code
    /// @param _owner is address of new image owner
    /// @param _imageId is Id of image for new owner
    function addImage(address _owner, uint _imageId) internal {
        tokensForOwner[_imageId] = _owner;
        tokensOwned[_owner].push(_imageId);
        tokenPosInArr[_imageId] = tokensOwned[_owner].length - 1;
    }


    /// @notice remove image with image id from owner
    /// @dev for internal usage, will be called in another method, just writing clean code
    /// @param _owner is address of current image owner
    /// @param _imageId is Id of image we are removing from him
    function removeImage(address _owner, uint _imageId) internal {
        uint length = tokensOwned[_owner].length;
        uint index = tokenPosInArr[_imageId];
        uint swapToken = tokensOwned[_owner][length-1];

        tokensOwned[_owner][index] = swapToken;
        tokenPosInArr[swapToken] = index;

        delete tokensOwned[_owner][length -1];
        tokensOwned[_owner].length--;
    }

    function totalSupply() public view returns (uint256) {
        return numOfImages;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return tokensOwned[_owner].length;
    }

    function ownerOf(uint256 _imageId) public view returns (address) {
        return tokensForOwner[_imageId];
    }

    function tokenOfOwnerByIndex(address _owner, uint256 _index) public view returns (uint256) {
        return tokensOwned[_owner][_index];
    }

    function getUserImages(address _owner) public view returns (uint[]) {
        return tokensOwned[_owner];
    }

    function _getApproved(uint _imageId) internal view returns (address) {
        return tokensForApproved[_imageId];
    }

    function implementsERC721() public pure returns (bool) {
        return true;
    }
}