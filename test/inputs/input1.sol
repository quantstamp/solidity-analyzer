pragma solidity ^0.4.0;

contract MyContract {
  uint owner;
  function init(uint i_owner) private {
    owner = i_owner;
  }
  
  function resetOwner() {
  	owner = 0;
  }
}
