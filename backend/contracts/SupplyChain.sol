// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract SupplyChain is Ownable {
    struct Product {
        uint256 id;
        string name;
        string manufacturer;
        string currentOwner;
        string status;
    }

    mapping(uint256 => Product) public products;
    uint256 public productCount;

    event ProductCreated(uint256 id, string name, string manufacturer, string status);
    event ProductTransferred(uint256 id, string newOwner, string status);

    constructor(address initialOwner) Ownable(initialOwner) {
        // constructor body
    }

    function createProduct(string memory _name, string memory _manufacturer) public onlyOwner {
        productCount++;
        products[productCount] = Product(productCount, _name, _manufacturer, _manufacturer, "Manufactured");
        emit ProductCreated(productCount, _name, _manufacturer, "Manufactured");
    }

     function getProductCount() public view returns (uint256) {
        return productCount;
    }



    function transferProduct(uint256 _id, string memory _newOwner, string memory _status) public onlyOwner {
        Product storage product = products[_id];
        product.currentOwner = _newOwner;
        product.status = _status;
        emit ProductTransferred(_id, _newOwner, _status);
    }
}
