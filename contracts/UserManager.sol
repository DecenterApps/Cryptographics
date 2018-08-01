pragma solidity ^0.4.23;

contract UserManager {

    struct User {
        string username;
        bytes32 hashToProfilePicture;
        bool exists;
    }

    uint numberOfUsers;

    mapping(string => bool) usernameExists;
    mapping(address => User) addressToUser;

    mapping(bytes32 => bool) profilePictureExists;
    mapping(string => address) usernameToAddress;

    function register(string _username, bytes32 _hashToProfilePicture) public {
        require(usernameExists[_username] == false || keccak256(abi.encodePacked(getUsername(msg.sender))) == keccak256(abi.encodePacked(_username)));

        // if he already had username, that username is free now
        usernameExists[getUsername(msg.sender)] = false;

        addressToUser[msg.sender] = User({
            username: _username,
            hashToProfilePicture: _hashToProfilePicture,
            exists: true
        });

        usernameExists[_username] = true;
        profilePictureExists[_hashToProfilePicture] = true;
        usernameToAddress[_username] = msg.sender;

        numberOfUsers++;
    }

    function changeProfilePicture(bytes32 _hashToProfilePicture) public {
        require(addressToUser[msg.sender].exists, "User doesn't exists");

        addressToUser[msg.sender].hashToProfilePicture = _hashToProfilePicture;
    }

    function getUserInfo(address _address) public view returns(string, bytes32) {
        User memory user = addressToUser[_address];
        return (user.username, user.hashToProfilePicture);
    }

    function getUsername(address _address) public view returns(string) {
        return addressToUser[_address].username;
    } 

    function isUsernameExists(string _username) public view returns(bool) {
        return usernameExists[_username];
    }

}
