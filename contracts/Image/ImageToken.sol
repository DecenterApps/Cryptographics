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

    }

    /// @notice transfer image to another address
    /// @param _to address to whom we send image
    /// @param _imageId id of image we have that we send to another address
    function transfer(address _to, uint256 _imageId) public {

    }

    /// @notice approving image to be taken from specific address
    /// @param _to address that we give permission to take image
    /// @param _imageId is id of image we are going to give
    function approve(address _to, uint256 _imageId) public {

    }

    /// @notice takes approved image from another user and sends it to another address
    /// @param _from is address of current owner of image
    /// @param _to is address of new image owner (address we are giving ownership to)
    /// @param _imageId is id of image we are going to transfer
    function transferFrom(address _from, address _to, uint256 _imageId) public {

    }

    /// @notice add image with card id to Owner
    /// @dev for internal usage, will be called in another method, just writing clean code
    /// @param _owner is address of new image owner
    /// @param _imageId is Id of image for new owner
    function addImage(address _owner, uint _imageId) private {

    }


    /// @notice remove image with card id from owner
    /// @dev for internal usage, will be called in another method, just writing clean code
    /// @param _owner is address of current image owner
    /// @param _imageId is Id of image we are removing from him
    function removeImage(address _owner, uint _imageId) private {

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

}