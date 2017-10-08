pragma solidity ^0.4.0;

contract MyContract {
    address var1;
    TypeA var2;

    function g() {
        var1 = 0x0;
        var1 = var2;
    }

    function f(uint32 var1) {
        k (var1);
    }

    function () {
        var2 = 0x0;
        {
            TypeB var2;
            var2 = var1;
            this.var2 = 0x0;
        }
    }

    function h() {
        this.var2 = 0x0;
    }

    function k() {
        that.a.var2 = 0x0;
        this.h().var2;
        var2.a = 0x0;
    }

}
