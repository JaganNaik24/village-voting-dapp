// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VillageVoting {
    address public admin;
    uint public totalVotes;

    struct Leader {
        string name;
        uint voteCount;
    }

    mapping(address => bool) public hasVoted;
    Leader[] public leaders;

    constructor(string[] memory leaderNames) {
        admin = msg.sender;
        for (uint i = 0; i < leaderNames.length; i++) {
            leaders.push(Leader({name: leaderNames[i], voteCount: 0}));
        }
    }

    function vote(uint leaderIndex) public {
        require(!hasVoted[msg.sender], "Already voted");
        require(leaderIndex < leaders.length, "Invalid leader");

        leaders[leaderIndex].voteCount++;
        hasVoted[msg.sender] = true;
        totalVotes++;
    }

    function getLeaders() public view returns (Leader[] memory) {
        return leaders;
    }

    function getVotes(uint index) public view returns (uint) {
        require(index < leaders.length, "Invalid leader index");
        return leaders[index].voteCount;
    }

    function resetVotes() public {
        require(msg.sender == admin, "Only admin can reset");

        for (uint i = 0; i < leaders.length; i++) {
            leaders[i].voteCount = 0;
        }

        totalVotes = 0;
    }
}
