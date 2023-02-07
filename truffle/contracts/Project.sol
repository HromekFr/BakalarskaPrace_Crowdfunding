// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Project {

    enum State {
        Fundraising,
        Expired,
        Successful
    }

    address payable public owner;
    uint public goalAmount;
    uint public finishTime;
    uint256 public currentBalance;
    uint public deadline;
    string public title;
    string public description;
    string public imgHash;
    State public state;
    string public category;

    mapping (address => uint) public contributions;
    address[] public contributorsArray;

    event FundingReceived(address contributor, uint amount, uint currentTotal);
    event CreatorPaid(address recipient);

    modifier inState(State _state) {
        require(state == _state, "Project is in different state");
        _;
    }

    constructor
    (
        address payable _owner,
        string memory _title,
        string memory _description,
        uint _deadline,
        uint _goalAmount,
        string memory _imgHash,
        string memory _category
    ) {
        owner = _owner;
        title = _title;
        description = _description;
        deadline = _deadline;
        goalAmount = _goalAmount;
        imgHash = _imgHash;
        currentBalance = 0;
        state = State.Fundraising;
        category = _category;
    }

    function contribute() external inState(State.Fundraising) payable {
        require(msg.sender != owner, "You are trying to send money to your own project");

        contributions[msg.sender] = msg.value;
        currentBalance += msg.value;
        contributorsArray.push(msg.sender);
        emit FundingReceived(msg.sender, msg.value, currentBalance);
        checkStateOfProject();
    }


    function checkStateOfProject() public {
        if (currentBalance >= goalAmount) {
            state = State.Successful;
            payOut();
        } else if (block.timestamp > deadline)  {
            state = State.Expired;
        }
        finishTime = block.timestamp;
    }

    function payOut() internal inState(State.Successful) returns (bool) {
        uint256 totalRaised = currentBalance;
        currentBalance = 0;

        if (owner.send(totalRaised)) {
            emit CreatorPaid(owner);
            return true;
        } else {
            currentBalance = totalRaised;
            state = State.Successful;
        }

        return false;
    }

    function getRefund() public inState(State.Expired) returns (bool) {
        require(contributions[msg.sender] > 0);

        uint amountToRefund = contributions[msg.sender];
        contributions[msg.sender] = 0;

        if (!payable(msg.sender).send(amountToRefund)) {
            contributions[msg.sender] = amountToRefund;
            return false;
        } else {
            currentBalance -= amountToRefund;
        }

        return true;
    }

    function getDetails() public view returns 
    (
        address payable projectOwner,
        string memory projectTitle,
        string memory projectDesc,
        uint256 projectDeadline,
        State currentState,
        uint256 currentAmount,
        uint256 projectGoalAmount,
        string memory projectImgHash,
        string memory projectCategory,
        address [] memory projectContributors

    ) {
        projectOwner = owner;
        projectTitle = title;
        projectDesc = description;
        projectDeadline = deadline;
        currentState = state;
        currentAmount = currentBalance;
        projectGoalAmount = goalAmount;
        projectImgHash = imgHash;
        projectCategory = category;
        projectContributors = contributorsArray;
    }

    function returnContributorValue(address _address) public view returns (uint) {
        return contributions[_address];
    }

}