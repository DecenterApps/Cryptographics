pragma solidity ^0.4.23;

import "./Utils/Ownable.sol";
import "./Image/DigitalPrintImage.sol";

contract Marketplace is Ownable {

    struct Ad {
        uint imageId;
        uint price;
        address exchanger;
        bool exists;
    }

    DigitalPrintImage digitalPrintImageContract;

    uint public numberOfAds;
    uint [] public imagesOnSale;

    mapping(uint => uint) public positionOfImage;
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
        require(sellAds[_imageId].exists == false);

        sellAds[_imageId] = Ad({
            imageId: _imageId,
            price: _price,
            exchanger: msg.sender,
            exists: true
        });

        numberOfAds++;
        imagesOnSale.push(_imageId);
        digitalPrintImageContract._approveByMarketplace(this, _imageId);
        digitalPrintImageContract.transferFrom(msg.sender, this, _imageId);

        positionOfImage[_imageId] = imagesOnSale.length -1;

    }

    /// @notice Function to edit your Ad which is already on Marketplace
    /// @dev only image owner can edit Ad
    /// @param _imageId is id of image you've put on Marketplace
    /// @param _price is going to be new(updated) price
    function edit(uint _imageId, uint _price) public {
        require(sellAds[_imageId].exists == true);
        require(sellAds[_imageId].exchanger == msg.sender);

        Ad storage ad = sellAds[_imageId];
        ad.price = _price;
    }

    /// @notice Function to buy image from Marketplace
    /// param _imageId is Id of image we are going to buy
    function buy(uint _imageId) public payable {
        require(sellAds[_imageId].exists == true);
        require(msg.value >= sellAds[_imageId].price);

        removeOrder(_imageId);
        digitalPrintImageContract.transfer(msg.sender, _imageId);
        sellAds[_imageId].exchanger.transfer(msg.value);
    }

    /// @notice Function to remove image from Marketplace
    /// @dev image can be withdrawed only by its owner
    /// param _imageId is id of image we would like to get back
    function cancel(uint _imageId) public  {
        require(sellAds[_imageId].exists == true);
        require(sellAds[_imageId].exchanger == msg.sender);

        removeOrder(_imageId);
        digitalPrintImageContract.transfer(msg.sender, _imageId);
    }

    /// @notice Removes image from imgagesOnSale list
    /// @param _imageId is id of image we want to remove
    function removeOrder(uint _imageId) private {
        uint length = imagesOnSale.length;
        uint index = positionOfImage[_imageId];
        uint lastOne = imagesOnSale[length-1];

        sellAds[_imageId].exists = false;
        numberOfAds--;

        imagesOnSale[index] = lastOne;
        positionOfImage[lastOne] = index;

        delete imagesOnSale[length-1];
        imagesOnSale.length--;
    }

    /// @notice Function to assign digitalPrintImage contract
    /// @param _digitalPrintImageContract is address of that contract
    function addDigitalPrintImageContract(address _digitalPrintImageContract) public {
        digitalPrintImageContract = DigitalPrintImage(_digitalPrintImageContract);
    }
}
