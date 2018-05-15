pragma solidity ^0.4.23;

import "./Utils/Ownable.sol";
import "./Image/DigitalPrintImage.sol";

contract Marketplace is Ownable {

    struct Ad {
        uint imageId;
        uint price;
        address exchanger;
        bool exists;
        uint timestamp;
    }


    DigitalPrintImage digitalPrintImageContract;

    uint public numberOfAds;
    uint [] public imagesOnSale;

    mapping(uint => uint) public positionOfImage;
    mapping(uint => Ad) public adIdToAddInfo;

    /// @notice Function to add image on marketplace
    /// @dev only image owner can add image to marketplace
    /// @param _imageId is id of image
    /// @param _price is price for which we are going to sell image
    function sell(uint _imageId, uint _price) public {

    }

    /// @notice Function to edit your Ad which is already on Marketplace
    /// @dev only image owner can edit Ad
    /// @param _imageId is id of image you've put on Marketplace
    /// @param _price is going to be new(updated) price
    function edit(uint _imageId, uint _price) public {

    }

    /// @notice Function to buy image from Marketplace
    /// param _imageId is Id of image we are going to buy
    function buy(uint _imageId) public payable {

    }

    /// @notice Function to remove image from Marketplace
    /// @dev image can be withdrawed only by its owner
    /// param _imageId is id of image we would like to get back
    function cancel(uint _imageId) public {

    }

    /// @notice Function to assign digitalPrintImage contract
    /// @param _digitalPrintImageContract is address of that contract
    function addDigitalPrintImageContract(address _digitalPrintImageContract) {

    }

}
