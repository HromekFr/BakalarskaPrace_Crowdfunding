// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Project.sol";

contract Crowdfunding {
    Project[] private projects;

    event ProjectCreated (
        address contractAddress,
        address projectOwner,
        string projectTitle,
        string projectDesc,
        uint256 deadline,
        uint256 goalAmount,
        string imgHash,
        string category
    );


    function createProject(
        string memory title,
        string memory description,
        uint durationInDays,
        uint amountToRaise,
        string memory imgHash,
        string memory category
    ) external {
        uint timeGoal = block.timestamp + (durationInDays * 1 days);
        Project newProject = new Project(payable(msg.sender), title, description, timeGoal, amountToRaise, imgHash, category);
        projects.push(newProject);

        emit ProjectCreated(address(newProject), msg.sender, title, description, timeGoal, amountToRaise, imgHash, category);
    }

    function returnAllProjects() external view returns(Project[] memory){
        return projects;
    }
}