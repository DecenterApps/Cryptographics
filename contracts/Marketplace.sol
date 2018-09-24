pragma solidity ^0.4.23;

import "./Utils/Ownable.sol";
import "./Image/DigitalPrintImage.sol";


contract Marketplace is Ownable {

    struct Ad {
        uint price;
        address exchanger;
        bool exists;
        bool active;
    }

    DigitalPrintImage public digitalPrintImageContract;

    uint public creatorPercentage = 3; // 3 percentage
    uint public marketplacePercentage = 2; // 2 percentage
    uint public numberOfAds;
    uint[] public allAds;
    //image id to Ad
    mapping(uint => Ad) public sellAds;
    mapping(address => uint) public balances;

    constructor(address _digitalPrintImageContract) public {
        digitalPrintImageContract = DigitalPrintImage(_digitalPrintImageContract);
        numberOfAds = 0;
    }

    event SellingImage(uint indexed imageId, uint price);
    event ImageBought(uint indexed imageId, address indexed newOwner, uint price);

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
            exists: true,
            active: true
        });

        if (!exists) {
            numberOfAds++;
            allAds.push(_imageId);
        }

        emit SellingImage(_imageId, _price);
    }
    
    function getActiveAds() public view returns (uint[], uint[]) {
        uint count;
        for (uint i = 0; i < numberOfAds; i++) {
            // active on sale are only those that exists and its still the same owner
            if (isImageOnSale(allAds[i])) {
                count++;
            }
        }

        uint[] memory imageIds = new uint[](count);
        uint[] memory prices = new uint[](count);
        count = 0;
        for (i = 0; i < numberOfAds; i++) {
            Ad memory ad = sellAds[allAds[i]];
            // active on sale are only those that exists and its still the same owner
            if (isImageOnSale(allAds[i])) {
                imageIds[count] = allAds[i];
                prices[count] = ad.price;
                count++;
            }
        }

        return (imageIds, prices);
    }

    function isImageOnSale(uint _imageId) public view returns(bool) {
        Ad memory ad = sellAds[_imageId];

        return ad.exists && ad.active && (ad.exchanger == digitalPrintImageContract.ownerOf(_imageId));
    }

    /// @notice Function to buy image from Marketplace
    /// @param _imageId is Id of image we are going to buy
    function buy(uint _imageId) public payable {
        require(isImageOnSale(_imageId));
        require(msg.value >= sellAds[_imageId].price);

        removeOrder(_imageId);

        address _creator;
        address _imageOwner = digitalPrintImageContract.ownerOf(_imageId);
        (, , _creator, ,) = digitalPrintImageContract.imageMetadata(_imageId);

        balances[_creator] = msg.value * 2 / 100;
        balances[owner] = msg.value * 3 / 100;
        balances[_imageOwner] = msg.value * 95 / 100;

        digitalPrintImageContract.transferFromMarketplace(sellAds[_imageId].exchanger, msg.sender, _imageId);

        emit ImageBought(_imageId, msg.sender, msg.value);
    }

    /// @notice Function to remove image from Marketplace
    /// @dev image can be withdrawed only by its owner
    /// @param _imageId is id of image we would like to get back
    function cancel(uint _imageId) public {
        require(sellAds[_imageId].exists == true);
        require(sellAds[_imageId].exchanger == msg.sender);
        require(sellAds[_imageId].active == true);

        removeOrder(_imageId);
    }

    function withdraw() public {
        
        uint amount = balances[msg.sender];
        balances[msg.sender] = 0;

        msg.sender.transfer(amount);
    }

    /// @notice Removes image from imgagesOnSale list
    /// @param _imageId is id of image we want to remove
    function removeOrder(uint _imageId) private {
        sellAds[_imageId].active = false;
    }
}
