pragma solidity ^0.4.0;

contract MyContract {
  address _tobDelegated;

  function g() {
  	_tobDelegated.delegatecall(msg.data);;
  }

  function f() {
    _tobDelegated.delegatecall(msg.data);;
  }

  function () {
    _tobDelegated.delegatecall(msg.data);;
  }

  function no1() {
    _tobDelegated.delegatecall();;
  }

  function no2() {
    _tobDelegated.delegatecall(msg.data, 1);;
  }

  function no3() {
    delegatecall(msg.data);;
  }

}
