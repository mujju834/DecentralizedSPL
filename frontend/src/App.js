import React, { useEffect, useState } from 'react';
import getWeb3 from './services/blockchain';
import SupplyChain from './SupplyChain.json';
import './App.css';

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [manufacturerName, setManufacturerName] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = SupplyChain.networks[networkId];

        if (deployedNetwork) {
          const instance = new web3.eth.Contract(
            SupplyChain.abi,
            deployedNetwork.address,
          );
          setWeb3(web3);
          setAccounts(accounts);
          setSelectedAccount(accounts[0]);
          setContract(instance);
        } else {
          console.error('Smart contract not deployed to detected network.');
        }
      } catch (error) {
        console.error('Error loading web3, accounts, or contract:', error);
      }
    };
    init();
  }, []);

  const createProduct = async () => {
    if (contract && productName && manufacturerName) {
      try {
        await contract.methods.createProduct(productName, manufacturerName).send({ from: selectedAccount });
        console.log("Product created successfully");
      } catch (error) {
        console.error("Error creating product:", error);
      }
    } else {
      console.error("Contract is not loaded properly or product details are missing");
    }
  };

  const fetchAllProducts = async () => {
    if (contract) {
      try {
        const productCount = await contract.methods.productCount().call();
        const products = [];
        for (let i = 1; i <= productCount; i++) {
          const product = await contract.methods.products(i).call();
          products.push(product);
        }
        setProducts(products);
        console.log("Products fetched successfully:", products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    } else {
      console.error("Contract is not loaded properly");
    }
  };

  return (
    <div className="app">
      <h1>Supply Chain Management System</h1>
      <label htmlFor="account-select">Select Account:</label>
      <select
        id="account-select"
        value={selectedAccount}
        onChange={(e) => setSelectedAccount(e.target.value)}
        className="dropdown"
      >
        {accounts.map((account) => (
          <option key={account} value={account}>
            {account}
          </option>
        ))}
      </select>
      <div className="form-container">
        <h2>Create Product</h2>
        <label>
          Product Name:
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="input-field"
          />
        </label>
        <br />
        <label>
          Manufacturer Name:
          <input
            type="text"
            value={manufacturerName}
            onChange={(e) => setManufacturerName(e.target.value)}
            className="input-field"
          />
        </label>
        <br />
        <button onClick={createProduct} className="btn">Create Product</button>
      </div>
      <div className="product-container">
        <h2>Fetch All Products</h2>
        <button onClick={fetchAllProducts} className="btn">Fetch All Products</button>
        {products.length > 0 && (
          <div className="product-list">
            <h2>All Products</h2>
            {products.map((product, index) => (
              <div key={index} className="product-card">
                <h3>Product {index + 1}</h3>
                <p>ID: {product.id.toString()}</p>
                <p>Name: {product.name}</p>
                <p>Manufacturer: {product.manufacturer}</p>
                <p>Current Owner: {product.currentOwner}</p>
                <p>Status: {product.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
