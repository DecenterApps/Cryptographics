pragma solidity ^0.4.23;

contract UserManager {

    struct User {
        string username;
        bytes32 hashToProfilePicture;
    }

    uint numberOfUsers;

    mapping(string => bool) userNameExists;
    mapping(bytes32 => bool) profilePictureExists;
    /// @dev remove this if not needed on frontend/check if there is a case where we want to get user by username
    mapping(string => address) usernameToAddress;
    mapping(address => User) addressToUser;

    function register(string _username, bytes32 _hashToProfilePicture) public {
        require(userNameExists[_username] == false);
        require(profilePictureExists[_hashToProfilePicture] == false);

        addressToUser[msg.sender] = User({
            username: _username,
            hashToProfilePicture: _hashToProfilePicture
        });

        userNameExists[_username] = true;
        profilePictureExists[_hashToProfilePicture] = true;
        usernameToAddress[_username] = msg.sender;

        numberOfUsers++;
    }

    function getUserInfo(address _address) public view returns(string, bytes32) {
        User memory user = addressToUser[_address];
        return (user.username, user.hashToProfilePicture);
    }

}
