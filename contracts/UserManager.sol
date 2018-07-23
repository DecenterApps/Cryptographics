pragma solidity ^0.4.23;

contract UserManager {

    struct User {
        string username;
        bytes32 hashToProfilePicture;
        bool exists;
    }

    uint numberOfUsers;

    mapping(string => bool) usernameExists;
    mapping(bytes32 => bool) profilePictureExists;
    mapping(string => address) usernameToAddress;
    mapping(address => User) addressToUser;

    function register(string _username, bytes32 _hashToProfilePicture) public {
        require(usernameExists[_username] == false);

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

}
