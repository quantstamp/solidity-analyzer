pragma solidity ^0.4.0;

contract MyContract {

    address _tobDelegated;
    MyOtherContract _tobDelegatedToOthe;

    function g() {
        _tobDelegated.delegatecall(msg.data);
    }

    function () {
        _tobDelegatedToOthe.delegatecall(msg.data);
    }
}

