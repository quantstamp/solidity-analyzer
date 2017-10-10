# solidity-analyzer
A dev repository for analyzing and finding bugs smart contracts.

## Introduction
Given a smart contract, the analyzer finds any public method that directly or
indirectly exposes a non-public state variable modification.
The prototype uses multiple visitors to extract variables, call-graphs,
statements from a given contract.

## Analysis
This analyzer tries to find whether there is a static path from a _private_
variable to a _public_ method. This path can potentially lead the content of
the variable being unintentionally exposed. To answer this question, the
analyzer finds all private variables and all public methods. Now, any
public method trying to alter a private variable can be reported as a potential point of leakage. There might also be cases that a public method alters a
private variable by calling a series of private methods. Therefore, the goal of
this prototype is to show analyses for finding which private variables are
altered by public methods. To do so, the analyzer first creates a control flow
graph where each node represents a private variable or a method. Then, the
analyzer tries to find paths from a private variable to public methods.
If such methods alter the variable, then the analyzer reports it. Note that this
analysis is based on structural flow and might reports many false-positives. A
data-flow analysis can dramatically reduce false-positives, but static analyzer
could always report a degree of false-positives.

## Implementation

The prototype uses [solidity-parser](https://www.npmjs.com/package/solidity-parser) for parsing
a given solidity file. The parser generates an Abstract Syntax Tree (AST) for
the analyzer to create a control flow graph. The analyzer uses [Visitor Design
Pattern](https://en.wikipedia.org/wiki/Visitor_pattern) for traversing an AST
and extract the required information.

![Visitors](https://www.use.com/images/s_3/2017_10_01_171_575551a8264b78f33af9.jpg)

## Install
Simply install using the package manager

```Shell
$ npm install solidity-analyzer
```

## Demo
Pass the solidity file and the script finds whether there is a path from public
method to a sensitive state variable (assuming private).
For example, in the following solidity code:

```solidity
contract MyContract {
  uint owner;
  
  function init(uint i_owner) private {
    owner = i_owner;
  }
  function resetOwner() {
    owner = 0;
  }
}
```
Can be executed like:

```shell
$ node cli.js toys/input1.sol
```

and the analyzer returns the following report:
```Shell
Unsafe modification of 'owner' [indirectly] from 'resetOwner'.
```

Or the analyzer finds the public methods that could indirectly alter any
sensitive variable.

```solidity
contract MyContract {
  uint owner;
  
  function init(uint i_owner) private {
    owner = i_owner;
  }
  function resetOwner() {
    init(0);
  }
}
```
The Warning is:

```shell
Unsafe modification of 'owner' [indirectly] from 'resetOwner'.
```

As another check, the analyzer can highlight any use of _delegatecalls_
that could potentially expose private state variables or internal function calls.
For example, in the following solidity code:


```javascript
contract MyContract {
  address owner;
  MyOtherContract that;
  
  function f() {
      _tobDelegatedToOthe.delegatecall(msg.data);
  }
}
```

The Warning is:

```shell
A delegateCall in function 'f' might cause malicious access to public methods of 'that'(MyOtherContract).
```