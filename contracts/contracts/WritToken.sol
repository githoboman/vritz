// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WritToken is ERC20, Ownable {
    // Basic recipient-aware transfer filter integration for Bot Chain
    mapping(address => bool) public isSanctioned;

    constructor() ERC20("Writ Token on Bot Chain", "WRIT") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function setSanctionStatus(address account, bool status) external onlyOwner {
        isSanctioned[account] = status;
    }

    function _update(address from, address to, uint256 value) internal virtual override {
        require(!isSanctioned[from], "WritToken: sender is sanctioned");
        require(!isSanctioned[to], "WritToken: recipient is sanctioned");
        super._update(from, to, value);
    }
}
