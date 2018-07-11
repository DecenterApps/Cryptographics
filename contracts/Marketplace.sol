pragma solidity ^0.4.23;

import "./Utils/Ownable.sol";
import "./Image/DigitalPrintImage.sol";

contract Marketplace is Ownable {

    struct Ad {
        uint price;
        address exchanger;
        bool exists;
    }

    DigitalPrintImage digitalPrintImageContract;

    uint public creatorPercentage = 5; // 5 percentage
    uint public numberOfAds;
    uint[] public allAds;
    //image id to Ad
    mapping(uint => Ad) public sellAds;

    constructor(address _digitalPrintImageContract) public{
        digitalPrintImageContract = DigitalPrintImage(_digitalPrintImageContract);
        numberOfAds = 0;
    }

    /// @notice Function to add image on marketplace
    /// @dev only image owner can add image to marketplace
    /// @param _imageId is id of image
    /// @param _price is price for which we are going to sell image
    function sell(uint _imageId, uint _price) public {
        require(digitalPrintImageContract.ownerOf(_imageId) == msg.sender);

        bool exists = sellAds[_imageId].exists;

        sellAds[_imageId] = Ad({
            price: _price,
            exchanger: msg.sender,
            exists: true
        });

        if (!exists) {
            numberOfAds++;
            allAds.push(_imageId);
        }
    }

    function getActiveAds() public view returns (uint[], uint[]) {
        uint count;
        for (uint i = 0; i<numberOfAds; i++) {
            Ad memory ad = sellAds[allAds[i]];
            // active on sale are only those that exists and its still the same owner
            if (ad.exists && (ad.exchanger == digitalPrintImageContract.ownerOf(allAds[i]))) {
                count++;
            }
        }

        uint[] memory imageIds = new uint[](count);
        uint[] memory prices = new uint[](count);
        for (i = 0; i<numberOfAds; i++) {
            ad = sellAds[allAds[i]];
            // active on sale are only those that exists and its still the same owner
            if (ad.exists && (ad.exchanger == digitalPrintImageContract.ownerOf(allAds[i]))) {
                imageIds[i] = allAds[i];
                prices[i] = ad.price;
            }
        }
    }

    /// @notice Function to buy image from Marketplace
    /// @param _imageId is Id of image we are going to buy
    function buy(uint _imageId) public payable {
        require(sellAds[_imageId].exists == true);
        require(msg.value >= sellAds[_imageId].price);

        removeOrder(_imageId);

        //@dev transfer to user
    }

    /// @notice Function to remove image from Marketplace
    /// @dev image can be withdrawed only by its owner
    /// @param _imageId is id of image we would like to get back
    function cancel(uint _imageId) public  {
        require(sellAds[_imageId].exists == true);
        require(sellAds[_imageId].exchanger == msg.sender);

        removeOrder(_imageId);
    }

    /// @notice Removes image from imgagesOnSale list
    /// @param _imageId is id of image we want to remove
    function removeOrder(uint _imageId) private {
        sellAds[_imageId].exists = false;
    }

    /// @notice Function to assign digitalPrintImage contract
    /// @dev this should be onlyOwner
    /// @param _digitalPrintImageContract is address of that contract
    function addDigitalPrintImageContract(address _digitalPrintImageContract) public {
        if (address(digitalPrintImageContract) == address(0)) {
            digitalPrintImageContract = DigitalPrintImage(_digitalPrintImageContract);
        }
    }
}
