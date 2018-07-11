pragma solidity ^0.4.23;

contract UserManager {

    struct User {
        string username;
        bytes32 hashToProfilePicture;
    }

    User [] users;
    uint numberOfUsers;

    mapping(string => bool) userNameExists;
    mapping(bytes32 => bool) profilePictureExists;



    mapping(string => uint) usernameToId;
    mapping(address => User) addressToUser;

    function register(string _username, bytes32 _hashToProfilePicture) public {
        require(userNameExists[_username] == false);
        require(profilePictureExists[_hashToProfilePicture] == false);

        users.push(User({
            username: _username,
            hashToProfilePicture: _hashToProfilePicture
            }));

        userNameExists[_username] = true;
        profilePictureExists[_hashToProfilePicture] = true;
        usernameToId[_username] = numberOfUsers;
        addressToUser[msg.sender] = users[numberOfUsers];
        numberOfUsers++;
    }

    function getUserInfo(address _address) public view returns(string, bytes32) {
        User memory user = addressToUser[_address];
        return (user.username, user.hashToProfilePicture);
    }

}
